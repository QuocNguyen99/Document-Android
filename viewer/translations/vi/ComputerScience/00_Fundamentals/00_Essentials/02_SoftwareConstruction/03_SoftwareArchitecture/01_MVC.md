#MVC

MVC hoặc Model-View-Controller là design pattern tổ chức một ứng dụng thành ba phần:

- `Model`: Quản lý dữ liệu và logic nghiệp vụ, thể hiện trạng thái của ứng dụng.
- `View`: Hiển thị user interface, hiển thị dữ liệu từ Model tới người dùng.
- `Controller`: Xử lý thông tin đầu vào của người dùng từ `View`, cập nhật `Model` và đảm bảo `View` phản ánh các thay đổi.

Khi người dùng tương tác với View, Bộ điều khiển sẽ xử lý đầu vào, cập nhật Model và Model sẽ thông báo cho View để làm mới

## Ưu điểm của MVC
- Nhẹ, tiết kiệm tài nguyên.
- Cấu trúc đơn giản.
- Dễ dàng kiểm tra và gỡ lỗi.
- Dễ dàng tách các thành phần `Model` và `View`.
##Nhược điểm của MVC
- Độ phức tạp của `Controller` tăng theo thời gian.
- `Controller` được gắn với `View`, do đó những thay đổi trong `View` yêu cầu những thay đổi tương ứng trong `Controller`.
