# build.gradle files

In JVM-based projects, you often have to deal with **build systems**. 

The most common one is Maven. Its configuration is based on XML, and it has a functional but hard-to-read XML syntax.
In Android, it was decided to use the Gradle project build system. Gradle files can be written in Groovy and also recently began to support Kotlin DSL.


Android projects usually have two Gradle configuration files — **module level** and **project level**.

## build.gradle (module level)

When we create a project in Android Studio, the `build.gradle` file shown below will automatically be created in the app folder:

```kotlin
plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    compileSdk 30

    defaultConfig {
        applicationId "com.example.testapplication"
        minSdk 21
        targetSdk 30
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.3.2'
    implementation 'androidx.appcompat:appcompat:1.2.0'
    implementation 'com.google.android.material:material:1.3.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
    testImplementation 'junit:junit:4.+'
    androidTestImplementation 'androidx.test.ext:junit:1.1.2'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
}
```

### plugins block

At the very top of `app/build.gradle`, we see a block containing details of the plugins that are being used — this is where we can specify the `id` of any additional plugins we want to apply:

```kotlin
plugins {
    id 'com.android.application'
    id 'kotlin-android'
}
```

Plugins allow us to extend the functionality of the projects we create. 

For example, the plugin `com.android.application` means that the project is an Android app, while `com.android.library` would indicate that it's an Android library instead.

This plugin allows you to configure some android app build options in the next `android` block.

### android block
The `android` block comes next. This is where we set the configuration specific to our Android app using curly brackets.

### defaultConfig block
In the `defaultConfig` section, we specify the properties that the Android plugin (`com.android.application`) will apply to all the builds of our application:

```kotlin
defaultConfig {
    applicationId "com.example.testapplication"
    minSdk 21
    targetSdk 30
    versionCode 1
    versionName "1.0"
    testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
}
```

- `applicationId` is a unique identifier that allows you to identify your app in the Google Play Store. It has certain limitations:

    - It must have at least two segments — one or more dots in the name.

    - Segments can only start with letters.

    - Only alphanumeric literals and underscores are allowed.

- `minSdk` defines the minimum Android version that the app will be compatible with.

- `targetSdk` sets the API level at which the application is intended to run.

- `versionCode` is an integer variable indicating the version code of the application, as the name implies. It isn't displayed to users but protects against downgrading the application version, meaning an older version can't be placed on top of the existing one.


- `versionName` is for the benefit of users — it's visible to them and must be a string. Refer to Semantic versioning for instructions about building the version string.


- `testInstrumentationRunner` specifies the complete class name of the test runner that will execute the Android instrumented tests.

### buildTypes block

The next section is `buildTypes`. Here we declare the assembly configurations. For example, release and debug configurations. Anything we specify inside `release{ ... }` will be applied to this particular build:


```kotlin
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```
The `minifyEnabled false` flag is responsible for enabling **R8** and is set to false by default. This is a special tool that serves to obfuscate and optimize code. Code obfuscation is used to protect the program code so that it is even harder for hackers to break. If we turn it on, code shrinking, obfuscation, and optimization will be enabled for the project's release build type only.


`proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'` allows us to include standard ProGuard rules in the build. However, the `proguard-rules.pro` file doesn't contain any rules by default. It's located in the app folder, so you can include some rules there if you wish.

### compileOptions block

`compileOptions` is where we specify the project's compilation features:

```kotlin
compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
}
```

sourceCompatibility `JavaVersion.VERSION_1_8` indicates that this version of the Java programming language will be used to compile the .java files.

The targetCompatibility `JavaVersion.VERSION_1_8` parameter ensures that the generated class files will be compatible with the VMs specified in this version.

Note that the target is usually assigned the same value as the source:

```kotlin
kotlinOptions {
    jvmTarget = '1.8'
}
```


### dependencies block

The final block is where we define our project's dependencies. The `implementation` keyword allows us to access remote dependencies, which will be loaded from the remote repositories:

```kotlin
implementation 'androidx.core:core-ktx:1.3.2'
```

`testImplementation` and `androidTestImplementation` add dependencies for the test and androidTest configurations, respectively:

```kotlin
testImplementation 'junit:junit:4.+'
androidTestImplementation 'androidx.test.ext:junit:1.1.2'
androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
```

Our project creates three packages: `app/src/main`, `app/src/androidTest` and `app/src/test`. The first one is the main working package where we write our application code. The second one is the package where we write the tests specific to the android system components as such. And the third one is where we write the android-independent tests.

## build.gradle (project level)

```kotlin
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.0.2' apply false
    id 'com.android.library' version '8.0.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.8.20' apply false
}
```

The file you can see above is also called `build.gradle` and is created in the project's root directory (hence the name project level).
Applications may have several modules, so it describes the configuration that will be applied to them all.

When we start a new project, these plugins are defined in the plugins method and are necessary for the Android project. 

All plugins set inside this method will be searched by the repositories that are set in the `settings.gradle`.

`com.android.application` is an essential component in Gradle for use in Android application project.
It handles the packaging of app resources, assets and code into an APK file, so that it's ready for installation and execution on Android devices.

`com.android.library` is essential for Android project, it's used for creating Android libraries or dependencies that can be used as dependencies in other Android projects. It provides the necessary tasks, configurations, and conventions to build and package the module's resources, assets, and code into an Android Archive (AAR) file. The AAR file contains the compiled code, resources, and manifest of the library, making it easy to share and reuse across different Android projects.

`org.jetbrains.kotlin.android` is used for Kotlin Android projects. It is used to enable Kotlin language support in Android modules, sets the necessary configurations to compile Kotlin code, and integrates it seamlessly with the Android build process. This plugin ensures that Kotlin files are compiled into Java bytecode, making them compatible with the Android Runtime (ART) on Android devices.


> [!CAUTION]
> The Kotlin plugin version should be compatible with your Kotlin compiler version and the Kotlin standard library version used in your project.

## Other Gradle files

There are three others you should know about:

1. The `gradle-wrapper.properties` file is used to configure the Gradle wrapper, which is a tool for downloading a specific Gradle version:

```properties
distributionBase=GRADLE_USER_HOME
distributionUrl=https\://services.gradle.org/distributions/gradle-7.0.2-bin.zip
distributionPath=wrapper/dists
zipStorePath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
```
2. As with the previous file, gradle.properties contains key-value pairs. We can use it to configure certain properties: JVM parameters, Kotlin code style, and so on.

```properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
```
3. And at the last, `settings.gradle` it is located in project root directory, and defines **project-level** **repository settings** and informs Gradle which modules it should include when building your app. **Multi-module projects need to specify each module that should go into the final build**.

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "testapplication"
include ':app'
```

- The **pluginManagement** block is used to define repositories where Gradle should search for plugins. it specifies three repositories:
  - `google()`: Google's Maven repository, which is used to resolve Android-related plugins and dependencies.
  - `mavenCentral()`: Maven Central repository, which is a popular repository for Java and Android libraries.
  - `gradlePluginPortal()`: Gradle Plugin Portal, which is the official repository for Gradle plugins.

- The **dependencyResolutionManagement** repositories block is where you configure the repositories and dependencies used by all modules in your project, such as libraries that you are using to create your application. 

However, you should configure module-specific dependencies in each module-level build.gradle file. For new projects, Android Studio includes Google's Maven repository and the Maven Central Repository by default, but it does not configure any dependencies (unless you select a template that requires some).

- `rootProject.name = "testapplication"`: This line sets the name of the root project to "testapplication." The root project represents the top-level project in a multi-module build.

- `include ':app'`: This line includes the app module in the build. It means that the app module will be part of the overall Android project and will be built when you run Gradle tasks. It enables us to include multiple modules in our project by defining subprojects separated by commas:

`include ':app', ...`