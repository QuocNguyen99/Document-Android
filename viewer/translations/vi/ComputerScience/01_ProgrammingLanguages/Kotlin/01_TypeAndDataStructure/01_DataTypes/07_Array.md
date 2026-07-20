# Mảng

Bạn có thể coi một mảng là **a collection gồm các phần tử cùng loại**. Tất cả các phần tử được lưu trữ trong bộ nhớ một cách tuần tự.

collection cung cấp một tên cho tất cả các phần tử. Khi một mảng được tạo, **không thể thay đổi mảng** và Bạn không thể thay đổi kích thước của mảng sau khi nó được tạo. Tuy nhiên, bạn có thể sửa đổi một phần tử được lưu trữ bất kỳ lúc nào.

## Tạo một mảng với các phần tử được chỉ định

Kotlin có thể xử lý nhiều loại mảng: `IntArray`, `LongArray`, `DoubleArray`, `FloatArray`, `CharArray`, `ShortArray`, `ByteArray`, `BooleanArray`. Lưu ý rằng Kotlin không có loại `StringArray` mặc định.
Bạn có thể lưu trữ `Strings` theo mảng.

Để tạo một mảng có kiểu xác định, chúng ta cần gọi một hàm đặc biệt và truyền tất cả các phần tử để lưu trữ chúng cùng nhau:

- `intArrayOf` tạo `IntArray`;
- `charArrayOf` tạo `CharArray`;
- `doubleArrayOf` tạo `DoubleArray`;
- vân vân.

## Tạo một mảng có kích thước xác định

Để tạo một mảng có kích thước nhất định, chúng ta cần viết kiểu của nó và chuyển nó sau tên kiểu trong dấu ngoặc tròn (hàm tạo):
```kotlin
val numbers = IntArray(5) // an array of 5 integer numbers
println(numbers.joinToString())
```

Chúng được điền bởi các giá trị mặc định của các loại tương ứng (`0` cho các loại số).
Bạn không thể thay đổi kích thước của mảng nhưng bạn có thể sửa đổi các phần tử.

Một tùy chọn khác là sử dụng hàm tạo mảng lấy kích thước mảng và hàm trả về giá trị của các phần tử mảng cho trước chỉ mục của nó hoặc một giá trị không đổi hoặc sử dụng kết hợp phương thức scope function áp dụng và phương thức `fill() ` để lấp đầy một mảng bằng phần tử đã chỉ định.

```kotlin
val numbers = IntArray(10) { i -> i + 1 }
println("Numbers: ${numbers.joinToString()}") 
// 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
val onlyOne = IntArray(10) { 1 }
println("Only 1: ${onlyOne.joinToString()}") 
// 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
val onlyMinusOne = IntArray(10).apply { fill(-1) }
println("Only -1: ${onlyMinusOne.joinToString()}") 
// -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
```
## So sánh mảng

Để so sánh hai mảng, hãy gọi hàm `contentEquals()` của một mảng và truyền một mảng khác làm đối số.
các toán tử `==` và `!=` **không so sánh nội dung của mảng**, chúng chỉ so sánh các biến trỏ đến cùng một đối tượng

## Mảng đa chiều

Nó giúp dễ dàng biểu diễn những thứ có nhiều chiều: ví dụ: các vật thể 3D có chiều dài, chiều cao và chiều rộng. 
Vũ trụ mà chúng ta đang sống có thể được mô tả bằng bốn phép đo, thời gian là chiều thứ tư, nên nó là 4D. Các cấp độ cao hơn như 5D, v.v.

### Tạo mảng 2D các loại khác nhau

Mảng lồng nhau có thể có nhiều loại khác nhau. Ví dụ: bạn có thể tạo một mảng hai chiều lưu trữ cả mảng Int và String:

```kotlin
val arrayOfString2D = arrayOf(
    arrayOf("Practice", "makes", "perfect"),
    arrayOf(1, 2)
)
```