# Bộ, phạm vi và sự thay thế


## Bộ ký tự

Mỗi bộ bao gồm nhiều ký tự nhưng tương ứng với một ký tự duy nhất trong chuỗi. Các bộ được đặt trong dấu ngoặc vuông `[]`. Ví dụ: bộ `"[abc]"` có nghĩa là một ký tự đơn `"a"`, `"b"` hoặc `"c"` có thể khớp với nó. Hãy xem ví dụ dưới đây:

```kotlin
val regex = Regex("[bcr]at") // it matches strings "bat", "cat", "rat", but not "fat"

regex.matches("rat") // true
regex.matches("fat") // false
```

Bạn có thể sử dụng bao nhiêu bộ tùy thích và kết hợp chúng với các ký tự thông thường. Có hai bộ trong ví dụ sau:

```kotlin
val pattern = "[ab]x[12]" // can match a or b followed by x followed by either 1 or 2
```

Mẫu này có thể được khớp thành công bởi các chuỗi sau:
```kotlin
"ax1", "ax2", "bx1", "bx2"
```

Trong khi đó, các chuỗi sau không khớp với mẫu:

```kotlin
"xa1", "aax1", "bx"
```


**Như bạn có thể thấy, thứ tự của các tập hợp trong biểu thức chính quy rất quan trọng. Mặt khác, thứ tự các ký tự trong bộ không quan trọng.**

## Phạm vi ký tự

Thay vào đó, chúng ta có thể chỉ định một phạm vi được chỉ định bởi ký hiệu dấu gạch nối `-`. Ký tự đứng trước dấu gạch nối biểu thị điểm bắt đầu của phạm vi; ký tự sau dấu gạch nối là ký tự cuối cùng nằm trong phạm vi. Chúng ta có thể đặt các ký tự vào một tập hợp dưới dạng một phạm vi nếu chúng ngay lập tức theo sau nhau trong bảng mã hóa ASCII/Unicode.

```kotlin
val anyDigitPattern = "[0-9]" // matches any digit from 0 to 9
```

Điều tương tự cũng áp dụng cho các phạm vi chữ cái, chẳng hạn như `"[a-z]"` hoặc `"[A-Z]"`. Các phạm vi này khớp với tất cả các chữ cái viết thường và viết hoa trong tiếng Latin tương ứng. Những mẫu này phân biệt chữ hoa chữ thường; đối với kết quả không phân biệt chữ hoa chữ thường, chúng ta có thể viết biểu thức chính quy sau:

```kotlin
val anyLetterPattern = "[a-zA-Z]" // matches any letter "a", "b", ..., "A", "B", ...
```

> [!WARNING]
> Lưu ý rằng mặc dù phạm vi [A-z] có giá trị về mặt kỹ thuật nhưng nó bao gồm các ký hiệu bổ sung được đặt giữa chữ hoa và chữ thường trong bảng ASCII.

> [!TIP]
> bạn có thể dễ dàng đặt nhiều phạm vi vào một bộ và trộn chúng với các ký tự riêng biệt theo bất kỳ thứ tự nào:

```kotlin
val anyLetterPattern = "[a-z!?.A-Z]" // matches any letter as well as "!", "?", and "."
```

## Loại trừ ký tự

Trong một số trường hợp, bạn có thể muốn xác định những ký tự nào không cần thiết. Sau đó, bạn có thể viết một bộ khớp với mọi thứ ngoại trừ các ký tự được đề cập trong đó. Để làm điều đó, chúng tôi viết ký tự mũ `^` là ký tự đầu tiên trong bộ.

```kotlin
val regex = "[^abc]".toRegex() // matches everything except "a", "b", and "c"

regex.matches("a") // false
regex.matches("b") // false
regex.matches("c") // false
regex.matches("d") // true
```
## Tránh các ký tự trong bộ


- **Ký tự chữ** bên trong bộ `[ ]` không cần thoát.
- Ví dụ: `[.?!]` chỉ khớp với `.`, `?` và `!`.

## 🔹 Xử lý các trường hợp đặc biệt:
- **Dấu nối (`-`)**: Đặt đầu tiên hoặc cuối cùng để khớp theo nghĩa đen.  
  - Ví dụ: `[-a-z]` (khớp dấu gạch nối + chữ thường), `[A-Z-]` (khớp dấu gạch nối + chữ in hoa).  
- **Dấu mũ (`^`)**: Chỉ cần thoát **nếu ở đầu** tập hợp.  
  - Ví dụ: `[^a-z^]` (khớp mọi thứ trừ chữ thường và `^`).  
- **Dấu ngoặc vuông (`[]`)**: Luôn thoát khỏi chúng (`\[ \]`) để khớp theo nghĩa đen.
  - Ví dụ: `val regex = Regex("[\\[\\]]") // matches "[" and "]"`

## Lựa chọn thay thế

Cho đến giờ, chúng ta đang nói về **ký tự đơn**. Tuy nhiên, cũng có một cách để khớp **các chuỗi dài hơn**. Thanh dọc `|` được sử dụng để khớp các chuỗi ký tự trước hoặc sau ký hiệu:

```kotlin
val regex = "yes|no|maybe".toRegex() // matches "yes", "no", or "maybe", but not "y" or "e"

regex.matches("no") // true
```

Nhìn chung, các phương án thay thế khá giống với các tập hợp: chúng mô tả nhiều phương án thay thế mà một phần cụ thể của mẫu có thể khớp. **Tuy nhiên, mặc dù các bộ chỉ có thể khớp với một ký tự duy nhất trong chuỗi, nhưng các phép thay thế được sử dụng để xác định các ký tự thay thế nhiều ký tự**.

