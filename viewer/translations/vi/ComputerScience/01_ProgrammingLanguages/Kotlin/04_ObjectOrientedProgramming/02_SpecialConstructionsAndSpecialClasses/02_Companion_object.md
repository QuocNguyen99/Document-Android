#Companion object

**Bạn có thể khai báo bất kỳ số lượng đối tượng nào bên trong một đối tượng khác**. 
**Nhưng trong nhiều trường hợp, bạn chỉ cần một singleton cho một lớp** và việc sử dụng tên đầy đủ của nó có vẻ dài dòng. Trong trường hợp này, bạn có thể sử dụng một tính năng Kotlin khác, companion object.

##Companion object

companion object là một singleton được gắn vào một lớp bên ngoài và do đó không thể truy cập được nó nếu không truy cập vào lớp bên ngoài. Nó cho phép chúng ta hiểu rằng đối tượng hiện tại được kết nối bằng cách nào đó với lớp bên ngoài. 

Ví dụ: chúng tôi có thể lưu trữ tốc độ mặc định cho tất cả người chơi trong `Player` companion object. Điều đó cũng có nghĩa là mọi phiên bản `Player` đều chứa tham chiếu đến companion object và sẽ trả về phiên bản của nó mọi lúc.

```kotlin
class Player(val id: Int) {
    companion object Properties {
        /* Default player speed in playing field - 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }
}

/* prints 7 */
println(Player.Properties.defaultSpeed)
```


Tuy nhiên, không giống như trường hợp đối tượng lồng nhau, tên có thể được bỏ qua. Hãy thử nó:

```kotlin
class Player(val id: Int) {
    companion object {
        /* Default player speed in playing field - 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }
}

/* prints 7 */
println(Player.defaultSpeed)
```

chúng ta vẫn có thể truy cập nó thông qua khai báo lớp bên ngoài. Nếu companion object không có tên, chúng ta cũng có thể sử dụng tên mặc định là Companion:

```kotlin
/* prints 7 too */
println(Player.Companion.defaultSpeed)
```
## Companion object và lớp bên ngoài

Bạn có thể tự do sử dụng các thuộc tính và hàm từ companion object ở lớp bên ngoài. Ví dụ:

```kotlin
class Deck {
    companion object {
        val size = 10
        val height = 2
        fun volume(bottom: Int, height: Int) = bottom * height
    }

    val square = size * size             //100
    val volume = volume(square, height)  //200
}
```

Nhưng điều gì sẽ xảy ra nếu lớp bên ngoài có thuộc tính có cùng tên với companion object? Chà, trong trường hợp này, các thuộc tính của lớp sẽ che khuất các thuộc tính của lớp đồng hành.

```kotlin
class Deck {
    companion object {
        val size = 10
    }
    val size = 2
    val square = size * size // 4
}
```

Trong trường hợp này, nếu bạn muốn sử dụng thuộc tính từ đối tác đồng hành, bạn phải sử dụng tên của đối tác đồng hành hoặc, nếu nó không được đặt tên, tên mặc định Đồng hành:
```kotlin
class Deck {
    companion object {
        val size = 10
    }
    val size = 2
    val square = Companion.size * Companion.size // 100
}
```

Tương tự như trường hợp các đối tượng lồng nhau, bạn không thể sử dụng các thuộc tính và chức năng của lớp bên ngoài trong lớp bên trong.

```kotlin
class Deck() {    
    val size = 2
    object Properties {
        val defaultSize = size // you cannot get this variable
    }
}
```

## Hạn chế của đối tượng đồng hành

- Mỗi lớp chỉ có một companion object. Điều đó có nghĩa là bạn không thể tạo nhiều đối tượng đồng hành cho một lớp vì Kotlin không hỗ trợ hành vi này, ngay cả khi chúng có tên khác nhau

- Chúng tôi không thể tạo companion object bên trong một singleton khác (hoặc companion object) vì điều đó vi phạm nguyên tắc truy cập toàn cầu.

```kotlin
object OuterSingleton {
    companion object InnerSingleton { // Modifier 'companion' is not applicable inside 'object'  
  
    }
}
```
## Tương tự trong các ngôn ngữ khác

Nếu bạn đến từ một programming language khác, bạn có thể hơi bối rối trước các đối tượng đồng hành. Khái niệm gần nhất với nó là các thành viên `static`. Từ khóa `static` có nghĩa là các trường và phương thức có công cụ sửa đổi này là chung cho tất cả các đối tượng của lớp và có thể được sử dụng mà không cần tạo một phiên bản của lớp. Bạn có thể gặp từ khóa này trong một số ngôn ngữ.

```java
class Dog {
    public static int numOfPaws = 4;

    public static String createSound() {
        return "WUF-WUF";
    }
}
/*prints WUF-WUF*/
System.out.println(Dog.createSound());
```
Như bạn có thể biết, Kotlin không có từ khóa `static`. 

> [!TIP]
> Nếu bạn cần một cái gì đó chung cho tất cả các phiên bản của một lớp, bạn có thể sử dụng đối tượng `companion`