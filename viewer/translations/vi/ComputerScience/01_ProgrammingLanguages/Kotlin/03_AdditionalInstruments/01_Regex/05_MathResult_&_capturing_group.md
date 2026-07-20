# MatchResult và các nhóm chụp

## Lớp MatchResult

Lớp này cung cấp cho bạn thông tin chi tiết về kết quả của thao tác so khớp. Ví dụ: nếu bạn tìm thấy kết quả khớp trong một chuỗi có hàm `find()`, `matchAt()`, `matchEntire()` và `findAll()`, nó sẽ cung cấp cho bạn một đối tượng `MatchResult` hoặc `null` nếu không khớp.


```kotlin
val regex: Regex = """a(\d+)b""".toRegex()
val input = "a123b a4bc"

val firstMatch: MatchResult? = regex.find(input)
```

Lớp `MatchResult` có các thuộc tính và phương thức sau:

- **giá trị**: Thuộc tính này chứa chuỗi regular expression khớp. Đó là `String` hiển thị toàn bộ trận đấu.

```kotlin
println(firstMatch?.value) // prints: a123b
```

- **phạm vi**: Thuộc tính này cho bạn biết phạm vi chỉ số nơi trận đấu diễn ra. Đó là một phiên bản `IntRange`, là một phạm vi số nguyên.

```kotlin
println(firstMatch?.range) // prints: 0..4
```
- **nhóm**: Thuộc tính này cung cấp cho bạn `MatchGroupCollection`, giống như một bản đồ và cho phép bạn truy cập các nhóm đã nắm bắt. Phần tử đầu tiên trong collection là toàn bộ trận đấu và các phần tử sau đó hiển thị từng nhóm đã bắt được. Mỗi nhóm là một MatchGroup với `value` cho chuỗi trùng khớp và `range` cho phạm vi chỉ số.

```kotlin
println(firstMatch?.groups)
// prints: [MatchGroup(value=a123b, range=0..4), MatchGroup(value=123, range=1..3)]
```

- **groupValues**: Thuộc tính này cung cấp cho bạn danh sách các chuỗi. **Phần đầu tiên là toàn bộ trận đấu, phần còn lại là các nhóm đã bắt được**. Nếu một nhóm không thu được gì (ví dụ: nếu nhóm này là tùy chọn và không xuất hiện trong dữ liệu đầu vào), thì giá trị của nhóm đó trong danh sách là một chuỗi trống.

```kotlin
println(firstMatch?.groupValues) // prints: [a123b, 123]
```

- **bị phá hủy**: Thuộc tính này cho phép bạn giải nén các giá trị nhóm. Nó trả về một đối tượng `Destructured`, có các hàm thành phần tương ứng với các giá trị nhóm. Bạn có thể sử dụng chúng khi làm việc với các giá trị nhóm.

> [!CAUTION]
> Số lượng biến ở phía bên trái của bài tập phải khớp với số lượng nhóm bắt giữ trong mẫu biểu thức chính quy.

Ví dụ:
```kotlin
val regex = """(\d{4})-(\d{2})-(\d{2})""".toRegex()
val input = "2024-01-01"

val secondMatch = regex.find(input)!!

val (year, month, day) = secondMatch.destructured

println("Year: $year")   // Year: 2024
println("Month: $month") // Month: 01
println("Day: $day")     // Day: 01
```

- **next()**: Sử dụng công cụ này để tìm kết quả khớp tiếp theo sau kết quả hiện tại trong đầu vào. Nếu không còn kết quả khớp nào nữa, nó sẽ trả về `null`.

sự khác biệt giữa `findAll()` với lớp Regex và `next()` với lớp `MatchResult`?. Mặc dù `findAll()` cung cấp cho bạn tất cả các kết quả phù hợp để xem xét, nhưng phương pháp `next()` cho phép bạn kiểm soát process tốt hơn, điều này có thể tiết kiệm bộ nhớ và công sức tính toán.

```kotlin
println(firstMatch?.next()?.groupValues) // prints: [a4b, 4]
```

## Ví dụ thực tế

Chúng ta sẽ viết một chương trình tìm tất cả các số trong một chuỗi và tăng chúng lên 10%, làm tròn kết quả đến hai chữ số thập phân:

```kotlin
fun main() {
    // Create a regular expression to match numbers with optional decimal point
    val regex = Regex("""\d+(\.\d+)?""")

    // Define a string with number information
    val input = "The price is $12.99 for the first item, and $9.99 for each additional item."

    // Create a string builder to store the modified string
    val output = StringBuilder()

    // Find the first match in the input string
    var match = regex.find(input)

    // Keep track of the last index of the previous match
    var lastIndex = 0

    // Loop until there are no more matches
    while (match != null) {
        // Append the substring from the input string before the current match
        output.append(input.substring(lastIndex, match.range.first))

        // Convert the matched value to a double and multiply it by 1.1
        val number = match.value.toDouble()
        val increasedNumber = number * 1.1

        // Round the increased number to two decimal places and append it to the output
        output.append("%.2f".format(increasedNumber))

        // Update the last index to the end of the current match
        lastIndex = match.range.last + 1

        // Find the next match using the next() method
        match = match.next()
    }

    // Append the remaining substring from the input string after the last match
    output.append(input.substring(lastIndex))

    // Print the output string
    println(output)
}
```

## Nhóm không bắt được

Thông thường, mọi nhóm trong regular expression đều là **nhóm bắt giữ**, nghĩa là bạn có thể truy cập từng nhóm riêng biệt sau một trận đấu bằng các phương pháp như `groups` và `groupValues`. 

Nhưng các biểu thức chính quy cũng cho phép bạn quyết định nhóm nào cần thu thập bằng cách sử dụng bộ định lượng `?` tùy chọn. Để bỏ qua việc thu thập nhóm này, hãy sử dụng cú pháp `(?:pattern)` để thông báo cho công cụ biểu thức chính quy phân nhóm mà không thu thập.

**Các nhóm không nắm bắt** rất hữu ích khi bạn cần cấu trúc các mẫu của mình với các nhóm nhưng không muốn nắm bắt nội dung của chúng.


hãy xem biểu thức chính quy từ bài thực hành trước đây của chúng ta:

```kotlin
val regex = Regex("""\d+(\.\d+)?""")
// Groups: [12.99, .99]
// Groups: [9.99, .99]
```
Bằng cách thay đổi mẫu biểu thức chính quy của chúng tôi thành:
```kotlin
val regex = Regex("""\d+(?:\.\d+)?""")
//Groups: [12.99]
// Groups: [9.99]
```

Đầu ra này chỉ bao gồm kết quả trùng khớp đầy đủ và loại bỏ nhóm đã chụp không cần thiết.

## Nhóm bắt giữ được đặt tên

**Nhóm thu thập được đặt tên** làm cho mẫu biểu thức chính quy của bạn dễ đọc và quản lý hơn, giúp việc tham khảo các phần của mẫu trở nên đơn giản hơn.

Để tạo một nhóm thu thập được đặt tên, bạn sử dụng cú pháp `(?<name>pattern)`, trong đó `name` là nhãn cho nhóm và `pattern` là chuỗi ký tự cần khớp.

Ví dụ:

```kotlin
val regex = """(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})""".toRegex()
val input = "2023-12-31"

val matchResult = regex.find(input)!!

println(matchResult.groups["year"]?.value)   // prints: 2023
println(matchResult.groups["month"]?.value)  // prints: 12
println(matchResult.groups["day"]?.value)    // prints: 31
```



