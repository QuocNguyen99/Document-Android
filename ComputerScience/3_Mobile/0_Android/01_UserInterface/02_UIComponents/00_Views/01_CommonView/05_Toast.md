# Toast

A `Toast` is a message that appears on the surface of the application window, filling the amount of space it needs for the message.

## Toast cancel() method

You can use the `cancel()` method to remove a Toast from the screen if the information it contains is no longer current. This situation could arise if the user has moved to the next or previous screen and a long Toast message is still being displayed.

## Toast.Callback


Toast.Callback was added in Android 11 R (API 30). It allows you to identify the exact point when a Toast appears and disappears, as shown below:


```kotlin
val toast = Toast.makeText(this, "Here will be your text", Toast.LENGTH_SHORT)
toast.addCallback(object: Toast.Callback() {
    override fun onToastShown() {
        // Your code here
    }

    override fun onToastHidden() {
        // Your code here
    }
})
toast.show()
```

> [!WARNING]
> It's best not to use Toast messages too often. Otherwise, you may run into problems caused by system restrictions that you cannot resolve.

























