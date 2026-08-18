# Token

Token là công cụ kỹ thuật số được sử dụng cho quá trình xác thực và ủy quyền.
Sau khi được xác thực, người dùng sẽ được cấp token thay vì nhập nhiều lần thông tin đăng nhập. 
token này sau đó được sử dụng cho các request tiếp theo để truy cập tài nguyên hoặc dịch vụ.
Điều quan trọng là mã thông báo chứa thông tin cần thiết để xác thực danh tính hoặc quyền của người dùng. 

## Mã thông báo phiên


Mã thông báo phiên là số nhận dạng duy nhất được gán cho người dùng sau khi họ đăng nhập vào web service.

1. Khi người dùng cung cấp thông tin xác thực của họ, web server sẽ xác thực người dùng, tạo phiên và lưu trữ thông tin phiên này trong cơ sở dữ liệu. 
2. Sau đó, nó sẽ gửi một phiên ID trở lại trình duyệt của người dùng, thường ở dạng cookie.
3. Phiên ID này được lưu trữ cục bộ và được sử dụng với mỗi request tiếp theo tới server.
4. Server, khi nhận được phiên ID này, sẽ tra cứu nó trong cơ sở dữ liệu của nó để lấy thông tin phiên và xác nhận danh tính của người dùng trước khi phản hồi request.
5. process này cho phép người dùng duy trì **tương tác có trạng thái** với các ứng dụng web mà không cần phải xác thực lại cho mỗi hành động mà họ thực hiện.

## Mã thông báo truy cập

Mã thông báo truy cập có cách tiếp cận khác. Trong xác thực dựa trên token, khi người dùng đăng nhập, server sẽ xác thực thông tin xác thực của họ và đưa ra access token.
token này là một phần dữ liệu đã được ký để chứng minh danh tính và quyền của người dùng.
1. Client lưu trữ token này và đưa nó vào tiêu đề Authorization của các request HTTP để truy cập các tài nguyên được bảo vệ.
2. Sau đó, server sẽ giải mã và xác minh token để xác nhận quyền của người dùng trước khi thực hiện request.
3. Mã truy cập không thể thiếu đối với các ứng dụng không có trạng thái, trong đó mỗi request phải được xác thực và ủy quyền độc lập.



Sự khác biệt chính giữa hai loại này nằm ở trường hợp sử dụng: mã thông báo phiên dùng để duy trì phiên của người dùng theo cách có trạng thái, trong khi mã thông báo truy cập dùng để đảm bảo các tương tác không trạng thái bằng cách cung cấp quyền truy cập vào tài nguyên mà không cần duy trì phiên.
Mã thông báo truy cập được thiết kế đặc biệt để tồn tại trong thời gian ngắn và bị hủy khi người dùng đăng xuất, đảm bảo mức độ bảo mật cao hơn vì chúng không giữ được quyền truy cập dài hạn như mã thông báo phiên.

