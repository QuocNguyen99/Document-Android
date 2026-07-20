# Mật mã không đủ


## Nó là gì

Rủi ro này xảy ra khi một ứng dụng di động sử dụng **mật mã yếu, lỗi thời hoặc được triển khai không chính xác** (encryption, băm, quản lý khóa, tính ngẫu nhiên, cấu hình TLS). 
Do đó, những kẻ tấn công có thể **giải mã dữ liệu nhạy cảm, giả mạo/giả mạo nội dung được bảo vệ hoặc đánh cắp/lạm dụng khóa encryption**.


## Các kịch bản tấn công thường gặp:

- **Thuật toán yếu hoặc không được dùng nữa**: sử dụng mật mã lỗi thời hoặc hàm băm không an toàn mà kẻ tấn công có thể phá vỡ hoặc đảo ngược.
- **Độ dài khóa không đủ**: khóa ngắn/có thể đoán được khiến các cuộc tấn công bạo lực trở nên khả thi.
- **Quản lý khóa kém**: khóa được lưu trữ không an toàn, bị rò rỉ trong nhật ký hoặc được truyền dưới dạng bản rõ.
- **Lỗi triển khai**: sử dụng sai thư viện mật mã, tạo số ngẫu nhiên không an toàn hoặc mã mật mã tùy chỉnh có lỗi.
- **Thiếu băm mật khẩu/băm mật khẩu yếu**: băm mật khẩu bị bẻ khóa thông qua bảng Rainbow hoặc lực lượng vũ phu nhanh.
- **TLS hạ cấp/dự phòng yếu**: kẻ tấn công buộc encryption yếu hơn trong quá trình thiết lập kết nối.
- **Giả mạo dữ liệu MitM**: mật mã yếu cho phép giải mã, sửa đổi và mã hóa lại dữ liệu bị chặn mà không bị phát hiện.


## Cách phòng ngừa (hành động quan trọng nhất)

- **Sử dụng thuật toán Encryption mạnh**: dựa vào mật mã hiện đại, được chấp nhận rộng rãi (ví dụ: AES, RSA/ECC) và tránh các tùy chọn không được dùng nữa.
- **Đảm bảo đủ độ dài khóa**: tuân theo hướng dẫn hiện hành của ngành về kích thước khóa cho mỗi thuật toán.
- **Tuân theo các phương pháp quản lý khóa an toàn**: bảo vệ khóa bằng khả năng kiểm soát truy cập mạnh mẽ; sử dụng bộ nhớ an toàn (HSM/kho khóa nếu có).
- **Triển khai Encryption đúng cách**: sử dụng các thư viện/khuôn khổ được đánh giá tốt; tránh việc triển khai tiền điện tử tùy chỉnh.
- **Lưu trữ an toàn khóa Encryption**: lưu trữ khóa trong OS- được cung cấp bộ lưu trữ an toàn (iOS Chuỗi khóa, Kho khóa Android), không bao giờ là văn bản thuần túy.
- **Sử dụng Lớp truyền tải an toàn**: sử dụng HTTPS/TLS với xác thực chứng chỉ phù hợp và cấu hình mật mã mạnh.
- **Xác thực và Xác thực**: sử dụng chữ ký/xác thực chứng chỉ để đảm bảo tính toàn vẹn và xác thực khi cần thiết.
- **Thường xuyên cập nhật các biện pháp bảo mật**: luôn cập nhật các thư viện tiền điện tử và các thành phần nền tảng.
- **Tiến hành kiểm tra bảo mật**: thực hiện đánh giá tập trung vào tiền điện tử, kiểm tra thâm nhập và kiểm tra mã.
- **Tuân theo các tiêu chuẩn ngành và các phương pháp hay nhất**: tuân thủ hướng dẫn từ các cơ quan tiêu chuẩn (ví dụ: NIST/IETF).
- **Sử dụng Hàm băm mạnh**: sử dụng hàm băm mật khẩu/KDF hiện đại (ví dụ: bcrypt/scrypt/PBKDF2) và hàm băm an toàn (ví dụ: SHA-256) khi thích hợp.
- **Thực hiện Salting:** luôn sử dụng muối mạnh ngẫu nhiên để băm mật khẩu.
- **Sử dụng Hàm dẫn xuất khóa (KDF)**: sử dụng KDF cho bí mật dựa trên mật khẩu với đủ số lần lặp/hệ số công việc.
























