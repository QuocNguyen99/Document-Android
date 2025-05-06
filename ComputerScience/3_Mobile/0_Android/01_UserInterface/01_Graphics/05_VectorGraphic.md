
## Vector

`VectorDrawables` are images in Android that are defined using vector graphics, which means they are created using lines, curves, and shapes rather than pixels like traditional images.
They are similar to `SVG` (Scalable Vector Graphics) images used on the web.

Here's an example:

In Android Studio, you can easily import existing SVG files and convert them to VectorDrawables (File → New → Vector Asset).
This process simplifies the creation of vector graphics for your app without needing to manually write XML code.

`VectorDrawable` class is used to handle vector graphics. Unlike colors or images, there isn't a specific class for vectors.

> [!CAUTION]
> Also, you can't create vector drawings programmatically using code;
> you have to use XML files to define them. This means you can't dynamically generate vector graphics at runtime, they need to be defined beforehand in your app's resources.

## Shapes and gradients

We can create a rectangle with rounded corners, a horizontal gradient fill in the following way:

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <corners
        android:radius="8dp" />
    <gradient
        android:angle="0"
        android:startColor="#8C5AFF"
        android:endColor="#408BCF" />
    <stroke
        android:width="1dp"
        android:color="#333333" />
</shape>
```
![alt text](/resources/gradient_rectangle_shape_drawable.png)


Ironically, the `ShapeDrawable` class is not actually used when you define a `<shape>` in XML.
Instead, when you create a `<shape>`, Android converts it into a `GradientDrawable`, even if it only contains a solid color.

Here’s the Kotlin equivalent of the above `<shape>` definition:

```kotlin
GradientDrawable().apply {
    cornerRadius = dp(8f)
    orientation = GradientDrawable.Orientation.LEFT_RIGHT
    colors = intArrayOf(0xFF8C5AFF.toInt(), 0xFF408BCF.toInt())
    setStroke(dp(1), 0xFF333333.toInt())
}
```

this example use two additional function:

```kotlin
/** Converts Device Independent Pixels to pixels. Returns an `Int` or a `Float` based on [value]'s type. */
inline fun Context.dip(value: Int): Int = (value * resources.displayMetrics.density).toInt()

/** Converts Device Independent Pixels to pixels. Returns an `Int` or a `Float` based on [value]'s type. */
inline fun Context.dip(value: Float): Float = (value * resources.displayMetrics.density)
```

## 9-patch

A **9-patch** is a raster (PNG) image with stretchable areas.
It is mainly used as a background because it automatically accommodates to the dimensions of the view.

To illustrate this, let's take a peek at some patches from the Android SDK:

![alt text](/resources/9-patch-example.png)

So, these files have `.9.png` extensions, they are valid PNG files, but there are some black dashes around the image.
Patches have a special one-pixel border: black pixels on the left and at the top denote stretchable areas, and non-black pixels on the right and at the bottom indicate padding.

Example render of EditTexts which use stretched `textfield_` images from the screenshot above:

![alt text](/resources/edit_text_with_9_patch.png)

For more details, see [the official docs on 9-patch](https://developer.android.com/guide/topics/graphics/drawables#nine-patch) and [how to create patches in Android Studio](https://developer.android.com/studio/write/draw9patch). For the API, please refer to [NinePatch](https://developer.android.com/reference/android/graphics/NinePatch) and [NinePatchDrawable](https://developer.android.com/reference/android/graphics/drawable/NinePatchDrawable).

In the above screenshot, there are some 9-patches called "default", "activated", "disabled", "focused" and "selected".

## Drawable selector

A `<selector>` can also reference `Drawables`, so a `StateListDrawable` is a composite `Drawable` that also depends on the current state.

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- Apache 2.0 License header skipped… -->

<selector xmlns:android="http://schemas.android.com/apk/res/android">
    
    <item android:state_window_focused="false" android:state_enabled="true"
        android:drawable="@drawable/textfield_search_default" />
        
    <item android:state_pressed="true"
        android:drawable="@drawable/textfield_search_pressed" />
        
    <item android:state_enabled="true" android:state_focused="true"
        android:drawable="@drawable/textfield_search_selected" />
    
    <item android:drawable="@drawable/textfield_search_default" />
    
</selector>
```

When creating selectors programmatically:

```kotlin
StateListDrawable().apply {
    addState(
        intArrayOf(-android.R.attr.state_window_focused, android.R.attr.state_enabled),
        textfieldSearchDefault
    )
    addState(
        intArrayOf(android.R.attr.state_pressed),
        textfieldSearchPressed
    )
    addState(
        intArrayOf(android.R.attr.state_enabled, android.R.attr.state_focused),
        textfieldSearchSelected
    )
    addState(
        intArrayOf(),
        textfieldSearchDefault
    )
}
```

## Other Drawables

- Since the release of Lollipop, clickable elements like list items respond to clicks with a [RippleDrawable](https://developer.android.com/reference/android/graphics/drawable/RippleDrawable).

- A [LayerDrawable](https://developer.android.com/reference/android/graphics/drawable/LayerDrawable) is a composite that draws its children one over another.

- [InsetDrawable](https://developer.android.com/reference/android/graphics/drawable/InsetDrawable) is a decorator that adds some paddings to another Drawable.

- `Drawables` can also have a level: an integer in the `0..10_000` range. For example, battery, Wi-Fi, and mobile signal levels are [LevelListDrawables](https://developer.android.com/reference/android/graphics/drawable/LevelListDrawable):

![alt text](/resources/level_list_drawables.png)

- There are also the `RotateDrawable`, the `ScaleDrawable`, and the `ClipDrawable`. The way these Drawables look is dependent on the level value, too.

- Finally, for something that moves, you can check out the `TransitionDrawable`, the `AnimationDrawable`, or the `AnimatedVectorDrawable`, amongst others.


## reference

- [Advanced Vector Graphics and Drawables](https://hyperskill.org/learn/step/45974)