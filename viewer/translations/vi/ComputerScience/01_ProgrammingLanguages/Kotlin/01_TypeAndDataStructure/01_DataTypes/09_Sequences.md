# Trình tự

`Sequence` là vùng chứa các đối tượng không được chứa nhưng được tạo ra trong khi lặp.

Điều đó có nghĩa là gì? Những đối tượng đó không được xử lý cho đến khi sử dụng chúng: nghĩa là, các chuỗi được thực thi một cách lười biếng. Chúng tôi sẽ không nhận được kết quả trung gian ở cuối mỗi bước.

`Sequences` cung cấp các chức năng tương tự như `Iterable`: chúng tôi có thể lọc, ánh xạ hoặc sắp xếp các mục, nhưng dưới mui xe,
chúng hoạt động khác nhau và có tiềm năng lớn cho các bộ sưu tập có số lượng lớn các mục hoặc những mục yêu cầu nhiều thao tác nối


Điều đó mang lại cho chúng ta hai lợi thế:

- **Chuỗi có thể là vô hạn**: chúng ta có thể xác định một chuỗi bằng một giá trị ban đầu và một phép toán (ví dụ), và chuỗi đó sẽ có các giá trị vô hạn.
- **Chúng cho phép bạn tránh các bước trung gian**: không giống như các bộ sưu tập khác, khi một chuỗi thực hiện một số thao tác (lọc, chuyển đổi, v.v.), 
những thứ này được áp dụng theo chuỗi cho từng đối tượng mà không cần tạo collection mới ở mỗi bước.


## Tạo trình tự

Chúng ta có thể tạo trình tự theo nhiều cách khác nhau.
- sử dụng hàm `sequenceOf()` để lấy chuỗi từ các phần tử được truyền dưới dạng đối số:
```kotlin
val sequenceOfStrings = sequenceOf("one", "two", "three", "four")
val sequenceOfInts = sequenceOf(1, 2, 3, 4)
```
- Sử dụng hàm `asSequence()`, chúng ta có thể chuyển đổi bất kỳ collection nào thành một chuỗi:
```kotlin
val listOfStrings = listOf("one", "two", "three", "four")
val sequenceOfStrings = listOfStrings.asSequence()
```
- Chúng ta có thể sử dụng `generateSequence()`, nhận giá trị đầu tiên `(seed)` và một hàm áp dụng cho giá trị đó và xây dựng một chuỗi vô hạn. 
Bạn có thể thắc mắc tại sao chúng ta lại muốn có một dãy vô hạn. 

Ví dụ: chúng ta có thể tạo các giá trị theo một điều kiện nhất định hoặc chỉ cần lấy các phần tử mà chúng ta muốn từ chuỗi của mình.

```kotlin
val sequenceOfEvenNumbers = generateSequence(1) { it + 1 }
    .filter { it % 2 == 0 }
    .take(5)
println(sequenceOfEvenNumbers.toList()) // [2, 4, 6, 8, 10]
```

> [!CAUTION]
> Hãy cẩn thận khi sử dụng Trình tự; nếu bạn không giới hạn kết quả, nó có thể gây ra OutOfMemoryError do đầu ra vô hạn.


Sử dụng phương pháp `sequence()`, chúng ta có thể tạo ra từng phần tử chuỗi. Nhờ `yield()` và `yieldAll()`, chúng tôi có thể trả về một hoặc nhiều phần tử (`Iterable`) và tạm dừng quá trình thực thi (đợi cho đến khi các phần tử này được sử dụng hết).


```kotlin
val evenNumbersSequence = sequence {
    yield(2) // return 2 and suspend the function
    yieldAll(listOf(4, 6)) // return 4 and 6 and suspend the function
    yieldAll(generateSequence(8) { it + 2 }) // generate an infinite sequence of even numbers starting at 8
}
println(evenNumbersSequence.take(5).toList()) // [2, 4, 6, 8, 10]
```

## Các thao tác tuần tự

Các hoạt động với trình tự có thể được phân thành hai loại:

- **Không trạng thái**: các thao tác này không yêu cầu trạng thái và process mỗi phần tử độc lập; chúng có thể yêu cầu một lượng nhỏ trạng thái không đổi đối với một phần tử process. Một số hoạt động không trạng thái là `map()`, `filter()`, `take()` hoặc `drop()`.

- **Trạng thái**: các thao tác này yêu cầu một lượng lớn trạng thái, thường tỷ lệ thuận với số phần tử trong chuỗi. Một số ví dụ bao gồm tất cả các biến thể của `sorted()`, `distinct()` hoặc `chunked()`.

Chúng tôi cũng có hai loại hoạt động, tùy thuộc vào việc chúng tạo ra một chuỗi mới hay đã cần tính kết quả:

- **Trung cấp**: khi chúng ta áp dụng thao tác, kết quả trả về là một chuỗi khác và do đó bạn chưa cần tính kết quả từ các giá trị của chuỗi được tạo ra một cách lười biếng. Ví dụ: `map()` hoặc `filter()`.

- **Terminal**: nó cần các giá trị của luồng, do đó, nó sẽ process toàn bộ luồng để nhận kết quả. Một số ví dụ là `toList()` trả về một danh sách cụ thể hoặc `sum()` tính tổng các giá trị trong chuỗi.

### Xử lý trình tự

Khi làm việc với `Iterables` hoặc `Sequences`, điều quan trọng là chúng ta phải xác định xem mình đang làm việc lười biếng hay háo hức
#### 1. Iterable: háo hức

Khi chúng tôi làm việc với `Iterables`, chúng tôi thực hiện tất cả các thao tác trên tất cả các phần tử. 
Tức là chúng ta làm việc theo chiều ngang hoặc háo hức. 

> [!WARNING]
> Điều đó có nghĩa là mỗi thao tác đều được thực hiện trên từng phần tử ngay cả khi chúng không cần thiết sau đó.
> Ở mỗi bước, một collection mới được tạo. 

> [!TIP]
> Chúng tôi sử dụng điều đó khi làm việc với các danh sách nhỏ hơn hoặc khi chúng tôi không có nhiều thao tác được xâu chuỗi.

```kotlin
val withIterator = (1..10)
    .filter { print("Filter: $it, "); it % 2 == 0 } // filter out the odd numbers
    .map { print("Mapping: $it, "); it * 2 } // multiply the remaining numbers by 2
    .take(3) // take the first 3 numbers
println()

// Filter: 1, Filter: 2, Filter: 3, Filter: 4, Filter: 5, Filter: 6, Filter: 7, Filter: 8, Filter: 9, Filter: 10,
// Mapping: 2, Mapping: 4, Mapping: 6, Mapping: 8, Mapping: 10,
// Take: 4, Take: 8, Take: 12,

println(withIterator) // [4, 8, 12]
```

Trong ví dụ này, chúng tôi đã lọc tất cả các phần tử để chỉ lấy các số chẵn và nhận được collection mới với các phần tử được lọc. 
Sau đó, chúng tôi ánh xạ collection mới bằng cách nhân mỗi phần tử với 2.
Cuối cùng, chúng ta lấy 3 số đầu tiên. Do đó, **chúng tôi đã thực hiện tổng cộng 10 thao tác lọc, 5 thao tác ánh xạ và 3 thao tác lấy. Tức là có tổng cộng 18 thao tác.**

#### 2. Trình tự: lười biếng

Khi chúng ta làm việc với trình tự, các phương thức chỉ được gọi khi xây dựng danh sách kết quả. 
Tức là chúng ta làm việc theo chiều dọc hoặc lười biếng. 

> [!NOTE]
> Chúng tôi thực hiện từng thao tác sau khi thao tác đầu cuối được gọi. 
> Toàn bộ chuỗi thao tác trên từng phần tử đều được xử lý. 
Không có bộ sưu tập trung gian nào liên quan.

> [!TIP]
> Điều đó phù hợp với các bộ sưu tập có nhiều phần tử hoặc nơi chúng tôi thực hiện nhiều thao tác xâu chuỗi.

```kotlin
val withSequence = (1..10).asSequence()
    .filter { print("Filter: $it, "); it % 2 == 0 } // filter out the odd numbers
    .map { print("Mapping: $it, "); it * 2 } // multiply the remaining numbers by 2
    .take(3) // take the first 3 numbers
    .toList() // convert the sequence into a list
println()

// Filter: 1,
// Filter: 2, Mapping: 2, Take: 4
// Filter: 3, 
// Filter: 4, Mapping: 4, Take: 8
// Filter: 5,
// Filter: 6, Mapping: 6, Take: 12

println(withSequence) // [4, 8, 12]
```
Trong ví dụ này, chúng tôi lấy các mục theo từng phần tử và thực hiện tất cả các thao tác (lọc, ánh xạ và lấy) trên từng phần tử trong số chúng, từng phần một. 
Vì vậy, chúng tôi đã thực hiện tổng cộng 6 thao tác lọc, 3 thao tác ánh xạ và 3 thao tác lấy. Tức là có tổng cộng 12 thao tác.