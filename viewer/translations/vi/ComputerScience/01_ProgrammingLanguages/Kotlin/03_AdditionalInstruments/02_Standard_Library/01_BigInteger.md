#BigInteger

Như bạn có thể nhớ, các kiểu số nguyên nguyên thủy tiêu chuẩn không thể lưu trữ các số cực lớn. Không thể gán một số lớn như vậy cho một biến thuộc loại `Int` (hoặc thậm chí `Long`):

```kotlin
val y: Int = 62957291795228763406253098 // compilation error: The value is out of range
```

Đây cũng là lý do tại sao các thao tác với số đôi khi có thể dẫn đến **tràn**

Thật may mắn cho chúng ta, Thư viện lớp Java cung cấp một lớp có tên `BigInteger` để xử lý các số rất lớn (cả dương và âm). Kích thước của một số được lưu trữ chỉ bị giới hạn bởi dung lượng bộ nhớ khả dụng. Vì vậy, khi bạn sử dụng môi trường Kotlin/JVM, bạn có thể sử dụng `BigIntegers`.

> [!IMPORTANT]
> Lớp `BigInteger` là **immutable** có nghĩa là các hàm và toán tử của lớp trả về các phiên bản mới thay vì thay đổi các phiên bản hiện có.

> [!TIP]
> Mặc dù loại này có thể lưu trữ bất kỳ số nguyên nào, kể cả số nhỏ, nhưng bạn không nên sử dụng `BigInteger` trừ khi thực sự cần thiết. Luôn luôn có một hiệu suất đạt được liên quan đến việc sử dụng nó. Các thao tác `BigInteger` chậm hơn so với các thao tác trên các loại số nguyên tích hợp.

## Chức năng của BigInteger

Hàm `divideAndRemainder` trả về một mảng gồm hai số: kết quả của phép chia số nguyên và số dư:

```kotlin
val (result, remainder) = oneHundredTen.divideAndRemainder(nine) // 12 and 2
```
Lớp này cũng cung cấp các hàm để thực hiện các phép toán phức tạp hơn. Hàm `abs` trả về một `BigInteger` mới có giá trị là giá trị tuyệt đối của `BigInteger` này:
```kotlin
val number = BigInteger("-8")
println(number.abs()) // 8
```

Hàm `gcd` trả về **ước chung lớn nhất** của hai số.

```kotlin
val eight = BigInteger.valueOf(8)
val six = BigInteger.valueOf(6)
println(eight.gcd(six)) // 2
```