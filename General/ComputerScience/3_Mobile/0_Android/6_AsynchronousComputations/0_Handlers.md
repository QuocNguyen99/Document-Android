# Handlers

`Handler` is a class from the Android SDK, which is used for scheduling arbitrary tasks on a particular thread.

**A Handler** operates with a queue of messages.
It allows us to **schedule code execution** at a certain point in the future, with or without a specified **delay**.

Handlers also enable us to execute code **outside of our thread**.

1. put a work into a queue
2. execute it

to associate Our handler object with Mainthread

- `Looper` - class is used to run a message loop for a thread

- `post()` - causes `Runnable` to be added to message queue with a specific time spand

- `Runnable` - interface to use for any class whose instances is going to be executed by thread

## Runnable execution

To see how Handlers can be used, we will create an operation to be performed with a certain delay. Specifically, we will create a function that changes the color of an activity.

Let's start by defining the array of colors that we want to loop through:

```kotlin
private val colors = arrayOf(Color.RED, Color.GREEN, Color.BLUE)
private var color = colors[0]
```

Next, we need a Handler for our event loop inside the main thread:

```kotlin
private val handler = Handler(Looper.getMainLooper())
```

> [!WARNING]
> When importing the Handler class, the IDE will offer two choices: android.os.Handler and java.util.logging.Handler. Be sure to choose the Android-related one!


Now let's declare a `Runnable` object with our logic in a function called `run`:


```kotlin
private val updateLight: Runnable = object : Runnable {
    override fun run() {
        color = colors[(colors.indexOf(color) + 1) % colors.size]
        window.decorView.setBackgroundColor(color)
        handler.postDelayed(this, 1000)
    }
}
```

> [!NOTE]
> As you might have already guessed, window.decorView.setBackgroundColor() is a (non-production) way to change the color of the whole activity without addressing specific elements.

When we use the `postDelayed` method, we pass in two arguments: `this` (our Runnable object itself) and the delay time (in milliseconds) before the Runnable must be executed. In `onStart`, we simply run the following:

```kotlin
override fun onStart() {
    super.onStart()
    handler.postDelayed(updateLight, 1000)
}
```
This gives us an activity that flashes our three colors with a one-second interval!

We must also remember to stop the execution of our task with the `removeCallbacks()` method if the activity is stopped:


```kotlin
override fun onStop() {
    super.onStop()
    handler.removeCallbacks(updateLight)
}
```

This ensures that our activity will stop flashing if it isn't visible and, if it gets destroyed, we will avoid a memory leak and prevent any interaction with detached views.

## Multithreading with Handlers

Now let's try to create a separate thread so that we can use it to increment a counter and display the result in `counterTextView`:

```kotlin
button.setOnClickListener {
    thread {
        for (i in 0..5) {
            handler.post {
                counterTextView.text = i.toString()
            }
            Thread.sleep(100) // let's pretend we're doing some work
        }
    }
}
```

## Additional features

In addition to those used in the above examples, the following functions are also available:

- `postAtTime(@NonNull Runnable r, long uptimeMillis)` — used to specify a time when the action should be performed. It will run when `SystemClock.uptimeMillis() >= uptimeMillis`.
- `postAtFrontOfQueue (Runnable r)` — causes the `Runnable r` to be executed on the next iteration through the message queue.


