#OAuth

OAuth là giao thức ủy quyền được áp dụng rộng rãi trong các ứng dụng phần mềm, cho phép truy cập được chỉ định an toàn vào các tài nguyên được lưu trữ bởi các dịch vụ khác nhau. 

Nó cho phép người dùng cấp cho các ứng dụng của bên thứ ba quyền truy cập vào tài nguyên máy chủ của họ mà không cần chia sẻ thông tin xác thực của họ, thay vào đó sử dụng mã thông báo ủy quyền.


## Luồng mã ủy quyền OAuth

Quá trình nhận ủy quyền process bắt đầu khi trình duyệt được chuyển hướng đến điểm cuối ủy quyền nằm tại Dịch vụ Token của Authorization Server.

1. **Chuyển hướng đến Điểm cuối Authorization**: Trình duyệt của khách hàng được chuyển hướng đến điểm cuối ủy quyền, đánh dấu bước đầu tiên trong việc yêu cầu sự đồng ý của người dùng để truy cập vào tài nguyên của họ.


2. **Kiểm tra Authentication**: Nếu người dùng chưa tự xác thực, Dịch vụ Token sẽ chuyển hướng trình duyệt đến Dịch vụ Authentication. Mặc dù các dịch vụ này là một phần của cùng một hệ thống, nhưng chúng phục vụ các chức năng riêng biệt, sau đó xử lý cụ thể việc xác thực người dùng.


3. **Người dùng Authentication**: Người dùng hoàn tất xác thực process. Xác thực thành công dẫn đến việc người dùng được chuyển hướng trở lại Dịch vụ Token, báo hiệu rằng danh tính của người dùng đã được xác minh.

4. **Cấp mã Authorization**: Sau khi người dùng được xác thực, Authorization Server sẽ cấp mã ủy quyền một lần. Mã này được gửi lại cho khách hàng làm bằng chứng về sự đồng ý của người dùng cho khách hàng truy cập tài nguyên của họ.


Sau khi ủy quyền thành công, khách hàng tương tác với điểm cuối token để trao đổi mã ủy quyền lấy access token. 
Việc trao đổi này được thực hiện một cách an toàn bởi chương trình phụ trợ của khách hàng.


1. **Yêu cầu POST với mã Authorization**: Phần phụ trợ của khách hàng thực hiện yêu cầu POST an toàn tới điểm cuối token, bao gồm mã ủy quyền và thông tin xác thực của khách hàng. Yêu cầu này nhận được access token sẽ cho phép khách hàng truy cập tài nguyên của người dùng.

2. **Xác thực và phát hành Token**: Khi nhận được yêu cầu, Authorization Server sẽ xác minh tính xác thực của mã ủy quyền và thông tin xác thực của khách hàng. Nếu xác thực thành công, máy chủ sẽ phản hồi bằng cách cấp access token cho máy khách. Ngoài ra, token làm mới cũng có thể được cung cấp nếu nó được authorization server hỗ trợ và định cấu hình.


process này đảm bảo rằng quyền truy cập vào tài nguyên được cấp một cách an toàn với sự đồng ý rõ ràng của người dùng cũng như việc kiểm tra ủy quyền và xác thực phù hợp. 
Việc tách biệt ủy quyền và điểm cuối token cho phép phân biệt rõ ràng trách nhiệm trong OAuth framework, nâng cao tính bảo mật và hiệu quả.


## Thông tin xác thực của khách hàng Flow (OAuth2)

- Được thiết kế để liên lạc giữa máy chủ với máy chủ (không có người dùng tham gia).
- Máy khách xác thực bằng `client_id` và `client_secret` của chính nó.
- Sau khi xác thực thành công → nhận được access token.
- token chỉ cấp quyền truy cập vào tài nguyên của chính khách hàng chứ không phải dữ liệu người dùng.
- Không cần đăng nhập hoặc chuyển hướng người dùng → lý tưởng cho các công việc nền, tự động hóa, dịch vụ vi mô.
- Yêu cầu bảo mật mạnh mẽ: lưu trữ thông tin xác thực an toàn + HTTPS.











