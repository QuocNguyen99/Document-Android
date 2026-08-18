# Lưu trữ dữ liệu không an toàn

## Nó là gì

Dữ liệu nhạy cảm được lưu trữ trên thiết bị theo cách mà kẻ tấn công có thể đọc hoặc sửa đổi (ví dụ: tệp/cơ sở dữ liệu văn bản gốc, encryption yếu hoặc bị thiếu, bộ đệm không an toàn). 
Rủi ro gia tăng khi có quyền truy cập vật lý, phần mềm độc hại, thiết bị đã root/bẻ khóa, bản sao lưu và nhật ký bị lộ.


## Các kịch bản tấn công thường gặp:

- **Bí mật văn bản gốc**: mật khẩu/mã thông báo/khóa API được lưu trữ không được mã hóa trong các tệp, cơ sở dữ liệu cục bộ, SharedPreferences.
- **Cache không an toàn**: mã thông báo xác thực/dữ liệu phiên được lưu vào cache mà không có biện pháp bảo vệ hoặc hết hạn thích hợp, tạo điều kiện cho việc mạo danh.
- **Nhật ký không được bảo vệ**: PII hoặc response/lỗi API nhạy cảm được ghi vào nhật ký hoặc báo cáo sự cố và sau đó được trích xuất.
- **Trích xuất bản sao lưu**: dữ liệu hộp cát nhạy cảm có trong bản sao lưu thiết bị và bị kẻ tấn công khôi phục.
- **Ghi root/bẻ khóa**: quyền truy cập nâng cao cho phép đọc/giả mạo trực tiếp bộ nhớ ứng dụng.
- **Rò rỉ tệp tạm thời**: dữ liệu nhạy cảm bị bỏ lại trong tệp tạm thời sau khi xử lý.
- **Cấu hình sai bộ nhớ đám mây**: cài đặt bộ nhớ quá dễ dãi sẽ làm lộ dữ liệu được lưu trữ

## Cách phòng ngừa (hành động quan trọng nhất)
- **Sử dụng Strong Encryption**: mã hóa dữ liệu nhạy cảm ở phần lưu trữ bằng thuật toán hiện đại; bảo vệ chìa khóa đúng cách.
- **Truyền dữ liệu an toàn**: luôn sử dụng HTTPS/TLS khi dữ liệu di chuyển giữa ứng dụng và server.
- **Triển khai Cơ chế lưu trữ an toàn**: sử dụng lưu trữ bảo mật nền tảng (iOS Blockchain, Android Keystore/bộ nhớ được mã hóa).
- **Sử dụng Kiểm soát truy cập phù hợp**: yêu cầu xác thực/ủy quyền trước khi đọc hoặc ghi dữ liệu nhạy cảm.
- **Xác thực dữ liệu đầu vào và vệ sinh**: ngăn chặn việc tiêm và đảm bảo chỉ lưu trữ/xử lý dữ liệu dự kiến.
- **Áp dụng Quản lý phiên an toàn**: sử dụng mã thông báo ngẫu nhiên mạnh, hết hạn hợp lý và bảo vệ mã thông báo khỏi bị rò rỉ.
- **Cập nhật thường xuyên và bản vá phụ thuộc**: luôn cập nhật thư viện/SDK để tránh các sự cố đã biết liên quan đến bộ nhớ.
- **Luôn cập nhật**: theo dõi các tư vấn và thay đổi nền tảng ảnh hưởng đến các phương pháp hay nhất về lưu trữ/bảo mật.


















