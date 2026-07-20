# Yêu cầu, kiểm tra và khẳng định

Trong Kotlin, `require`, `check` và `assert` là các hàm được sử dụng để xác minh các điều kiện trong mã. Các hàm này đưa ra ngoại lệ nếu điều kiện chúng kiểm tra không được đáp ứng.

## yêu cầu

`fun require(value: Boolean)` được sử dụng để xác minh các yêu cầu của **đối số** của hàm hoặc hàm tạo. 
Nếu điều kiện được chỉ định trong `require` không được đáp ứng (là sai), `IllegalArgumentException` sẽ bị ném ra.

Ở đây chúng tôi có một cấu trúc truyền thống sử dụng `if` và `throw`. Chúng tôi sử dụng nó để kiểm tra các điều kiện tiên quyết hoặc một tham số của hàm.

```kotlin
fun setAgeWithIf(age: Int) {
    if (age < 0) {
        throw IllegalArgumentException("Age must not be less than zero")
    }
    println("Age is $age")
}
```

Bây giờ, chúng tôi sẽ sử dụng `require` để giải quyết loại tác vụ này và kiểm tra điều kiện tiên quyết để thực thi một đoạn mã.

```kotlin
fun setAgeWithRequire(age: Int) {
    require(age >= 0) { "Age must not be less than zero" }
    println("Age is $age")
}
```

## kiểm tra

`fun check(value: Boolean)` được sử dụng để xác minh **trạng thái** của một đối tượng hoặc biến. Nó sẽ ném `IllegalStateException` nếu điều kiện được chỉ định trong `check` không được đáp ứng (là sai), vì vậy chúng tôi cần trạng thái pháp lý để thực hiện mã.

```kotlin
class MyClassWithIf {
    private var isInitialized = false

    fun performActionWithIf() {
        if (!isInitialized) {
            throw IllegalStateException("Object state is not initialized")
        }
        println("Action performed")
    }
}
```

Và bây giờ hãy xem bạn có thể làm điều đó như thế nào với `check`:


```kotlin
class MyClassWithCheck {
    private var isInitialized = false

    fun performActionWithCheck() {
        check(isInitialized) { "Object state is not initialized" }
        println("Action performed")
    }
}
```

## khẳng định

`fun assert(value: Boolean)` là một hàm trong Kotlin được sử dụng để xác minh các điều kiện trong mã được cho là đúng trừ khi có lỗi trong chương trình. 

Nếu điều kiện được chỉ định trong `assert` không được đáp ứng (sai), `AssertionError` sẽ bị ném

```kotlin
fun calculateValueWithIf(x: Int): Int {
    val value = x * 2
    if (value != x + x) {
        throw AssertionError("Error in calculation")
    }
    return value
}
```

Trong trường hợp trên, nếu kết quả tính toán không chính xác do lỗi trong chương trình, `AssertionError` sẽ bị ném ra với thông báo "Lỗi khi tính toán".

```kotlin
fun calculateValueWithAssert(x: Int): Int {
    val value = x * 2
    assert(value == x + x) { "Error in calculation" }
    return value
}
```

##Thực hành tốt
Đây là quy trình bạn có thể muốn thực hiện khi thực hiện kiểm tra:
- Bắt đầu bằng cách sử dụng `check` để xác minh **trạng thái** ban đầu của đối tượng.
Nếu những lần kiểm tra này không thành công, điều đó có nghĩa là hàm lẽ ra không được gọi ngay từ đầu do trạng thái đối tượng không chính xác.
- Tiếp theo, sử dụng `require` để **xác thực các đối số của hàm**. 
Nếu bất kỳ đối số nào không hợp lệ, tốt nhất bạn nên xác định điều đó trước khi tiếp tục các thao tác của hàm, vì lệnh gọi hàm cuối cùng sẽ thất bại do đối số không hợp lệ.
- Sau khi xác thực trạng thái và đối số, hãy tiến hành logic hoặc các thao tác chính của hàm.
- Cuối cùng, sử dụng `assert` để **đảm bảo rằng chức năng của bạn đã thực hiện chính xác công việc của mình**. 
Điều này có thể liên quan đến việc xác minh rằng một số đối tượng nhất định đã được cập nhật sang trạng thái mới hoặc đảm bảo rằng giá trị trả về đúng như mong đợi.


```kotlin
class MyClass {
    private var isInitialized = false

    fun initialize() {
        isInitialized = true
    }

    fun performAction(x: Int, y: Int): Int {
        check(isInitialized) { "Object is not initialized" }
        require(x > 0 && y > 0) { "Both x and y must be greater than zero" }

        val result = x + y

        assert(result == x + y) { "Error in calculation" }

        return result
    }
}
```