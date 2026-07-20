# MVVM: Model-View-ViewModel


Mẫu này dựa trên MVC và MVP và nhằm mục đích tách biệt rõ ràng hơn sự phát triển của user interface (UI) khỏi logic nghiệp vụ và hành vi trong một ứng dụng.

MVVM giải quyết các nhược điểm của mẫu MVP bằng cách đề xuất sự tách biệt giữa logic trình bày dữ liệu (Chế độ xem hoặc UI) và logic nghiệp vụ cốt lõi của ứng dụng.
Các lớp mã riêng biệt của MVVM là:

- `Model`: Lớp này có nhiệm vụ trừu tượng hóa các nguồn dữ liệu. `Model` hoạt động cùng với `ViewModel` để truy xuất và lưu dữ liệu.
- `View`: Mục đích của lớp này là thông báo cho `ViewModel` về hành động của người dùng. Nó tuân theo `ViewModel` và không chứa logic nghiệp vụ ứng dụng.
- `ViewModel`: Lớp này hiển thị các luồng dữ liệu liên quan đến `View`. Nó cũng đóng vai trò là cầu nối giữa `Model` và `View`.

## Ưu điểm của MVVM

- Người dùng có thể thực hiện kiểm thử đơn vị mà không cần phụ thuộc vào `View`.
- Việc kiểm tra không yêu cầu tạo mô hình như trong MVP; nó chỉ cần xác minh các biến quan sát thích hợp.
- Sử dụng XAML cho `View`, cho phép sửa đổi UI mà không ảnh hưởng đến mã.
- Phân tách rõ ràng ba thành phần, giúp việc phát triển, kiểm tra và gỡ lỗi mã rất dễ dàng.

##Nhược điểm của MVVM
- Khi liên kết nhiều biến với `View`, logic sẽ bị phân tán và phát triển theo thời gian, khiến việc kiểm soát mã trở nên khó khăn hơn.
- data binding hai chiều tiêu tốn tài nguyên bộ nhớ đáng kể.









































