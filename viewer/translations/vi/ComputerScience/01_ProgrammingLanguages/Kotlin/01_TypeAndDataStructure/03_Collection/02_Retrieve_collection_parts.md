# Truy xuất các bộ phận collection

## Lát cắt

Cắt lát là một thao tác cơ bản: nó trả về một loạt các mục từ collection dựa trên chỉ mục của chúng.

```kotlin
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // retrieve items from 1 to 5 using slice and range
    println(list.slice(0..4)) // [1, 2, 3, 4, 5]
```

## Lấy và thả
Bạn có thể chỉ ra số lượng phần tử cần trả về từ collection bằng cách sử dụng nhóm phương thức "lấy":

- `take()`: trả về collection có n phần tử từ collection ban đầu, bắt đầu từ phần tử đầu tiên. Nếu được gọi với số lớn hơn kích thước collection, toàn bộ collection sẽ được trả về.

- `takeLast()`: trả về collection có n phần tử từ collection ban đầu, bắt đầu từ phần tử cuối cùng. Nếu được gọi với số lớn hơn kích thước collection, toàn bộ collection sẽ được trả về.

- `takeWhile()`: trả về collection có các phần tử thỏa mãn vị từ, bắt đầu từ phần tử đầu tiên. Nếu không có phần tử nào khớp với vị từ thì kết quả là collection trống.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // take 5 elements from the first
    println(list.take(5)) // [1, 2, 3, 4, 5]
    // take 5 elements from the last
    println(list.takeLast(5)) // [6, 7, 8, 9, 10]
    // take while the condition is true < 5
    println(list.takeWhile { it < 5 }) // [1, 2, 3, 4]
    // take last while the condition is true > 5
    println(list.takeLastWhile { it > 5 }) // [6, 7, 8, 9, 10]
}
```

Đôi khi, chúng tôi chỉ muốn lấy một số phần tử cụ thể từ collection.

- `drop()`: trả về collection chứa tất cả các phần tử ngoại trừ n phần tử đầu tiên. Nếu được gọi với số lớn hơn kích thước collection, một danh sách trống sẽ được trả về.

- `dropLast()`: trả về collection chứa tất cả các phần tử ngoại trừ n phần tử cuối cùng. Nếu được gọi với số lớn hơn kích thước collection, một danh sách trống sẽ được trả về.

- `dropWhile()`: trả về collection chứa tất cả các phần tử ngoại trừ phần tử đầu tiên thỏa mãn vị từ đã cho. Nếu không có phần tử nào khớp với vị từ thì kết quả là collection ban đầu; nếu tất cả chúng khớp với vị ngữ thì một danh sách trống sẽ được trả về.

- `dropLastWhile()`: trả về collection chứa tất cả các phần tử ngoại trừ phần tử cuối cùng thỏa mãn vị từ đã cho. Nếu không có phần tử nào khớp với vị từ thì kết quả là collection ban đầu; nếu tất cả chúng khớp với vị ngữ thì một danh sách trống sẽ được trả về.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // drop 5 elements from the first
    println(list.drop(5)) // [6, 7, 8, 9, 10]
    // drop 5 elements from the last
    println(list.dropLast(5)) // [1, 2, 3, 4, 5]
    // drop while the condition is true < 5
    println(list.dropWhile { it < 5 }) // [5, 6, 7, 8, 9, 10]
    // drop last while the condition is true > 5
    println(list.dropLastWhile { it > 5 }) // [1, 2, 3, 4, 5]
}
```

## Chunk

Rất thường xuyên, chúng ta cần chia collection thành các phần có kích thước cố định.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // chunked into 3
    println(list.chunked(3)) // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
    // chunked into 3, the result transformed by applying a lambda with sum
    println(list.chunked(3) { it.sum() }) // [6, 15, 24, 10]
    // chunked into 3, the result transformed into a string
    println(list.chunked(3) { it.joinToString() }) // ["1, 2, 3", "4, 5, 6", "7, 8, 9", "10"] => print [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

## Có cửa sổ

Bạn cũng có thể nhận được tất cả các phạm vi có thể có của các phần tử collection có kích thước xác định. 

Chúng tôi sử dụng các tham số sau:

- `size`: là số phần tử trong mỗi cửa sổ, tức là kích thước của cửa sổ.

- `step`: là số phần tử chúng ta cần cuộn giữa các cửa sổ, mặc định là 1. Nó biểu thị khoảng cách giữa các phần tử đầu tiên của các cửa sổ liên tiếp.

- `partialWindows`: nó bao gồm các cửa sổ có kích thước nhỏ hơn ở cuối collection nếu bạn không thể tạo một cửa sổ có kích thước được chỉ định; theo mặc định, nó là `false`. Nó cho biết bạn có muốn giữ một phần cửa sổ ở cuối hay không.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // windows of 3, default step is 1
    println(list.windowed(3))
    // [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 6, 7], [6, 7, 8], [7, 8, 9], [8, 9, 10]]
    // windows of 3, step 3
    println(list.windowed(3, 3)) // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    // windows of 3, step 4, partial windows is false
    println(list.windowed(3, 4, false)) // [[1, 2, 3], [5, 6, 7]]
    // windows of 3, step 4, partial windows is true
    println(list.windowed(3, 4, true)) // [[1, 2, 3], [5, 6, 7], [9, 10]]
    // windows of 3, step 4, partial windows is true, the result is transformed with sum
    println(list.windowed(3, 4, true) { it.sum() }) // [6, 18, 19]  
}
```

