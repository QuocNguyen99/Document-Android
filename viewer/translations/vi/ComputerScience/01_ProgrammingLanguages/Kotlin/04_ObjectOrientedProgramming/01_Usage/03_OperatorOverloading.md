#Operator overloading

Kotlin cho phép bạn xác định toán tử của riêng mình trên một số loại nhất định. Các toán tử này có biểu diễn ký hiệu được xác định trước, như "+" hoặc "+=" và mức độ ưu tiên. Để xác định toán tử tùy chỉnh, chúng tôi phải đáp ứng các yêu cầu sau:
- Cung cấp hàm thành viên hoặc hàm mở rộng có tên cụ thể cho loại tương ứng.
- Kiểu này trở thành kiểu vế trái cho các phép toán nhị phân và là kiểu đối số cho phép toán một ngôi.

Để tùy chỉnh một toán tử, chúng ta nên đánh dấu hàm bằng công cụ sửa đổi `operator`.

```kotlin
operator fun String.unaryMinus() = this.reversed()

fun main() {
    val name = "Kotlin"
    println(-name) // niltoK
}
```

Ngoài ra, bạn có thể kết hợp toán tử với công cụ sửa đổi infix.

```kotlin
infix operator fun String.times(n: Int) = this.repeat(n)

fun main() {
    val s = "Kotlin"
    println(s * 3) //KotlinKotlinKotlin
}
```

## Các phép toán đơn nhất

Đây là những hàm thường không có tham số.

| Biểu hiện | Đã dịch sang |
|----------||------------------|
| +a | a.unaryPlus() |
| -a | a.unaryMinus() |
| !a | a.not() |
| a++ | a.inc() |
| một-- | a.dec() |

## Hoạt động nhị phân
Đây là những hàm thường có hai tham số.

| Biểu hiện | Đã dịch sang |
|----------||------------------|
| a + b | a.plus(b) |
| a - b | a.trừ(b) |
| a*b | a.times(b) |
| a/b | a.div(b) |
| một % b | a.rem(b) |
| a..b | a.rangeTo(b) |


| Biểu hiện | Đã dịch sang |
|----------||------------------|
| a trong b | b.contains(a) |
| a !in b | !b.contains(a) |

## Toán tử truy cập được lập chỉ mục

Dấu ngoặc vuông `[]` được dịch sang các cuộc gọi tới `get` và `set`.

| Biểu hiện | Đã dịch sang |
|-------------------|--------------------------|
| một [tôi] | a.get(i) |
| a[i, j] | a.get(i, j) |
| a[i_1, ..., i_n] | a.get(i_1, ..., i_n) |
| a[i] = b | a.set(i, b) |
| a[i, j] = b | a.set(i, j, b) |
| a[i_1, ..., i_n] = b | a.set(i_1, ..., i_n, b) |

## gọi toán tử

| Biểu hiện | Đã dịch sang |
|---|---|
| một() | a.invoke() |
| một (tôi) | a.invoke(i) |
| một(i,j) | a.invoke(i, j) |
| a(i_1, ..., i_n) | a.invoke(i_1, ..., i_n) |

## Bài tập tăng cường

| Biểu hiện | Đã dịch sang |
|---|---|
| a += b | a.plusAssign(b) |
| a -= b | a.minusAssign(b) |
| a *= b | a.timesAssign(b) |
| a /= b | a.divAssign(b) |
| một %= b | a.remAssign(b) |

### Toán tử đẳng thức và bất đẳng thức

| Biểu hiện | Đã dịch sang |
|---|---|
| a == b | a?.equals(b) ?: (b === null) |
| a != b | !(a?.equals(b) ?: (b === null)) |

### Toán tử so sánh

| Biểu hiện | Đã dịch sang |
|---|---|
| a > b | a.compareTo(b) > 0 |
| một < b | a.compareTo(b) < 0 |
| a >= b | a.compareTo(b) >= 0 |
| một <= b | a.compareTo(b) <= 0 |


Ví dụ để ghi đè hoạt động mặc định:

```kotlin
class Counter(var value: Int) {
    operator fun timesAssign(n: Int) {
        value = value * 2 * n
    }
}

fun main() {
    var c = Counter(5)
    c *= 3
    println(c.value)  // 30
}
```