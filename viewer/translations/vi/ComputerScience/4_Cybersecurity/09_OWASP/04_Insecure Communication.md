# Truyền thông không an toàn

## Nó là gì

Rủi ro này xảy ra khi một ứng dụng di động **gửi hoặc nhận dữ liệu qua các kênh không an toàn** hoặc sử dụng **cấu hình TLS bị hỏng/yếu**, 
cho phép kẻ tấn công **chặn (nghe lén) hoặc sửa đổi (Man-In-The-Middle)** lưu lượng giữa thiết bị và máy chủ (hoặc các thiết bị khác).


## Các kịch bản tấn công thường gặp:

- **Lưu lượng văn bản thuần**: dữ liệu nhạy cảm được gửi mà không có encryption (HTTP, ổ cắm không an toàn, luồng Wi-Fi/Bluetooth/NFC không an toàn).
- **TLS yếu/không được dùng nữa**: các giao thức cũ hoặc bộ mật mã yếu cho phép giải mã lưu lượng truy cập dễ dàng hơn.
- **Chấp nhận chứng chỉ không hợp lệ**: ứng dụng chấp nhận chứng chỉ tự ký/hết hạn/bị thu hồi/máy chủ sai (thường do "phím tắt" của nhà phát triển).
- **Sử dụng TLS một phần**: TLS chỉ được sử dụng để đăng nhập, nhưng các luồng khác (cuộc gọi, phiên, mã thông báo API) không được bảo vệ nhất quán.
- **Phiên bảo mật/không bảo mật hỗn hợp**: lượt xem/phân tích hoặc chuyển hướng trên web của bên thứ ba đưa ra các điểm cuối không an toàn làm rò rỉ dữ liệu phiên.


## Cách phòng ngừa (hành động quan trọng nhất)

- Coi mạng là **không đáng tin cậy theo mặc định**; giả sử lưu lượng truy cập có thể được theo dõi hoặc sửa đổi.
- Sử dụng **TLS ở mọi nơi** cho tất cả hoạt động liên lạc giữa ứng dụng với máy chủ (không chỉ xác thực).
- Thực thi xác nhận chứng chỉ nghiêm ngặt:
    - Từ chối chứng chỉ tự ký/hết hạn/không đáng tin cậy/bị thu hồi/máy chủ sai
    - Yêu cầu xác minh toàn bộ chuỗi và “đóng thất bại” (không tiến hành âm thầm)
- Sử dụng **cấu hình TLS mạnh**:
    - Vô hiệu hóa các giao thức/mật mã không được dùng nữa
    - Ưu tiên các bộ mật mã hiện đại và độ dài khóa thích hợp
- Cân nhắc **ghim chứng chỉ** cho các ứng dụng có rủi ro cao (để giảm MITM ngay cả với các CA lừa đảo).
- Tránh gửi dữ liệu nhạy cảm qua **các kênh thay thế** (SMS, thông báo, nhật ký).
- Đối với các tải trọng có độ nhạy cao, hãy thêm **lớp ứng dụng encryption** lên trên TLS làm lớp bảo vệ chuyên sâu.
- Trong quá trình kiểm tra bảo mật, **kiểm tra lưu lượng truy cập mạng** để đảm bảo không có rò rỉ nhạy cảm nào trên văn bản gốc hoặc TLS yếu.


































