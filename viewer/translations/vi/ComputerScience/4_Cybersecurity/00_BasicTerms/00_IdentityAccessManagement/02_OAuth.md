# Mở Authorization

Nếu người dùng đã có cả đống tài khoản, mật khẩu và thông tin đăng nhập. 
Thật vô nghĩa khi nghĩ ra một cái khác cho bạn. 
Sẽ thuận tiện hơn nhiều nếu người dùng có thể truy cập ứng dụng của bạn thông qua tài khoản họ đã có, như Google, Twitter, Facebook hoặc các dịch vụ khác. 
Tất cả các dịch vụ này đều sử dụng giao thức Open Authorization OAuth để cung cấp thông tin người dùng cho các ứng dụng của bên thứ ba.


## Vai trò OAuth

![văn bản thay thế](/resources/cybersecurity_open_authorization.png)

Trong OAuth 2.0, bốn bên sau có liên quan:
- **Chủ sở hữu tài nguyên** (người dùng) cấp quyền truy cập vào một số phần tài khoản của họ
- **resource server** (API) chứa thông tin của người dùng đang được ứng dụng của bên thứ ba truy cập.
- **authorization server** (có thể là cùng một máy chủ với API) cấp token cho khách hàng để truy cập tài nguyên được bảo vệ sau khi được chủ sở hữu tài nguyên ủy quyền thành công.
- **Máy khách** (ứng dụng) đang cố gắng hành động thay mặt người dùng hoặc truy cập tài nguyên của người dùng. Để làm như vậy, khách hàng cần phải có được sự cho phép. Có hai cách để làm điều đó; bằng cách hướng người dùng đến authorization server hoặc bằng cách xác nhận quyền trực tiếp.

## Loại máy khách (ứng dụng) 

Có hai loại khách hàng: **công khai** và **bí mật**. Cái trước không thể giữ bí mật bí mật của khách hàng trong khi cái sau thì có thể.

Một ví dụ về ứng dụng khách bí mật có thể là ứng dụng web, trong đó không ai ngoài quản trị viên có thể truy cập vào máy chủ và xem mật khẩu của ứng dụng khách.

Đối với ứng dụng khách công cộng, nó thường là ứng dụng điện thoại di động hoặc ứng dụng máy tính để bàn có nhúng mật khẩu ứng dụng khách bên trong. Một ứng dụng như vậy có thể bị bẻ khóa và điều này có thể làm lộ mật khẩu. 



## Đề án thực hiện

    Có bốn loại kế hoạch thực hiện:

    - **Luồng ứng dụng** có nghĩa là ứng dụng sử dụng bí mật của ứng dụng khách để lấy access token. Người dùng không phải cung cấp ủy quyền ở bất kỳ giai đoạn nào. Loại này yêu cầu bảo mật bí mật của khách hàng.
    - **Lược đồ luồng ngầm** có nghĩa là ứng dụng yêu cầu access token từ máy chủ cổng. Nếu người dùng cấp quyền thì access token sẽ được cung cấp. Sau đó, người dùng chuyển access token cho ứng dụng. Loại chương trình này chỉ dành cho khách hàng công cộng.
    - **Luồng mật khẩu** có nghĩa là người dùng cung cấp cho ứng dụng tên người dùng và mật khẩu để truy cập dữ liệu của người dùng. Sau đó, khách hàng liên hệ trực tiếp với API của nhà cung cấp để yêu cầu access token. Trong trường hợp này, ứng dụng phải được tin cậy để không lưu trữ tên người dùng và mật khẩu.
    - **Luồng mã truy cập** có nghĩa là người dùng được ủy quyền thông qua một biểu mẫu đặc biệt. Trong trường hợp ủy quyền thành công, mã của nó sẽ được cung cấp cho khách hàng. Khách hàng gửi mã đến API của nhà cung cấp và nhận lại access token.

## Làm việc với OAuth

Ví dụ: khi bạn muốn đăng ký ứng dụng của mình trên một trang web, trước hết, bạn cần phải nhận được sự cho phép đối với ứng dụng của mình. Điều này được thực hiện bằng cách sử dụng `access_token`, thực thể chính của OAuth.

Trước khi ứng dụng có thể nhận `access_token`, người dùng phải xác nhận quyền truy cập vào ứng dụng đó.

![văn bản thay thế](/resources/cybersecurity_oauth_process.png)

1. Nhà phát triển ứng dụng muốn sử dụng API, vì vậy họ phải truy cập trang web của API tương ứng và đăng ký ứng dụng tại đó để nhận `client_id` và `client_secret`.

2. Sau khi họ đăng ký ứng dụng và nhận được `client_id` và `client_secret`, họ phải tạo một liên kết ủy quyền sẽ chứa trong các tham số truy vấn; `client_id`, `redirect_uri` (nơi người dùng sẽ được gửi sau khi xác nhận; bản thân `redirect_uri` phải được cho phép trong cài đặt của ứng dụng), `response_type` (những gì sẽ được trả lại trong trường hợp thành công) và phạm vi (những quyền mà người dùng phải cung cấp cho tài khoản của họ; trong trường hợp của chúng tôi, chúng tôi sẽ không sử dụng phạm vi).
3. Người dùng nhấp vào liên kết này và cho phép truy cập (nhấp vào nút “cho phép”) và được chuyển hướng trở lại `redirect_uri` do nhà phát triển chỉ định kèm theo phản hồi tại đây.
4. Nhà phát triển sử dụng phản hồi này để nhận `access_token`.