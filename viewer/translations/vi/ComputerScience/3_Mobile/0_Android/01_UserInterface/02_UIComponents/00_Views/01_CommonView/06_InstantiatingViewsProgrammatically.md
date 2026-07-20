# Khởi tạo chế độ xem theo chương trình

Thực tế rất phổ biến là khai báo hệ thống phân cấp chế độ xem trong tệp bố cục XML và biến chúng thành đối tượng thực bằng `LayoutInflater` hoặc bằng cách gọi `Activity.setContentView(layoutResId)`, cách này thực hiện chính xác điều tương tự. 
Sau đó, chúng tôi thu được các đối tượng bình thường, chẳng hạn như `TextView`, `Button`, `LinearLayout` và các đối tượng khác.

Dưới lớp vỏ bọc, `LayoutInflater` chỉ gọi hàm tạo của lớp `View` được yêu cầu, chuyển các thuộc tính XML đã phân tích cú pháp vào đó và thực hiện điều này một cách đệ quy, thêm các thẻ con vào `ViewGroup` gốc.
Do đó, chúng ta đang xử lý các đối tượng thông thường có thể được khởi tạo trực tiếp bằng cách gọi hàm tạo.

## Khởi tạo một View

Một `View` điển hình có một số hàm tạo, nhìn chung trông như thế này: `SomeView(context: Context[, attrs: AttributeSet?[, @AttrRes defStyleAttr: Int[, @StyleRes defStyleRes: Int]]])`. Chúng ta sẽ cần biểu mẫu đầu tiên, `SomeView(Context)`. Cần có ba tham số khác để chuyển các thuộc tính XML và áp dụng các kiểu.

Nói một cách đơn giản, bên trong Activity, biểu thức `TextView(this)` sẽ tạo ra một `TextView` hoàn toàn mới. Để hiển thị nó, chúng ta cần đính kèm nó vào hệ thống phân cấp `View` của Activity. Để thực hiện việc này, chúng ta có thể sử dụng một phiên bản khác của `setContentView` chấp nhận `View`.

Với kiến ​​thức này, chúng ta có thể tạo, định cấu hình và đính kèm `View`:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    setContentView(TextView(this).apply {
        text = "Hello from Kotlin code!"
        textSize = 36f
    })
}
```

## Kích thước


Bất kỳ `View` tốt nào cũng triển khai các trình cài đặt Java hoặc các thuộc tính Kotlin cùng với các thuộc tính XML để có thể được định cấu hình cả từ mã XML và Java/Kotlin. Nhưng điều này không phải lúc nào cũng đơn giản.

Điều đầu tiên cần lưu ý là đơn vị kích thước: chúng ta không thể viết `10dp` hoặc `10sp` trong Kotlin. Hầu hết các kích thước đều được tính bằng pixel ngoại trừ `TextView.setTextSize()` chấp nhận `sp`. Cách chung để sử dụng bất kỳ đơn vị được hỗ trợ nào (dp, sp, pt, in, mm) là hàm TypedValue.applyDimension. Một tùy chọn đơn giản hơn để chuyển đổi dp thành px là nhân với mật độ màn hình: `(value * context.resources.displayMetrics.density).toInt()`. Quá trình này khá dài, vì vậy trong các dự án sử dụng bố cục có lập trình, việc gặp nhiều tiện ích mở rộng là điều khá phổ biến.


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

## Màu sắc và hình vẽ

Một điểm khác cần chú ý là áp dụng màu sắc và Drawables. Trong XML, chúng ta thường có thể chuyển bất kỳ giá trị nào trong số chúng vào cùng một thuộc tính.

```xml
<View
    ...
    android:background="@drawable/beautiful_shape"
    android:background="@color/nice_color"
    android:background="#3700B3" />
```
Mã tương đương có vẻ dài dòng hơn một chút nhưng có sẵn một số phím tắt.

```kotlin
background = ContextCompat.getDrawable(context, R.drawable.beautiful_shape)

// using a shortcut, works both for color resources and drawable resources
setBackgroundResource(R.color.nice_color)

// third case, inline color, can also be done differently
background = ColorDrawable(0xFF3700B3) // 0x is hexadecimal notation in Kotlin
setBackgroundColor(0xFF3700B3) // FF is alpha channel which is set to “fully opaque”
```

> [!CAUTION]
> `setBackgroundColor()` chấp nhận số nguyên màu. Thay vào đó, `R.color.*` cung cấp tài nguyên ID. Đó là lý do tại sao chúng tôi gọi `set*Resource(R.color.*)` chứ không phải `set*Color(0x*)`. `set*Color(R.color.*)` là lỗi và sẽ cho màu sắc không mong muốn.

## Số nhận dạng

Chúng tôi chủ yếu khai báo ID `View` trong XML để sử dụng `findViewById()` sau này. Nhưng còn một lý do nữa: Các chế độ xem có ID sẽ lưu trạng thái của chúng khi Activity hoặc Fragment được tạo lại. Vì vậy, nếu chúng ta tạo `EditText` theo chương trình, cách dễ nhất để duy trì đầu vào của người dùng là gán ID cho nó. Trong XML, chúng tôi có thể khai báo mã định danh bằng `@+id/` nhưng điều này sẽ không hoạt động trong Kotlin. Ý nghĩ đầu tiên có thể là khai báo các hằng số của riêng chúng ta, như `const val AWESOME_EDIT_TEXT = 1`, nhưng điều này sẽ không bao giờ đảm bảo tính duy nhất. Tốt hơn là sử dụng máy móc tài nguyên ID tích hợp sẵn.

Để khai báo tài nguyên ID, hãy tạo tệp tài nguyên 'giá trị' với tên được đề xuất `values/ids.xml`, như sau:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <item name="awesome_edit_text" type="id" />
    <!-- more items… -->
</resources>
```

Thế thôi! Bây giờ bạn có thể truy cập `R.id.awesome_edit_text` trong Kotlin, để chúng tôi chỉ định nó.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    setContentView(EditText(this).apply {
        id = R.id.awesome_edit_text
        hint = "I will save my state!"
    })
}
```
## Tham số bố cục

Mỗi `ViewGroup` định vị con của nó bằng cách nào đó. Trong XML, chúng tôi có các thuộc tính `layout_-prefixed` cung cấp thông tin bổ sung về vị trí `View` trong cấp độ mẹ của nó.

```xml
<LinearLayout
    ... />

    <View
        android:layout_width="…"
        android:layout_height="…"
        android:layout_weight="…" />

</LinearLayout>
```

Lưu ý rằng `layout_weight` chỉ hoạt động bên trong `LinearLayout`, `layout_centerInParent` trong `RelativeLayout` và `FrameLayout` hỗ trợ `layout_gravity`. Nó hoạt động như thế nào?

Bất kỳ `View` nào cũng có thuộc tính `layoutParams: ViewGroup.LayoutParams` và việc triển khai `ViewGroup` đều có các lớp con riêng như `LinearLayout.LayoutParams`, `RelativeLayout.LayoutParams` và `AnyOtherLayout.LayoutParams`. Khi View được thêm vào `ViewGroup`, `ViewGroup` sẽ đảm bảo rằng `LayoutParams` của trẻ là hợp lệ và có thể được xử lý.

Có hai cách chính để chỉ định `LayoutParams`.

Đầu tiên là gán thuộc tính `layoutParams`. Đây là cách duy nhất khi tạo chế độ xem gốc của `Fragment` hoặc mục `RecyclerView.ViewHolder` (khi đó bạn sẽ cần `RecyclerView.LayoutParams`).

```kotlin
setContentView(EditText(this).apply {
    id = R.id.awesome_edit_text
    layoutParams = FrameLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT)
    hint = "I will save my state!"
})
```

Tùy chọn khác là chỉ định `LayoutParams` khi thêm chế độ xem vào chế độ xem gốc của nó.

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

Về cơ bản, nó chỉ gán `LayoutParams` cho `View`, vì vậy tùy chọn này chỉ là một phím tắt.

Khi thay đổi `LayoutParams` trên `View` đã hiển thị, điều quan trọng là phải gán lại `layoutParams`. Nếu không, `View` có thể không nhận thấy bất kỳ thay đổi nào.

```kotlin
(view.layoutParams as LinearLayout.LayoutParams).run {
    width = dp(500)
} // will not update or will do it unpredictably later

view.layoutParams =
    (view.layoutParams as LinearLayout.LayoutParams).apply {
        width = dp(500)
    } // will do the job right ahead
```

## Áp dụng kiểu và chủ đề

Trở lại `constructor(context: Context, attrs: AttributeSet?, @AttrRes defStyleAttr: Int, @StyleRes defStyleRes: Int)` dài nhất. Hai tham số cuối cùng được dùng để tạo kiểu. `defStyleAttr` trỏ đến thuộc tính chủ đề trong đó View sẽ tìm thấy kiểu của nó. `defStyleRes` là tham chiếu trực tiếp đến một phong cách. Điều này nghe có vẻ phức tạp nhưng hãy xem xét trường hợp đơn giản nhất:

```kotlin
Button(context, null, 0, 0).apply {
    // this trick cannot be done in XML!
}
```

`Button` chỉ là một chiếc `TextView` đầy phong cách, nhưng ở đây chúng tôi sẽ loại bỏ tất cả kiểu dáng: không `background`, không `minWidth`, không `padding`, vì vậy giờ đây bạn có thể định cấu hình nó từ đầu mà không can thiệp vào hệ thống thiết kế tích hợp. Từ điểm tiếp cận, đây vẫn là `Button`, không phải `TextView` đơn giản, điều này rất quan trọng đối với người dùng mù.

Xóa các kiểu rất thú vị nhưng bây giờ hãy nói về việc thiết lập chúng. Đây là đoạn trích từ `values/themes_material.xml`inside Android:


```xml
<style name="Theme.Material">
    <!-- Button styles -->
    <item name="buttonStyle">@style/Widget.Material.Button</item>
    <item name="buttonStyleSmall">@style/Widget.Material.Button.Small</item>
    <item name="buttonStyleInset">@style/Widget.Material.Button.Inset</item>
```

Trong thuật ngữ Java/Kotlin, dòng ở giữa có thể được đọc là “Thuộc tính chủ đề Material `android.R.attr.buttonStyleSmall` có giá trị `android.R.style.Widget_Material_Button_Small`”.

> [!CAUTION]
> Lưu ý rằng các dấu chấm từ tài nguyên XML được chuyển thành dấu gạch dưới trong R.

Có hai lựa chọn khác nhau về cách áp dụng nó.

```kotlin
// via theme, like style="?android:attr/buttonStyleSmall"
Button(context, null, android.R.attr.buttonStyleSmall)

// directly, like style="@android:style/Widget.Material.Button.Small"
Button(context, null, 0, android.R.style.Widget_Material_Button_Small)
```

Tùy chọn đầu tiên hoạt động khi bạn có các chủ đề khác nhau gán cùng thuộc tính cho các chủ đề khác nhau và bạn cần chọn kiểu theo chủ đề hiện tại. Cái thứ hai là để chỉ định kiểu trực tiếp.


> [!CAUTION]
> Không thể áp dụng kiểu hoặc chủ đề cho View đã được tạo. Không có setStyle() hoặc setTheme(), mọi thứ diễn ra trong một hàm tạo.

Một kiểu áp dụng cho một View. Mặt khác, một chủ đề sẽ ảnh hưởng đến toàn bộ cây con. Chúng ta có thể làm gì để bắt chước hành vi thuộc tính `android:theme`? Ngoài `View`, các chủ đề có thể được áp dụng cho `Application` và `Activity`, đồng thời cả hai đều mở rộng lớp Ngữ cảnh. Vì vậy, các chủ đề được áp dụng bằng `Context`, hay nói chính xác là `ContextThemeWrapper`. Chúng tôi chỉ chuyển bối cảnh theo chủ đề được bao bọc vào hàm tạo `View` và sau đó nó nhận các thuộc tính chủ đề.


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

Giờ đây, cả `LinearLayout` và `EditText` đều nhận được cùng một chủ đề có mức độ ưu tiên cao hơn các chủ đề của `Activity` và `Application`.


## thẩm quyền giải quyết

- [Khởi tạo lượt xem theo chương trình](https://hyperskill.org/learn/step/29230)






