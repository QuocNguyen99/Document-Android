# Kịch bản chéo trang

**Cuộc tấn công XSS (Cross-Site Scripting)** là một kiểu tấn công vào hệ thống web trong đó mã độc được đưa vào một trang web.
Khi người dùng mở một trang như vậy, mã độc sẽ được thực thi trên máy tính của họ và thiết lập kết nối với web server của kẻ tấn công.

Kịch bản chéo trang chủ yếu được sử dụng để đánh cắp cookie của người dùng. 
Các bên thứ ba có thể truy cập phiên của người dùng, thực hiện các yêu cầu HTTP từ người dùng, lấy thông tin xác thực của người dùng và gây khó khăn khi tương tác với trang web.
Họ thậm chí có thể tạo các chuyển hướng thường xuyên đến các trang web độc hại.


## Các kiểu tấn công XSS

Thường có hai loại trong số họ:
- **Phản ánh XSS**, trong đó tập lệnh độc hại xuất phát từ yêu cầu HTTP hiện tại. Các cuộc tấn công xảy ra khi người dùng nhấp vào liên kết được chuẩn bị đặc biệt. 

- **XSS được lưu trữ** có thể xảy ra khi kẻ tấn công tìm cách tiêm mã độc vào máy chủ, mã này được thực thi trong trình duyệt mỗi khi trang gốc được truy cập.


## Cách tìm lỗ hổng XSS

Nếu bạn muốn kiểm tra xem có lỗ hổng XSS trên trang web hay không, điều đầu tiên cần xem xét là liệu có những nơi mà người dùng có khả năng tác động đến nội dung của trang web hay không.

Ví dụ: nếu bạn nhận thấy một khu vực trên trang web nơi văn bản do người dùng nhập xuất hiện thì có thể có lỗ hổng bảo mật

```html
<script>alert("This web page is vulnerable")</script>
```
nếu bạn không quản lý để kích hoạt cửa sổ bật lên này thì các nhà phát triển đã quan tâm đến vấn đề bảo mật của trang web.

## Cách ngăn chặn các cuộc tấn công XSS

Để ngăn điều này xảy ra với trang web của bạn, bạn có thể kiểm tra lỗ hổng. 
Làm thủ công không phải lúc nào cũng hiệu quả nhưng tốn thời gian và khó khăn. 
May mắn thay, có những dịch vụ đặc biệt cho mục đích này, chẳng hạn như `xss-scanner.com`.

Ngoài ra còn có một số khuyến nghị dành cho nhà phát triển trang web và ứng dụng để ngăn chặn các cuộc tấn công XSS:
- Nếu trang web của bạn có thông tin đầu vào của người dùng, điều quan trọng là phải mã hóa dữ liệu.
- Trong trường hợp mã hóa không phù hợp, hãy thay thế bằng xác thực.
- Việc xử lý dữ liệu an toàn phải được thực hiện bằng mã không chỉ ở phía máy chủ của bạn mà còn ở phía máy khách.
- Sử dụng cờ cookie `HTTPOnly` cho Set-Cookie tiêu đề HTTP. Nó cấm đọc và ghi cookie thông qua JavaScript.
- Tốt nhất là không cho phép liên kết đến các trang web nếu chúng không bắt đầu bằng giao thức danh sách trắng, chẳng hạn như `http://`, `https://`.
- Sử dụng Chính sách bảo mật nội dung.











## thẩm quyền giải quyết:

- https://hyperskill.org/learn/step/16243