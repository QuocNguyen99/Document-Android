#Navigation

Navigation đề cập đến các tương tác cho phép người dùng điều hướng qua, vào và thoát khỏi các phần nội dung khác nhau trong ứng dụng của bạn.

## Các khái niệm chính

- **Máy chủ**: Phần tử UI chứa đích điều hướng hiện tại. Trong **Compose** là `NavHost`, **Fragment**: `NavHostFragment` 

- **Graph**: **data structure** xác định tất cả các điểm đến điều hướng trong ứng dụng và cách chúng kết nối với nhau. Cả Chế độ xem và Compose đều sử dụng `NavGraph`

- **Bộ điều khiển**: Điều phối viên trung tâm để quản lý việc điều hướng giữa các điểm đến. 
Bộ điều khiển cung cấp các phương thức để điều hướng giữa các đích, xử lý các liên kết sâu, quản lý back stack, v.v.  Cả Chế độ xem và Compose đều sử dụng `NavController`

- **Đích**: Một nút trong navigation graph. Khi người dùng điều hướng đến nút này, máy chủ sẽ hiển thị nội dung của nó. Cả Chế độ xem và Compose đều sử dụng `NavDestination`

- **Tuyến đường**: Xác định duy nhất một điểm đến và mọi dữ liệu mà điểm đến đó yêu cầu.
Bạn có thể điều hướng bằng cách sử dụng các tuyến đường. Các tuyến đường đưa bạn đến các điểm đến. Cách sử dụng như bất kỳ loại dữ liệu có thể tuần tự hóa nào.

## Lợi ích và tính năng

- **Hoạt ảnh và chuyển tiếp**: Cung cấp tài nguyên được tiêu chuẩn hóa cho hoạt ảnh và chuyển tiếp.
- **Liên kết sâu**: Triển khai và xử lý các liên kết sâu đưa người dùng trực tiếp đến đích.
- **An toàn loại**: Bao gồm hỗ trợ truyền dữ liệu giữa các đích với loại an toàn.
- **Hỗ trợ ViewModel**: Cho phép xác định phạm vi `ViewModel` đến navigation graph để chia sẻ dữ liệu liên quan đến UI- giữa các điểm đến của graph.
- **Giao dịch Fragment**: Hỗ trợ và xử lý đầy đủ các giao dịch phân đoạn.












