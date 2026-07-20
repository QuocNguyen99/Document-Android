#View Binding

## Tại sao nên sử dụng View Binding?

Chúng tôi thường xuyên cần khởi tạo các phần tử UI từ XML trong các dự án của mình để làm việc với chúng trong mã. `findViewById()` được sử dụng cho mục đích này nhưng có thể trở nên rất khó chịu khi chúng ta phải sử dụng nó thường xuyên. 
Nếu chúng ta cần sử dụng mười phần tử trong mã của mình, chúng ta phải viết cấu trúc này mười lần. Không tốt.

- Trước đây, người ta thường sử dụng thư viện dựa trên các chú thích có tên `ButterKnife`. Tuy nhiên, điều này vẫn dẫn đến nhiều mã không cần thiết và công cụ này hiện không được dùng nữa.

- Với sự xuất hiện của Tiện ích mở rộng Android Kotlin (còn được gọi là Kotlin Synthetics), chúng tôi đã có được cách thuận tiện hơn để tương tác trực tiếp với các đối tượng xem.

- Tuy nhiên, cách tiếp cận này cũng có những hạn chế đáng kể: không thể truy cập được trong Java, ngoài việc sử dụng cách đặt tên chung và các vấn đề với các chế độ xem có cùng id từ các bố cục khác nhau.

Cuối cùng Google đã tạo ra một tính năng đặc biệt có tên view binding để giải quyết vấn đề này. Nó có nhiều ưu điểm:

- Tốc độ: nó không ảnh hưởng đến tốc độ xây dựng và việc viết mã sẽ nhanh hơn nhiều!

- Null safety: view binding tạo tham chiếu trực tiếp đến các chế độ xem, nghĩa là không có rủi ro về `NullPointerException` do chế độ xem không hợp lệ ID.

- An toàn về loại: tất cả các trường view binding được tạo theo cùng loại với các trường được tham chiếu trong XML, do đó không cần phải nhập kiểu.

## Đang thiết lập

Khi view binding được bật, một lớp đặc biệt sẽ được tạo cho mỗi tệp đánh dấu XML,
lưu trữ các trường chịu trách nhiệm cho các phần tử UI tương ứng. 

Để thực hiện việc này, chúng ta phải truy cập bản dựng cấp mô-đun, thường là `app/build.gradle`:

```kotlin
android {
    ...
    buildFeatures {
        viewBinding = true
    }
}
```

## Sử dụng

Để bắt đầu, chúng tôi khai báo đối tượng `binding` trong hoạt động của mình. Tên của lớp Binding được tạo tự động theo tên XML: `activity_main.xml` -> `ActivityMainBinding`:

```kotlin
private lateinit var binding: ActivityMainBinding
```

Tiếp theo, trong onCreate, khởi tạo nó bằng kết quả phương thức `inflate`, chuyển vào `layoutInflater`. Ở đây, tất cả các lệnh gọi `findViewById` đều được đặt ở `inside` theo phương thức tăng cường được tạo.

```kotlin
binding = ActivityMainBinding.inflate(layoutInflater)
```

Khi sử dụng `viewBinding`, chúng tôi gọi một tình trạng quá tải `setContentView` khác, chuyển chế độ xem gốc của liên kết:

```kotlin
setContentView(binding.root)
```

Ngoài ra, không có gì ngăn cản chúng tôi sử dụng view binding trong Fragments. Cách tiếp cận tương tự như cách chúng tôi đã thực hiện cho hoạt động nhưng Fragments có thể tạo và hủy Chế độ xem của họ nhiều lần, yêu cầu chúng tôi hủy bỏ ràng buộc để tránh memory leak:

```kotlin
class BlankFragment : Fragment() {
    private var _binding: FragmentBlankBinding? = null

    override fun onCreateView(
        inflater: LayoutInflater,    container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentBlankBinding
            .inflate(inflater, container, false)
        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

Vì việc xử lý các thuộc tính null là bất tiện khi yêu cầu !! khi truy cập giá trị, thật thuận tiện khi có một thuộc tính thực hiện điều này cho chúng ta:

```kotlin
private val binding get() = _binding!!
```
