# Điều khiển Authentication / Authorization yếu

Rủi ro này xảy ra khi **phần phụ trợ không thực thi xác thực và ủy quyền đúng cách**, 
và thay vào đó **tin cậy ứng dụng di động** (client)—ví dụ: tin cậy UI ẩn, tham số request hoặc vai trò do client gửi.
Sau đó, những kẻ tấn công có thể gọi trực tiếp các API và thực hiện các hành động mà chúng không được phép thực hiện.


## Các kịch bản tấn công phổ biến

- **Request dịch vụ ẩn**: API chấp nhận request mà không cần xác minh rằng request đó được liên kết với người dùng thực đã được xác thực, cho phép thực hiện ẩn danh các hành động nhạy cảm.
- **Sự tin cậy của interface**: Một chức năng bị ẩn trong ứng dụng UI, nhưng phần phụ trợ không xác minh quyền—những kẻ tấn công vẫn gửi request và nhận được các hành động giống như quản trị viên.
- **Chính sách mật khẩu yếu** (ví dụ: mật khẩu 4 chữ số): Ngay cả khi được băm, mật khẩu ngắn vẫn dễ bị bẻ khóa sau khi rò rỉ dữ liệu.
- **Tham chiếu đối tượng trực tiếp không an toàn**: Phần cuối kiểm tra token có tồn tại nhưng không xác nhận người dùng/đối tượng được yêu cầu ID thuộc về token đó—kẻ tấn công thay đổi ID để truy cập dữ liệu của người dùng khác.
- **Tin cậy các vai trò/nhóm do client cung cấp** (ví dụ: vai trò LDAP trong tiêu đề): Phần phụ trợ sử dụng các vai trò được gửi từ client mà không cần xác minh độc lập—kẻ tấn công sửa đổi tiêu đề để yêu cầu đặc quyền quản trị viên.


## Cách phòng ngừa (hành động quan trọng nhất)

- **Thực thi xác thực phía server** cho mọi endpoint nhạy cảm (không bao giờ cho rằng client/UI đảm bảo điều đó).
- **Thực thi ủy quyền phía server** (RBAC/ABAC): xác minh danh tính được xác thực được phép thực hiện hành động.
- **Ngăn chặn tham chiếu đối tượng trực tiếp không an toàn**: liên kết các request với người dùng được xác thực (token → người dùng) và xác thực quyền sở hữu/quyền đối tượng trên mỗi lần truy cập.
- **Sử dụng các chính sách thông tin xác thực mạnh**: độ dài tối thiểu, giới hạn tốc độ, khóa, Authentication đa yếu tố nếu có thể và băm mật khẩu hiện đại (băm muối, băm chậm).
- **Không bao giờ tin cậy các vai trò/quyền do client gửi**: lấy vai trò từ các nguồn đáng tin cậy (thư mục phía server/DB hoặc token đã xác thực xác nhận quyền sở hữu mà bạn kiểm soát).
- **Thêm các biện pháp bảo vệ chống lạm dụng**: điều tiết, phát hiện bất thường, nhật ký kiểm tra và giám sát các nỗ lực leo thang đặc quyền.






























