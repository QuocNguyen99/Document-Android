# Giao diện chức năng (SAM)

## Giao diện chức năng trong Kotlin

Các giao diện chức năng, còn được gọi là giao diện Phương thức trừu tượng đơn (SAM), là một khái niệm quan trọng trong Kotlin. Chúng cho phép bạn truyền các hàm dưới dạng tham số, trả về các hàm từ các hàm khác và đơn giản hóa trình xử lý sự kiện cũng như các mẫu callback.

## Truyền hàm dưới dạng tham số:

Kotlin cho phép bạn chuyển lambda expression trong đó cần có giao diện chức năng, điều này có thể đơn giản hóa đáng kể mã của bạn. Đây là một ví dụ:

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

fun filter(numbers: List<Int>, predicate: IntPredicate): List<Int> {
    return numbers.filter { predicate.accept(it) }
}

fun main() {
    val isEven = IntPredicate { it % 2 == 0 }
    val evenNumbers = filter(listOf(1, 2, 3, 4), isEven)
    println(evenNumbers) // output: [2, 4] 
  
}
```

## Trả về hàm từ hàm:

Bạn cũng có thể trả về một hàm từ một hàm khác bằng cách xác định giao diện chức năng làm kiểu trả về:

```kotlin
fun comparator(): Comparator<Int> {
    return Comparator { a, b -> a - b }
}

fun main() {
    val compareInts = comparator()
    println(compareInts.compare(10, 2)) // output: 8
}
```

## Đơn giản hóa Trình nghe và gọi lại sự kiện:

Các giao diện chức năng đơn giản hóa đáng kể việc triển khai trình xử lý sự kiện và lệnh gọi lại. Thay vì tạo một đối tượng ẩn danh, bạn có thể truyền trực tiếp lambda:

```kotlin
button.setOnClickListener { view ->
    // handle click
}
``` 

## Lambda Biểu thức và giao diện chức năng trong Kotlin

Kotlin hợp lý hóa việc mã hóa bằng các biểu thức lambda và giao diện chức năng. Bạn có thể sử dụng liền mạch các biểu thức lambda của Kotlin với các giao diện này để viết mã ngắn gọn.

Dưới đây là ví dụ về giao diện chức năng trong Kotlin:

```kotlin
fun interface ClickListener {
    fun onClick(viewId: Int)
}
```

Bằng cách sử dụng lambda expression, bạn có thể tạo phiên bản `ClickListener` mà không cần lớp ẩn danh:

```kotlin
val clickListener = ClickListener { viewId ->
    println("Clicked on view with ID $viewId")
}
```


## Interoperability với Java: Giao diện chức năng của Kotlin

Các giao diện chức năng của Kotlin tương tác liền mạch với các giao diện chức năng của Java, chẳng hạn như các giao diện trong gói java.util.function. interoperability này đảm bảo mã Kotlin có thể dễ dàng sử dụng các thư viện Java dựa trên các giao diện chức năng.

Trong Java, các giao diện chức năng mang chú thích `@FunctionalInterface`. Thẻ này gợi ý rằng giao diện nên được triển khai thông qua Phương thức trừu tượng đơn (SAM). Đây là chìa khóa cho biểu thức lambda trong Java.

```kotlin
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);
}
```

Tuy nhiên, Kotlin không cần chú thích để xác định giao diện chức năng. Bất kỳ giao diện nào có một phương thức trừu tượng duy nhất đều được tính là giao diện chức năng (SAM) trong Kotlin và có thể được khởi tạo bằng lambda expression.

```kotlin
fun interface KConsumer<T> {
    fun accept(t: T)
}
```

Khi sử dụng các giao diện chức năng Java trong Kotlin, bạn có thể chuyển trực tiếp lambda đến nơi cần có giao diện chức năng Java, nhờ vào chuyển đổi SAM của Kotlin. Cách này:

```kotlin
val javaConsumer: Consumer<String> = Consumer { s -> println(s) }
```

Tương tự, bạn có thể sử dụng các giao diện chức năng Kotlin trong Java. Tuy nhiên, bạn cần sử dụng lớp mà Kotlin tạo ra để triển khai giao diện chức năng:

```kotlin
KConsumer<String> kotlinConsumer = new KConsumer<String>() {
    @Override
    public void accept(String s) {
        System.out.println(s);
    }
};
```

### Các phương pháp hay nhất:

1. **Sử dụng chuyển đổi SAM để đơn giản**: Khi giao tiếp với mã Java hoặc đơn giản hóa mã Kotlin của bạn, hãy sử dụng chuyển đổi SAM để thay thế các lớp ẩn danh bằng biểu thức lambda, giúp mã của bạn sạch hơn và dễ đọc hơn.

    ```kotlin
    fun interface ClickListener {
        fun onClick(view: View)
    }

    val clickListener = ClickListener { view ->
        // handle click
    }
    ```

2. **Tận dụng Type Inference**: Tính năng type inference của Kotlin cho phép bạn bỏ qua loại giao diện khi nó có thể được suy ra từ ngữ cảnh, làm giảm hơn nữa boilerplate.
    ```kotlin
    button.setOnClickListener { view ->
        // handle click
    }
    ```
3. **Giữ giao diện chức năng đơn giản**: Giao diện chức năng chỉ nên có một phương thức trừu tượng. Sự đơn giản này đảm bảo chúng hoàn hảo cho các chuyển đổi SAM và biểu thức lambda.


### Những hạn chế và cân nhắc

1. **Hạn chế phương thức trừu tượng đơn**: Giao diện SAM chỉ có thể có một phương thức trừu tượng, phương thức này có thể hạn chế đối với các giao diện phức tạp. Đảm bảo giao diện chức năng của bạn phù hợp với single responsibility.

2. **Không có chuyển đổi SAM cho giao diện Kotlin**: Chuyển đổi SAM chỉ áp dụng cho giao diện Java trong Kotlin. Đối với giao diện Kotlin, bạn cần sử dụng các loại hàm hoặc xác định triển khai lớp đầy đủ.

3. **Các loại rõ ràng cho sự mơ hồ**: Trong trường hợp lambda có thể khớp với nhiều giao diện chức năng, hãy khai báo loại rõ ràng để tránh nhầm lẫn.

```kotlin
val runnable: Runnable = Runnable {
    // implementation
}
```

