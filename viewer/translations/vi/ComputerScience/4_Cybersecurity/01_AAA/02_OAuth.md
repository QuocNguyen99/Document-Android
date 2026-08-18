#OAuth

OAuth là protocol ủy quyền được áp dụng rộng rãi trong các ứng dụng phần mềm, cho phép truy cập được chỉ định an toàn vào các tài nguyên được lưu trữ bởi các dịch vụ khác nhau.

Nó cho phép người dùng cấp cho các ứng dụng của bên thứ ba quyền truy cập vào tài nguyên server của họ mà không cần chia sẻ thông tin xác thực của họ, thay vào đó sử dụng mã thông báo ủy quyền.


## Luồng mã ủy quyền OAuth

Quá trình nhận ủy quyền process bắt đầu khi trình duyệt được chuyển hướng đến endpoint ủy quyền nằm tại Dịch vụ Token của Authorization Server.

1. **Chuyển hướng đến Endpoint Authorization**: Trình duyệt của client được chuyển hướng đến endpoint ủy quyền, đánh dấu bước đầu tiên trong việc yêu cầu sự đồng ý của người dùng để truy cập vào tài nguyên của họ.


2. **Kiểm tra Authentication**: Nếu người dùng chưa tự xác thực, Dịch vụ Token sẽ chuyển hướng trình duyệt đến Dịch vụ Authentication. Mặc dù các dịch vụ này là một phần của cùng một hệ thống, nhưng chúng phục vụ các chức năng riêng biệt, sau đó xử lý cụ thể việc xác thực người dùng.


3. **Người dùng Authentication**: Người dùng hoàn tất xác thực process. Xác thực thành công dẫn đến việc người dùng được chuyển hướng trở lại Dịch vụ Token, báo hiệu rằng danh tính của người dùng đã được xác minh.

4. **Cấp mã Authorization**: Sau khi người dùng được xác thực, Authorization Server sẽ cấp mã ủy quyền một lần. Mã này được gửi lại cho client làm bằng chứng về sự đồng ý của người dùng cho client truy cập tài nguyên của họ.


Sau khi ủy quyền thành công, client tương tác với endpoint token để trao đổi mã ủy quyền lấy access token.
Việc trao đổi này được thực hiện một cách an toàn bởi chương trình phụ trợ của client.


1. **Request POST với mã Authorization**: Phần phụ trợ của client thực hiện request POST an toàn tới endpoint token, bao gồm mã ủy quyền và thông tin xác thực của client. Request này nhận được access token sẽ cho phép client truy cập tài nguyên của người dùng.

2. **Xác thực và phát hành Token**: Khi nhận được request, Authorization Server sẽ xác minh tính xác thực của mã ủy quyền và thông tin xác thực của client. Nếu xác thực thành công, server sẽ phản hồi bằng cách cấp access token cho client. Ngoài ra, refresh token cũng có thể được cung cấp nếu nó được authorization server hỗ trợ và định cấu hình.


process này đảm bảo rằng quyền truy cập vào tài nguyên được cấp một cách an toàn với sự đồng ý rõ ràng của người dùng cũng như việc kiểm tra ủy quyền và xác thực phù hợp. 
Việc tách biệt ủy quyền và endpoint token cho phép phân biệt rõ ràng trách nhiệm trong OAuth framework, nâng cao tính bảo mật và hiệu quả.


## Thông tin xác thực của client Flow (OAuth2)

- Được thiết kế để liên lạc giữa server với server (không có người dùng tham gia).
- Client xác thực bằng `client_id` và `client_secret` của chính nó.
- Sau khi xác thực thành công → nhận được access token.
- token chỉ cấp quyền truy cập vào tài nguyên của chính client chứ không phải dữ liệu người dùng.
- Không cần đăng nhập hoặc chuyển hướng người dùng → lý tưởng cho các công việc nền, tự động hóa, dịch vụ vi mô.
- Yêu cầu bảo mật mạnh mẽ: lưu trữ thông tin xác thực an toàn + HTTPS.











