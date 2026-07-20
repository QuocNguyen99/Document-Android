#Object declaration

Singleton là một mẫu thực sự hữu ích và Kotlin cung cấp một cấu trúc cụ thể để khai báo các singleton: **object declaration**. 

Đây là một lớp đặc biệt với từ khóa object tạo ra một singleton. Từ khóa này ẩn tất cả các bước phức tạp nên bạn không cần phải suy nghĩ về cách triển khai mẫu này: chỉ cần sử dụng **object declaration**.


```kotlin
object Engine {

    fun getEngine(): Engine {
        /* ... */
    }
    
    fun isRunning(): Boolean {
        /* ... */
    }

}
```
> [!WARNING]
> Khi bạn sử dụng khai báo `object`, hàm tạo không khả dụng vì Kotlin tự thực hiện.

Để có được một phiên bản của sân chơi của chúng tôi, hãy sử dụng khai báo `Engine`. Chúng ta có thể sử dụng nó ở bất cứ đâu và nó sẽ trả về cùng một đối tượng mọi lúc.

```kotlin
val engine = Engine.getEngine()
```

## Đối tượng lồng nhau

Thường thì bạn cần tạo một singleton có liên quan đến một lớp khác. Ví dụ: bạn tạo lớp `Player` để lưu trữ thông tin về các nhân vật khác nhau trong trò chơi. Tất cả những nhân vật này có thể có chung một số đặc điểm, chẳng hạn như tốc độ. Chúng ta sẽ lưu trữ những thông tin đó như thế nào?

Tất nhiên, bạn có thể sử dụng object declaration và tạo một cái gì đó tương tự:

```kotlin
object PlayerProperties {
    /* Default player speed in playing field – 7 cells per turn */
    val defaultSpeed = 7

    fun calcMovePenalty(cell: Int): Int {
        /* calc move speed penalty */
    }
}
```

Tuy nhiên, có thể có nhiều lớp và các singleton liên quan, khiến mã trở nên khó hiểu và khó đọc. Một cách khác để lưu trữ thông tin này là sử dụng một đối tượng lồng nhau.

Object declaration có thể được lồng trong một khai báo lớp. Một lớp lồng nhau được tạo bên trong một lớp khác; nó không thể được truy cập nếu không khai báo lớp bên ngoài.

```kotlin
class Player(val id: Int) {
    object Properties {
        /* Default player speed in playing field – 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }
}

/* prints 7 */
println(Player.Properties.defaultSpeed)
```

Đối tượng `Properties` có phạm vi `Player`, có nghĩa là chúng ta chỉ có thể truy cập nó thông qua `Player.Properties`. 
**Bạn cũng có thể sử dụng các thuộc tính và hàm từ một đối tượng lồng nhau ở lớp bên ngoài. Điều này có thể hữu ích để lưu trữ một số dữ liệu chung cho tất cả các phiên bản của một lớp và để khởi tạo các biến**.
Ví dụ :

```kotlin
class Player(val id: Int) {
    object Properties {
        val defaultSpeed = 7
    }
    
    val superSpeed = Properties.defaultSpeed * 2 // 14
}
```

**Điều ngược lại là không đúng. Bạn không thể sử dụng các thuộc tính và chức năng của lớp bên ngoài trong lớp bên trong.**

```kotlin
class Player(val id: Int) {    
    val speed = 7
    object Properties {
        val defaultSpeed = speed // you cannot get this variable
    }
}
```

Như bạn có thể thấy, nó tương tự như **static** trong các ngôn ngữ khác. Kotlin không cung cấp thành viên tĩnh theo mặc định, nhưng bạn có thể sử dụng các đối tượng lồng nhau nếu bạn cần thứ gì đó liên quan đến lớp.


## Hằng số thời gian biên dịch
Như bạn biết, đôi khi cần phải sử dụng các giá trị không bao giờ thay đổi trong mã của bạn. Chúng tôi gọi chúng là giá trị không đổi, bạn có thể khai báo nó là `const`:

```kotlin
object Languages {
    const val FAVORITE_LANGUAGE = "Kotlin"

    // ...
}
```

Giá trị của các hằng số như vậy đã được biết trước tại thời điểm biên dịch.

> [!NOTE]
> Lưu ý rằng hằng số phải đáp ứng các yêu cầu sau: trước tiên, nó phải được khởi tạo bằng giá trị kiểu String hoặc kiểu cơ bản (Int, Double, v.v.). Ngoài ra, nó không thể là một getter tùy chỉnh. Và hãy nhớ rằng các hằng số phải được đặt tên bằng SCREAMING_SNAKE_CASE.


Bạn có thể thắc mắc: tại sao không khai báo tất cả các hằng số là cấp cao nhất? Tại sao chúng ta cần khai báo chúng trong một đối tượng?

Nói chung, cả hai cách tiếp cận đều có thể hợp lý tùy theo tình huống. 

Thực tế là việc sử dụng bất cẩn các thuộc tính cấp cao nhất sẽ làm giảm khả năng đọc và tổ chức của mã, từ đó dẫn đến các lỗi khó chịu. **Nếu bạn khai báo tất cả các hằng số ở đầu tệp, thì cuối cùng, bạn có thể nhận ra rằng ở một nơi bạn có hàng trăm khai báo không liên quan đến nhau. Vì vậy, nếu một hằng số tham chiếu đến một đối tượng cụ thể thì tốt hơn nên khai báo nó trong đối tượng đó.**

## Đối tượng và đối tượng lồng nhau

Đôi khi bạn muốn tạo nhiều hơn một singleton liên kết với một lớp. Bạn có thể khai báo bất kỳ số lượng đối tượng nào bên trong một lớp khác:

```kotlin
class Player(val id: Int) {
    object Properties {
        /* Default player speed in playing field – 7 cells per turn */
        val defaultSpeed = 7

        fun calcMovePenalty(cell: Int): Int {
            /* calc move speed penalty */
        }
    }

    /* creates a new instance of Player */
    object Factory {
        fun create(playerId: Int): Player {
            return Player(playerId)
        }
    }
}

/* prints 7 */
println(Player.Properties.defaultSpeed)


/* prints 13 */
println(Player.Factory.create(13).id)
```

Bạn có thể khai báo bất kỳ số lượng đối tượng nào bên trong một đối tượng khác.

```kotlin
object Game {
    object Properties {
        val maxPlayersCount = 13
        val maxGameDurationInSec = 2400
    }

    object Info {
        val name = "My super game"
    }
}
```

Điều này rất hữu ích cho việc tổ chức dữ liệu trong các singletons.

## Đối tượng dữ liệu


Cũng giống như các lớp dữ liệu, bạn có thể đánh dấu object declaration bằng công cụ sửa đổi `data`. Điều này hướng dẫn compiler tạo một số hàm cho đối tượng của bạn:

- `toString()` trả về tên đối tượng dữ liệu
- Cặp `equals()`/`hashCode()`

Bạn không nên nhầm lẫn chức năng này với chức năng đã tồn tại trong các lớp dữ liệu. Dữ liệu object declaration được thiết kế để sử dụng làm đối tượng đơn lẻ, không có chức năng `copy()` nào được tạo. Không giống như lớp `data`, đối tượng `data` không có bất kỳ thuộc tính dữ liệu nào.




