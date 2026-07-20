# Espresso

**Espresso** is a popular open-source UI testing framework, developed and maintained by Google, designed specifically for Android developers.

## Why Espresso?

- Espresso provides a simple-to-learn core API which is also open for customizing
- Espresso is integrated into Android Studio, which makes it even easier to create, run and debug UI tests from within the development environment
- Additionally, there are features such as Record Espresso Test that can be used to generate a test based on user interaction with the app under testing


## Setting up Espresso

Espresso should already be configured by default when you create an Android Studio project.
To confirm,check for the presence of these dependencies in your app's `build.gradle` file:


```gradle
dependencies {
    ...
    androidTestImplementation 'androidx.test.ext:junit:1.2.1'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.6.'
}
```
You can check [the latest version of the espresso-core library](https://mvnrepository.com/artifact/androidx.test.espresso/espresso-core) and the [latest version Android extension library for JUnit](https://mvnrepository.com/artifact/androidx.test.ext/junit). Here is why we need those dependencies:

- `androidx.test.espresso:espresso-core` dependency provides the core API for writing UI tests using Espresso in Android applications.

- `androidx.test.ext:junit` dependency provides extensions for using JUnit in Android app testing. It is required because Espresso relies on the JUnit testing framework for the execution of its test cases.

Next, verify if the instrumentation runner is set in the same `build.gradle` file:

```gradle
android {
    ...
    defaultConfig {
        ...
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
}
```

The instrumentation runner is a test runner that executes instrumentation tests on an Android device or emulator. 
It is responsible for running the test cases and collecting the test results.

Finally, you need to set up your test device(s) for UI testing. The first step is to enable developer options on the device.

Once the developer options are enabled, disable these three settings:
- window animation scale
- transition animation scale
- animator duration scale.

This step is necessary to reduce test flakiness.

Test flakiness refers to the unpredictable and inconsistent behavior of test results due to some external factors.

























