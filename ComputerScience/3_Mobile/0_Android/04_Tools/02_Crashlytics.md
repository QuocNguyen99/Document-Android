# Crashlytics

**Crashlytics** is one of the many services Firebase offers to enhance the development cycle for developers and help them build reliable and high-quality apps. The Crashlytics service collects and reports the analytics related to crashes, errors, exceptions, and logs within your app. It collects these types of data from your user base and provides insights for any critical or uncritical issues that might affect your app user experience.

## How does it work?

- **Logging**. You need to log important events in your app so that Crashlytics can gather them and show you the context and the user's pathway that lead to the crash.

- **Stack tracing**. Even if your application manages to recover from an error by capturing and handling it, the stack trace can still be captured and forwarded to you.

- **Crash reporting**. Every crash is transformed into a comprehensive crash report automatically sent when the application is started again. Using an analysis engine, Crashlytics groups similar events by comparing the error messages, error codes, and where the problems occurred in the app. These grouped events are called "issues," and the more events that match the issue, the higher this issue is ranked in the Crashlytics dashboard. This helps you prioritize and fix the most critical problems first.


## A more comprehensive crash report

To customize your reports and include more relevant data based on your use case, Crashlytics SDK provides the following four functionalities:
custom keys, custom logs, user identifiers, and caught exceptions.

- **Custom keys**: use them when you want to include other variables from your app in the crash reports sent to you because you think they would be relevant in helping you identify the problem. You can include up to 64 key/value pairs. Each pair can reach 1kB in size.

```kotlin
Firebase.crashlytics.setCustomKeys {
    key("key_1", "Wow") // String value
    key("key_2", true)  // boolean value
    key("key_3", 2.0)   // double value
    key("key_4", 9)     // int value
}
```

- **Custom logs**: use them when you need more context about the use case and the events that the user has gone through just before the crash. You can add logs that would be bundled with the crash data and displayed under the Logs tab in the Crashlytics dashboard.

```kotlin
Firebase.crashlytics.log("Logging In")
```

- **User identifiers**: use them when you need to know which users experienced a specific crash or error. They might help figure out that some errors are related because they originate from the same users. Crashlytics allows you to identify users in your custom crash reports.

```kotlin
Firebase.crashlytics.setUserId("00012")
```

- **Caught exceptions**: you can collect and send non-fatal exceptions which are caught within your app. Crashlytics allows you to record up to 8 exceptions which will be sent the next time your app is launched. If your app throws more than eight exceptions, only the newest 8 exceptions are recorded.

```kotlin
try {
    // Code that can possibly throw an error
    ...
} catch (e: Exception) {
    // Record Exceptions using Crashlytics
    Firebase.crashlytics.recordException(e)
    ...
}
```


































