#Generic Programming

Generics đại diện cho các loại tham số. Các phương thức và lớp chung có thể xử lý các loại khác nhau theo cùng một cách chung

Loại phải được xác định khi bạn tạo một thể hiện của lớp hoặc gọi một phương thức.

Kotlin cho phép chúng ta xác định không chỉ một tham số thuộc loại tùy ý mà còn cả hai, ba, v.v. Trong trường hợp này, bạn có thể chỉ định một số tham số loại, phân tách chúng bằng dấu phẩy:

```kotlin
class Three<T, U, V>(var first: T, var second: U, var third: V)
```

## Quy ước đặt tên cho tham số kiểu

Tham số loại được đặt tên bằng một chữ cái theo quy ước để phân biệt với tên lớp thông thường.

Tên tham số loại được sử dụng phổ biến nhất là:

- `T` – Loại;

- `S`, `U`, `V`, v.v. – loại thứ 2, thứ 3, thứ 4;

- `E` – Phần tử (thường được sử dụng bởi các collection khác nhau);

- `K` – Chìa khóa;

- `V` – Giá trị;

- `N` – Số.

## Hàm chung

Tuy nhiên, không chỉ các lớp có thể là chung mà còn có các hàm chung. Các tham số kiểu có thể được truyền cho hàm hoặc được định nghĩa là kiểu trả về của nó

### Khai báo các hàm chung

Hàm sau được khai báo là generic và không thuộc về bất kỳ lớp nào.

```kotlin
fun <T> doSomething(t: T): T {
    return t
}
```

Cũng giống như các lớp generic, các hàm generic có thể có một số tham số kiểu. Chúng được phân tách bằng dấu phẩy bên trong dấu ngoặc nhọn:

```kotlin
fun <T,U> multipleDoSomething(t: T, u: U){
   // do something
}
```

### Phương pháp chung

Như chúng ta đã nói, các hàm generic có thể là thành viên của các lớp. Chúng có thể hoạt động với các thành viên khác của lớp giống như các phương thức lớp thông thường. 

```kotlin
class NonGenericClass {
    fun <T> someGenericMethod(t: T): T {
        //...//
        return t
    }
}
```

## Hàm mở rộng

Kotlin cung cấp khả năng mở rộng các lớp hiện có mà không cần inheritance hoặc sử dụng các mẫu thiết kế. Bạn có thể sử dụng các hàm mở rộng, cho phép thêm một số chức năng vào một lớp trong khi không phải là thành viên của lớp đó.

```kotlin
class BiggerBox<T>(var value1: T, var value2: T) {}

fun <T> BiggerBox<T>.changeBoxes() {
    val tmp = this.value1
    this.value1 = this.value2
    this.value2 = tmp
}
```


## Mã sử ​​dụng lại khác biệt với bất kỳ và chung chung

```kotlin
val nonGenericInstance: NonGenericClass = NonGenericClass("abc")
val str: String = nonGenericInstance.get() // Compile-time error: Type mismatch
```

Sau khi gọi phương thức `get()`, chúng tôi nhận được `Any`, không phải `String` hay Số nguyên. Chúng ta không thể lấy chuỗi trực tiếp từ phương thức này.

> [!TIP]
> Bây giờ chúng ta có thể thấy lợi thế chính của thuốc generic so với lớp `Any`. Vì không cần thực hiện chuyển kiểu rõ ràng nên chúng tôi không bao giờ có ngoại lệ runtime. Nếu chúng ta làm sai điều gì đó, chúng ta có thể thấy nó tại thời điểm biên dịch.