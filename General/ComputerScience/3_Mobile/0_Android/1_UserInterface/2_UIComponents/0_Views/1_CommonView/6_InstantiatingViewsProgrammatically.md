# Instantiating Views programmatically

It's a very common practice to declare view hierarchies in XML layout files and turn them into real objects with `LayoutInflater` or by calling `Activity.setContentView(layoutResId)` which does exactly the same thing. After that, we obtain normal objects, such as `TextView`, `Button`, `LinearLayout`, and others. Under the hood, `LayoutInflater` just invokes the constructor of a required `View` class, passes parsed XML attributes into it, and does this recursively, adding child tags to parent `ViewGroup`. Hence, we're dealing with normal objects which can be instantiated directly by invoking a constructor.

## Instantiating a single View

A typical `View` has several constructors which, in general, look like this: `SomeView(context: Context[, attrs: AttributeSet?[, @AttrRes defStyleAttr: Int[, @StyleRes defStyleRes: Int]]])`. We will need the first form, `SomeView(Context)`. Three other parameters are needed for passing XML attributes and applying styles.

Simply put, inside an Activity the expression `TextView(this)` will create a brand new `TextView`. In order to show it, we need to attach it to the Activity's `View` hierarchy. To do this, we can use another version of `setContentView` which accepts a `View`.

With this knowledge, we can create, configure, and attach a `View`:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    setContentView(TextView(this).apply {
        text = "Hello from Kotlin code!"
        textSize = 36f
    })
}
```

## Dimensions


Any good `View` implements Java setters or Kotlin properties along with XML attributes so that it can be configured both from XML and Java/Kotlin code. But this is not always straightforward.

The first thing to note is size units: we can't write `10dp` or `10sp` in Kotlin. Most sizes are in pixels except for `TextView.setTextSize()` which accepts `sp`. The general way to use any of the supported units (dp, sp, pt, in, mm) is the TypedValue.applyDimension function. A more straightforward option to convert dp to px is multiplication by screen density: `(value * context.resources.displayMetrics.density).toInt()`. This is quite long, so in projects which use programmatic layouts, it's quite common to meet a bunch of extensions.


```kotlin
fun Context.dp(dp: Int): Int = (dp * resources.displayMetrics.density).toInt()
fun Context.dp(dp: Float): Float = dp * resources.displayMetrics.density

fun Context.sp(sp: Int): Int = (sp * resources.displayMetrics.scaledDensity).toInt()
fun Context.sp(sp: Float): Float = sp * resources.displayMetrics.scaledDensity

inline fun View.sp(sp: Int): Int = context.sp(sp)
inline fun View.sp(sp: Float): Float = context.sp(sp)

inline fun View.dp(dp: Int): Int = context.dp(dp)
inline fun View.dp(dp: Float): Float = context.dp(dp)
```

## Colors and Drawables

Another point to pay attention to is applying colors and Drawables. In XML, we typically can pass any of them into the same attribute.

```xml
<View
    ...
    android:background="@drawable/beautiful_shape"
    android:background="@color/nice_color"
    android:background="#3700B3" />
```
Equivalent code looks a bit more verbose but there are some shortcuts available.

```kotlin
background = ContextCompat.getDrawable(context, R.drawable.beautiful_shape)

// using a shortcut, works both for color resources and drawable resources
setBackgroundResource(R.color.nice_color)

// third case, inline color, can also be done differently
background = ColorDrawable(0xFF3700B3) // 0x is hexadecimal notation in Kotlin
setBackgroundColor(0xFF3700B3) // FF is alpha channel which is set to “fully opaque”
```

> [!CAUTION]
> `setBackgroundColor()` accepts a color integer. `R.color.*` provides a resource ID instead. That's why we call `set*Resource(R.color.*)`, and not `set*Color(0x*)`. `set*Color(R.color.*)` is a mistake and will give unexpected color.

## Identifiers

We mainly declare `View` IDs in XML in order to use `findViewById()` later. But there's one more reason: Views with IDs will save their state when Activity or Fragment is recreated. So, if we create an `EditText` programmatically, the easiest way to preserve the user input is to assign an ID to it. In XML we could declare an identifier with `@+id/` but this won't work in Kotlin. The first thought might be declaring our own constants, like `const val AWESOME_EDIT_TEXT = 1`, but this will never guarantee uniqueness. It's better to use built-in ID resource machinery.

To declare an ID resource, create a 'values' resource file with recommended name `values/ids.xml`, like this:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <item name="awesome_edit_text" type="id" />
    <!-- more items… -->
</resources>
```

That's it! Now you have `R.id.awesome_edit_text` accessible in Kotlin, letting us assign it.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    setContentView(EditText(this).apply {
        id = R.id.awesome_edit_text
        hint = "I will save my state!"
    })
}
```
## Layout parameters

Every `ViewGroup` positions its children somehow. In XML, we have `layout_-prefixed` attributes which provide additional info about a `View` position within its parent.

```xml
<LinearLayout
    ... />

    <View
        android:layout_width="…"
        android:layout_height="…"
        android:layout_weight="…" />

</LinearLayout>
```

Note that `layout_weight` only works inside `LinearLayout`, `layout_centerInParent` in `RelativeLayout`, and `FrameLayout` supports `layout_gravity`. How does it work?

Any `View` has `layoutParams: ViewGroup.LayoutParams` property, and `ViewGroup` implementations have their own subclasses like `LinearLayout.LayoutParams`, `RelativeLayout.LayoutParams`, and `AnyOtherLayout.LayoutParams`. When a View is added into a `ViewGroup`, the latter ensures that the child's `LayoutParams` are valid and can be handled.

There are two main ways to specify `LayoutParams`.

The first one is to assign `layoutParams` property. This is the only way when creating `Fragment`'s root view, or a `RecyclerView.ViewHolder` item (you'd need `RecyclerView.LayoutParams` then).

```kotlin
setContentView(EditText(this).apply {
    id = R.id.awesome_edit_text
    layoutParams = FrameLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT)
    hint = "I will save my state!"
})
```

The other option is to specify `LayoutParams` when adding a view into its parent.

```kotlin
// adding a root View of an Activity
setContentView(LinearLayout(this).apply {
    orientation = LinearLayout.VERTICAL

    // adding a View to its parent
    addView(EditText(context).apply {
        id = R.id.awesome_edit_text
        hint = "I will save my state!"
    }, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))

}, FrameLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))
```

Under the hood, it just assigns `LayoutParams` to the `View`, so this option is just a shortcut.

When mutating `LayoutParams` on already visible `View`, it's important to re-assign `layoutParams`. Otherwise, the `View` may not notice any change.

```kotlin
(view.layoutParams as LinearLayout.LayoutParams).run {
    width = dp(500)
} // will not update or will do it unpredictably later

view.layoutParams =
    (view.layoutParams as LinearLayout.LayoutParams).apply {
        width = dp(500)
    } // will do the job right ahead
```

## Applying styles and themes

Back to the longest `constructor(context: Context, attrs: AttributeSet?, @AttrRes defStyleAttr: Int, @StyleRes defStyleRes: Int)`. The last two parameters are intended for styling. `defStyleAttr` points to a theme attribute where the View should find its style. `defStyleRes` is a direct reference to a style. This sounds complicated but let's look at the simplest case:

```kotlin
Button(context, null, 0, 0).apply {
    // this trick cannot be done in XML!
}
```

The `Button` is just a stylish `TextView`, but here we'll take away all the style: no `background`, no `minWidth`, no `padding`, so now you can configure it from scratch, without interfering with the built-in design system. From the accessibility point, this is still a `Button`, not a plain `TextView`, which is important for blind users.

Wiping styles is fun but now let's talk about setting them. Here's an excerpt from `values/themes_material.xml`inside Android:


```xml
<style name="Theme.Material">
    <!-- Button styles -->
    <item name="buttonStyle">@style/Widget.Material.Button</item>
    <item name="buttonStyleSmall">@style/Widget.Material.Button.Small</item>
    <item name="buttonStyleInset">@style/Widget.Material.Button.Inset</item>
```

In Java/Kotlin terms, the middle line can be read as “Material theme attribute `android.R.attr.buttonStyleSmall` has value `android.R.style.Widget_Material_Button_Small`”.

> [!CAUTION]
> Note that dots from XML resources are turned into underscores in R.

There are two different options for how to apply it.

```kotlin
// via theme, like style="?android:attr/buttonStyleSmall"
Button(context, null, android.R.attr.buttonStyleSmall)

// directly, like style="@android:style/Widget.Material.Button.Small"
Button(context, null, 0, android.R.style.Widget_Material_Button_Small)
```

The first option works when you have different themes assigning the same attributes to different themes, and you need to pick a style according to the current theme. The second one is for specifying the style directly.


> [!CAUTION]
> A style or theme cannot be applied to an already created View. There's no setStyle() or setTheme(), everything happens in a constructor.

A style applies to a single View. A theme, on the other hand, affects the whole subtree. What can we do to mimic `android:theme` attribute behavior? Apart from `View`, themes can be applied to `Application` and `Activity`, and both of them extend the Context class. So, themes are applied using `Context`, or, to be precise, `ContextThemeWrapper`. We just pass a wrapped themed context into a `View` constructor and then it receives theme attributes.


```kotlin
setContentView(LinearLayout(
    ContextThemeWrapper(this, android.R.style.Theme_Material)
).apply {
    orientation = LinearLayout.VERTICAL

    addView(EditText(context /* we're using parent context with a theme */).apply {
        ...
    }, LinearLayout.LayoutParams(...))

}, FrameLayout.LayoutParams(..))
```

Now both `LinearLayout` and `EditText` receive the same theme which has priority over the themes of `Activity` and `Application`.


## reference

- [Instantiating Views Programmatically](https://hyperskill.org/learn/step/29230)






