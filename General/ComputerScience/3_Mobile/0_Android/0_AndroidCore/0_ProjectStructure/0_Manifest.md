# Android Manifest

The manifest file describes essential information about your app in an XML file.


## `<application> tag`

This is the main element that manages the structure of your app.

Within the `<application>` tag, you’ll find attributes that define certain app properties. 
For example, the `android:icon` attribute specifies the app’s icon, while the `android:label` attribute defines the text label users see in their list of applications:

```xml
<manifest ...>
   <application
       android:allowBackup="true"
       android:icon="@mipmap/ic_launcher"
       android:label="Android Manifest"
       android:roundIcon="@mipmap/ic_launcher_round"
       android:supportsRtl="true"
       android:theme="@style/AppTheme">
       ...
</manifest>
```

There are several other attributes specified within the `<application>` tag.
Some of which are self-explanatory, while others you'll understand better as you continue learning Android development.

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```


in Android, activities serve as entry points to your app. Each activity provides a window for the app to draw its UI and interact with the user. Within the `<activity>` tag, there’s a required attribute: `android:name`.

For the app to use the activity, it must be specified in the app’s manifest, as we saw earlier, using the `android:name` attribute to point to this class.



## `<intent-filter> tag`

The next block in the file has a tag `<intent-filter>` which tells Android which Activity should be started when the user taps on the application icon. 

```xml
<activity android:name=".MainActivity">
   <intent-filter>
      <action android:name="android.intent.action.MAIN" />

      <category android:name="android.intent.category.LAUNCHER" />
   </intent-filter>
</activity>
```

The elements `<action>` and `<category>` indicate that the activity icon should be shown in the launcher.

> [!CAUTION]
> Note that MainActivity is referenced in the element activity tag. Any Activity in your app must be declared in the manifest. If not your application will be crashed.

Other activities in the manifest may use `<intent-filter>` tag for different purposes or omit it altogether.


## App components

You will have to edit the file, change its structure, and add new elements and attributes during application development. The file `AndroidManifest.xml` is also the place where you declare the following:

- The **package name** for the application uniquely identifies it.
- The components of the app, which include **activities**, **services**, **broadcast** **receivers**, and **content providers**. Based on these declarations, the Android system can determine what components are included in the application and under what conditions they are launched.

- The **permissions** that your app needs. Permissions include the ability for your app to access sensitive user data such as contacts and SMS, or certain system features such as hardware and Internet access. You can use system permissions defined by Android or define your custom permissions.

```xml
<manifest ... >
    <uses-permission android:name="android.permission.INTERNET"/>
    <application ...
</manifest>
```

- Finally, **the hardware and software feature** the app requires. Depending on this, Play Store determines which apps can be installed on a specific device. The element `<uses-feature>` declares specific functionality required for the application to function. Note: your application will not be installed on devices that do not have the necessary functionality.

For example, the application might require an autofocus camera. **If the device does not have a built-in autofocus camera, the application will not be installed**. You can declare the autofocus camera as required with the following manifest tag:

```xml
<manifest ... >
    <uses-feature android:name="android.hardware.camera.autofocus"
                  android:required="true"/>
    <application ...
</manifest>
```