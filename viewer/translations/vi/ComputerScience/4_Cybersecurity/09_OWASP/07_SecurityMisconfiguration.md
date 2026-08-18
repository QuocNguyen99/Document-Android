# Cấu hình sai bảo mật

## Nó là gì

Cấu hình bảo mật sai xảy ra khi một ứng dụng di động được cung cấp với **cài đặt bảo mật không an toàn hoặc không chính xác** (cấu hình, quyền, kiểm soát truy cập, mật mã, quy tắc mạng, xử lý phiên).
Những lỗi này có thể tạo điều kiện cho **quyền truy cập trái phép**, lộ dữ liệu hoặc các hành động đặc quyền—thường do phát hành vội vàng, lỗi của con người hoặc để cài đặt phát triển trong quá trình sản xuất.

## Các kịch bản tấn công thường gặp:

- **Cài đặt mặc định không an toàn**: mặc định yếu, các quyền không cần thiết hoặc thông tin xác thực mặc định không thay đổi.
- **Kiểm soát truy cập không đúng**: ủy quyền bị định cấu hình sai cho phép truy cập vào dữ liệu nhạy cảm hoặc các hành động đặc quyền.
- **encryption hoặc hàm băm yếu**: các lựa chọn về mật mã đã lỗi thời/không chính xác giúp khôi phục dữ liệu nhạy cảm dễ dàng hơn.
- **Thiếu kết nối an toàn**: cho phép HTTP hoặc cài đặt TLS yếu cho phép nghe lén / MITM.
- **Bộ nhớ không được bảo vệ**: mật khẩu, khóa API hoặc mã thông báo được lưu trữ ở dạng văn bản gốc hoặc định dạng được bảo vệ yếu.
- **Quyền truy cập tệp không an toàn**: tệp hoặc tùy chọn được lưu trữ dưới dạng có thể đọc được trên thế giới/có thể ghi trên thế giới (Android).
- **Quản lý phiên bị định cấu hình sai**: token/xử lý phiên yếu cho phép chiếm quyền điều khiển hoặc mạo danh phiên.
- **Cài đặt đường dẫn nhà cung cấp tệp không an toàn**: FileProvider đã xuất hiển thị các đường dẫn rộng, cho phép truy cập vào tài nguyên nội bộ.
- **Hoạt động đã xuất**: Activities/Dịch vụ/Nhà cung cấp nội bộ đã xuất hoặc có thể duyệt, tạo thêm attack surface.
- **Các quyền không cần thiết**: yêu cầu các quyền không cần thiết cho chức năng cốt lõi, làm tăng rủi ro về quyền riêng tư/bảo mật.

## Cách phòng ngừa (hành động quan trọng nhất)

- **Bảo mật cấu hình mặc định**: xem xét và củng cố tất cả các cài đặt mặc định trước khi phát hành; xóa các cờ không an toàn và các phím tắt dành cho nhà phát triển.
- **Thông tin xác thực mặc định**: không bao giờ gửi tên người dùng/mật khẩu mặc định được mã hóa cứng hoặc không thay đổi.
- **Quyền không an toàn**: tránh bộ nhớ có thể đọc được/có thể ghi trên thế giới và các chế độ tệp quá dễ dãi.
- **Nguyên tắc Least privilege**: chỉ request các quyền được yêu cầu nghiêm ngặt đối với các tính năng.
- **Cấu hình mạng an toàn**: không cho phép lưu lượng văn bản rõ ràng; sử dụng TLS mạnh và xem xét việc ghim chứng chỉ khi thích hợp.
- **Tắt gỡ lỗi**: đảm bảo các bản phát hành không thể gỡ lỗi được; giảm ghi nhật ký nhạy cảm và xóa endpoint gỡ lỗi.
- **Tắt chế độ sao lưu (Android)**: loại trừ dữ liệu ứng dụng nhạy cảm khỏi bản sao lưu thiết bị nếu có.
- **Giới hạn ứng dụng attack surface**: chỉ xuất Activities/Dịch vụ/Nhà cung cấp phải xuất; khóa các bộ lọc ý định và đường dẫn FileProvider.
- **Đánh giá và kiểm tra thường xuyên**: chạy đánh giá cấu hình, quét tự động và kiểm tra bảo mật để sớm phát hiện các cấu hình sai.


















