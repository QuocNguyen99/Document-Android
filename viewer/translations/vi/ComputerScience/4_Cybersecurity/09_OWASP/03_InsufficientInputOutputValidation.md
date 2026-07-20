# Xác thực đầu vào/đầu ra không đủ


## Nó là gì

Rủi ro này xảy ra khi một ứng dụng di động (hoặc chương trình phụ trợ của ứng dụng đó) **không xác thực và vệ sinh đúng cách dữ liệu đầu vào hoặc đầu ra** đến từ các nguồn không đáng tin cậy (người dùng, API, liên kết sâu, tệp, phản hồi mạng). 
Do đó, kẻ tấn công có thể tiêm dữ liệu độc hại dẫn đến **đánh cắp dữ liệu, thao túng dữ liệu, treo máy hoặc thậm chí thực thi mã**.


## Các kịch bản tấn công phổ biến


- **SQL Tiêm**: Dữ liệu đầu vào không được xác thực được chèn vào các truy vấn cơ sở dữ liệu, cho phép kẻ tấn công đọc/sửa đổi dữ liệu.
- **Chèn lệnh**: Đầu vào được chuyển vào các lệnh hệ thống hoặc đường dẫn thực thi không an toàn, cho phép thực thi mã từ xa.
- **XSS / Chèn tập lệnh**: Dữ liệu không đáng tin cậy được hiển thị ở các đầu ra dựa trên WebViews hoặc HTML- mà không khử trùng, cho phép đánh cắp phiên/dữ liệu hoặc thao tác UI.
- **Truyền tải đường dẫn / Lạm dụng tệp**: Đường dẫn tệp hoặc tên tệp không được xác thực, cho phép kẻ tấn công truy cập hoặc ghi đè lên các tệp ngoài ý muốn.
- **Đầu vào/đầu ra không đúng định dạng gây ra sự cố hoặc hỏng**: Các định dạng không mong muốn (chuỗi rất dài, ký tự đặc biệt, JSON bị hỏng) có thể gây ra tình trạng mất ổn định, trạng thái bị lỗi hoặc xử lý không chính xác.


## Cách phòng ngừa (hành động quan trọng nhất)


- **Áp dụng input validation nghiêm ngặt**: đưa các định dạng dự kiến ​​vào danh sách cho phép, thực thi kiểm tra loại, giới hạn độ dài và từ chối các ký tự/cấu trúc không mong muốn.
- Sử dụng **biện pháp bảo vệ theo ngữ cảnh**:
    - Truy vấn được tham số hóa/câu lệnh được chuẩn bị cho cơ sở dữ liệu (không nối chuỗi cho truy vấn).
    - API an toàn để truy cập tệp (chuẩn hóa đường dẫn, hạn chế thư mục, xác thực loại tệp).
    - Không bao giờ chuyển đầu vào thô vào thực thi shell/lệnh.
- Thực thi **mã hóa và vệ sinh đầu ra**:
    - Mã hóa đầu ra dựa trên ngữ cảnh (HTML, URL, JSON).
    - Dọn dẹp mọi nội dung do người dùng tạo hoặc không đáng tin cậy trước khi hiển thị (đặc biệt là trong WebViews).
- **Thêm kiểm tra tính toàn vẹn dữ liệu**: xác thực chữ ký/băm khi cần, phát hiện giả mạo, xác thực lược đồ cho các phản hồi của mạng.
- **Xây dựng hệ thống phòng thủ chuyên sâu**: các tiện ích xác thực tập trung, xử lý lỗi nhất quán, giới hạn tốc độ và ghi nhật ký các tải trọng đáng ngờ.
- Chạy **kiểm tra bảo mật thông thường**: code review + Kiểm tra bảo mật ứng dụng tĩnh/Kiểm tra bảo mật ứng dụng động + quét phụ thuộc + kiểm tra thâm nhập của đầu vào API và các trường hợp biên.






















