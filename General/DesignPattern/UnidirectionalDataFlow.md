# Unidirectional data flow

A unidirectional data flow (UDF) is a design pattern where state flows down and events flow up. Bằng cách tuân theo luồng dữ liệu một chiều, bạn có thể phân tách các Composable hiển thị State trong giao diện người dùng từ các phần lưu trữ và thay đổi State trong ứng dụng của bạn.

![](../../resources/state_hosting.avif)

Làm theo pattern này khi sử dụng Jetpack Compose mang lại một số lợi ích:

- Testability: Việc tách State khỏi giao diện người dùng hiển thị State này giúp việc kiểm tra cả hai một cách dễ dàng hơn.
- State encapsulation: Vì State chỉ có thể được cập nhật ở một nơi và chỉ có một nguồn đáng tin cậy cho State của một thành phần kết hợp nên bạn sẽ ít có khả năng tạo ra lỗi do State không nhất quán.
- UI consistency: Tất cả các cập nhật State được update ngay lập tức trong giao diện người dùng bằng cách sử dụng các observable state holders, như `StateFlow` hoặc `LiveData`.