## Kiểm soát quyền riêng tư không đầy đủ

## Nó là gì

Rủi ro này xảy ra khi một ứng dụng thu thập, sử dụng, lưu trữ hoặc chia sẻ Thông tin nhận dạng cá nhân (PII) mà không có biện pháp bảo vệ quyền riêng tư mạnh mẽ. PII có thể bao gồm tên, địa chỉ, email, địa chỉ IP, chi tiết thanh toán, dữ liệu vị trí và các danh mục có độ nhạy cảm cao (sức khỏe, tôn giáo, tình dục, quan điểm chính trị). 
Nếu xử lý sai, PII có thể bị rò rỉ, thay đổi hoặc phá hủy, gây tổn hại nghiêm trọng cho người dùng và gây ra rủi ro pháp lý lớn cho doanh nghiệp.

## Các kịch bản tấn công thường gặp:

- **PII bị rò rỉ thông qua nhật ký/báo cáo sự cố**: Nhà phát triển (hoặc SDK bên thứ ba) vô tình ghi lại dữ liệu nhạy cảm, dẫn đến nhật ký thiết bị, phân tích sự cố hoặc màn hình lỗi.
- **PII trong tham số truy vấn URL**: Dữ liệu nhạy cảm được gửi trong URL, sau đó được lưu trữ trong nhật ký server, công cụ phân tích, lịch sử trình duyệt hoặc proxy.
- **Hiển thị PII qua bản sao lưu**: Dữ liệu hộp cát ứng dụng được bao gồm trong bản sao lưu thiết bị; những kẻ tấn công có được bản sao lưu có thể trích xuất thông tin nhạy cảm.
- **Gỡ cài đặt/cài đặt lại tính bền vững của dữ liệu (Android)**: Cấu hình sai (ví dụ: bảo toàn dữ liệu khi gỡ cài đặt) cho phép ứng dụng sau này có cùng gói ID truy cập vào dữ liệu người dùng còn sót lại.
- **PII được trích xuất sau một lần vi phạm khác**: Trước tiên, kẻ tấn công xâm phạm bộ nhớ/mạng/xác thực (ví dụ: giao tiếp không an toàn hoặc xác thực yếu) rồi thu thập PII từ tệp, bảng nhớ tạm hoặc nhật ký.


## Cách phòng ngừa (hành động quan trọng nhất)

- **Giảm thiểu PII**: chỉ thu thập và giữ lại những gì cần thiết; giảm độ chi tiết (vị trí thô), tần suất (ít thường xuyên hơn) và khả năng lưu giữ (xóa sau khi hết hạn).
- **Ẩn danh/bí danh nếu có thể**: băm, gộp, che hoặc thêm tiếng ồn tùy thuộc vào trường hợp sử dụng.
- **Sử dụng sự đồng ý rõ ràng cho PII tùy chọn**: cho phép người dùng chọn tham gia/không tham gia và hiểu được sự đánh đổi.
- **Lưu trữ và truyền tải an toàn**: xử lý PII giống như các dữ liệu nhạy cảm khác—mã hóa khi lưu trữ, sử dụng TLS khi truyền và tránh để lộ dữ liệu đó trong nhật ký/URL.
- **Kiểm soát truy cập mạnh mẽ**: yêu cầu xác thực/ủy quyền phù hợp cho mọi quyền truy cập PII.
- **Bảo vệ chuyên sâu cho dữ liệu có rủi ro cao**: thêm các lớp bảo vệ bổ sung cho các danh mục quan trọng (ví dụ: bảo vệ khóa dựa trên thiết bị).
- **Ngăn chặn rò rỉ ngẫu nhiên**: vệ sinh nhật ký/lỗi, xem xét SDK của bên thứ ba và tránh để lộ bảng nhớ tạm/tham số truy vấn.
- **Xác thực thông qua kiểm tra bảo mật**: mô hình mối đe dọa PII; sử dụng kiểm tra tĩnh/động để phát hiện ghi nhật ký, rò rỉ URL và các vấn đề liên quan đến sao lưu.

































