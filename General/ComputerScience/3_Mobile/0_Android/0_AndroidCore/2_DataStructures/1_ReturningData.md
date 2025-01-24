# Activity communication: returning data

In Android development, data transfer between activities can be more than just a one-way transaction. At times, an app might start a new activity—within the same or a different app—and anticipate a result back. For example, an app could launch a file explorer, enabling the user to select a file, with the selected file being received as a result. Similarly, an app can launch the camera app for the user to snap a photo, receiving the captured image as a result thereafter. This approach of starting activities and expecting results enables interaction among various parts of an Android app, or even among different apps on the device. In this topic, we will explore the Activity Result APIs and their use in returning data from activities.

## Using the Activity Result APIs

When you start an activity for a result, you effectively request the Android system to launch an activity and subsequently return a result produced by the activity to your app. The APIs provide a method to register a callback, which is invoked when we get a result from a launched activity. This callback is commonly referred to as a result callback. When inside a ComponentActivity or Fragment, you can register the result callback using the method registerForActivityResult(). This method takes in two arguments:

- An ActivityResultContract: This is an object that defines the input type required by the launched activity to produce a result along with the output type of the result. The APIs provide predefined contracts for common intent actions like taking a picture, picking content, or even requesting permissions. You can also create your custom contracts for more specific needs, which we'll explore in the next section.

- An ActivityResultCallback: This is a functional interface, also known as a Single Abstract Method (SAM) interface, with the onActivityResult() method. It's called when the app receives a result from the launched activity, and it takes an argument of the output type defined in the contract.

The registerForActivityResult() method returns an ActivityResultLauncher which you will later use to launch an activity for a result.

Let's take a look at a simple example to understand how this works in practice. Suppose you want to open the phone's contacts app to allow the user to pick a contact and get the contact picked as a result. You will first have to register the result callback:

```kotlin
import androidx.activity.result.contract.ActivityResultContracts.PickContact

class MainActivity : AppCompatActivity() {

    // Register the result callback
    private val pickContact = registerForActivityResult(PickContact()) { contactUri: Uri? ->
        // Technically, we are not getting the actual contact
        // but rather a Uri? object that we can use to query the contact
        // using a contentResolver
        if (contactUri != null) {
            val contactData = contentResolver.query(contactUri, null, null, null, null)

            if (contactData != null && contactData.moveToFirst()) {
                val name = contactData.getStringOrNull(
                    contactData.
                        getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
                )
                Log.d("MAIN_ACTIVITY", "name: $name")
            }

            contactData?.close()
        }
    }

    ...
}
```

Here, we used the predefined contract PickContact that extends the ActivityResultContract class. The contract defines an implicit intent that is used to launch an activity capable of displaying contacts to pick from. The contract also defines the output result as a Uri?. The second argument is passed as a lambda (a trailing lambda to be specific) using Kotlin's SAM conversion which converts the lambda expression into code that instantiates the ActivityResultCallback interface implementation.

> [!NOTE]
> Note that the APIs are written in Java hence returned values can be null despite Kotlin allowing us to specify the type of contactUri as Uri (Non-null) which might lead to the famous NullPointerException when not handled well. We also have access to the registerForActivityResult() method since AppCompatActivity inherits from ComponentActivity.


Now we can use pickContact to start the process of producing the result by launching the subsequent activity, in our case, probably a contacts app. Once the user is done and we get a result, the onActivityResult() method from the registered result callback will be executed with the result as an argument:

```kotlin
class MainActivity : AppCompatActivity() {
    ...

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ...

        button.setOnClickListener {
            // `launch()` starts the process of producing the result
            pickContact.launch(null)
        }
    }
}
```

The method launch() requires us to pass the input argument stated in the contract which may be required by the launched activity to output a result. In our case, PickContact contract defined the input type as @Nullable Void hence we provided null as an argument.


> [!NOTE]
> Depending on the way the contract is implemented, the result we get from the launched activity can be null, in our case, say the user exits the launched contacts app before making a selection, contactUri will be null. Make sure that your app can handle such a situation. It is also recommended that you call registerForActivityResult() before the activity or fragment is created and ActivityResultLauncher can only be launched when the activity or fragment's lifecycle reaches the CREATED state.

## Custom contracts


There may be times when none of the predefined contracts fit your app's needs. In such cases, you can create a custom contract. Let's say we've got a pair of activities in our app - the trusty MainActivity and SecondActivity. Our aim here is for MainActivity to launch SecondActivity, have the user type something there, and then send the results back to the caller. In this setup, the main job of the SecondActivity is to grab text input from the user, and we want to make sure that this text ends up back in MainActivity. This way we will be able to see how we can send results back if we end up being the launched activity.

Start by creating a class, in this instance, you can name it GetText, and have it inherit from ActivityResultContract. The ActivityResultContract requires us to define the input and output type arguments, with the input coming first:

```kotlin
class GetText : ActivityResultContract<Unit, String?>() {}
```

> [!NOTE]
> Note that if you don't require any input, in Kotlin, you can either use Unit or Void?

Implement both createIntent() and parseResult() methods from the inherited ActivityResultContract:



```kotlin
class GetText : ActivityResultContract<Unit, String?>() {
    // Here we construct the intent used to launch the subsequent activity
    override fun createIntent(context: Context, input: Unit?): Intent {
        return Intent(context, SecondActivity::class.java)
    }

    // We get the result from the provided intent
    override fun parseResult(resultCode: Int, intent: Intent?): String? {
        // resultCode RESULT_OK is just the integer -1
        if (resultCode != Activity.RESULT_OK) {
            return null
        }
        return intent?.getStringExtra(Intent.EXTRA_TEXT)
    }
}
```

createIntent() receives the app's context and the input as parameters, while parseResult() receives a result code and the intent, containing the result, delivered by the Android system after the launched activity is closed. In the provided code snippet, within the createIntent() method, we create an intent to launch the SecondActivity. Subsequently, in the parseResult() method, we check the result code to ensure the result received is acceptable before extracting the text. Note that there are several predefined result codes in the Activity class. They include: RESULT_CANCELED = 0, RESULT_OK = -1 and RESULT_FIRST_USER = 1. We can now utilize GetText in a manner similar to how we used PickContact.

On the other side, in the SecondActivity, we simply need to call setResult() which takes in a result code and the data being sent as an Intent, then close the activity:

```kotlin
class SecondActivity : AppCompatActivity() {
    ...

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ...

        button.setOnClickListener {
            // `editText` holds a reference to an EditText view
            setResult(RESULT_OK, Intent().putExtra(Intent.EXTRA_TEXT, editText.text.toString()))
            // closes the activity
            finish()
        }
    }
}
```

> [!NOTE]
> Note that if another activity starts the SecondActivity by simply calling startActivity(), then the result will be ignored when we return to the calling activity.

By default, the result is set to RESULT_CANCELED in case the user exits the app before completing the action and before the result is set so that the calling activity receives the canceled result. Furthermore, there's an overridden version of setResult() that accepts only the result code. You can then use the returned result code in the caller activity to determine the subsequent course of action. You have the flexibility to use your own custom result codes, with RESULT_FIRST_USER serving as a recommended starting point to prevent clashes with system-defined result codes.

## Traditional approach

Before the introduction of the Activity Result APIs, Android developers used to use startActivityForResult() and onActivityResult() APIs. Despite the older APIs still being available across all API levels in the Activity class, Google recommends using the newer APIs introduced in AndroidX's Activity and Fragment classes. The reason behind this is their simplicity and improved testability.

Here's an example of the dated approach you might stumble upon in older codebases:

```kotlin
// This code is generally found in an activity or fragment
private val REQUEST_CODE = 123

fun startSomeActivityForResult() {
    val intent = Intent(this, AnotherActivity::class.java)
    startActivityForResult(intent, REQUEST_CODE)
}

override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQUEST_CODE && resultCode == Activity.RESULT_OK) {
        // Handle the result here
        val result = data?.getStringExtra("result_key")
        // Do something with the result
    }
}
```

Here, the most noticeable addition is the REQUEST_CODE. In the traditional approach, all activity results were managed within the onActivityResult() method. Consequently, request codes were employed to distinguish and identify the received results, ensuring the appropriate actions were executed.

## Best practices and tips

When you start an activity for a result, bear in mind that your application could be shut down by the system, particularly during memory-intensive operations. To safeguard against this, result callbacks must be unconditionally registered in the same order every time your activity is created. This is to ensure these callbacks are ready if the activity gets destroyed as the Activity Result APIs decouple the result callback from where it gets registered. Don't forget to save any crucial state when starting an activity for a result in the anticipation that your activity may be destroyed.

When implementing result handling, remember to account for potential variances in how different apps return results. For instance, in our previous contacts example, while hypothetical or unlikely, some obscure contacts apps a user might select as the default on certain Android phones might return the chosen contact as an extra instead of the expected data information of the intent typical of a "Contacts" app. This would result in a null content-Uri. Therefore, it's vital to be ready for such scenarios; you might, for example, display a suitable message to the user informing them the contact wasn't received as expected.

Besides, if you intend to design components or activities that other apps will utilize to get results, it's critical to provide detailed documentation. Clear, well-explained interfaces and expectations will make the data exchange between apps smooth and reliable, minimizing potential issues and enhancing the user experience.

In case you want to receive a result in a separate class outside ComponentActivity or Fragment, you can do so by using the ActivityResultRegistry directly. The ActivityResultRegistry is the one responsible for storing the result callbacks in the activity. You can learn more if you are interested in how that works.

## Conclusion

In conclusion, the Activity Result APIs are used to exchange data between activities. These APIs allow developers to seamlessly request and handle results from launched activities. By registering result callbacks and launching subsequent activities, developers can create more dynamic applications. Custom contracts enable the exchange of specific data, while the traditional approach, though still available, is eclipsed by the simplicity of the Activity Result APIs. To ensure robustness, it's crucial to unconditionally register result callbacks and save essential app state when initiating activities for results.

## reference

- [Activity communication: returning data](https://hyperskill.org/learn/step/38574)




















