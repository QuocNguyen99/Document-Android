#Thông tin xác thực không đúng

## Định nghĩa
Rủi ro này xảy ra khi ứng dụng di động xử lý thông tin đăng nhập không an toàn, đặc biệt:
Khóa API, tên người dùng/mật khẩu được nhúng trong mã hoặc cấu hình.


## Các kịch bản tấn công phổ biến

- **Thông tin xác thực được mã hóa cứng**: kẻ tấn công thiết kế ngược ứng dụng → tìm thông tin xác thực được nhúng → truy cập các hệ thống nhạy cảm.

- **Truyền không an toàn**: kẻ tấn công chặn lưu lượng mạng → lấy thông tin xác thực → mạo danh người dùng.

- **Bộ nhớ không an toàn**: kẻ tấn công trích xuất thông tin đăng nhập được lưu trữ từ thiết bị → chiếm đoạt tài khoản.


## Cách phòng ngừa (hành động quan trọng nhất)

- **Không bao giờ mã hóa thông tin xác thực** trong ứng dụng.
- **Truyền an toàn**: luôn sử dụng các kênh được mã hóa (ví dụ: TLS/HTTPS) và tránh tiết lộ bí mật trong yêu cầu/nhật ký.
- **Tránh lưu trữ mật khẩu người dùng** trên thiết bị; thích các mã thông báo truy cập an toàn, có thể hủy bỏ.
- **Sử dụng các tiêu chuẩn xác thực mạnh** và tránh logic xác thực "cây nhà lá vườn".
- **Xoay và cập nhật** khóa/mã thông báo API thường xuyên để giảm thiệt hại nếu có thứ gì đó bị rò rỉ.































