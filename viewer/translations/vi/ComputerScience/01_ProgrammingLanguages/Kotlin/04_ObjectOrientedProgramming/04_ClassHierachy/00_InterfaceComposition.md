#Interface Composition

## Hãy bắt đầu với việc giải quyết xung đột

Khi nói đến nhiều inheritance, có một số cạm bẫy cần tránh.
Ví dụ:

```kotlin
interface FirstInterface {  
    fun f() { print("First") }  
    fun g()  
}  
  
interface SecondInterface {  
    fun f() { print("Second") }  
    fun g() { print("g") }  
}  
  
class FirstClass : FirstInterface {  
    override fun g() { print("g") }  
}  
  
class SecondClass : FirstInterface, SecondInterface {  
    override fun f() { print("Class")}  
}
```
Không có vấn đề như vậy trong trường hợp `FirstClass`: nó chỉ thực hiện một interface.


Tuy nhiên, `SecondClass` triển khai cả hai interface; do đó, compiler không thể chọn giữa hai chữ ký hàm được cung cấp. Được rồi, hãy sửa nó:

```kotlin
class SecondClass : FirstInterface, SecondInterface {  
    override fun f() { print("Class")}  
    override fun g() {  
        super.g()  
    }  
}
```

Điều này sẽ hiệu quả vì chỉ có một interface thực sự cung cấp cách triển khai mặc định – đó là `SecondInterface`.
Nhưng nếu interface của chúng ta trông như sau thì sao?

```kotlin
interface FirstInterface {  
    fun f() { print("First") }  
    fun g() { print("not g") }  
}  
  
interface SecondInterface {  
    fun f() { print("Second") }  
    fun g() { print("g") }  
}
```

Sau đó, chúng tôi sẽ gặp lỗi vì compiler không biết nên sử dụng chức năng nào - chức năng trong interface thứ nhất hoặc giao diện thứ hai.
Điều này có thể được giải quyết bằng cú pháp sau:

```kotlin
class ThirdClass : FirstInterface, SecondInterface {  
    override fun f() {  
        super<FirstInterface>.f()  
        super<SecondInterface>.f()  
    }  
  
    override fun g() {  
        super<SecondInterface>.g()  
    }  
}
```
Ở đây, bằng cách sử dụng dấu ngoặc nhọn, chúng tôi hiển thị interface nào mà chúng tôi gọi là hàm.

## Ý tưởng của composition

Như bạn có thể thấy, inheritance với tư cách là design pattern có những sai sót riêng.
Có một giải pháp thay thế cho nó, có tính năng tái sử dụng mã tương tự và được gọi là **composition**.
Giả sử chúng ta muốn tạo một trò chơi.
Ví dụ: các nhân vật trong trò chơi của chúng tôi có 3 tham số:

- **Cấp độ**: sức mạnh của họ như thế nào
- **Kẻ thù**: nhân vật là kẻ thù hay đồng minh
- **Lớp**: những gì nhân vật có thể làm, ví dụ như chiến đấu bằng kiếm hoặc niệm phép

Theo nguyên tắc inheritance, chúng tôi có thể triển khai nó như sau:

```kotlin

interface Level {  
    fun getLevel(): Int  
}  
  
interface Enemy {  
    fun isEnemy(): Boolean  
}  
  
interface Class {  
    fun getClass(): String  
}
```
Và với mỗi ký tự, chúng ta sẽ cần phải viết khá nhiều mã:

```kotlin
class DangerousEnemyWarrior : Level, Enemy, Class  
{  
    override fun getLevel(): Int { return 10 }  
  
    override fun isEnemy(): Boolean { return true }  
  
    override fun getClass(): String { return "Warrior" }  
}
```
Lưu ý: chúng tôi đã tạo một nhân vật cấp 10,
là Kẻ thù của người chơi và thuộc lớp Chiến binh.

Đối với mỗi ký tự mới, chúng ta cần đặt thủ công tất cả các tham số này.
Còn chúng ta thử sử dụng lại các tham số tương tự để tối ưu hóa process thì sao?

## Composition trong mã

Mô hình để triển khai nó theo cách hiệu quả hơn được gọi là composition.

Thay vì triển khai nhiều interface và phải ghi đè tất cả các phương thức và trường của chúng,
chúng ta có thể tạo trước các triển khai của chúng và lưu trữ chúng dưới dạng các thực thể riêng biệt (các đối tượng trong ví dụ bên dưới).
Sau đó, chúng ta có thể chỉ cần soạn một đối tượng cần thiết từ những "khối xây dựng" này.

Và đó là lúc sự ủy quyền phát huy tác dụng,
vì đây là một cách rất thuận tiện trong Kotlin để tham chiếu triển khai hiện có thay vì cung cấp nó ở nơi cần thiết.
Hãy xem ví dụ dưới đây:


```kotlin
// We only need to create all these objects once

object Dangerous : Level { override fun getLevel(): Int { return 10 } }  
  
object NotDangerous : Level { override fun getLevel(): Int { return 1 } }  
  
object Foe : Enemy { override fun isEnemy(): Boolean { return true } }  
  
object Friend : Enemy { override fun isEnemy(): Boolean { return false } }  
  
object Warrior : Class { override fun getClass(): String { return "Warrior"}}  
  
object Wizard : Class { override fun getClass(): String { return "Wizard"}}

// And then we're free to use them as many times as we'd like!

class DangerousKotlinEnemyWarrior : Level by Dangerous, Enemy by Foe, Class by Warrior  
  
class NotDangerousFriendlyWizard : Level by NotDangerous, Enemy by Friend, Class by Wizard
```
Tạo các lớp theo cách này dễ dàng và gọn gàng hơn nhiều.


