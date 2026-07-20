#MVP - Model View Người dẫn chương trình

Mẫu kiến ​​trúc MVP cung cấp một cách dễ dàng để cấu trúc mã dự án.
Sự chấp nhận rộng rãi của nó bắt nguồn từ khả năng cung cấp tính mô-đun, khả năng kiểm tra và cơ sở mã sạch hơn, dễ bảo trì hơn. Nó bao gồm ba thành phần sau:

- `Model`: Model đại diện cho một tập hợp các lớp mô tả dữ liệu và logic nghiệp vụ. Nó cũng xác định các quy tắc nghiệp vụ cho dữ liệu, nghĩa là cách dữ liệu có thể được thay đổi và thao tác.
- `View`: `View` chịu trách nhiệm về tương tác của người dùng và theo dõi hành động của người dùng để thông báo cho `Presenter`.
- `Presenter`: `Presenter` đóng vai trò trung gian giữa `View` và `Model`.


Nó truy xuất dữ liệu từ `Model` và hiển thị trên `View`, đồng thời xử lý các sự kiện của người dùng từ `View` và chuyển chúng đến `Model` để xử lý.
`Presenter` cũng chịu trách nhiệm xử lý logic xử lý hoặc logic nghiệp vụ phức tạp, ngăn `View` thực hiện các tác vụ này.

## Ưu điểm của MVP

- Cấu trúc rõ ràng và trực quan hơn so với MVC.
- Dễ dàng viết bài kiểm tra đơn vị cho `Presenter` vì nó hoạt động độc lập với `View` 

##Nhược điểm của MVP

- Mô hình phát triển lớn hơn theo thời gian.
- `Presenter` mở rộng khi thêm nhiều logic nghiệp vụ hơn, khiến người dùng khó quản lý và chia nhỏ mã hơn khi nó quá lớn.




