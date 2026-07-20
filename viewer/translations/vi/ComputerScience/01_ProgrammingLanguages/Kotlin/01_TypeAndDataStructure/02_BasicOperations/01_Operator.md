# Nhà điều hành

## Toán tử một ngôi số học

Toán tử một ngôi là các toán tử hoạt động trên một toán hạng duy nhất.
chẳng hạn như tăng (`++`), giảm (`--`), phủ định (`-`) hoặc không logic (`!`)

- Một dấu cộng đơn nhất chỉ cho bạn một giá trị. Nó là một toán tử tùy chọn, vì vậy bạn bỏ qua nó trong thực tế:
```kotlin
println(+5) // prints 5
println(+(-5)) // prints -5
```

Giải thích mã
- Dấu trừ một ngôi phủ định một giá trị hoặc biểu thức:
```kotlin
println(-8)  // prints -8
println(-(100 + 4)) // prints -104
```
Giải thích mã
Cả hai đều **có mức độ ưu tiên cao hơn** so với toán tử nhân và chia.



## Thứ tự ưu tiên số học


Hãy xem thứ tự ưu tiên của các toán tử số học, bao gồm cả dấu ngoặc đơn. Danh sách được sắp xếp từ mức độ ưu tiên cao nhất đến thấp nhất.

1. Dấu ngoặc đơn;
2. Cộng/trừ một đơn vị;
3. Nhân, chia và mô đun;
4. Phép cộng và phép trừ.

## Thứ tự ưu tiên của toán tử tăng và giảm

Một số thao tác được ưu tiên hơn các thao tác khác, nghĩa là chúng được thực hiện trước.
Cần tính đến mức độ ưu tiên của các phép toán khi thực hiện một tập hợp các biểu thức số học

1. Dấu ngoặc đơn ( `(expr)` );
2. Tăng/giảm hậu tố ( `expr++`, `expr--`);
3. Cộng/trừ đơn nguyên, tăng/giảm tiền tố ( `-expr`, `++expr`, `--expr` );
4. Nhân, chia và mô đun ( `*`, `/`, `%` );
5. Phép cộng và phép trừ ( `+`, `-` );
6. Thao tác gán ( `=`, `+=`, `-=`, `*=`, `/=`, `%=` ).

## Phạm vi

Hãy tưởng tượng một tình huống mà bạn cần kiểm tra xem biến số nguyên `c` có lớn hơn hoặc bằng `a` và nhỏ hơn hoặc bằng `b` hay không

```kotlin
val within = a <= c && c <= b
```

Mã này hoạt động tốt. Tuy nhiên, Kotlin cung cấp một cách thuận tiện hơn để thực hiện điều tương tự bằng cách sử dụng **phạm vi**:

```kotlin
val within = c in a..b
```

Ở đây, `a..b` là một dãy số từ `a` đến `b` (bao gồm cả hai giá trị viền), `in` là một từ khóa đặc biệt được sử dụng để kiểm tra xem một giá trị có nằm trong một phạm vi hay không. Đây là **phạm vi kết thúc**.

Ngoài ra, chúng tôi có một phạm vi mở: `a..<b` là một phạm vi số từ `a` cho đến `b` (không bao gồm giá trị đường viền, `b`).

Nếu bạn cần kiểm tra xem một giá trị có nằm trong phạm vi hay không, chỉ cần thêm `!` (không phải) trước `in`.

```kotlin
val notWithin = 100 !in 10..99 // true
```
Bạn có thể gán một phạm vi cho một biến và sử dụng nó sau.
```kotlin
val range = 100..200
println(300 in range) // false
```

