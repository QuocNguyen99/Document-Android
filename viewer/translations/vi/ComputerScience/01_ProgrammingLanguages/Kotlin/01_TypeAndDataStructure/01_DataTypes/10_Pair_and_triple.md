# Cặp và bộ ba


Điều gì sẽ xảy ra nếu chúng ta muốn trả về một số giá trị thuộc các loại khác nhau? Kotlin cung cấp cho chúng tôi hai lớp đặc biệt giúp chúng tôi xử lý tình huống này: Cặp và Bộ ba. Hãy xem cách họ làm việc.


## Cặp

Cặp là kiểu dữ liệu Kotlin đơn giản để lưu trữ hai giá trị có cùng loại hoặc khác loại trong một phiên bản. Không cần phải có bất kỳ mối quan hệ nào giữa hai giá trị. 

```kotlin
val pair = Pair(1, "one")
println(pair) // (1, one)
```

Chúng ta có thể sử dụng infix function để tạo đối tượng Cặp mới:

```kotlin
val pair = 1 to "one"
println(pair) // (1, one)
```
## Cách làm việc với Pair

Để làm việc với các giá trị, chúng ta có thể sử dụng các thuộc tính **first** và **second** hoặc phương thức `componentN` để trích xuất các giá trị từ một Cặp. Giá trị N của `componentN` là viết tắt của số lượng thành phần; ví dụ: `component1` đại diện cho thuộc tính hoặc giá trị đầu tiên của Cặp.

```kotlin
val pairOne = Pair("Hi", "I am a Pair")
val pairTwo = "Hi" to "I am another Pair"

// Properties
println(pairOne.first) // Hi
println(pairOne.second) // I am a Pair

// Methods
println(pairTwo.component1()) // Hi
println(pairTwo.component2()) // I am another Pair
```

Ngoài ra, chúng ta có thể sử dụng phương thức `copy()` để sao chép các đối tượng `Pair` và thay đổi thuộc tính của chúng bằng cách sử dụng tên của tham số

> [!WARNING]
> Thuộc tính của `Pair` là immutable, chỉ đọc. 
> Bạn phải tạo một `Pair` mới để thay đổi các giá trị hoặc sử dụng hàm `copy` để tạo một Cặp mới và gán cho nó bất kỳ giá trị nào bạn muốn dựa trên đối tượng trước đó.

```kotlin
val pair = Pair("marks", listOf(8.0, 9.0, 10.0))
val other = pair.copy("other")
val grades = pair.copy(second = listOf(9.0, 7.0, 8.5))
val myCopy = pair.copy(first = "other", second = listOf(1.0, 2.0, 3.0))
println(pair) // (marks, [8.0, 9.0, 10.0])
println(other) // (other, [8.0, 9.0, 10.0])
println(grades) // (marks, [9.0, 7.0, 8.5])
println(myCopy) // (other, [1.0, 2.0, 3.0])
```

## Gấp ba

`Triple`, giống như `Pair`, là kiểu dữ liệu Kotlin đơn giản đại diện cho bộ ba giá trị có cùng loại hoặc khác loại trong một phiên bản.

```kotlin
val triple = Triple(1, "A", true)
println(triple)
```

### Cách làm việc với Triple

Để làm việc với các giá trị, chúng ta có thể sử dụng các thuộc tính **first**, **second** và **third** hoặc phương thức `componentN` để trích xuất các giá trị. Giá trị N của `componentN` là viết tắt của số lượng thành phần; ví dụ: thành phần1 đại diện cho thuộc tính hoặc giá trị đầu tiên của `Triple`.


Giống như trong trường hợp `Pair`, với phương thức `copy()`, bạn có thể tạo Bộ ba mới dựa trên Bộ ba khác hoặc thay đổi một số thuộc tính. Bạn phải giữ nguyên thứ tự của các thuộc tính. 

> [!WARNING]
> thuộc tính của Bộ ba là immutable, chỉ đọc. 
> Bạn phải tạo Bộ ba mới để thay đổi giá trị hoặc sử dụng chức năng sao chép để tạo Bộ ba mới và gán cho nó bất kỳ giá trị nào bạn muốn dựa trên đối tượng trước đó.

