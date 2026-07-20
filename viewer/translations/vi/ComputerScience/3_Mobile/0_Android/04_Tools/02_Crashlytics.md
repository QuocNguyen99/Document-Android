#Crashlytics

**Crashlytics** là một trong nhiều dịch vụ mà Firebase cung cấp để nâng cao chu trình phát triển cho các nhà phát triển và giúp họ xây dựng các ứng dụng đáng tin cậy và chất lượng cao. Dịch vụ Crashlytics thu thập và báo cáo các phân tích liên quan đến sự cố, lỗi, ngoại lệ và nhật ký trong ứng dụng của bạn. Nó thu thập các loại dữ liệu này từ cơ sở người dùng của bạn và cung cấp thông tin chi tiết về mọi vấn đề nghiêm trọng hoặc không nghiêm trọng có thể ảnh hưởng đến trải nghiệm người dùng ứng dụng của bạn.

## Nó hoạt động như thế nào?

- **Ghi nhật ký**. Bạn cần ghi lại các sự kiện quan trọng trong ứng dụng của mình để Crashlytics có thể thu thập chúng và hiển thị cho bạn bối cảnh cũng như lộ trình dẫn đến sự cố của người dùng.

- **Truy tìm ngăn xếp**. Ngay cả khi ứng dụng của bạn cố gắng khắc phục lỗi bằng cách ghi lại và xử lý lỗi đó, dấu vết ngăn xếp vẫn có thể được ghi lại và chuyển tiếp cho bạn.

- **Báo cáo sự cố**. Mọi sự cố sẽ được chuyển thành báo cáo sự cố toàn diện được tự động gửi khi ứng dụng được khởi động lại. Bằng cách sử dụng công cụ phân tích, Crashlytics nhóm các sự kiện tương tự bằng cách so sánh các thông báo lỗi, mã lỗi và vị trí xảy ra sự cố trong ứng dụng. Các sự kiện được nhóm này được gọi là "sự cố" và càng có nhiều sự kiện khớp với sự cố thì sự cố này càng được xếp hạng cao hơn trong trang tổng quan Crashlytics. Điều này giúp bạn ưu tiên và khắc phục những vấn đề quan trọng nhất trước tiên.


## Báo cáo sự cố toàn diện hơn

Để tùy chỉnh các báo cáo của bạn và bao gồm dữ liệu phù hợp hơn dựa trên trường hợp sử dụng của bạn, Crashlytics SDK cung cấp bốn chức năng sau:
khóa tùy chỉnh, nhật ký tùy chỉnh, số nhận dạng người dùng và các trường hợp ngoại lệ đã phát hiện.

- **Khóa tùy chỉnh**: sử dụng chúng khi bạn muốn đưa các biến khác từ ứng dụng của mình vào báo cáo sự cố được gửi cho bạn vì bạn cho rằng chúng có liên quan trong việc giúp bạn xác định sự cố. Bạn có thể bao gồm tối đa 64 cặp khóa/giá trị. Mỗi cặp có thể đạt kích thước 1kB.

```kotlin
Firebase.crashlytics.setCustomKeys {
    key("key_1", "Wow") // String value
    key("key_2", true)  // boolean value
    key("key_3", 2.0)   // double value
    key("key_4", 9)     // int value
}
```

- **Nhật ký tùy chỉnh**: sử dụng chúng khi bạn cần thêm ngữ cảnh về trường hợp sử dụng và các sự kiện mà người dùng đã trải qua ngay trước khi xảy ra sự cố. Bạn có thể thêm nhật ký đi kèm với dữ liệu sự cố và hiển thị trong tab Nhật ký trong bảng điều khiển Crashlytics.

```kotlin
Firebase.crashlytics.log("Logging In")
```

- **Giá trị nhận dạng người dùng**: sử dụng chúng khi bạn cần biết người dùng nào đã gặp phải sự cố hoặc lỗi cụ thể. Họ có thể giúp tìm ra một số lỗi có liên quan vì chúng bắt nguồn từ cùng một người dùng. Crashlytics cho phép bạn xác định người dùng trong báo cáo sự cố tùy chỉnh của mình.

```kotlin
Firebase.crashlytics.setUserId("00012")
```

- **Đã phát hiện ngoại lệ**: bạn có thể thu thập và gửi các trường hợp ngoại lệ không gây tử vong được phát hiện trong ứng dụng của mình. Crashlytics cho phép bạn ghi lại tối đa 8 trường hợp ngoại lệ sẽ được gửi vào lần tiếp theo khi ứng dụng của bạn được khởi chạy. Nếu ứng dụng của bạn đưa ra nhiều hơn 8 ngoại lệ thì chỉ 8 ngoại lệ mới nhất được ghi lại.

```kotlin
try {
    // Code that can possibly throw an error
    ...
} catch (e: Exception) {
    // Record Exceptions using Crashlytics
    Firebase.crashlytics.recordException(e)
    ...
}
```


































