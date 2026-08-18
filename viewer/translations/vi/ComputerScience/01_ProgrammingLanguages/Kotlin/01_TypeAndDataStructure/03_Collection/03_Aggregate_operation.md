
# Hoạt động tổng hợp trên các collection
 
Đã đến lúc tìm hiểu cách lấy các giá trị dựa trên nội dung của collection, ví dụ: giá trị tối đa, giá trị trung bình, một đối tượng có giá trị tối đa của thuộc tính, v.v.
 
## Hàm tổng hợp cơ bản
 
Khi làm việc với các collection, chúng tôi có một loạt phương pháp để thu được các giá trị dựa trên nội dung collection và nhận thông tin bổ sung về nội dung đó. Các phương pháp này được gọi là "phương pháp tổng hợp":
 
- `minOrNull()` trả về phần tử nhỏ nhất của collection hoặc null trên collection trống.
 
- `maxOrNull()` trả về phần tử lớn nhất của collection hoặc null trên collection trống.
 
- `average()` trả về giá trị trung bình của các phần tử trong collection kèm theo giá trị số.
 
- `sum()` trả về tổng của tất cả các phần tử trong collection với các giá trị số.
 
- `count()` trả về số phần tử có trong collection.
 

> [!CAUTION]
> phương thức sum() và Average() chỉ hoạt động với các số và nếu collection thuộc loại dữ liệu khác, chúng sẽ đưa ra một ngoại lệ.

## Tổng hợp với chức năng chọn
 
Đôi khi, chúng ta cần chỉ định giá trị nào chúng ta muốn nhận bằng phương thức tổng hợp. Trong Kotlin, chúng tôi có các phương pháp đặc biệt để thực hiện các tác vụ này bằng cách sử dụng **chức năng chọn**. Họ là:
 
 
- `minByOrNull()` với chức năng selector, trả về phần tử có giá trị nhỏ nhất.
 
- `maxByOrNull()` với chức năng selector, trả về phần tử có giá trị lớn nhất.
 
- `minOfOrNull()` với chức năng selector, trả về giá trị trả về nhỏ nhất của chính selector đó. 
 
- `maxOfOrNull()` với chức năng selector, trả về giá trị trả về lớn nhất của chính selector đó.
 
- `sumOf()` với chức năng chọn, trả về tổng ứng dụng của nó cho tất cả các phần tử collection.
 
Ngoài ra, chúng tôi cũng có thể sử dụng `minBy()`/`maxBy()` và `maxOf()`/`minOf()` để thực hiện các tác vụ tương tự, nhưng chúng ném `NoSuchElementException` vào các collection trống.

> [!TIP]
> Ngoài ra, bạn có thể sử dụng các vị từ để tìm các phần tử max hoặc min.
 
 
```kotlin
fun main() {
    val words = listOf("anne", "michael", "caroline", "dimitry", "emilio")
 
    // Count
    println(words.count()) // 5
    // maxByOrNull/minByOrNull
    println(words.maxByOrNull { it.length }) // caroline
    println(words.minByOrNull { it.length }) // anne
    //maxOfOrNull/minOfOrNull
    println(words.maxOfOrNull { it.length }) // 8
    println(words.minOfOrNull { it.length }) // 4
    // sumOf
    println(words.sumOf { it.length }) // 32
 
    // using predicates, length > 5
    println(words.count { it.length > 5 }) // 4
    println(words.maxByOrNull { it.length > 5 }) // michael
    println(words.minByOrNull { it.length > 5 }) // anne
 
    // emptyList
    val emptyWordsList = emptyList<String>()
    println(emptyWordsList.count()) // 0
    println(emptyWordsList.maxByOrNull { it.length }) // null
    println(emptyWordsList.minByOrNull { it.length }) // null
    println(emptyWordsList.maxOfOrNull { it.length }) // null
    println(emptyWordsList.minOfOrNull { it.length }) // null
    println(emptyWordsList.maxOf { it.length })  // NoSuchElementException
    println(emptyWordsList.minOf { it.length })  // NoSuchElementException
    println(emptyWordsList.maxBy { it.length })  // NoSuchElementException
    println(emptyWordsList.minBy { it.length })  // NoSuchElementException
}
```
 
**Điều quan trọng cần lưu ý là sự khác biệt** giữa `maxOfOrNull`/`minOfOrNull` và `maxByOrNull`/`minByOrNull`. `maxOfOrNull`/`minOfOrNull` trả về giá trị lớn nhất/nhỏ nhất trong số tất cả các giá trị do hàm chọn tạo ra được áp dụng cho từng phần tử trong collection hoặc trả về null nếu collection trống.
 
```kotlin
    //maxOfOrNull/minOfOrNull
    println(words.maxOfOrNull { it.length }) // 8
    println(words.minOfOrNull { it.length }) // 4
```
 
 
Trong khi đó, `maxByOrNull`/`minByOrNull` trả về phần tử đầu tiên mang lại giá trị lớn nhất/nhỏ nhất của hàm đã cho hoặc null nếu không có phần tử nào
 
```kotlin
    println(words.maxByOrNull { it.length > 5 }) // michael
    println(words.minByOrNull { it.length > 5 }) // anne
```
## Tổng hợp bằng bộ so sánh
 
Chúng ta có thể thực hiện tác vụ tương tự như trên bằng cách sử dụng bộ so sánh tùy chỉnh với lambda và các phương pháp sau:
 
- `minWithOrNull()` trả về phần tử nhỏ nhất theo bộ so sánh.
 
- `maxWithOrNull()` trả về phần tử lớn nhất theo bộ so sánh.
 
- `minOfWithOrNull()` trả về giá trị trả về của bộ chọn nhỏ nhất theo bộ so sánh.
 
- `maxOfWithOrNull()` trả về giá trị trả về của bộ chọn lớn nhất theo bộ so sánh.
 
- `count()` trả về số lượng mục theo bộ so sánh.
 
Các phương thức này trả về `null` trên các collection trống. Tuy nhiên, chúng tôi cũng có `maxOfWith()` và `minOfWith()` để thực hiện nhiệm vụ tương tự và họ ném `NoSuchElementException` vào các collection trống.

## Đếm phần tử

Một trong những nhiệm vụ chính khi làm việc với các collection là đếm các phần tử. Rõ ràng, chúng ta có thể sử dụng `size`. nhưng một sự thật thú vị là chúng ta cũng có thể sử dụng **vị ngữ** để đếm số phần tử collection phù hợp.

Để thực hiện hành động này, chúng ta có thể áp dụng phương pháp `count()`.

```kotlin
fun main() {
    val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    // number of elements
    println(numbers.size) // 10
    // number of elements
    println(numbers.count()) // 10
    // number of elements that match the condition
    println(numbers.count { it % 2 == 0 }) // 5
}
```

## Các phần tử riêng biệt

Các phương thức `distinct()` trả về một danh sách chỉ có các phần tử riêng biệt trong collection đã cho.
Ngoài ra, `distinctBy()` trả về collection chỉ chứa các phần tử có khóa riêng biệt được trả về bởi hàm chọn đã cho.

```kotlin
fun main() {

    val numberWithRepeated = listOf(1, 2, 3, 4, 5, 4, 4, 3, 1)
    val namesWithRepeated = listOf("Pablo", "John", "Jane", "John", "Jane")
    // distinct elements
    println(numberWithRepeated.distinct()) // [1, 2, 3, 4, 5]
    println(namesWithRepeated.distinct()) // [Pablo, John, Jane]
    // distinct by a condition
    println(numberWithRepeated.distinctBy { it % 2 }) // [1, 2]
    // -> 1 % 2 = 1 -> 2 % 2 = 0 -> 3 % 2 = 1 -> 4 % 2 = 0 -> 5 % 2 = 1
    println(namesWithRepeated.distinctBy { it.first() }) // [Pablo, John]
    // -> "Pablo".first() = 'P' -> "John".first() = 'J' -> "Jane".first() = 'J'
}
```


