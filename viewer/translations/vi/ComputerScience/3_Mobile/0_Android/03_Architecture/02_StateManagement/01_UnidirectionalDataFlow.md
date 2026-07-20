#Unidirectional data flow

unidirectional data flow (UDF) là design pattern trong đó trạng thái giảm xuống và các sự kiện tăng lên.  Bằng cách làm theo unidirectional data flow, bạn có thể tách các thành phần kết hợp hiển thị trạng thái trong UI khỏi các phần lưu trữ và thay đổi trạng thái của ứng dụng.

Vòng lặp cập nhật UI cho một ứng dụng sử dụng unidirectional data flow trông như thế này:

- **Sự kiện**: Một phần của UI tạo ra một sự kiện và chuyển nó lên trên, chẳng hạn như một lần bấm nút được chuyển đến ViewModel để xử lý; hoặc một sự kiện được truyền từ các lớp khác trong ứng dụng của bạn, chẳng hạn như cho biết rằng phiên người dùng đã hết hạn.

- **Cập nhật trạng thái**: Trình xử lý sự kiện có thể thay đổi trạng thái.
- **Trạng thái hiển thị**: state holder chuyển trạng thái xuống và UI hiển thị trạng thái đó.

![](/resources/state_hosting.avif)

Làm theo mẫu này khi sử dụng Jetpack Compose mang lại một số lợi thế:

- **Khả năng kiểm tra**: Trạng thái tách rời khỏi UI hiển thị trạng thái này giúp việc kiểm tra cả hai một cách riêng biệt dễ dàng hơn.
- **Trạng thái encapsulation**: Vì trạng thái chỉ có thể được cập nhật ở một nơi và chỉ có một nguồn thông tin chính xác về trạng thái của một thành phần kết hợp nên bạn sẽ ít có khả năng tạo ra lỗi do trạng thái không nhất quán.
- **Tính nhất quán của UI**: Tất cả các cập nhật trạng thái được phản ánh ngay lập tức trong UI bằng cách sử dụng các chủ sở hữu trạng thái có thể quan sát được, như `StateFlow` hoặc `LiveData`.