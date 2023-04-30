# Custom view

## Create a view class

        A well-designed custom view is like any other well-designed class. It encapsulates a specific set of functionality with a simple interface, uses CPU and memory efficiently, and so on. In addition to being a well-designed class, a custom view must do the following:

* Conform to Android standards.
* Provide custom styleable attributes that work with Android XML layouts.
* Send accessibility events.
* Be compatible with multiple Android platforms.

## Subclass a view

    All the view classes defined in the Android framework extend `[View]`. Your custom view can also extend `View` directly, or you can save time by extending one of the existing view subclasses, such as `[Button]`.

    To allow Android Studio to interact with your view, at a minimum you must provide a constructor that takes a `[Context]` and an `[AttributeSet]` object as parameters. This constructor allows the layout editor to create and edit an instance of your view.

```kotlin
class PieChart(context: Context, attrs: AttributeSet) : View(context, attrs)
```

## Define custom attributes

        To add a built-in `View` to your user interface, specify it in an XML element and control its appearance and behavior with element attributes. You can also add and style custom views using XML. To enable this behavior in your custom view, do the following:

* Define custom attributes for your view in a `<declare-styleable>` resource element.
* Specify values for the attributes in your XML layout.
* Retrieve attribute values at runtime.
* Apply the retrieved attribute values to your view.

        This section discusses how to define custom attributes and specify their values. The next section covers retrieving and applying the values at runtime.

To define custom attributes, add `<declare-styleable>` resources to your project. It's customary to put these resources into a `res/values/attrs.xml` file. Here's an example of a `attrs.xml` file:

```xml
<resources>
   <declare-styleable name="PieChart">
       <attr name="showText" format="boolean" />
       <attr name="labelPosition" format="enum">
           <enum name="left" value="0"/>
           <enum name="right" value="1"/>
       </attr>
   </declare-styleable>
</resources>
```

Once you define custom attributes, you can use them in layout XML files just like built-in attributes. :

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:custom="http://schemas.android.com/apk/res-auto">
 <com.example.customviews.charting.PieChart
     custom:showText="true"
     custom:labelPosition="left" />
</LinearLayout>
```

## Apply custom attributes

        When a view is created from an XML layout, all the attributes in the XML tag are read from the resource bundle and passed into the view's constructor as an `[AttributeSet]`.Although it's possible to read values from the `AttributeSet` directly, doing so has some disadvantages:

* Resource references within attribute values are not resolved.
* Styles are not applied.

Instead, pass the `AttributeSet` to `[obtainStyledAttributes()]`. This method passes back a `[TypedArray]` array of values that are already dereferenced and styled.

        The Android resource compiler does a lot of work for you to make calling `obtainStyledAttributes()` easier. For each `<declare-styleable>` resource in the `res/` directory, the generated `R.java` defines both an array of attribute IDs and a set of constants that define the index for each attribute in the array. You use the predefined constants to read the attributes from the `TypedArray`. Here's how the `PieChart` class reads its attributes:



```kotlin
init {
    context.theme.obtainStyledAttributes(
            attrs,
            R.styleable.PieChart,
            0, 0).apply {

        try {
            mShowText = getBoolean(R.styleable.PieChart_showText, false)
            textPos = getInteger(R.styleable.PieChart_labelPosition, 0)
        } finally {
            recycle()
        }
    }
}
```

Note that `TypedArray` objects are a shared resource and must be recycled after use.

## Add properties and events

            Thuộc tính là một cách hiệu quả để kiểm soát hành vi và hình thức của View, nhưng chúng chỉ có thể được đọc khi View được khởi tạo. To provide dynamic behavior, expose a property getter and setter pair for each custom attribute. The following snippet shows how `PieChart` exposes a property called `showText`:

```kotlin
fun isShowText(): Boolean {
    return mShowText
}

fun setShowText(showText: Boolean) {
    mShowText = showText
    invalidate()
    requestLayout()
}
```



    Notice that `setShowText` calls `[invalidate()]` and `[requestLayout()]`. These calls are crucial to ensure that the view behaves reliably. You need to invalidate the view after any change to its properties that might change its appearance, so that the system knows it needs to be redrawn. Likewise, you need to request a new layout by requestLayout() function if a property changes in a way that might affect the size or shape of the view. Forgetting these method calls can cause hard-to-find bugs.

## Custom Drawing

        The most important step in drawing a custom view is to override the `[onDraw()]` method. The parameter to `[onDraw()]` is a `[Canvas]` object that the view can use to draw itself.

    Before you can call any drawing methods, though, it's necessary to create a `[Paint]` object. 

### Create Drawing Objects

The `[android.graphics]` framework divides drawing into two areas:

* _What_ to draw, handled by `[Canvas]`
* _How_ to draw, handled by `[Paint]`.

For instance, `[Canvas]` provides a method to draw a line, while `[Paint]` provides methods to define that line's color. `[Canvas]` has a method to draw a rectangle, while `[Paint]` defines whether to fill that rectangle with a color or leave it empty. Simply put, `[Canvas]` defines shapes that you can draw on the screen, while `[Paint]` defines the color, style, font, and so forth of each shape you draw.







## Những lưu ý khi custom View

* Luôn sử dụng lại object thay vì tạo mới nó trong onDraw().
* Ko hardcode kích thước View khi vẽ, mà nên vẽ View phụ thuộc vào kích thước nó có, để tránh trường hợp Dev khác sử dụng lại View đó nhưng cần kích thước khác.
* có 2 method để request update lại View: invalidate() và requestLayout()
  * invalidate(): vẽ lại view đơn giản.
  * requestLayout(): tính toán lại kích thước rồi mới vẽ lại.


