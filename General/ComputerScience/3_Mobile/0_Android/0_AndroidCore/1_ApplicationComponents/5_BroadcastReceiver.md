# BroadcastReceiver

`BroadcastReceiver` is a **component** that responds to broadcast messages throughout the system.
These can be messages from both the system itself and from any application (including yours). 

Examples of system messages include a change of date or time, turning on Airplane mode, a change in battery status, and so on.

> [!NOTE]
> Each broadcast message is wrapped in an Intent. The Intent's action string identifies the event that has occurred (android.intent.action.AIRPLANE_MODE, for example).

## How is BroadcastReceiver used?

You start by creating your `BroadcastReceiver`:

```kotlin
class YourBroadcastReceiver : BroadcastReceiver() {
    
}
```

The receiver must have an `onReceive()` method. This method is called when the `BroadcastReceiver` is receiving an Intent broadcast:

```kotlin
class YourBroadcastReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        //Your code here
    }
}
```

Receivers can either be:  
- **static**:
The static option is when the BroadcastReceiver subclass is added to the manifest file
- **dynamic**:
The dynamic option is when the `BroadcastReceiver` instance is **registered** during the application lifetime.

The main difference between these options is that a static receiver will work whether the application is running or not.

if your app isn't already running the system will launch it when the broadcast is sent. By contrast, dynamic receivers are only triggered when the application is running. So, all dynamic receivers are unregistered at the point of application death.

First, let's look at how to use a static receiver. With this option, you only need to declare the receiver in the `AndroidManifest.xml` file inside application block:

## Static receiver

With this option, you only need to declare the receiver in the `AndroidManifest.xml` file inside application block:

```xml
<receiver
    android:name=".YourBroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.AIRPLANE_MODE" />
    </intent-filter>
</receiver>
```

It's as simple as that. Now, when you execute the specified action, the `onReceive()` method will also be triggered.

## Dynamic receiver

Dynamic receivers are created differently. You don't need to use the manifest file because the receiver will be instantiated and registered directly in the code.

Instead, you need to create the receiver and a filter to check for the action you have selected. This is done in the following way:

```kotlin
val receiver: BroadcastReceiver = YourBroadcastReceiver()
val filter = IntentFilter(Intent.ACTION_AIRPLANE_MODE_CHANGED)
applicationContext.registerReceiver(receiver, filter)
```

As you can see above, the final step is to register the receiver. Now, when you execute the specified action, the `onReceive()` method will fire, too.

If you want to turn off your receiver, just add this line at the point where you wish to unregister it:

```kotlin
applicationContext.unregisterReceiver(receiver)
```

## Multiple actions

You may need your application to respond to more than one type of message. for example,
Both `AIRPLANE_MODE_CHANGED` and `DATE_CHANGED`.

You should add a single filter, so there's no need to create several. You can see how to add multiple actions using the static approach below:

```xml
<receiver
    android:name=".YourBroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.AIRPLANE_MODE" />
        <action android:name="android.intent.action.DATE_CHANGED" />
    </intent-filter>
</receiver>
```
And the following example demonstrates how to add more than one action dynamically:

```kotlin
val filter = IntentFilter().apply {
    addAction(Intent.ACTION_AIRPLANE_MODE_CHANGED)
    addAction(Intent.ACTION_DATE_CHANGED)
}
```

If you need a different result for each action, you can use a when expression in your `onReceive()` method:

```kotlin
when (intent.action) {
    Intent.ACTION_AIRPLANE_MODE_CHANGED ->
        Toast.makeText(context, "Airplane mode was changed", LENGTH_LONG).show()
    Intent.ACTION_DATE_CHANGED ->
        Toast.makeText(context, "The date was changed", LENGTH_LONG).show()
}
```

















