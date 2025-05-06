# Values


## Strings

String resources are indicated by the tag `<string>`. It is suggested to store string resources in a strings.xml file, but you can use multiple files.

Each `<string>` element has a "name" property and a value:


```xml
<resources>
   <string name="app_name">Android</string>
   <string name="btn_text">Click Me</string>
   <string name="btn_action">Send Me</string>
</resources>
```

If you create several files with resources, ensure that the file names are unique.
Note that resources of the same type and the same name within the same directory will cause a conflict, and the Android Asset Packaging Tool (**aapt**) will not compile them.
The aapt tool parses, indexes, and compiles the resources into a binary format optimized for the Android platform.

### Exception for localized resources

Android allows multiple resource files with the same name as long as they are placed in different directories that are qualified by language or region. This is because Android supports resource localization, where different versions of a resource file are provided for different languages or regions.

When the app runs, Android will automatically select the appropriate version of the resource based on the user's device language settings. If no specific resource for a language is found, the default resource (`res/values/strings.xml`) will be used.

Thus, files with the same name like `strings.xml` can coexist without conflicts because they are placed in directories qualified by different locales (`e.g., values, values-vi, values-fr, etc.`).

## Colors

To work with color, you might need to brush up on the [rgb and cmyk formats](https://99designs.com/blog/tips/correct-file-formats-rgb-and-cmyk/). Use the tag `<color>` to specify different colors and shades. You can use one of the following formats and values:

- #RGB
- #RRGGBB
- #ARGB
- #AARRGGBB

Example:

```xml
<resources>
   <color name="colorPrimary">#6200EE</color>
   <color name="colorPrimaryDark">#3700B3</color>
   <color name="colorAccent">#03DAC5</color>
   <color name="green_lime">#CDDC39</color>
   <color name="indigo">#3F51B5</color>
</resources>
```

## Styles and themes

**Style resources help you maintain a consistent look for your application.** A style is a set of attributes that control the appearance and behavior of a View.
They are stored in the `styles.xml` or `themes.xml` files.

Specifying a `style` attribute for a View tag applies the style's attribute values to the View.

```xml
<!-- styles.xml -->
<resources>
    <style name="GreenPadded">
        <item name="android:background">@android:color/holo_green_light</item>
        <item name="android:padding">8dp</item>
    </style>
</resources>
```

```xml
<!-- layout -->
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    style="@style/GreenPadded" />
```

A theme is a style applied to a certain scope: a container, activity, or application. 
In the example below, the theme affects the appearance of a `TextView` inside the `FrameLayout`:

```xml
<!-- styles.xml -->
<resources>
    <style name="GreenPadded">
        <item name="android:background">@android:color/holo_green_light</item>
        <item name="android:padding">8dp</item>
    </style>
    <style name="BigCenteredText">
        <item name="android:textSize">34sp</item>
        <item name="android:gravity">center</item>
    </style>
</resources>
```

```xml
<!-- layout -->
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    style="@style/GreenPadded"
    android:theme="@style/BigCenteredText">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:text="Look at me, I'm themed!" />

</FrameLayout>
```


A theme for the whole `<application>` or an `<activity>` can be specified in the manifest file:

```xml
<manifest ...>
   <application
       android:icon="@mipmap/ic_launcher"
       android:label="Android Manifest"
       android:theme="@style/AppTheme">
       ...
</manifest>
```

## Dimens

Android supports many units of measurement: **dp**, **sp**, **pt**, **px**, **mm**, and **in**.

In the past, developers used pixels when working with computer interfaces. 
But with the appearance of a wider variety of display densities, this approach became a source of problems.
At higher resolutions, elements looked really small. So new units of measurement began to appear that were independent of screen resolution.

Density-independent pixels (dp) are adjusted for screen density to have the same physical size among different devices. **Developers use them to specify the sizes of UI elements.**

**Scalable pixels (sp) are designed for text sizes**. They work similarly to dp, but can be scaled by the user in Android Settings.
This allows users to change text size without re-scaling the whole user interface.

```xml
<resources>
    <dimen name="font_size">18sp</dimen>
    <dimen name="space">1dp</dimen>
    <dimen name="btn_size">100dp</dimen>
</resources>
```

The resource system retrieves the dimension and multiplies it by `resources.displayMetrics.density` for `dp`,
or by `resources.displayMetrics.scaledDensity` for `sp`, giving the value in pixels for the current screen density and user's preference.




























