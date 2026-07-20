#SAML

SAML, hay **Ngôn ngữ đánh dấu xác nhận bảo mật**, đóng vai trò như một tiêu chuẩn mở tạo điều kiện thuận lợi cho việc truyền dữ liệu ủy quyền giữa **nhà cung cấp danh tính (IdPs)** và **nhà cung cấp dịch vụ (SP)**. 
Bằng cách sử dụng XML- dựa trên framework, SAML cho phép người dùng truy cập nhiều ứng dụng bằng một bộ thông tin xác thực duy nhất, từ đó hỗ trợ triển khai công nghệ đăng nhập một lần (SSO). Công nghệ này cho phép truy cập hợp lý trên nhiều ứng dụng hoặc dịch vụ web khác nhau mà không cần thông tin đăng nhập riêng cho từng dịch vụ.

SSO process, một ứng dụng chính của SAML, bao gồm ba thực thể chính: 
- hiệu trưởng (chẳng hạn như người dùng yêu cầu quyền truy cập)
- Identity Provider (xác minh danh tính người dùng và tạo xác nhận SAML)
- Nhà cung cấp dịch vụ (cho phép truy cập tài nguyên).


## Cách hoạt động của xác thực dựa trên SAML-


![văn bản thay thế](/resources/cybersecurity_aaa_saml_base_authentication.png)

Tổng quan về cách hoạt động của xác thực dựa trên SAML-:

1. **Bắt đầu yêu cầu đăng nhập**: Người dùng cố gắng đăng nhập vào một ứng dụng web, điều này sẽ kích hoạt yêu cầu đăng nhập. Yêu cầu này sau đó được chuyển đến nhà cung cấp dịch vụ (SP) có liên quan.
2. **Tạo yêu cầu SAML**: Nhà cung cấp dịch vụ xử lý yêu cầu đăng nhập và chuyển tiếp yêu cầu đó đến identity provider (IdP) thích hợp, tạo ra yêu cầu SAML trong process. Yêu cầu này bao gồm thông tin nhận dạng của người dùng cùng với thông tin chi tiết về dịch vụ mà người dùng muốn truy cập.
3. **Người dùng Authentication**: Sau đó, người dùng được nhắc nhập thông tin đăng nhập (chẳng hạn như tên người dùng và mật khẩu) trên trang đăng nhập của IdP. 
IdP xác minh các thông tin xác thực này dựa trên thư mục người dùng của nó, có khả năng kết hợp các biện pháp bảo mật bổ sung như xác thực đa yếu tố dựa trên các giao thức xác thực cụ thể của IdP.
4. **Tạo và truyền phản hồi SAML**: Sau khi xác thực thành công, IdP sẽ tạo phản hồi SAML, còn được gọi là xác nhận SAML. 
Phản hồi này chứa thông tin ủy quyền bao gồm vai trò của người dùng, thuộc tính và chữ ký số và có thể được mã hóa để bảo vệ việc trao đổi thông tin.
5. **Nhà cung cấp dịch vụ Authorization**: Nhà cung cấp dịch vụ nhận được phản hồi SAML và xác thực chữ ký số để xác nhận tính xác thực của nó. 
Sau đó, nó giải mã thông tin ủy quyền có trong xác nhận SAML, xác định xem người dùng có được phép truy cập vào các tài nguyên được yêu cầu hay không.



## Thành phần của SAML

- **Xác nhận Authentication**: Xác nhận rằng người dùng đã được xác thực bằng IdP.

- **Xác nhận thuộc tính**: Chứa thông tin cụ thể về người dùng, chẳng hạn như địa chỉ email, vai trò hoặc tư cách thành viên nhóm của họ.

- **Xác nhận quyết định Authorization**: Cho biết liệu người dùng có được phép truy cập vào các tài nguyên được yêu cầu hay không.





















