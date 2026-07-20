# bộ định lượng

Trong biểu thức chính quy, có một nhóm ký tự được gọi là bộ định lượng, xác định số lần một ký tự nhất định (hoặc một lớp ký tự) xuất hiện trong mẫu biểu thức chính quy. bộ định lượng là một trong những tính năng thiết yếu và quan trọng nhất của ngôn ngữ biểu thức chính quy, vì chúng cho phép một mẫu duy nhất khớp với các chuỗi khác nhau có độ dài khác nhau.

## Danh sách các bộ định lượng

Dưới đây là danh sách các bộ định lượng cần ghi nhớ:

- `+` khớp với một hoặc nhiều phiên bản của ký tự trước đó;
- `*` khớp với 0 hoặc nhiều phiên bản của ký tự trước đó;
- `{n}` khớp chính xác với n phiên bản của ký tự trước đó;
- `{n,m}` khớp với ít nhất n nhưng không quá m phiên bản của ký tự trước đó;
- `{n,}` khớp với ít nhất n phiên bản của ký tự trước đó;
- `{0,m}` khớp không quá m phiên bản của ký tự trước.

> [!NOTE]
> Lưu ý rằng còn có một bộ định lượng khác, ?, làm cho ký tự đứng trước là tùy chọn. Nó là viết tắt của {0,1}. Chúng tôi sẽ không xem xét định lượng này ở đây vì bạn đã biết nó rồi.

> [!CAUTION]
> Trong biểu thức chính quy, bộ định lượng phải luôn xuất hiện ngay sau ký tự, nhóm hoặc lớp ký tự mà chúng sửa đổi. Họ không thể đứng một mình hoặc bị đặt trước họ.  


### Bộ định lượng cộng

Dưới đây bạn có thể thấy cách chúng tôi sử dụng ký tự **plus**, ký tự này khớp với một hoặc nhiều lần xuất hiện của ký tự trước:

```kotlin
val regex = "ca+b".toRegex()

regex.matches("cab") // true
regex.matches("caaaaab") // true
regex.matches("cb") // false because it does not have at least one instance of 'a'
```

### Bộ định lượng dấu hoa thị

Ví dụ bên dưới minh họa cách sử dụng ký tự **dấu hoa thị**, ký tự này khớp với 0 hoặc nhiều lần xuất hiện của ký tự trước:

```kotlin
val regex = "A[0-3]*".toRegex()

regex.matches("A")  // true because the pattern matches zero or more occurrences
regex.matches("A0") // true
regex.matches("A000111222333") // true
```

### Chỉ định số lần lặp lại

Cả hai bộ định lượng trước đây đều có nhiều ứng dụng, nhưng chúng không cho phép bạn chỉ định số lần một ký tự có thể xuất hiện. May mắn thay, có một nhóm bộ định lượng cho phép chỉ định số lượng phiên bản trong dấu ngoặc nhọn: `{n}`, `{n,m}` và `{n,}`.

> [!CAUTION]
> Cần làm rõ một điều quan trọng: không được phép sử dụng khoảng trắng bên trong dấu ngoặc nhọn. Chỉ có thể có một hoặc hai số và tùy chọn dấu phẩy. Việc đặt khoảng trắng bên trong dấu ngoặc nhọn sẽ dẫn đến việc "vô hiệu hóa" bộ định lượng và kết quả là tạo ra một regular expression hoàn toàn khác.

khớp chính xác n phiên bản của ký tự trước bằng cách sử dụng bộ định lượng `{n}`:

```kotlin
val regex = "[0-9]{4}".toRegex() // four digits

regex.matches("6342")  // true
regex.matches("9034")  // true

regex.matches("182")   // false
regex.matches("54312") // false
```

Có thể khớp từ các phiên bản `n` với `m` nhờ bộ định lượng `{n,m}`. Lưu ý rằng phạm vi được chỉ định trong dấu ngoặc nhọn bao gồm cả hai đầu: `m`

```kotlin
val regex = "1{2,3}".toRegex()

regex.matches("1")    // false
regex.matches("11")   // true
regex.matches("111")  // true
regex.matches("1111") // false
```

Ví dụ cuối cùng trình bày cách so khớp ít nhất n phiên bản bằng bộ định lượng `{n,}`:

```kotlin
val regex = "ab{4,}".toRegex()

regex.matches("abb") // false, not enough 'b'
regex.matches("abbbb") // true
regex.matches("abbbbbbb") // true   
```

Bộ định lượng khớp không quá các phiên bản `m` hoạt động tương tự.


