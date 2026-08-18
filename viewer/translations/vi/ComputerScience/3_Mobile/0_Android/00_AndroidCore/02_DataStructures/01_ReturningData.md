# Giao tiếp Activity: trả về dữ liệu

Trong quá trình phát triển Android, việc truyền dữ liệu giữa các hoạt động có thể không chỉ là giao dịch một chiều. Đôi khi, một ứng dụng có thể bắt đầu một hoạt động mới—trong cùng một ứng dụng hoặc một ứng dụng khác—và dự đoán kết quả sẽ trả về.

Cách tiếp cận bắt đầu các hoạt động và mong đợi kết quả này cho phép tương tác giữa các phần khác nhau của ứng dụng Android hoặc thậm chí giữa các ứng dụng khác nhau trên thiết bị.

## Sử dụng API kết quả Activity

Khi bạn bắt đầu một hoạt động cho một kết quả, bạn request hệ thống Android khởi chạy một hoạt động một cách hiệu quả và sau đó trả về kết quả do hoạt động đó tạo ra cho ứng dụng của bạn.

**Các API cung cấp phương thức để đăng ký callback**, phương thức này được gọi khi chúng tôi nhận được kết quả từ một hoạt động đã khởi chạy. callback này thường được gọi là kết quả callback. Khi ở trong ComponentActivity hoặc Fragment, bạn có thể đăng ký kết quả callback bằng phương thức `registerForActivityResult()`. Phương thức này có hai đối số:

- `ActivityResultContract`: Đây là đối tượng xác định loại đầu vào mà hoạt động đã khởi chạy yêu cầu để tạo ra kết quả cùng với loại đầu ra của kết quả. API cung cấp các hợp đồng được xác định trước cho các hành động có mục đích chung như chụp ảnh, chọn nội dung hoặc thậm chí yêu cầu quyền. Bạn cũng có thể tạo hợp đồng tùy chỉnh cho các nhu cầu cụ thể hơn mà chúng ta sẽ khám phá trong phần tiếp theo.

- An `ActivityResultCallback`: Đây là interface chức năng hay còn gọi là interface Phương thức trừu tượng đơn (SAM), với phương thức `onActivityResult()`. Nó được gọi khi ứng dụng nhận được kết quả từ hoạt động đã khởi chạy và nó nhận một đối số thuộc loại đầu ra được xác định trong hợp đồng.

Phương thức `registerForActivityResult()` trả về `ActivityResultLauncher` mà sau này bạn sẽ sử dụng để khởi chạy một hoạt động nhằm đạt được kết quả.

Chúng ta hãy xem một ví dụ đơn giản để hiểu cách thức hoạt động của nó trong thực tế. Giả sử bạn muốn mở ứng dụng danh bạ trên điện thoại để cho phép người dùng chọn một liên hệ và kết quả là chọn liên hệ đó. Trước tiên bạn sẽ phải đăng ký kết quả callback:

```kotlin
import androidx.activity.result.contract.ActivityResultContracts.PickContact

class MainActivity : AppCompatActivity() {

    // Register the result callback
    private val pickContact = registerForActivityResult(PickContact()) { contactUri: Uri? ->
        // Technically, we are not getting the actual contact
        // but rather a Uri? object that we can use to query the contact
        // using a contentResolver
        if (contactUri != null) {
            val contactData = contentResolver.query(contactUri, null, null, null, null)

            if (contactData != null && contactData.moveToFirst()) {
                val name = contactData.getStringOrNull(
                    contactData.
                        getColumnIndex(ContactsContract.CommonDataKinds.Phone.DISPLAY_NAME)
                )
                Log.d("MAIN_ACTIVITY", "name: $name")
            }

            contactData?.close()
        }
    }

    ...
}
```

Ở đây, chúng tôi đã sử dụng hợp đồng được xác định trước PickContact để mở rộng lớp `ActivityResultContract`.
Hợp đồng xác định mục đích ngầm được sử dụng để khởi chạy một hoạt động có khả năng hiển thị các liên hệ để chọn.
Hợp đồng cũng xác định kết quả đầu ra là Uri?.
Đối số thứ hai được truyền dưới dạng lambda (cụ thể là lambda ở cuối) bằng cách sử dụng chuyển đổi SAM của Kotlin để chuyển đổi lambda expression thành mã khởi tạo việc triển khai interface ActivityResultCallback.

> [!NOTE]
> Lưu ý rằng các API được viết bằng Java do đó các giá trị trả về có thể là null mặc dù Kotlin cho phép chúng tôi chỉ định loại contactUri là Uri (Không rỗng) có thể dẫn đến NullPointerException nổi tiếng khi không được xử lý tốt. Chúng tôi cũng có quyền truy cập vào phương thức registerForActivityResult() vì AppCompatActivity kế thừa từ ComponentActivity.


Bây giờ chúng ta có thể sử dụng `pickContact` để bắt đầu process tạo ra kết quả bằng cách khởi chạy hoạt động tiếp theo, trong trường hợp của chúng ta, có thể là ứng dụng danh bạ. Khi người dùng hoàn tất và chúng tôi nhận được kết quả, phương thức `onActivityResult()` từ kết quả đã đăng ký callback sẽ được thực thi với kết quả làm đối số:

```kotlin
class MainActivity : AppCompatActivity() {
    ...

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ...

        button.setOnClickListener {
            // `launch()` starts the process of producing the result
            pickContact.launch(null)
        }
    }
}
```

Phương thức `launch()` yêu cầu chúng tôi chuyển đối số đầu vào được nêu trong hợp đồng mà hoạt động đã khởi chạy có thể yêu cầu để đưa ra kết quả. Trong trường hợp của chúng tôi, hợp đồng `PickContact` đã xác định loại đầu vào là `@Nullable` Void do đó chúng tôi đã cung cấp null làm đối số.


> [!WARNING]
> Tùy thuộc vào cách triển khai hợp đồng, kết quả mà chúng tôi nhận được từ hoạt động đã khởi chạy có thể không có giá trị, trong trường hợp của chúng tôi, giả sử người dùng thoát khỏi ứng dụng danh bạ đã khởi chạy trước khi đưa ra lựa chọn, contactUri sẽ không có giá trị. Hãy đảm bảo rằng ứng dụng của bạn có thể xử lý tình huống như vậy. Bạn cũng nên gọi registerForActivityResult() trước khi hoạt động hoặc phân đoạn được tạo và ActivityResultLauncher chỉ có thể được khởi chạy khi lifecycle của hoạt động hoặc phân đoạn đạt đến trạng thái CREATED.

## Hợp đồng tùy chỉnh


Đôi khi không có hợp đồng nào được xác định trước phù hợp với nhu cầu ứng dụng của bạn. Trong những trường hợp như vậy, bạn có thể tạo một hợp đồng tùy chỉnh.
Giả sử chúng ta có một cặp hoạt động trong ứng dụng của mình - `MainActivity` và `SecondActivity` đáng tin cậy. Mục tiêu của chúng tôi ở đây là để `MainActivity` khởi chạy `SecondActivity`, yêu cầu người dùng nhập nội dung nào đó vào đó rồi gửi kết quả lại cho người gọi.

Trong thiết lập này, công việc chính của `SecondActivity` là lấy văn bản nhập từ người dùng và chúng tôi muốn đảm bảo rằng văn bản này kết thúc bằng `MainActivity`. Bằng cách này, chúng tôi sẽ có thể biết cách chúng tôi có thể gửi lại kết quả nếu chúng tôi kết thúc hoạt động được khởi chạy.

Bắt đầu bằng cách tạo một lớp, trong trường hợp này, bạn có thể đặt tên nó là `GetText` và kế thừa nó từ `ActivityResultContract`. `ActivityResultContract` yêu cầu chúng ta xác định các đối số loại đầu vào và đầu ra, với đầu vào đến trước:

```kotlin
class GetText : ActivityResultContract<Unit, String?>() {}
```

> [!NOTE]
> Lưu ý rằng nếu bạn không yêu cầu bất kỳ đầu vào nào, trong Kotlin, bạn có thể sử dụng Unit hoặc Void?

Triển khai cả hai phương thức `createIntent()` và parseResult() từ ActivityResultContract được kế thừa:



```kotlin
class GetText : ActivityResultContract<Unit, String?>() {
    // Here we construct the intent used to launch the subsequent activity
    override fun createIntent(context: Context, input: Unit?): Intent {
        return Intent(context, SecondActivity::class.java)
    }

    // We get the result from the provided intent
    override fun parseResult(resultCode: Int, intent: Intent?): String? {
        // resultCode RESULT_OK is just the integer -1
        if (resultCode != Activity.RESULT_OK) {
            return null
        }
        return intent?.getStringExtra(Intent.EXTRA_TEXT)
    }
}
```

Mặt khác, trong `SecondActivity`, chúng ta chỉ cần gọi `setResult()` để nhận mã kết quả và dữ liệu được gửi dưới dạng Intent, sau đó đóng hoạt động:

```kotlin
class SecondActivity : AppCompatActivity() {
    ...

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ...

        button.setOnClickListener {
            // `editText` holds a reference to an EditText view
            setResult(RESULT_OK, Intent().putExtra(Intent.EXTRA_TEXT, editText.text.toString()))
            // closes the activity
            finish()
        }
    }
}
```

> [!NOTE]
> Lưu ý rằng nếu một hoạt động khác khởi động SecondActivity bằng cách gọi startActivity() thì kết quả sẽ bị bỏ qua khi chúng tôi quay lại hoạt động gọi.

Theo mặc định, kết quả được đặt thành `RESULT_CANCELED` trong trường hợp người dùng thoát khỏi ứng dụng trước khi hoàn thành hành động và trước khi kết quả được đặt để hoạt động gọi điện nhận được kết quả bị hủy.

Hơn nữa, có một phiên bản bị ghi đè của `setResult()` chỉ chấp nhận mã kết quả. Sau đó, bạn có thể sử dụng mã kết quả trả về trong hoạt động của người gọi để xác định hành động tiếp theo.

Bạn có thể linh hoạt sử dụng mã kết quả tùy chỉnh của riêng mình, với `RESULT_FIRST_USER` đóng vai trò là điểm bắt đầu được đề xuất để ngăn xung đột với mã kết quả do hệ thống xác định.

##Cách tiếp cận truyền thống

Trước khi giới thiệu **API kết quả Activity**, các nhà phát triển Android đã từng sử dụng API `startActivityForResult()` và `onActivityResult()`.

Mặc dù các API cũ hơn vẫn có sẵn trên tất cả các cấp độ API trong lớp Activity, Google khuyên bạn nên sử dụng các API mới hơn được giới thiệu trong các lớp Activity và Fragment của AndroidX. **Lý do đằng sau điều này là tính đơn giản và khả năng kiểm tra được cải thiện của chúng.**

Đây là một ví dụ về cách tiếp cận lỗi thời mà bạn có thể gặp phải trong các cơ sở mã cũ hơn:

```kotlin
// This code is generally found in an activity or fragment
private val REQUEST_CODE = 123

fun startSomeActivityForResult() {
    val intent = Intent(this, AnotherActivity::class.java)
    startActivityForResult(intent, REQUEST_CODE)
}

override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    super.onActivityResult(requestCode, resultCode, data)
    if (requestCode == REQUEST_CODE && resultCode == Activity.RESULT_OK) {
        // Handle the result here
        val result = data?.getStringExtra("result_key")
        // Do something with the result
    }
}
```

## Các phương pháp và mẹo hay nhất

- Khi bạn bắt đầu một hoạt động để đạt được kết quả, **hãy nhớ rằng ứng dụng của bạn có thể bị hệ thống tắt**, đặc biệt là trong các hoạt động sử dụng nhiều bộ nhớ. Để bảo vệ khỏi điều này, callback kết quả phải được đăng ký vô điều kiện theo cùng một thứ tự mỗi khi hoạt động của bạn được tạo. **Điều này nhằm đảm bảo các callback này sẵn sàng nếu hoạt động bị hủy vì API kết quả Activity tách riêng kết quả callback khỏi nơi nó được đăng ký**. Đừng quên lưu lại bất kỳ trạng thái quan trọng nào khi bắt đầu một hoạt động để dự đoán rằng hoạt động của bạn có thể bị hủy.

- Khi triển khai xử lý kết quả, **hãy nhớ tính đến những khác biệt tiềm ẩn trong cách các ứng dụng khác nhau trả về kết quả**. Ví dụ: trong ví dụ về danh bạ trước đây của chúng tôi, mặc dù chỉ là giả định hoặc khó có khả năng xảy ra, nhưng một số ứng dụng danh bạ ít người biết đến mà người dùng có thể chọn làm mặc định trên một số điện thoại Android nhất định có thể trả về liên hệ đã chọn làm thông tin bổ sung thay vì thông tin dữ liệu mong đợi về mục đích điển hình của ứng dụng "Danh bạ". Điều này sẽ dẫn đến một nội dung rỗng-Uri. Vì vậy, điều quan trọng là phải sẵn sàng cho những tình huống như vậy; Ví dụ: bạn có thể hiển thị một thông báo phù hợp cho người dùng để thông báo cho họ rằng liên hệ không được nhận như mong đợi.

- Ngoài ra, nếu bạn có ý định thiết kế các thành phần hoặc hoạt động mà các ứng dụng khác sẽ sử dụng để đạt được kết quả thì việc cung cấp tài liệu chi tiết là rất quan trọng. Các interface và kỳ vọng rõ ràng, được giải thích rõ ràng sẽ giúp việc trao đổi dữ liệu giữa các ứng dụng diễn ra suôn sẻ và đáng tin cậy, giảm thiểu các vấn đề tiềm ẩn và nâng cao trải nghiệm người dùng.

- Trong trường hợp bạn muốn nhận kết quả ở một lớp riêng ngoài `ComponentActivity` hoặc `Fragment`, bạn có thể thực hiện bằng cách sử dụng trực tiếp `ActivityResultRegistry`. `ActivityResultRegistry` chịu trách nhiệm lưu trữ các callback kết quả trong hoạt động. Bạn có thể tìm hiểu thêm nếu bạn quan tâm đến cách thức hoạt động của nó.

## thẩm quyền giải quyết

- [Giao tiếp Activity: trả về dữ liệu](https://hyperskill.org/learn/step/38574)




















