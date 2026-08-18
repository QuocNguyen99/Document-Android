# Loại bị ràng buộc

Đôi khi chúng ta cần hạn chế tham số kiểu bên trong một hàm hoặc lớp chung.  Ví dụ: chúng tôi có một lớp chung `Storage<T>` và chúng tôi muốn làm cho nó chỉ lưu trữ sách mà không tạo thêm một lớp nào. Trong tình huống như vậy, chúng ta nên sử dụng **giới hạn loại**.

Chúng ta có thể thêm giới hạn của mình bằng cách thêm ràng buộc `T : Book` bên trong dấu ngoặc nhọn:

```kotlin
class Storage<T : Book>() {
      // some code
}
```

Sau đó, chúng ta tạo các lớp có đối tượng mà chúng ta muốn lưu trữ:

```kotlin
open class Book {}
class Magazine : Book() {}
class Stone {}
```

Bây giờ hãy tạo các phiên bản của `Storage<T>`:

```kotlin
val storage1 = Storage<Book>()
val storage2 = Storage<Magazine>()
val storage3 = Storage<Stone>() // compile-time error
```

Theo mặc định, tất cả các tham số loại bị ràng buộc bởi loại `Any?`. `SomeGeneric<T>` giống với `SomeGeneric<T : Any?>`.

> [!CAUTION]
> Là các ràng buộc, chúng ta có thể thiết lập không chỉ các lớp mà cả các interface. Đừng cố gắng mở rộng một lớp chung này từ một lớp chung khác - nó sẽ dẫn đến lỗi.

## Cách sử dụng với hàm

Giới hạn loại cũng có thể được sử dụng với các hàm chung. Nguyên tắc sử dụng các hàm cũng giống như với các lớp.


```kotlin
fun <T : Book> sortByDate(list: List<T>) { ... }
```

## Nhiều giới hạn

Nếu bạn cần nhiều giới hạn loại, bạn cần sử dụng **mệnh đề Where** để phân tách chúng.

```kotlin
fun <T> sortByDate(list: List<T>)
     where T : Book, T : Watchable<T> {...}
```

> [!NOTE]
> Khi bạn sử dụng nhiều giới hạn, loại đầu tiên phải là lớp hoặc interface. Các loại sau đây phải là interface.


## Các loại chắc chắn không thể rỗng


Ngoài các giới hạn kiểu mà chúng ta đã đề cập, còn có một khái niệm khác cần phải hiểu khi làm việc với các generic, đặc biệt là trong ngữ cảnh interoperability với Java—khái niệm về **có tính không rỗng xác định**. Điều này đặc biệt hữu ích khi xử lý các lớp và interface Java chung.


Kể từ Kotlin 1.7.0, chúng ta có thể khai báo tham số loại chung là chắc chắn không thể rỗng. Điều này đạt được bằng cách khai báo loại có cú pháp `T & Any` (loại giao nhau của `T` và `Any`).

Giả sử chúng ta có interface Java `Game<T>` sau:

```kotlin
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x);

    @NotNull
    public T load(@NotNull T x);
}
```

Để ghi đè phương thức này trong Kotlin, loại `T1` cần được khai báo là chắc chắn không thể rỗng:

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1

    override fun load(x: T1 & Any): T1 & Any // T1 is definitely non-nullable

 // override fun load(x: T1): T1
 // ^ This won't compile
}
```
