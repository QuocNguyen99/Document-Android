# System apps and common intents

Android provides seamless integration between different apps that probably don't even know about each other. 
One app just says something like “I want the user to pick a photo,“
a Gallery app answers “I can do this,” and then returns the photo picked by the user back to the caller app.

As you may remember, Activities are started using Intents which can hold action, data, category, and extras. 
Here we're going to discuss how to use them to perform common actions outside of your app.


## Fire and forget


The simplest case of such an interaction is to start an activity without expecting any result.
Show a document, make a phone call, send an e-mail, and don't mind what happens later.
In such cases, we just `startActivity()` with an according intent.

For example, to dial a number, we can just do this:

```kotlin
startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:+1234567890")))
```

This will open a dialer app with this number letting the user initiate a call.

There's another action, `ACTION_CALL`, to start a call immediately.
It is a more **“dangerous”** action, thus it is more restricted, for example, it cannot initiate emergency calls.
But the most interesting thing is that if an app declares `CALL_PHONE` permission in the Manifest, then the runtime permission must be granted.
This should be taken into account when adding new permissions to the Manifest because it may break some existing code.

Showing a document is also quite interesting.
When a browser opens a link in an app, it creates an intent with `ACTION_VIEW` and `CATEGORY_BROWSABLE`.
The latter signals that the Activity responsible for viewing link contents promises not to do anything harmful because a webpage on the Internet could construct any possible link like `delete://com.example.notes/1`.
If there is an Activity that can handle such a link, it won't be opened from the browser because of the absent `BROWSABLE` category.

The other important thing is the content type. What's the difference between these URLs?

- https://hyperskill.org/

- https://assets.ubuntu.com/v1/b2a3e33f-ubuntu-server-guide-2023-06-19.pdf

- https://upload.wikimedia.org/wikipedia/commons/1/16/En-uk-to_study.ogg

They all use the same protocol, HTTPS. They all can be opened in a browser. But PDF can also be opened in a book reader app, and .ogg can be opened in an audio player. So, the difference is in the media type.

- text/html

- application/pdf

- audio/ogg

To find the best possible app for viewing specific content, consider setting media type along with URI.

```kotlin
startActivity(
    Intent(Intent.ACTION_VIEW)
        .setDataAndType(Uri.parse("https://hyperskill.org/"), "text/html")
        .addCategory(Intent.CATEGORY_BROWSABLE)
)
startActivity(
    Intent(Intent.ACTION_VIEW)
        .setDataAndType(Uri.parse("https://…/….pdf"), "application/pdf")
        .addCategory(Intent.CATEGORY_BROWSABLE)
)
startActivity(
    Intent(Intent.ACTION_VIEW)
        .setDataAndType(Uri.parse("https://…/….ogg"), "audio/*")
        .addCategory(Intent.CATEGORY_BROWSABLE)
)
```

> [!NOTE]
> File extension is not a thing on the Internet, it can be wrong or absent. Browsers know the document type from the Content-Type HTTP header but in order to receive it, a connection to the server must be initiated.
> This is not fast and not guaranteed to succeed, that's why you should know media type in advance, at least the broader part, like audio/*, video/*, image/*.


Now to another example, let's give our user a button to send an e-mail with a bug report. According to `ACTION_SEND` and `ACTION_SENDTO` docs, we can specify `text/plain` message type, and pass address, message subject, and the message itself as extras. Let's try it out!


```kotlin
startActivity(
    Intent(Intent.ACTION_SENDTO)
        .setDataAndType(Uri.parse("mailto:"), "text/plain")
        .putExtra(Intent.EXTRA_EMAIL, "support@app.example.com")
        .putExtra(Intent.EXTRA_SUBJECT, "Bug report")
        .putExtra(Intent.EXTRA_TEXT, "Hello! Using your app, " +
            "I've experienced that it does … while I expect it would do ….")
)
```


The mailto: URI scheme is needed to make Android show only e-mail apps, as suggested by the official guide.

## Receiving result

To launch an Activity and receive the result, we need the same construct as with the requesting permissions. In general, it looks as follows:

```kotlin
private val launcher = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
) { result ->
    
}
```

Later, we `.launch(input parameter)`, and then receive the result to the lambda function.

For example, to pick an image from Gallery, we can rely on the existing `PickVisualMedia` contract.


```kotlin
private val photoPicker = registerForActivityResult(
    ActivityResultContracts.PickVisualMedia()
) { result: Uri? ->

}

fun pickPhoto() {
    photoPicker.launch(
        PickVisualMediaRequest(
            ActivityResultContracts.PickVisualMedia.ImageOnly
        )
    )
}
```

`ActivityResultContract` is a type-safe wrapper that helps you create an outgoing Intent and extract data from the result when the activity returns.

`PickVisualMedia` uses `MediaStore.ACTION_PICK_IMAGES` or `Intent.ACTION_OPEN_DOCUMENT` under the hood, depending on the current Android version.

In order to change the way intent is constructed, for example, to create a picker and let the user decide which app to open, we can override the createIntent function in a contract.

```kotlin
private val photoPicker = registerForActivityResult(
    object : ActivityResultContracts.PickVisualMedia() {
        override fun createIntent(context: Context, input: PickVisualMediaRequest): Intent =
            Intent.createChooser(super.createIntent(context, input))
    }
) { result: Uri? ->

}
```

The file contents can be read with `contentResolver.openInputStream(uri)`, as mentioned in the `ContentResolver` topic.

## Providing files

What if we want to send an attachment to another app? The file may be too big to send it in memory inside Intent.
Instead, we need to pass `Uri` of the file.

What if we want the Camera app to take a photo for us? Modern cameras produce large files which cannot be transferred back in memory.
Neither Camera can provide us an Uri of the photo: it doesn't know how long it should store a photo taken for our app. **We need to create an empty file and provide its Uri to Camera**.

In both situations, we pass `Uri` of a file.
But we can't just use the `file://` scheme: the file is private to our app, thus inaccessible to others. We will need to create a `ContentProvider` which will open access to our files via `content://` Uris. AndroidX offers us `FileProvider`: a `ContentProvider` for precisely this task.

In short, we need to go through these steps:

- configure file paths accessible through our provider

- subclass `FileProvider`, feeding our config to it, and registering it in the Manifest

- ask `FileProvider` to generate a `Uri` for the file

- start an activity, passing `Uri` to the `Intent`

Now to the code.

Configuration is stored as an XML resource. Create a file, for example, res`/xml/provider_paths.xml`.

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">

    <!--
    For sending an attachment, share 'docs/' private files directory,
    publicly visible as 'docs'.
    -->
    <files-path name="docs" path="docs/" />

    <!--
    For requesting photo capture, share 'photos/' private cache directory
    and expose it as 'photos'.
    We use cache directory to avoid dangling file if we fail to delete it after use.
    -->
    <cache-path name="photos" path="photos/" />

</paths>
```

Now we need to subclass `FileProvider` and pass config resource ID to its constructor.

```kotlin
package com.example.app

class AppFileProvider : FileProvider(R.xml.provider_paths)
```

And register the provider in the Manifest within the <application> tag.


```xml
<provider
    android:name="com.example.app.AppFileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true" />
```

As usual, the name specifies our class.
Authorities are semicolon-separated identifiers to refer from outside of the app, and `${applicationId}` is a placeholder that will be automatically expanded to our package name, for example, `com.example.app`.
Exported attribute set to `false` makes the provider invisible from the outside, except for the cases when we pass a `Uri` outside of the app, implicitly granting permission.
And that's what the last attribute, `grantUriPermission`, does.

At this point, we can finally share files from the specified directories. The pattern looks as follows:

```kotlin
val docsDir = File(context.filesDir, "docs"); 
val docFile = File(docsDir, "com.example company income and expenses.csv"); 
val docUri = getUriForFile(context, "${context.packageName}.fileprovider", docFile); 
```

Back to the e-mail attachment, we can just send this `Uri` as `EXTRA_STREAM`. The E-mail app will get our file contents through `FileProvider` we have set up earlier.

```kotlin
startActivity(
    Intent(Intent.ACTION_SENDTO)
        .setDataAndType(Uri.parse("mailto:"), "text/csv")
        .putExtra(Intent.EXTRA_EMAIL, "accountant@app.example.com")
        .putExtra(Intent.EXTRA_SUBJECT, "Annual report")
        .putExtra(Intent.EXTRA_STREAM, docUri)
)
```

With photos, we need several additional actions:

1. create a temporary file before launching the camera

2. preserve file name across configuration changes or process recreations (Camera will consume a lot of RAM)

3. read file contents after receiving the result.

That's a lot! Let's combine all the points together:

```kotlin
private var photoFile: File? = null

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Do standard things you need,
    // like setContentView() in Activity.
    ...

    // Retrieve file path if we're being recreated.
    photoFile = savedInstanceState?.getString("photoFilePath")?.let(::File)
}

override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)

    // Remember file path before we're destroyed.
    outState.putString("photoFilePath", photoFile?.path)
}

// Create activity launcher using a predefined contract.
private val takePhoto = registerForActivityResult(
    ActivityResultContracts.TakePicture(),
    ::onPhotoTaken
)

private fun takePhoto() {
    // Set everything up to make a photo.
    val photosDir = File(context.cacheDir, "photos"); 
    photoFile = File.createTempFile(/*prefix*/"photo", /*suffix*/".jpg", photosDir);
    // createTempFile() will create an empty file
    // with unique name and the specified prefix and suffix in photosDir.
    // ".jpg" is just a guess, Camera don't guarantee a JPEG file.
    // If we pass null, the suffix will be ".tmp" but this won't affect anything.

    val fileUri = getUriForFile(context, "${context.packageName}.fileprovider", photoFile!!)

    // Start camera!
    takePhoto.launch(fileUri)
}

private fun onPhotoTaken(success: Boolean) {
    if (success) {
        // Use the image, for example,
        imageView.setImageDrawable(
            BitmapFactory.decodeFile(
                photoFile!!.path // should never be null
            )
        )
    }

    // Clean up after use.
    // Even if the user has refused to take a picture and we have !success,
    // the file was already created.
    photoFile!!.delete()

    // Forget nonexistent file.
    photoFile = null
}
```

For more advanced features like photo scaling and cropping, you can look for open-source libraries in the following categories: Camera, Image Pickers, Image Croppers.
If you need to upload a photo from Gallery, check out the thread on passing `ContentResolver` data into `OkHttp`.

## Conclusion
Android gives us a great opportunity to invoke third-party apps and communicate with them.

A lot of features are already implemented by different apps and we don't need to re-invent them.

In this topic, you've learned how to open a dialer, browser, viewers and players, e-mail client, gallery, and camera. But they were just examples and a great opportunity to learn how to use FileProvider. There are more [common intents listed in the official doc](https://developer.android.com/guide/components/intents-common), refer to it when you need them.







## references

- [System apps and common intents](https://hyperskill.org/learn/step/30746)