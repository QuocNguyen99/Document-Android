# Xây dựng DSL

## DSL-Các tính năng Kotlin cụ thể

Kotlin cung cấp một số tính năng giúp thiết kế DSL trở nên dễ dàng và thanh lịch:

- **Lambda với receiver** - Cho phép các khối cấu hình trong phạm vi.
- **Hàm phạm vi** - Các hàm như `apply`, `run`, `with` và `also` giúp tạo các API kiểu trình tạo thông thạo. Tìm hiểu thêm.
- **@DslMarker** - Một chú thích đặc biệt giúp ngăn xung đột giữa các phạm vi DSL lồng nhau. Chúng ta sẽ khám phá điều này chi tiết hơn dưới đây.


## Xây dựng xác thực DSL theo từng bước

Mục tiêu của chúng tôi là viết mã Kotlin DSL rõ ràng như:

```kotlin
validation {
    field("email") {
        mustNotBeEmpty()
        mustContain("@")
    }
    field("age") {
        mustBeGreaterThan(18)
    }
}
```

Trong khối DSL này, chúng tôi định cấu hình hai trường (`email` và `age`) và gán quy tắc cho từng trường. Những quy tắc này sau này sẽ được sử dụng để xác thực dữ liệu đầu vào của người dùng.


Để triển khai DSL này, chúng ta phải xác định:

- `ValidationBuilder` để quản lý cấu trúc tổng thể và các trường lưu trữ

- `FieldBuilder` để quản lý các quy tắc cho một trường cụ thể

- Các chức năng như `mustNotBeEmpty()` và `mustContain()` để xác định các quy tắc thực tế

### Quy tắc

Quy tắc là composition của một thông báo lỗi và một hàm kiểm tra xem một giá trị nhất định có hợp lệ hay không.

Đây là cách chúng tôi xác định cấu trúc cho các quy tắc này:

```kotlin
typealias ErrorMessage = String
typealias ValidationResult = (String) -> Boolean

data class Rule(val errorMessage: ErrorMessage, val check: ValidationResult)
```

`ValidationResult()` là hàm nhận `String` và trả về `true` nếu giá trị vượt qua kiểm tra. Thiết kế này cho phép chúng ta lưu trữ logic và thực thi nó sau này.

### FieldBuilder

Trình tạo bắt buộc đầu tiên chịu trách nhiệm xác định và thu thập các quy tắc xác thực cho một trường duy nhất.

```kotlin
annotation class ValidationDsl // our custom annotation   

@ValidationDsl 
class FieldBuilder(val name: String) {
    private val _rules = mutableListOf<Rule>()
    val rules: List<Rule> get() = _rules.toList()

    fun mustNotBeEmpty() {
        _rules.add(Rule("$name cannot be empty") {
            it.isNotEmpty()  // Check if field is not empty
        })
    }

    fun mustBeGreaterThan(number: Int) {
        _rules.add(Rule("$name must be greater than $number") {
            val parseResult = it.toIntOrNull() // Try to parse to Int
            parseResult != null && parseResult > number  // Compare if valid
        })
    }

    fun mustContain(char: Char) {
        _rules.add(Rule("$name must contain $char") {
            it.contains(char)
        })
    }
}
```
### ValidationBuilder

Trình xây dựng cần thiết khác này sẽ chịu trách nhiệm quản lý tất cả các trường và xác thực chúng theo các quy tắc đã đăng ký.

```kotlin
@ValidationsDsl
class ValidationBuilder {     
    private val _fields = mutableListOf<FieldBuilder>()


    fun field(name: String, block: FieldBuilder.() -> Unit) {
        val fieldBuilder = FieldBuilder(name)
        block(fieldBuilder)
        _fields.add(fieldBuilder)
    }

    fun validate(data: Map<String, String>): List<String> {
        val errors = mutableListOf<String>()

        // Iterate over all fields and apply rules
        for (field in _fields) {
            val value = data[field.name] ?: ""

            for (rule in field.rules) {
                if (!rule.check(value)) errors.add(rule.errorMessage.format(field.name))
            }
        }

        return errors
    }
}
```

### Điểm vào DSL

Chúng ta cần kết nối DSL của mình bằng cách nào đó. Hãy thêm một chức năng cho phép khối `validation()` cấp cao nhất.

```kotlin
fun validation(block: ValidationBuilder.() -> Unit): ValidationBuilder {
    val builder = ValidationBuilder()
    block(builder)
    return builder
}
```

Hàm này tạo và trả về `ValidationBuilder` được cấu hình đầy đủ.

```kotlin
fun main() {
    // Create the validation DSL structure
    val validation = validation {
        field("email") {
            mustNotBeEmpty() // Rule: email must not be empty
            mustContain("@")  // Rule: email must contain @
        }
        field("age") {
            mustBeGreaterThan(18) // Rule: age must be greater than 18
        }
    }
    // Example input data to validate
    val data = mapOf(
        "email" to "userexample.com",
        "age" to "17"
    )

    // Run the validation and collect the result
    val result = validation.validate(data)
    if (result.isEmpty()) {
        println("All validations passed!")
    } else {
        println("Validation failed:")
        result.forEach { println("- $it") } // Print each error message
    }
}
```

## Kiểm soát phạm vi với `@DslMarker` 

Khi thiết kế các DSL phức tạp và lồng nhau, điều quan trọng là ngăn chặn việc truy cập ngoài ý muốn vào phạm vi bên ngoài.

Kotlin cung cấp chú thích `@DslMarker` để giúp thực thi các quy tắc phạm vi.

```kotlin
// Assume basic DSL functions are defined like this:
@DslMarker
annotation class ValidationDsl
```

Sau đó, chúng tôi áp dụng chú thích này cho các lớp trình xây dựng của mình:

```kotlin
@ValidationDsl
class ValidationBuilder {  }

@ValidationDsl
class FieldBuilder(val name: String) {  }
```

Nếu không có `@DslMarker` chúng ta có thể vô tình tạo ra DSL như thế này:


```kotlin
// Assume basic DSL functions are defined like this:
fun validation(block: ValidationBuilder.() -> Unit) = ...
fun ValidationBuilder.field(name: String, block: FieldBuilder.() -> Unit) = ...

validation {
    field("name") {
        field("nested") {
            validation {
                // This is confusing and should not be allowed
            }
        }
    }
}
```

Kiểu lồng này không có ý nghĩa trong DSL của chúng tôi. Nếu không có `@DslMarker` thì compiler sẽ cho phép điều đó. Khi áp dụng chú thích này, Kotlin sẽ phát sinh lỗi như:

```kotlin
// Compiler error:
fun field(name: String): Unit can’t be called in this context by implicit receiver. Use the explicit one if necessary
```
Điều này đảm bảo rằng mỗi khối chỉ có thể truy cập vào phạm vi liên quan của nó.

## Nguyên tắc chính: Cách hoạt động của DSL

Chúng tôi vừa chế tạo một chiếc DSL, bây giờ hãy xem nó hoạt động như thế nào. 
DSL về cơ bản là một khối cấu hình thu thập và lưu trữ logic để thực thi sau này.

Khi chúng tôi gọi `validation`, chúng tôi xây dựng một đối tượng nội bộ bằng cách sử dụng **lambda với receiver**: `ValidationBuilder` trở thành receiver (`this`) của khối đó.

Điều này cho phép chúng ta viết mã kiểu DSL- trực tiếp như `field("email")`, thay vì gọi các phương thức trên một đối tượng một cách rõ ràng.

Mỗi lệnh gọi `field` tạo ra một ngữ cảnh mới, một trình xây dựng phụ, chịu trách nhiệm thu thập các quy tắc liên quan đến trường cụ thể đó.


Mỗi quy tắc, như `mustNotBeEmpty()`, chỉ đơn giản là một lệnh gọi hàm hoặc lambda được thêm vào danh sách kiểm tra xác thực. Các quy tắc này không được thực thi ngay lập tức: khi sau này chúng tôi gọi một cái gì đó như `validate(data)`, đó là lúc các quy tắc được đánh giá. DSL chỉ thu thập tất cả logic, lưu trữ nó theo cách có cấu trúc.

Sự tách biệt giữa cấu hình và thực thi này là điều làm cho DSL trở nên mạnh mẽ: 
chúng cho phép người dùng **bày tỏ ý định** một cách rõ ràng, trong khi logic thực tế vẫn ẩn bên trong các lớp trình tạo được thiết kế tốt.

## Lợi ích của việc sử dụng DSL so với Mã truyền thống

Các phương pháp xác thực truyền thống thường liên quan đến mã mệnh lệnh với nhiều câu lệnh `if`:

```kotlin
if (email.isEmpty()) {
    errors.add("email cannot be empty")
}
if (!email.contains("@")) {
    errors.add("email must contain '@'")
}
if (age.toIntOrNull()?.let { it <= 18 } != false) {
    errors.add("age must be greater than 18")
}
```


Điều này có thể trở nên dài dòng và khó duy trì hơn khi số lượng xác nhận tăng lên.

Sử dụng DSL:
- **Cải thiện khả năng đọc**: Quy tắc xác thực được khai báo ở định dạng có cấu trúc và con người có thể đọc được.
- **Nâng cao khả năng bảo trì**: Việc thêm hoặc sửa đổi các quy tắc rất đơn giản và được bản địa hóa.
- **Thúc đẩy khả năng sử dụng lại**: Logic xác thực chung có thể được gói gọn trong các hàm DSL.

## Mở rộng DSL

Sau khi DSL của chúng tôi được cấu trúc, việc mở rộng nó rất đơn giản.

Ví dụ: chúng ta có thể xác định các hàm quy tắc bổ sung như `mustBeLessThan()` hoặc `mustStartWith()` và thêm chúng vào `FieldBuilder`. 
Các hàm này tuân theo cùng một mẫu như các mẫu chúng tôi đã xác định và cho phép DSL hỗ trợ nhiều trường hợp hơn.

Một cải tiến thú vị khác là làm cho loại DSL trở nên an toàn bằng cách chuyển data class làm loại chung cho trình xác thực. 

Điều này sẽ cho phép DSL truy cập trực tiếp vào các trường, giúp việc xác thực an toàn hơn và mang tính biểu cảm hơn.



