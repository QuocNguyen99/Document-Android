# Themes and styles



## Understanding themes and styles

Themes and styles share the same XML `<style>` structure, but they serve distinct purposes

A simple analogy is to think of them as **Maps** (key/value pairs) where the keys are **attribute names** and the values are the **resources** linked to those attributes.
While their technical implementation is similar, their roles are quite different.

- A **style** is a collection of view attribute values that specify the look and feel of a single `View`. For example, a `TextView` style can specify font color, font size, background color, and maybe more


By extracting these attributes into a style, you can ensure a consistent appearance for similar
components or UI elements across your application that use that same style. 

Moreover, it helps reduce code duplication as you don't have to set the same attributes for each view individually.

- A **theme** is similar to a style but applies to an entire app, activity, or view hierarchy — not just an individual `View`. When a theme is applied, every view in the app or activity applies each style attribute that it supports. Themes can also apply styles to non-view elements, such as the status bar and window background.

Styles and **themes** in Android are designed to work together. For example, consider an application where you want all `Button` views to have a specific background color, and text color. Instead of applying a style to each `Button` individually, you can define a default `Button` style in your theme:

```xml
<!-- This is a style -->
<style name="MyButtonStyle">
    <item name="android:background">#FFA07A</item>
    <item name="android:textColor">#FFFFFF</item>
</style>

<!-- This is a theme -->
<style name="MyTheme">
    <item name="android:buttonStyle">@style/MyButtonStyle</item>
</style>
```


In this example, `MyButtonStyle` defines a specific look for buttons, and MyTheme sets `MyButtonStyle` as the default style for all `Button` views in the app.
Now, every `Button` in your app will automatically use the `MyButtonStyle` unless a different style is explicitly applied to it.

Common attributes in Android themes come from `Material`, `AppCompat`, or the platform. Here are some of the most commonly used theme attributes:

| Attribute            | Description                                                                       |
|-----------------------|-----------------------------------------------------------------------------------|
| `colorPrimary`       | The most dominant color used across your application's UI.                       |
| `colorPrimaryDark`   | A darker variant of colorPrimary, generally used for the status bar.             |
| `colorAccent`        | A color used for UI controls to provide contrast with the primary colors.        |
| `windowBackground`   | Used to set the background color for all windows in the application.             |
| `statusBarColor`     | Used to set the background color of the status bar.                              |
| `navigationBarColor` | Used to set the background color of the navigation bar.                          |
| `textColorPrimary`   | Used for the default text color in your app.                                     |
| `textColorSecondary` | Used for secondary text color in your app, often used for subheadings and captions. |
| `fontFamily`         | Used to set the default font family for all text views in the application.       |
| `windowNoTitle`      | Used to remove the title bar from all activities in your application.            |
| `windowActionBar`    | Used to determine whether an ActionBar is included in the window.                |

You can use common theme attributes in your custom style (or even directly in your views). To do so, you can reference the attribute using the `?attr/ syntax`. For example, to use the `colorPrimary` attribute from your theme in your custom style, you can do something like this:

```xml
<style name="MyCustomStyle">
    <item name="android:textColor">?attr/colorPrimary</item>
</style>
```

> [!NOTE]
> Attribute names that originate from the AppCompat or other androidx or platform Libraries don't utilize the android: prefix. That is exclusively used for attributes that are part of the Android framework.
> In other words, the android: prefix distinguishes framework attributes from those provided by libraries or your own application.

## Inheritance in styles and themes

Both styles and themes support the concept of inheritance.
This can help reduce duplication, make your styles and themes easier to manage, and create a consistent look and feel across your app.

- **Styles**. Inheritance in styles allows a style to inherit the properties of another style. This means that if you have a base style with certain properties, you can create a new style that inherits all of these properties and can optionally override some of them

- **Themes**. Now, let's consider an example of inheritance with themes:

```xml
<style name="BaseTheme" parent="Theme.AppCompat.Light">
   <!-- Base theme inherits from AppCompat Light -->
</style>  

<style name="AppTheme" parent="BaseTheme">
   <item name="colorPrimary">@color/green</item>
   <!-- AppTheme inherits everything from BaseTheme -->
   <!-- But customizes the primary color -->
</style>
```

In this example, `BaseTheme` is a theme that inherits from `Theme.AppCompat.Light` and `AppTheme` is a derived theme that inherits from `BaseTheme` and overrides the colorPrimary attributes to green. This means that `AppTheme` has all the properties from `BaseTheme` and a primary color of green.

Themes can also inherit from the framework or AndroidX Library themes like `Theme.MaterialComponents`, allowing custom themes to inherit default attributes and override if needed.

- **The "dot notation"** inheritance. There's another way to specify inheritance in styles, which is by using dot notation, also known as **implicit inheritance**.
This is a shorthand method for extending a parent style, and it's particularly useful when you want to create a hierarchy of styles.

When you create a style and you want it to inherit from another style, you can simply name the new style by using the parent style's name,
followed by a dot, and then the name of the new style. This implicitly sets the parent style as the parent of the new style.

```xml
<style name="ParentStyle">
    <item name="android:textColor">#FF0000</item>
</style>

<style name="ParentStyle.ChildStyle">
    <item name="android:textSize">20sp</item>
</style>
```

In this example, we have defined a style named `ParentStyle` that sets the text color to red (`#FF0000`).
We then define a new style named `ParentStyle.ChildStyle` that sets the text size to `20sp`.
Since the new style is named using the parent style's name (`ParentStyle`), followed by a dot,
and then the name of the new style (`ChildStyle`), it implicitly sets `ParentStyle` as the parent of `ChildStyle`.
This means that any view using the `ChildStyle` style will inherit the text color attribute from `ParentStyle` (red) and also have its text size set to `20sp`.

> [!CAUTION]
> It's important to note that dot notation can only be used for direct descendants.
> If you want to create a style that inherits from a grandparent style or from a style in a different branch of the hierarchy, you'll need to use the parent attribute.

## Styling precedence order

When styling your Android application, it's important to understand the order in which styles and themes are applied

This is known as the **styling precedence order** or **style hierarchy**
Below are the different levels of styling, ordered from highest precedence (first to be applied) to lowest precedence (last to be applied):

1. **Applying character- or paragraph-level styling using text spans to TextView-derived classes**. 

2. **Applying individual attributes directly to a View**. If you apply an attribute directly to a view in your XML layout file, it will override any similar attribute set in a style or theme.

3. **Applying a style to a View**. You can apply a style to a view in your XML layout file. This style will override any similar attributes set in a theme, but not those applied directly to the view.

4. **Default styling**. Android has a set of default styles that are applied to views if no other styles or attributes are set. These default styles have the lowest precedence and will be overridden by any styles or attributes applied at a higher level.

5. **Applying a theme to a collection of Views, an Activity, or your entire App**. A theme is a collection of styles that can be applied to multiple views, an activity, or your entire app. Themes are applied before individual view styles, but after default styling.

6. **Applying certain view-specific styling**, such as setting a `TextAppearance` on a `TextView`. Some views have specific styling options, such as the `TextAppearance` attribute for `TextView` classes. This has the lowest level of precedence.

## Best practices

Maintainable code and simple style overrides should be the primary goals while working with styles and themes.

To achieve that, here is a list of best practices to follow when building your next Android app:
- **Define common attributes in styles**

Avoid repeating attributes across multiple UI elements. Instead, define these common attributes in styles.

- **Use theme attributes instead of hard-coded values**

Instead of hard-coding values like colors, dimensions, or drawables in your styles, use theme attributes. This practice makes it easier to change these values in different themes.

```xml
<style name="MyButtonStyle" parent="android:Widget.Button">
    <item name="android:background">?attr/colorPrimary</item>
</style>
```

- **Extend existing styles for compatibility**

When creating your own styles, always extend an existing style from the framework or `androidx` libraries. This helps maintain compatibility with platform UI styles. To extend a style, specify the style you want to extend with the parent attribute. You can then override the inherited style attributes and add new ones.

```xml
<style name="MyButtonStyle" parent="Widget.AppCompat.Button">
    <item name="android:textSize">20sp</item>
</style>
```
- **Use a base application theme for consistency**

Define a base theme for your application that includes common attributes. 
For different parts of your app, if you need to change some attributes, create a new theme that inherits from the base theme.

```xml
<!-- Base application theme. -->
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <!-- Customize your theme here. -->
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
</style>

<!-- Special theme for a specific activity. -->
<style name="SpecialActivityTheme" parent="AppTheme">
    <item name="colorPrimary">@color/specialColorPrimary</item>
</style>
```

- **Override styles for variations**

While using common styles, you may need variations for different screens or components.
Avoid duplicating styles. Instead, override attributes in a new style:

```xml
<!-- Base style for text, defined inside values directory -->
<style name="BaseTextStyle" ...>

<!-- Base style for text, defined inside values-xhdpi directory -->
<style name="BigTextStyle" parent="BaseTextStyle">
  <item name="android:textSize">24sp</item> 
</style>
```

- **Use night mode**

Android 10 (API level 29) and higher support a system-wide dark theme. You can use the `DayNight` theme in your app to automatically switch between light and dark themes. This improves the user experience and saves battery life on OLED screens.

- **Minimize style complexity**

Avoid using too many nested levels of style inheritance. Try to restrict to 2-3 levels for better maintainability. Also, minimize style overrides to what is essential.








