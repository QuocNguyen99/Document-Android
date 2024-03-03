# Architecture Components

Tại Google I/O '17, Google đã công bố Architecture Components, một bộ thư viện giúp giải quyết các vấn đề cơ bản của Android và hướng dẫn kiến ​​trúc ứng dụng.

Các thành phần kiến ​​trúc có trong bộ thư viện Android Jetpack. Google hỗ trợ nhiều giải pháp thực tế để giúp các nhà phát triển xây dựng các ứng dụng mạnh mẽ bằng thư viện Jetpack.

Trước khi khám phá thư viện Jetpack, hãy thảo luận về cấu trúc ứng dụng được Google đề xuất.


## App Architecture

Trong quá trình phát triển Android, cấu trúc ứng dụng xác định cách bạn mở rộng quy mô, kiểm tra và duy trì ứng dụng của mình.

Kiến trúc ứng dụng do Google đề xuất bên dưới cho phép ứng dụng mở rộng quy mô, cải thiện chất lượng và độ mạnh mẽ, đồng thời giúp việc kiểm tra ứng dụng dễ dàng hơn theo nguyên tắc kiến ​​trúc của Google.

![](../../resources/mad-arch-overview.avif)

Cấu trúc ứng dụng được đề xuất bao gồm ba Layer:

- UI Layer: Trách nhiệm của  UI Layer người dùng là hiển thị dữ liệu ứng dụng trên màn hình. Các thành phần giao diện người dùng phải được cập nhật bất cứ khi nào dữ liệu ứng dụng thay đổi do tương tác của người dùng hoặc giao tiếp bên ngoài với mạng và cơ sở dữ liệu. Bạn cũng có thể gọi Layer này là Layer Trình bày vì nó chứa các thành phần giao diện người dùng và chủ sở hữu trạng thái như ViewModel.

- Domain Layer: Domain Layer chịu trách nhiệm trừu tượng hóa logic nghiệp vụ phức tạp và cải thiện khả năng sử dụng lại của nó. Layer này chuyển đổi dữ liệu ứng dụng phức tạp thành các loại phù hợp cho các  UI Layer người dùng và nhóm logic nghiệp vụ tương tự như một tính năng duy nhất. Layer này hữu ích trong việc mở rộng các dự án có nhiều tính năng tương tự và yêu cầu xử lý dữ liệu thường xuyên. Nói chung, Layer này là tùy chọn.

- Data Layer: Trách nhiệm của Data Layer là cung cấp kết quả của việc thực thi logic nghiệp vụ, chẳng hạn như các hoạt động CRUD (Tạo, Truy xuất, Cập nhật, Xóa - tất cả các sự kiện hệ thống). Layer này có thể được thiết kế với nhiều chiến lược khác nhau, như Kho lưu trữ hoặc Nguồn dữ liệu, để phân chia trách nhiệm thực thi.

## Android Jetpack

Google hỗ trợ một bộ thư viện để đạt được cấu trúc ứng dụng được xác định trong Android Jetpack. Hãy cùng khám phá các thư viện được sử dụng nhiều nhất trong Android Jetpack cho từng lớp (xem thêm chi tiết ở [Android jetpack](../Jetpack))