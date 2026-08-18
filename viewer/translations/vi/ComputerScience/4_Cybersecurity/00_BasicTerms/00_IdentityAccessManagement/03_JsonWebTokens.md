# Tìm hiểu về mã thông báo web JSON

## Sự định nghĩa

JWT là một tiêu chuẩn mở để trao đổi thông tin một cách an toàn dưới dạng đối tượng JSON giữa các bên. Nó đáng tin cậy vì được ký điện tử bằng khóa bí mật (HMAC) hoặc cặp khóa công khai/riêng (RSA/ECDSA), đảm bảo tính toàn vẹn và xác thực.

## Trường hợp sử dụng

1. **Authentication**: Được sử dụng để xác minh người dùng sau khi đăng nhập bằng cách gửi token với mỗi request.
2. **Authorization**: Bao gồm các xác nhận quyền sở hữu (ví dụ: vai trò) để xác minh quyền truy cập.  
3. **Đăng nhập một lần (SSO)**: Cho phép xác thực liền mạch trên nhiều hệ thống.  
4. **API Authentication không trạng thái**: Được sử dụng trong API RESTful để xác thực không cần phiên, có thể mở rộng.  
5. **Quyền truy cập của bên thứ ba**: Cấp quyền truy cập hạn chế vào các tài nguyên (ví dụ: OAuth 2.0).  
6. **Miền chéo Authentication**: Xác thực người dùng trên các miền hoặc dịch vụ khác nhau.

## Cấu trúc của JWT

JWT bao gồm ba phần: `Header.Payload.Signature`.

- **Tiêu đề**: Chứa siêu dữ liệu về token (ví dụ: loại và thuật toán ký).  
- **Payload**: Chứa các xác nhận quyền sở hữu (cặp khóa-giá trị) về người dùng hoặc hệ thống.
  - **Tuyên bố đã đăng ký**: Được xác định trước (ví dụ: `iss`, `sub`, `exp`).  
  - **Khiếu nại công khai**: Khiếu nại tùy chỉnh được đăng ký với IANA.  
  - **Xác nhận quyền sở hữu riêng**: Xác nhận quyền sở hữu tùy chỉnh để sử dụng nội bộ.  
- **Chữ ký**: Đảm bảo tính toàn vẹn và xác thực bằng cách ký vào tiêu đề và payload được mã hóa bằng khóa bí mật hoặc khóa riêng.

Chữ ký mẫu sử dụng HMAC SHA256:
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

## Tuyên bố chung
- iss: Nhà phát hành token.
- phụ: Chủ đề (ví dụ: người dùng ID).
- exp: Thời gian hết hạn (dấu thời gian UNIX).
- nbf: Không hợp lệ trước đó (dấu thời gian UNIX).
- iat: Được phát hành vào lúc (dấu thời gian UNIX).
- jti: token ID độc đáo.
## JWE và JWS
- JWS (JSON Web Signature): là tiêu chuẩn cho phép tạo và xác thực chữ ký số cho token JWT
- JWE (JSON Web Encryption): là tiêu chuẩn cho phép encryption của token JWT bảo vệ nội dung của chúng, đảm bảo chỉ những bên được ủy quyền mới có thể truy cập vào payload.
JWT được sử dụng rộng rãi để xác thực an toàn, có thể mở rộng và không trạng thái trong các ứng dụng web hiện đại.

## Các cuộc tấn công phổ biến vào JWT

- **Brute Force on Weak Secrets**: Kẻ tấn công đoán các bí mật ký yếu để giả mạo mã thông báo hợp lệ. **Sử dụng các bí mật dài, ngẫu nhiên, giới hạn tốc độ và phát hiện sự bất thường.**

- **Lạm dụng thuật toán 'Không'**: Kẻ tấn công thay đổi tiêu đề thành `alg: none` và giả mạo các xác nhận quyền sở hữu nếu xác minh yếu. **Luôn từ chối mã thông báo chưa được ký và thực thi các thuật toán đã được phê duyệt.**

- **Nhầm lẫn thuật toán (RS256 → HS256)**: Kẻ tấn công chuyển sang HS256 và sử dụng sai khóa chung làm bí mật HMAC. **Khắc phục bằng cách mã hóa cứng các thuật toán dự kiến ​​và xác thực các loại khóa.**

- **Rò rỉ khóa**: Khóa ký bị đánh cắp cho phép kẻ tấn công tạo ra các mã thông báo hợp lệ. Bảo vệ khóa trong kho/HSM an toàn, sử dụng phương thức truyền tải được mã hóa và luân chuyển khóa thường xuyên.

## Chiến lược làm mới và hết hạn Token

Quản lý JWT lifecycle phải cân bằng giữa bảo mật và trải nghiệm người dùng.

- **Đặt quyền truy cập ngắn-token TTL**: Giữ thời gian truy cập ngắn của token để giảm việc sử dụng sai nếu bị đánh cắp (thường vài phút đến vài giờ, tùy theo rủi ro).

- **Sử dụng refresh token**: Cho phép người dùng nhận mã thông báo truy cập mới mà không cần đăng nhập nhiều lần. Giữ refresh token tồn tại lâu hơn nhưng lưu trữ và sử dụng chúng một cách an toàn.

- **Xác thực refresh token một cách nghiêm ngặt**: Xác minh tính toàn vẹn, kiểm tra việc thu hồi và quản lý việc phát hành/lưu trữ một cách cẩn thận để ngăn chặn truy cập trái phép.



