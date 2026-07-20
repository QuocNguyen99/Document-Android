# Hoạt động theo chiều bit và dịch chuyển bit

Như bạn đã biết, trong hầu hết các trường hợp, máy tính sử dụng định dạng nhị phân của biểu diễn số. Ở định dạng này, mỗi chữ số của một số có thể là 0 hoặc 1. Ví dụ: **giá trị thập phân** 15 là 1111 ở định dạng nhị phân. 

Ngôn ngữ Kotlin cung cấp một số toán tử để thao tác các bit riêng lẻ của số nguyên. Các thao tác này là những thao tác nhanh chóng và đơn giản được bộ xử lý hỗ trợ trực tiếp. 

**Chúng đặc biệt quan trọng trong lập trình cấp thấp**


## Toán tử bitwise

- `inv()` là toán tử một ngôi đảo ngược các bit ở định dạng nhị phân của số, biến mọi `0` thành `1` và mọi `1` thành `0`. **Nó cũng thay đổi bit dấu của giá trị.**
  
- `or` là toán tử nhị phân thực hiện OR theo bit theo bit: chữ số kết quả là `1` nếu có ít nhất một chữ số toán hạng là `1`, nếu không thì là `0`.

- `and` là toán tử nhị phân thực hiện AND theo bit: chữ số kết quả là `1` nếu cả hai chữ số toán hạng là `1`, ngược lại là `0`.

- `xor` là toán tử nhị phân thực hiện XOR theo bit: chữ số kết quả là `1` nếu có chính xác một toán hạng là `1`, ngược lại là `0`.

> [!NOTE]
> Các toán tử được liệt kê có thể được áp dụng cho cả toán hạng số nguyên và toán hạng boolean. Nếu cả hai toán hạng đều là số nguyên thì các phép toán theo bit sẽ được thực hiện. Nếu cả hai toán hạng đều là boolean thì các phép toán logic tương ứng sẽ được thực hiện (ngoại trừ ~).

Giả sử chúng ta có hai số nguyên: `15` và `10`. Số đầu tiên có biểu diễn nhị phân là 1111, số thứ hai là 1010. Lưu ý, chúng tôi sẽ bỏ qua các số 0 không quan trọng trong số để cho ngắn gọn. Ví dụ bên dưới minh họa việc sử dụng các toán tử `and`, `or` và `xor`:


```kotlin
val first = 15  // binary format 1111
val second = 10 // binary format 1010

val bitwiseAnd = first and second // 1111 & 1010 = 1010, the result is 10
val bitwiseOr = first or second  // 1111 | 1010 = 1111, the result is 15
val bitwiseXor = first xor second // 1111 ^ 1010 = 0101, the result is 5
```

Và đây là hai ví dụ về sự đảo ngược:

```kotlin
val first = 35  // binary format 0..00100011
val second = -35 // binary format 1..11011101

val inverseFirst = first.inv() // ~ 0..00100011 = 1..11011100, the result is -36
val inverseSecond = second.inv()  // ~ 1..11011101 = 0..00100010, the result is 34
```

## Tại sao chúng ta cần những hoạt động này?

Ví dụ: bạn có thể kiểm tra xem một số có chia hết cho 2 hay không bằng cách sử dụng `and`:

```kotlin
val a = 5
val b = 4

val bitwiseAndA = a and 1 // 101 & 001 = 001, the result is 1 =>
// a is divided by 2 with a remainder equal to one

val bitwiseAndB = b and 1 // 100 & 001 = 000, the result is 0 => 
// b is divided by 2 without a remainder
```

Bit ít quan trọng nhất (Bit ít quan trọng nhất - LSB) trong số nhị phân xác định số đó là số lẻ hay số chẵn:

- Nếu LSB là `1` thì số là `odd`.
- Nếu LSB là `0` thì số là `even`.

## Toán tử dịch chuyển bit

Ngoài các toán tử theo bit, Kotlin còn cung cấp các toán tử **bit-shift** có thể được sử dụng để dịch chuyển các bit của một số nguyên từ vị trí này sang vị trí khác.

- `shl` dịch chuyển biểu diễn bit sang trái theo một số bit nhất định được chỉ định và các bit 0 được dịch chuyển sang các vị trí bậc thấp;

- `shr` dịch chuyển biểu diễn bit sang phải theo một số bit nhất định được chỉ định. Nó lấp đầy chỗ trống bằng giá trị của bit dấu.
- `ushr` là toán tử dịch chuyển bit không dấu, dịch chuyển mẫu bit sang phải một số bit nhất định được chỉ định. Nó gần giống như `shr`, nhưng các giá trị dịch chuyển được lấp đầy bằng số không. Kết quả của toán tử `ushr` luôn dương.

Ví dụ sau minh họa cách thực hiện phép nhân và chia nhanh cho hai bằng cách sử dụng toán tử dịch chuyển bit:
```kotlin
var value = 25   // binary: 0001 1001, decimal: 25

value = value shl 1 // binary: 0011 0010, decimal: 50
value = value shl 2 // binary: 1100 1000, decimal: 200

var anotherVal = 14   // binary: 1110, decimal: 14
anotherVal = anotherVal shr 1 // binary: 0111, decimal: 7
```

Như bạn có thể thấy, kết quả của toán tử dịch trái shl tương đương với phép nhân cho hai và kết quả của toán tử dịch phải tương đương với phép chia cho hai.

Hãy khái quát hóa: **khi chúng tôi sử dụng toán tử dịch chuyển bit có dấu, chúng tôi thực hiện phép nhân hoặc chia toán hạng bên trái với 2 theo lũy thừa của toán hạng bên phải.**

```kotlin
var newVal = 25

newVal = newVal shl 1 // 25 * 2^1 = 50
newVal = newVal shl 3 // 50 * 2^3 = 400
newVal = newVal shr 2 // 400 / 2^2 = 100
```

Kể từ Kotlin 1.6, bạn có thể sử dụng `rotateLeft()` và `rotateRight()` để dịch chuyển một số bit nhất định được chỉ định:

```kotlin
val a = 4

val shiftRightA = a.rotateRight(1) // 0..0100.rotateRight(1) = 0..0010, the result is 2
val shiftLeftA = a.rotateLeft(1) // 0..0100.rotateLeft(1) = 0..1000, the result is 8

val b = 3

val shiftLeftB = b.rotateLeft(1) // 0..0011.rotateLeft(1) = 0..0110, the result is 6
val shiftRightB = b.rotateRight(1) // 0..0011.rotateRight(1) = 1..0001, the result is -2147483647
```

`rotateRight()` đã thay đổi giá trị của chúng tôi một cách kỳ lạ. Có chuyện gì vậy? Điều này xảy ra do loại `int` đại diện cho giá trị số nguyên 32 bit, do đó, khi bạn dịch chuyển bit cuối cùng của mình bằng `rotateRight()`, bit trên vị trí `31` sẽ là `1` và bit trên vị trí `0` sẽ là `1`.

## Mức độ ưu tiên của các phép toán theo bit và dịch chuyển bit

Giống như các toán tử số học, các toán tử dịch chuyển bit và bitwise tuân theo cái gọi là quy tắc ưu tiên, xác định thứ tự thực hiện và nhóm các phép toán trong một biểu thức. Các thao tác có độ ưu tiên cao hơn sẽ được thực hiện trước các thao tác có độ ưu tiên thấp hơn. Hãy xem danh sách các hoạt động theo thứ tự ưu tiên giảm dần:

1. Dấu ngoặc đơn ( `(expr)` );

2. Tăng/giảm hậu tố (`expr++`, `expr--`);

3. Cộng/trừ đơn nguyên, tăng/giảm tiền tố (`-expr`, `++expr`, `--expr`);

4. Nhân, chia và mô đun ( `*`, `/`, `%` );

5. Phép cộng và phép trừ ( `+`, `-` );

6. Hoạt động phân công (`=`, `+=`, `-=`, `*=`, `/=`, `%=`);

7. Toán tử dịch chuyển bit và bitwise (`and`, `or`, `xor`, `shr`, `shl`, `ushr`).

Bản thân `and`, `or`, `xor`, `shr`, `shl`, `ushr` không phải là các toán tử và thứ tự thực thi của chúng trong biểu thức là từ trái sang phải.

> [!NOTE]
> Khi các toán tử có mức độ ưu tiên bằng nhau, một quy tắc khác sẽ được sử dụng để xác định xem việc đánh giá có nên được thực hiện từ trái sang phải hay ngược lại hay không. Nó được gọi là sự kết hợp.

