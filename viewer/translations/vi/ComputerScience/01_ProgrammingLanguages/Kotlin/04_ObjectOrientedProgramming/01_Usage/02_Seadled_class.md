# Lớp học kín

Bạn có nhớ các enum, vùng chứa các hằng số collection không? Chúng ta sẽ nói về một loại vùng chứa khác - loại dành cho các lớp con cố định: sealed class hoặc giao diện kín.

## Cú pháp cơ bản

Để khai báo sealed class hoặc giao diện, chúng ta chỉ cần đặt công cụ sửa đổi `sealed` trước lớp hoặc giao diện:

```kotlin
sealed class CustomError 
sealed interface CustomErrors
```

Vì các lớp được niêm phong và các giao diện được niêm phong là tương tự nhau (sự khác biệt duy nhất là giữa lớp và giao diện), chúng tôi sẽ chỉ tiếp tục với các ví dụ sealed class.

- sealed class là trừu tượng nên không thể khởi tạo được. 

```kotlin
fun main() {
    // Sealed types cannot be instantiated
    val customError = CustomError()
}
```
- bạn có thể mở rộng nó.
```kotlin
open class Person {
    fun whoAmI(name: String): String {
        return "I am $name"
    }
}


sealed class Staff : Person() {
    class Teacher(val numberOfLessons: Int) : Staff()
    class Manager(val Responsibility: String) : Staff()
    object Worker : Staff()
}

```
- Giống như các lớp thông thường, bạn có thể khai báo hàm tạo, nhưng hàm tạo trong sealed class phải ở chế độ riêng tư hoặc được bảo vệ:

```kotlin
sealed class CustomError {
    constructor(type: String) {} // protected (default) 
    private constructor(type: String, code: Int) {} // private
    public constructor() {} //  Public gives error
}
```
- Bạn cũng có thể sử dụng hàm tạo chính, giống hệt như trong bất kỳ lớp bình thường nào:

```kotlin
//primary constructor 
sealed class CustomError(type: String) 
```

## Sealed class so với enum

Hằng số Enum chỉ có một loại duy nhất, trong khi các lớp kín cung cấp nhiều phiên bản với độ linh hoạt cao hơn. **Chúng ta có thể kết luận rằng enum được sử dụng để biểu thị một tập hợp giá trị cố định, trong khi sealed class là một lớp được sử dụng để biểu thị một tập hợp các lớp con cố định thuộc loại của lớp đã cho.**

```kotlin
enum class Staff(numberOfLessons: Int)  {
    TEACHER(2), MANAGER("Manager is managing")
}
```

Điều đó là không thể với enum nhưng có thể được thực hiện với sealed class:

```kotlin
sealed class Staff {
    class Teacher(val numberOfLessons: Int) : Staff()
    class Manager(val Responsibility: String) : Staff()
    object Worker : Staff()
}
```

## Các lớp kín và biểu thức khi

Các lớp kín thường được sử dụng với biểu thức when, vì mỗi lớp được coi là một trường hợp.

```kotlin
sealed class Result {
    object Success : Result()
    data class Error(val message: String) : Result()
    object Loading : Result()
}

fun handleResult(result: Result) {
    when (result) {
        is Result.Success -> println("Operation successful!")
        is Result.Error -> println("Error occurred: ${result.message}")
        Result.Loading -> println("Loading...") // Trường hợp Loading
    }
}

fun main() {
    val success = Result.Success
    val error = Result.Error("Network failure")
    val loading = Result.Loading

    // Xử lý từng trường hợp
    handleResult(success)
    handleResult(error)
    handleResult(loading)
}
```

>[!CAUTION]
> Tất cả các lớp con trực tiếp của sealed class đều được biết tại thời điểm biên dịch. Không có lớp con nào khác có thể xuất hiện bên ngoài mô-đun/gói trong đó sealed class được xác định

Ví dụ về lớp con trực tiếp và chuyển hướng
```kotlin
open class B : A() // class B is direct subclass of class A 
open class C : B() // class C is indirect subclass of class A and direct subclass of class B
```

> [!TIP]
> Trong Kotlin, khi làm việc với sealed class, các đối tượng như `Success`, `Error` và `Loading` thường được khai báo là `object` thay vì `class`. 
> Điều này là do chúng đại diện cho các trạng thái duy nhất, không thay đổi trong toàn bộ lifecycle của ứng dụng. 
> Việc sử dụng `object` đảm bảo rằng chỉ có một phiên bản duy nhất của mỗi trạng thái, giúp tiết kiệm bộ nhớ và cải thiện hiệu suất. 
> Mặt khác, nếu sử dụng `class` thì sẽ cần phải tạo nhiều phiên bản cho mỗi trạng thái, điều này là không cần thiết trong trường hợp này.