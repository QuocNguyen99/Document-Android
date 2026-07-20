# Quản lý nhà nước Android View

Xử lý các đối tượng immutable không trạng thái rất dễ dàng và có thể dự đoán được, nhưng đời thực thì phức tạp. User interface có **trạng thái** và đôi khi chúng tôi có trách nhiệm quản lý trạng thái đó.

## Vấn đề

Chúng ta hãy xem một ứng dụng đơn giản trong đó bạn có thể tăng số trong trường văn bản:

```xml
<RelativeLayout …>

    <TextView
        android:id="@+id/textView"
        …
        android:text="0" />

    <EditText
        android:id="@+id/editText"
        …
        android:text="0" />

    <Button
        android:id="@+id/button"
        …
        android:text="+" />

</RelativeLayout>
```

```kotlin
class CounterActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_counter)

        val tv = findViewById<TextView>(R.id.textView)
        val et = findViewById<EditText>(R.id.editText)
        findViewById<Button>(R.id.button).setOnClickListener {
            tv.text = ((tv.text.toString().toIntOrNull() ?: 0) + 1).toString()
            et.setText(((et.text.toString().toIntOrNull() ?: 0) + 1).toString())
        }
    }
}
```

Chúng tôi có `TextView` và `EditText` được xử lý bằng mã giống hệt được gọi từ `Button`.
Nhưng khi xoay màn hình, hoạt động của chúng tôi được tạo lại, bố cục được tăng cường lại và chúng tôi đã mất `TextView.text` nhưng `EditText.text` vẫn tồn tại.


Có một số hai dành cho Android để tạo lại `Activity` của chúng tôi. Cái đầu tiên là **configuration change** (hướng thiết bị, ngôn ngữ, tỷ lệ phông chữ, v.v.).
Một số trong số chúng có thể được ứng dụng của bạn xử lý và việc giải trí có thể tránh được.

Nhưng lý do thứ hai là **process chết**:
nếu một số ứng dụng nền trước khác sử dụng nhiều bộ nhớ, ứng dụng ở chế độ nền của bạn sẽ bị tắt.



**Chúng ta không thể tránh được điều đó nên chúng ta phải cứu lấy bang của mình.**

## Trạng thái View

Nói chung, `View` với ID được chỉ định sẽ tự động duy trì trạng thái của nó.
Chìa khóa trong ví dụ trên là `EditText` là một tiện ích cho người dùng nhập và được thiết kế để lưu văn bản, trong khi `TextView` dành cho đầu ra và không muốn lưu văn bản của nó theo mặc định. 

Bạn có thể chỉ định `android:freezesText="true"` để thay đổi hành vi này nhưng đó không phải là giải pháp rõ ràng: logic của chúng tôi dựa vào dữ liệu bị kẹt bên trong chế độ xem, bao gồm cả dữ liệu chỉ dành cho đầu ra.

## Trạng thái phiên bản đã lưu

Có sẵn phương thức `onSaveInstanceState(Bundle)` để ghi đè cả trong `Fragment` và `Activity`. 
Nó cho chúng ta cơ hội lưu dữ liệu của mình trong cả hai trường hợp: cái chết của configuration change và process.
Nhưng hãy nhớ rằng nếu người dùng thoát ra bằng nút "quay lại", trạng thái sẽ không được lưu và việc mở mới màn hình này sẽ "sạch".

**Hạn chế là chúng tôi không thể lưu trữ các đối tượng tùy ý ở đó.**

Ví dụ:
```kotlin
class CounterActivity : Activity() {

    private var count = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_counter)

        val tv = findViewById<TextView>(R.id.textView)
        val et = findViewById<EditText>(R.id.editText)

        if (savedInstanceState != null) {
            // recreation, use saved state
            count = savedInstanceState.getInt("count")
        }

        tv.text = count.toString()
        et.setText(count.toString())

        findViewById<Button>(R.id.button).setOnClickListener {
            count++
            tv.text = count.toString()
            et.setText(count.toString())
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        // we're being destroyed, save the data for the following recreation
        outState.putInt("count", count)
    }
}
```

##ViewModel

Như đã lưu ý trước đó, không phải mọi thứ đều có thể được lưu giữ trong `Bundle`.
Ngoài ra, các giao dịch liên lạc giữa các quá trình có giới hạn kích thước là 1 MB (Lý do có thể đạt tới `TransactionTooLargeException`). Tất nhiên, thông tin đầu vào của người dùng phải được bảo quản cẩn thận vì người dùng sẽ vô cùng khó chịu khi lãng phí thời gian để điền vào một số dữ liệu sẽ bị mất.
Nhưng còn một số dữ liệu không quan trọng thì sao?
- Nội dung nào đó đã được tải xuống từ internet có thể được tải xuống lại một lần nữa hoặc đơn giản là lấy từ tệp bộ đệm cục bộ.
- Dữ liệu từ cơ sở dữ liệu cục bộ có thể dễ dàng được yêu cầu thêm một lần nữa.
- Internet radio hoặc luồng video phát theo thời gian thực và không cần lưu trữ.
- Bất kỳ kết nối thời gian thực nào khác như kết nối dành cho nhắn tin tức thời đều có thể được thiết lập lại sau.

Trong tất cả các trường hợp này, chúng tôi không muốn mất dữ liệu trong trường hợp configuration change nhưng loại bỏ dữ liệu đó trong trường hợp process chết vì người dùng hiện hoàn toàn tập trung vào thứ gì đó khác và chúng tôi không biết khi nào họ sẽ quay lại.

Đó là lúc chúng ta cần `ViewModel`. Tên của nó xuất phát từ **MVVM (Model-View-ViewModel)** 

Bằng cách này, giá trị vẫn tồn tại sau các thay đổi về cấu hình (chẳng hạn như xoay thiết bị) nhưng sẽ bị loại bỏ trong trường hợp process bị chết (bạn có thể mở ứng dụng Máy ảnh và trình duyệt web để tiêu hao tất cả RAM)

## Cung cấp dữ liệu từ ViewModel đến View

Chúng tôi cần một thùng chứa giá trị và cung cấp cho chúng tôi khả năng đăng ký các thay đổi.

Có lớp `LiveData` trong Thành phần kiến ​​trúc Android chính xác cho mục đích này. **Nhưng** `kotlinx.coroutines` có `StateFlow` **cung cấp tốt hơn** `null-safety` và rất tiện lợi để sử dụng với coroutine nên chúng ta sẽ tiếp tục sử dụng nó.

Ví dụ:

```kotlin
 class CounterViewModel : ViewModel() {
     private val _count = MutableStateFlow(0)
     val count: StateFlow<Int> get() = _count

     fun increment() {
         count++
         _count.value++
     }
 }
```
Chúng tôi sẽ quan sát điều đó, điều đó có nghĩa là View sẽ được thông báo về bất kỳ thay đổi nào trong `StateFlow`.

```kotlin
 class CounterActivity : ComponentActivity() {

     private val vm: CounterViewModel by viewModels()

     override fun onCreate(savedInstanceState: Bundle?) {
         super.onCreate(savedInstanceState)
         /** 

         suspend functions is tied to view's lifecycle,
         any operation running in this scope will be canceled when the view is destroyed.

         Thus, if the View gets recreated, 
         it will abandon the subscription and avoid possible memory leak
         caused by long-living ViewModel's StateFlow holding
         a reference to short-lived View subscriber. 
         
         **/
         lifecycleScope.launch { 
             /** 

             creates a narrower scope between Activity's
             onStart and onStop lifecycle methods.
            
             anything inside inner lambda will run in onStart
             and will be canceled when onStop happens.

             So, when the user is incapable of seeing the View,
             the latter never observes the data.

             **/
             repeatOnLifecycle(Lifecycle.State.STARTED) {
                 /** 
                 
                 collect function saves our lambda to be called both
                 at the beginning of the suscription (in onStart) and
                 when the data gets changed

                 **/
                 vm.count.collect { count ->
                     tv.text = count.toString()
                     et.setText(count.toString())
                 }
             }
         }

         findViewById<Button>(R.id.button).setOnClickListener {
             vm.increment()
         }
     }
 }
 ```























