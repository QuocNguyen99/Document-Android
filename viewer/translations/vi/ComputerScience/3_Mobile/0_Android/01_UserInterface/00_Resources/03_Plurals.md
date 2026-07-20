# số nhiều

Số nhiều, còn được gọi là chuỗi số lượng, là tài nguyên chuỗi mang các chuỗi thay thế để số nhiều

Hãy tưởng tượng bạn muốn hiển thị một dòng chữ với số lượng bánh đã đặt. Nội dung có thể là: “đặt 2 bánh”, hoặc “đặt 1 bánh”. Lưu ý từ "bánh" thay đổi tùy theo số lượng bánh. Số nhiều có ích trong tình huống này.

## Tài nguyên số nhiều

Số nhiều, là tài nguyên giá trị, có thể được kết hợp với các tài nguyên chuỗi khác trong tệp `res/values/strings.xml`. Bạn cũng có thể tạo một tệp XML riêng biệt, miễn là nó được đặt trong thư mục `res/values`.

Đây là một ví dụ về việc triển khai tài nguyên số nhiều cho ví dụ trước đây của chúng tôi về bánh:

```xml
<resources>
    <plurals name="numberOfCakesOrdered">
        <item quantity="one">%d cake ordered</item>
        <item quantity="other">%d cakes ordered</item>
    </plurals>
</resources>
```

## Thuộc tính số lượng

Trường hợp trên chỉ áp dụng cho tiếng Anh và một số ngôn ngữ khác có cùng quy tắc ngữ pháp số nhiều.
Các ngôn ngữ khác chơi theo các quy tắc khác nhau; đó là lý do tại sao Android hỗ trợ số lượng lớp nhiều hơn. Danh sách đầy đủ được Android hỗ trợ là `zero`, `one`, `two`, `few`, `many` và `other`.


Ví dụ: bằng tiếng Anh, tiếng Tây Ban Nha và các ngôn ngữ khác có quy tắc ngữ pháp tương tự, `zero` bị bỏ qua. Đó là bởi vì, về mặt ngữ pháp, số lượng `0` được xử lý theo cách tương tự như các đại lượng khác ngoại trừ `1`. Ví dụ: "Đã tìm thấy 0 liên hệ", "Đã tìm thấy 1 liên hệ" và "Đã tìm thấy 2 liên hệ".


Các ngôn ngữ khác có các quy tắc khác nhau:

- Trong `Chinese` và `Korean` chỉ sử dụng other vì ngữ pháp của câu không bị ảnh hưởng bởi số lượng.

- Trong `Russian`, một không chỉ đại diện cho số lượng 1 mà còn đại diện cho 21, 31, 41, 51, 61, v.v. Về cơ bản, bất kỳ số nào kết thúc bằng 1, ngoại trừ những số kết thúc bằng 11. Ví dụ: "1 контакт", "21 контакт". `few`, `many` và `other` cũng được sử dụng bằng tiếng Nga.

- Các ngôn ngữ khác như tiếng Ả Rập xử lý số lượng 0 khác với các đại lượng khác, vì vậy `zero` được sử dụng trong các trường hợp của chúng.

Vì chúng tôi không thể liệt kê đầy đủ mọi ngôn ngữ và các quy tắc ngữ pháp của nó nên bạn có thể tìm thấy các quy tắc mà Android chủ yếu sử dụng tại đây: [Quy tắc đa ngôn ngữ](https://www.unicode.org/cldr/cldr-aux/charts/25/supplemental/language_plural_rules.html).

## Cách sử dụng trong mã

Giả sử bạn có tài nguyên số nhiều trong tệp `res/values/strings.xml`:

```xml
<plurals name="notification">
    <item quantity="one">You have %d notification</item>
    <item quantity="other">You have %d notifications</item>
</plurals>
```

Bạn có thể truy cập nó bằng cách sử dụng phương thức `getQuantityString()` từ lớp Tài nguyên:

```kotlin
val newMessages = 5
val notification = resources.getQuantityString(R.plurals.notification, newMessages, newMessages)
```


















