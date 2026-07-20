## Loại có thể rỗng và không thể rỗng

### Tính rỗng


chúng tôi vừa thêm ký hiệu `?` ngay sau loại biến của chúng tôi. Chúng tôi đã đánh dấu biến tên của mình là nullable.

```kotlin
var age: Int? = null
```
không có ký hiệu `?` trong loại, bạn không thể gán null cho một biến.
### Truy cập các biến null

chúng ta có thể truy cập độ dài theo cách này:

```kotlin
print(name?.length)
```

`?` này. cặp ký hiệu được gọi là **lệnh gọi an toàn** trong Kotlin. 

Vì vậy, Kotlin giới thiệu **loại nullable** khác với **loại không nullable**

- Trong Kotlin, **loại nullable** là một biến có thể chứa giá trị null

- Trong Kotlin, **không thể rỗng** là loại không thể giữ giá trị null.

### Tránh NPE. Null safety

Null safety là một tính năng quan trọng trong thiết kế của Kotlin.
Hệ thống loại của Kotlin nhằm mục đích loại bỏ các tham chiếu null, thường dẫn đến lỗi và sự cố trong quá trình phát triển phần mềm.

### Lưu cuộc gọi
Nếu bạn cần có quyền truy cập vào các thuộc tính hoặc phương thức gọi của một đối tượng có thể rỗng, trước tiên bạn phải kiểm tra xem nó có rỗng hay không.

```kotlin
val name: String? = "Kotlin"
val length = if (name != null) name.length else null 
```

Nhưng đó là một biểu hiện khá dài! Bạn có thể nhận được kết quả tương tự nếu bạn sử dụng toán tử cuộc gọi an toàn `?`. cho phép bạn truy cập các thuộc tính hoặc phương thức gọi trên các biến không có giá trị mà không gặp rủi ro về `NullPointerException`

```kotlin
val name: String? = "Kotlin"
val length = name?.length // length is null if name is null
```

### Nhà điều hành Elvis

chúng ta có thể đơn giản hóa mã bằng **toán tử Elvis**:

```kotlin
var name: String? = "Kotlin"
val length: Int? = name?.length
print(length ?: 0)
```

Bạn có thể hỏi, nhưng tại sao nó lại được gọi là Elvis? Nhìn kìa: anh ấy đây rồi!

![văn bản thay thế](/resources/elvis_operator.png)

### Toán tử xác nhận không null

Khẳng định không null operator`!!`. **Mã sẽ không bị lỗi chỉ khi bạn chắc chắn 100% rằng biến của bạn sẽ không bị** `null`


Toán tử này được sử dụng để dừng chương trình khi gặp `null`.

Tại sao việc sử dụng quá mức `!!` lại có vấn đề:

1. **Đánh bại Null Safety**: Hệ thống loại của Kotlin được thiết kế để xử lý các giá trị rỗng một cách duyên dáng. Lạm dụng!! bỏ qua các biện pháp an toàn này.

2. **Mùi mã**: Việc sử dụng thường xuyên thường cho thấy việc coi thường việc kiểm tra null thích hợp và có thể dẫn đến mã kém ổn định hơn và khó bảo trì hơn.

3. **Sự cố không mong muốn**: Nó có thể khiến ứng dụng của bạn gặp sự cố bất ngờ nếu không thực hiện kiểm tra null thích hợp trước khi sử dụng `!!`.


### Các phương pháp hay nhất cho Null Safety trong Kotlin

1. **Sử dụng các loại có thể rỗng một cách khôn ngoan**: Chỉ sử dụng các loại có thể rỗng (`Type?`) khi một biến thực sự có thể là `null`. Nếu một biến không phải là `null`, hãy sử dụng loại không thể rỗng.

2. **Cuộc gọi an toàn (?.)**: Sử dụng toán tử cuộc gọi an toàn khi truy cập các thuộc tính hoặc phương thức trên một đối tượng có thể rỗng. Điều này sẽ trả về `null` nếu đối tượng là `null` thay vì ném `NullPointerException`.

3. **Toán tử Elvis (?:)**: Toán tử Elvis cho phép bạn đưa ra một giá trị thay thế nếu một biểu thức đánh giá là rỗng.

4. **Xác nhận không rỗng (!!)**: Chỉ sử dụng toán tử này khi bạn chắc chắn rằng giá trị không phải là `null`. Nó sẽ ném ra `NullPointerException` nếu giá trị là `null`.