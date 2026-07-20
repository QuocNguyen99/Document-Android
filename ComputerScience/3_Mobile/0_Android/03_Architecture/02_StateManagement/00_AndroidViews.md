# Android View State management

Dealing with stateless, immutable objects is easy and predictable, but real life is complicated. User interface has its **state**, and sometimes it's our responsibility to manage it.

## Problem

Let's take a look at a simple application where you can increment a number in a text field:

```xml
<RelativeLayout …>

    <TextView
        android:id="@+id/textView"
        …
        android:text="0" />

    <EditText
        android:id="@+id/editText"
        …
        android:text="0" />

    <Button
        android:id="@+id/button"
        …
        android:text="+" />

</RelativeLayout>
```

```kotlin
class CounterActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_counter)

        val tv = findViewById<TextView>(R.id.textView)
        val et = findViewById<EditText>(R.id.editText)
        findViewById<Button>(R.id.button).setOnClickListener {
            tv.text = ((tv.text.toString().toIntOrNull() ?: 0) + 1).toString()
            et.setText(((et.text.toString().toIntOrNull() ?: 0) + 1).toString())
        }
    }
}
```

We had a `TextView` and an `EditText` handled by identical code invoked from a `Button`.
But when the screen was rotated, our activity was recreated, layout was re-inflated, and we lost `TextView.text` but `EditText.text` had survived.


There are several two for Android to recreate our `Activity`. The first one is a **configuration change** (device orientation, language, font scale, and much more).
Some of them could be handled by your application and recreation might be avoided.

But the second reason is **process death**:
if some other foreground application uses a lot of memory, your application in background will be killed.



**We can't avoid it, so we have to save our state.**

## View state

Generally, a `View` with a specified ID will preserve its state automatically.
The key in the example above is that `EditText` is a widget for user input and is designed to save the text, while `TextView` is intended for output and doesn't want to save its text by default. 

You can assign `android:freezesText="true"` to change this behavior but that's not a clean solution: our logic relies on data stuck inside a view, including that intended for output only.

## Saved instance state

There's the `onSaveInstanceState(Bundle)` method available for override both in `Fragment` and `Activity`. 
It gives us a chance to save our data in both scenarios: configuration change and process death.
But keep in mind that if the user exits via the "back" button, the state is not to be saved, and new opening of this screen will be "clean".

**The restriction is we can't store arbitrary objects there.**

Example:
```kotlin
class CounterActivity : Activity() {

    private var count = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_counter)

        val tv = findViewById<TextView>(R.id.textView)
        val et = findViewById<EditText>(R.id.editText)

        if (savedInstanceState != null) {
            // recreation, use saved state
            count = savedInstanceState.getInt("count")
        }

        tv.text = count.toString()
        et.setText(count.toString())

        findViewById<Button>(R.id.button).setOnClickListener {
            count++
            tv.text = count.toString()
            et.setText(count.toString())
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        // we're being destroyed, save the data for the following recreation
        outState.putInt("count", count)
    }
}
```

## ViewModel

As noted before, not everything can be persisted in a `Bundle`.
Also, interprocess communication transactions have the size limit of 1MB (The reason that can reach to `TransactionTooLargeException`). Of course, user input have to be preserved carefully because it's extremely frustrating for the user to waste some time on filling in some data which will be lost.
But what about some non-critical data?
- Something that was downloaded from the internet can just be downloaded once more or simply taken from local cache file.
- Data from a local database can easily be requested one more time.
- Internet radio or video stream plays in real time and doesn't need to be stored.
- Any other real-time connection like the one for instant messaging can be reestablished later.

In all these scenarios we'd like not to lose the data in case of configuration change but dismiss it in case of process death because the user is currently completely focused on something different and we don't know when they're going to return.

That's when we need a `ViewModel`. Its name comes from the **MVVM (Model-View-ViewModel)** 

By this way, the value survives configuration changes (like device rotation) but will be dropped in case of process death (you can open Camera and web browser apps to drain all RAM)

## Providing data from ViewModel to View

We need a container which holds a value and gives us an ability to subscribe to changes.

There's the `LiveData` class in Android Architecture Components exactly for this purpose. **But** `kotlinx.coroutines` have their own `StateFlow` **which provides better** `null-safety` and is very handy to use with coroutines so we're going to stick with it.

Example:

```kotlin
 class CounterViewModel : ViewModel() {
     private val _count = MutableStateFlow(0)
     val count: StateFlow<Int> get() = _count

     fun increment() {
         count++
         _count.value++
     }
 }
```
We will observe it which means that the View will be notified about any changes in the `StateFlow`.

```kotlin
 class CounterActivity : ComponentActivity() {

     private val vm: CounterViewModel by viewModels()

     override fun onCreate(savedInstanceState: Bundle?) {
         super.onCreate(savedInstanceState)
         /** 

         suspend functions is tied to view's lifecycle,
         any operation running in this scope will be canceled when the view is destroyed.

         Thus, if the View gets recreated, 
         it will abandon the subscription and avoid possible memory leak
         caused by long-living ViewModel's StateFlow holding
         a reference to short-lived View subscriber. 
         
         **/
         lifecycleScope.launch { 
             /** 

             creates a narrower scope between Activity's
             onStart and onStop lifecycle methods.
            
             anything inside inner lambda will run in onStart
             and will be canceled when onStop happens.

             So, when the user is incapable of seeing the View,
             the latter never observes the data.

             **/
             repeatOnLifecycle(Lifecycle.State.STARTED) {
                 /** 
                 
                 collect function saves our lambda to be called both
                 at the beginning of the suscription (in onStart) and
                 when the data gets changed

                 **/
                 vm.count.collect { count ->
                     tv.text = count.toString()
                     et.setText(count.toString())
                 }
             }
         }

         findViewById<Button>(R.id.button).setOnClickListener {
             vm.increment()
         }
     }
 }
 ```























