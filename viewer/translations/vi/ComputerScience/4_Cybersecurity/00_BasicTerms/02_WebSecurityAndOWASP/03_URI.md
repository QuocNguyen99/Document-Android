# Mã định danh tài nguyên thống nhất

**Mã định danh tài nguyên thống nhất** hoặc URI còn được gọi là **URL** tuyệt đối là một chuỗi ký tự được sử dụng để nhận dạng duy nhất một tài nguyên trên internet.

Điều đáng nói là ngoại trừ `http://` và `https://` nổi tiếng còn có nhiều cái khác:


## Mã hóa và giải mã URI


Mã hóa URI(L) là phương pháp được sử dụng để đảm bảo rằng URL chỉ chứa các ký tự hợp lệ theo tiêu chuẩn **RFC 3986**, bao gồm các chữ số, chữ cái và một số ký hiệu nhất định trong bộ ký tự ASCII. Nếu URL có các ký tự nằm ngoài bộ này, chúng sẽ được chuyển đổi thành định dạng đặc biệt bằng cách sử dụng mã hóa phần trăm, giúp server dễ dàng hiểu được chúng.



> [!NOTE]
> Điều quan trọng cần lưu ý là mã hóa URL không giống với encryption. 
> Encryption nói về việc bảo mật thông tin bằng khóa bí mật, trong khi mã hóa URL nhằm mục đích đảm bảo server có thể hiểu được URL và ngăn chặn sự thao túng của người dùng.



Các ngôn ngữ lập trình khác nhau cung cấp API cho cả URL mã hóa và giải mã.

- **Python**: `urllib.parse.quote()` và `urllib.parse.unquote()`
- **JavaScript**: `encodeURIComponent()` và `decodeURIComponent()`
- **Java**: `java.net.URLEncoder` và `java.net.URLDecoder`
- **Đi**: `url.QueryEscape()` và `url.QueryUnescape()`
- **C++**: không có công cụ mã hóa/giải mã tích hợp, tuy nhiên bạn có thể sử dụng `cpp-httplib` của bên thứ ba
- **Rỉ sét**: `url::percent_encoding`



## Các cuộc tấn công dựa trên URI- phổ biến thông qua tham số URI


Dưới đây là một số cuộc tấn công dựa trên URI- phổ biến:

**SQL Tiêm**: Kẻ tấn công thao túng các tham số URI để tiêm mã SQL độc hại vào các truy vấn cơ sở dữ liệu của ứng dụng.
- Ví dụ: `https://example.com/products?category=electronics' OR 1=1 --`
- Tác động: Có thể dẫn đến truy cập trái phép, rò rỉ dữ liệu hoặc thậm chí là thao túng dữ liệu.
**Tập lệnh chéo trang (XSS)** Kẻ tấn công chèn các tập lệnh độc hại vào URI, sau đó chúng được thực thi trong trình duyệt của nạn nhân khi họ truy cập URL bị thao túng.

- Ví dụ: `https://example.com/search?query=<script>alert("XSS");</script>`
- Tác động: Cho phép kẻ tấn công đánh cắp dữ liệu người dùng, thực hiện các hành động thay mặt người dùng hoặc làm hỏng trang web.
**Truyền tải đường dẫn**: Kẻ tấn công khai thác xác thực URI không đầy đủ để điều hướng bên ngoài cấu trúc tệp hoặc thư mục dự định.
- Ví dụ: `https://example.com/download?file=../../../etc/passwd`
**Chuyển hướng mở**: Kẻ tấn công tạo URL chuyển hướng người dùng đến các trang web độc hại, thường được sử dụng trong các cuộc tấn công lừa đảo.
- Tác động: Có thể dẫn tới việc truy cập trái phép vào các tập tin hoặc thư mục nhạy cảm.
- Ví dụ: `https://example.com/redirect?url=https://malicious.com`
- Tác động: Lừa người dùng truy cập các trang web độc hại, tiềm ẩn nguy cơ dẫn đến mất cắp dữ liệu hoặc lây nhiễm phần mềm độc hại.
**Ô nhiễm tham số**: Kẻ tấn công thao túng các tham số URI để gây nhầm lẫn cho logic xử lý của ứng dụng.
- Ví dụ: `https://example.com/search?query=term1&query=term2`
- Tác động: Có thể dẫn đến hành vi ngoài ý muốn, lỗ hổng hoặc lỗi trong ứng dụng.

**HTTP Giả mạo động từ** — Kẻ tấn công thao túng phương thức request `HTTP` (`GET`, `POST`, `PUT`, `DELETE`, v.v.) trong URI để thực hiện các hành động trái phép.


**Tiết lộ thông tin** — Kẻ tấn công thao túng URI để tiết lộ thông tin nhạy cảm như chi tiết server nội bộ hoặc thông tin gỡ lỗi.


**Từ chối dịch vụ (DoS)** — Kẻ tấn công tạo URI để tiêu thụ quá nhiều tài nguyên server, khiến người dùng hợp pháp không thể sử dụng ứng dụng.

**Thao tác cookie** — Kẻ tấn công thao túng URI để chèn hoặc sửa đổi cookie, có khả năng giành được quyền truy cập trái phép hoặc mạo danh người dùng.

## Thiết kế và triển khai URI an toàn

Dưới đây là một số phương pháp hay nhất để đảm bảo thiết kế và triển khai URI an toàn:

1. **Input Validation**:

    - **Xác thực tất cả thông tin đầu vào của người dùng**: Đảm bảo rằng tất cả dữ liệu nhận được qua URI đều được xác thực cho cả loại và nội dung. Từ chối bất kỳ đầu vào nào không phù hợp với mẫu hoặc định dạng dự kiến.

    - **Sạch hóa đầu vào**: Vệ sinh dữ liệu đầu vào để loại bỏ hoặc thoát khỏi các ký tự độc hại tiềm ẩn nhằm ngăn chặn các cuộc tấn công tiêm nhiễm như tiêm SQL hoặc Cross-Site Scripting (XSS).

2. **Truy vấn được tham số hóa** — Khi tương tác với cơ sở dữ liệu thông qua URI, hãy sử dụng các truy vấn được tham số hóa hoặc câu lệnh được chuẩn bị sẵn để ngăn chặn các cuộc tấn công tiêm nhiễm SQL. Không bao giờ nối trực tiếp thông tin đầu vào của người dùng vào các truy vấn SQL.

3. **Mã hóa đầu ra** — Mã hóa nội dung do người dùng tạo trước khi đưa nội dung đó vào URI để ngăn chặn các cuộc tấn công XSS. Sử dụng các chức năng như `url.QueryEscape` hoặc `html.EscapeString` nếu thích hợp.

4. **Cách sử dụng HTTPS** — Luôn sử dụng sơ đồ HTTPS (`https://`) trong URI để đảm bảo liên lạc được mã hóa giữa client và server, ngăn chặn việc chặn dữ liệu.

5. **Quản lý phiên** — Tránh đưa dữ liệu phiên nhạy cảm vào URI. Thay vào đó, hãy sử dụng cookie an toàn hoặc mã thông báo phiên để quản lý phiên của người dùng.

6. **Danh sách trắng URL** — Triển khai danh sách trắng URL để chỉ cho phép truy cập vào các URI cụ thể, đáng tin cậy. Từ chối mọi request đối với các URI trái phép hoặc không xác định.

7. **Danh sách đen** — Duy trì danh sách đen các URI độc hại hoặc mẫu URI đã biết và từ chối quyền truy cập vào chúng.

8. **Kiểm soát quyền truy cập phù hợp** — Đảm bảo rằng các biện pháp kiểm soát truy cập dựa trên URI- được thực thi. Đừng chỉ dựa vào độ ẩn danh của URI để bảo mật. Sử dụng kiểm soát truy cập dựa trên vai trò (RBAC) hoặc các cơ chế ủy quyền khác.

9. **Ngăn chặn truyền tải đường dẫn** — Triển khai xác thực đường dẫn URI thích hợp và bảo vệ truyền tải đường dẫn để hạn chế quyền truy cập vào các thư mục và tệp trái phép.

10. **Giới hạn tốc độ** — Triển khai giới hạn tốc độ cho các URI liên quan đến các hoạt động nhạy cảm hoặc xác thực người dùng để ngăn chặn hành vi lạm dụng và tấn công vũ phu.


## Danh sách trắng và danh sách đen URI

**Danh sách trắng URI** là một cơ chế kiểm soát quyền truy cập trong đó bạn chỉ định rõ ràng danh sách các URI được phép hoặc được phép mà người dùng hoặc client được phép truy cập.


Giả sử bạn có một ứng dụng web có các URI sau:

- `/home`
- `/profile`
- `/dashboard`
- `/logout`

Bạn có thể tạo danh sách trắng URI chỉ bao gồm các URI này. Mọi nỗ lực truy cập URI không có trong danh sách trắng sẽ dẫn đến việc từ chối truy cập.

**Mặt khác, danh sách đen URI** là một cơ chế kiểm soát quyền truy cập trong đó bạn chỉ định rõ ràng danh sách các URI không được phép hoặc bị cấm mà người dùng hoặc client không được phép truy cập. Mọi request đối với URI trong danh sách đen đều bị từ chối hoặc hạn chế

Bạn duy trì một danh sách đen các URI được biết là được sử dụng cho các cuộc tấn công lừa đảo hoặc các mục đích độc hại khác.




