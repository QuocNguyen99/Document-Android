# Bảo vệ nhị phân không đủ


## Nó là gì

Rủi ro này xảy ra khi kẻ tấn công có thể đảo ngược kỹ thuật hoặc giả mạo tệp nhị phân của ứng dụng (APK/IPA). 
Các tệp nhị phân có thể chứa nội dung có giá trị (khóa API, bí mật tiền điện tử, logic kinh doanh, mô hình AI) và có thể được sửa đổi để vượt qua các biện pháp kiểm soát (tường thanh toán, kiểm tra giấy phép) hoặc phân phối lại dưới dạng ứng dụng độc hại/giả mạo.


## Các kịch bản tấn công thường gặp:

- **Kỹ thuật đảo ngược**: dịch ngược mã nhị phân để trích xuất bí mật (khóa API, tài liệu mật mã), logic độc quyền hoặc xác định các điểm yếu phụ trợ.
- **Giả mạo mã**: sửa đổi tệp nhị phân để bỏ qua việc kiểm tra giấy phép/thanh toán, xóa các biện pháp kiểm soát bảo mật hoặc mở khóa các tính năng phải trả phí.
- **Đóng gói lại & phân phối lại**: xuất bản một bản sao đã sửa đổi (thường là trên các cửa hàng của bên thứ ba hoặc dưới một tên mới), đôi khi có phần mềm độc hại hoặc mã nhận dạng thanh toán đã thay đổi để thanh toán được chuyển đến tay kẻ tấn công.
- **Trộm cắp IP trên quy mô lớn**: trích xuất và tái sử dụng các thuật toán độc quyền hoặc các mô hình AI được nhúng, mang lại lợi thế không công bằng cho đối thủ cạnh tranh

## Cách phòng ngừa (hành động quan trọng nhất)

- **Tránh nhúng bí mật vào hệ nhị phân**: không mã hóa khóa API/bí mật mật mã; sử dụng các điều khiển phía server và mã thông báo có thể hủy bỏ.
- **Làm cho kỹ thuật đảo ngược trở nên khó khăn hơn**: áp dụng tính năng làm rối mã nguồn/thu nhỏ (đặc biệt là trên Android), giảm các ký hiệu/chuỗi bị lộ, xem xét các thành phần gốc/khó dịch ngược hơn khi thích hợp.
- **Không tin tưởng vào hoạt động kiểm tra phía client**: thực thi các khoản thanh toán/quyền và các quyết định bảo mật quan trọng ở phần phụ trợ (có thể bỏ qua kiểm tra cục bộ).
- **Thêm tính năng phát hiện tính toàn vẹn/giả mạo**: phát hiện chữ ký đóng gói lại hoặc sửa đổi tại runtime và xử lý một cách an toàn (chặn, xuống cấp hoặc báo cáo).
- **Giám sát và phản hồi các bản sao**: phát hiện các bản sao trái phép trong các cửa hàng ứng dụng và sử dụng quy trình gỡ bỏ/báo cáo; xem xét các dịch vụ chuyên biệt dành cho các ứng dụng có cấu hình cao.
- **Kế hoạch xoay vòng nhanh**: đảm bảo các khóa/bí mật bị rò rỉ có thể được thu hồi/xoay vòng nhanh chóng mà không cần đợi tất cả người dùng cập nhật.

> [!Lưu ý]: Không có biện pháp bảo vệ hoàn hảo trước các cuộc tấn công nhị phân. 
> Mục tiêu là tăng chi phí cho những kẻ tấn công và giảm số tiền thu được—dựa trên rủi ro và tác động kinh doanh của ứng dụng của bạn.




