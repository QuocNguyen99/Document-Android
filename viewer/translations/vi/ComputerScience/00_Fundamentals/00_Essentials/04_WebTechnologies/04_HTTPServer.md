# HTTP server

## Định nghĩa
Web server hay HTTP server là một chương trình trên máy tính có thể xử lý client request và gửi câu trả lời lại cho client.

Khi server khởi động, nó luôn chờ request và trả lời từng request bằng cách gửi lại thông tin được yêu cầu.

HTTP server là một phần của mô hình tương tác client-server.

![văn bản thay thế](/resources/client_serer_model.png)


## Kiến trúc Client-server.

Server lưu trữ các trang web **tĩnh**, **động** hoặc **kết hợp**.
- Các trang tĩnh được tạo sẵn. Khi client request một trang, server sẽ trả về một tài liệu dựng sẵn hoàn chỉnh.
- Các trang động có phần dựng sẵn mà server có thể gửi cho client.

Sau đó, JavaScript ở phía client sẽ tạo các phần khác của trang web bằng cách yêu cầu thông tin bổ sung từ một server khác, chẳng hạn như server REST API.

## Ủy quyền

HTTP server không chỉ có thể phản hồi request mà còn có thể chuyển hướng request đến các server khác. Các server như vậy được gọi là server proxy

Server proxy sẽ có ích nếu bạn có nhiều web server đằng sau một tên miền và muốn chuyển hướng request đến đúng server.


Ví dụ: bạn có trang web của mình trên web server chính.
Bạn cũng có bảng quản trị cho trang web của mình trên một server khác.
Server proxy có thể kiểm soát server nào sẽ nhận request của client tùy thuộc vào tên miền.

![văn bản thay thế](/resources/proxy_server.png)


Một client có thể gửi request đến một server thông qua hai tên miền khác nhau. Nhưng nó sẽ nhận được response từ server đằng sau proxy.

## Cân bằng tải

Là một proxy, HTTP server có thể hoạt động như bộ cân bằng tải.
HTTP server có thể gửi request của client đến các server riêng biệt để giảm tải cho server cuối.
Vì vậy, nếu một dịch vụ có nhiều client thì nên đặt một server cân bằng tải để giảm tải cho các server xử lý client request.
HTTP server cung cấp cho quản trị viên cấu hình cài đặt cân bằng để cân bằng linh hoạt.

## Mã hóa

Khi request của bạn được gửi đến server, nó thường đi qua nhiều nút trước khi đến server.
Và bất kỳ ai trên các nút này đều có thể xem dữ liệu bạn đã gửi. Họ cũng có thể đọc response của server.
Vì vậy, HTTP server có thể bảo mật kết nối bằng cách sử dụng chứng chỉ.

Kết nối HTTP an toàn được gọi là HTTPS (S là viết tắt của Secure). HTTPS protocol không phải là protocol hoàn toàn khác với HTTP protocol.
**Sự khác biệt là HTTPS hoạt động theo cơ chế truyền tải TLS và SSL.** TLS – Bảo mật lớp vận chuyển, dựa trên SSL (Lớp cổng bảo mật). TLS đưa ra hướng dẫn và quy tắc để tạo dữ liệu thực sự an toàn và bảo mật qua Internet.

Tất cả dữ liệu bạn gửi và nhận đều được mã hóa bằng chứng chỉ SSL.
Giấy chứng nhận được cấp bởi các tổ chức đặc biệt và cơ quan chứng nhận. Họ ký chứng chỉ bằng chữ ký số của riêng họ.
Trình duyệt có thể xem dấu chứng chỉ và xác minh rằng chứng chỉ hợp lệ.

Đây là một trong những chương trình bảo mật phổ biến nhất trên Internet. Khi bạn gửi nội dung nào đó đến server, trước tiên trình duyệt sẽ xác minh chứng chỉ, sau đó bạn mã hóa dữ liệu của mình bằng "khóa chung".
Và server có một "khóa riêng" cần thiết để giải mã dữ liệu bạn gửi. Khi server gửi câu trả lời, nó cũng mã hóa dữ liệu bằng "khóa chung" đó. Sau đó, trình duyệt của bạn có thể giải mã chúng bằng cách sử dụng "khóa riêng".

## Đang nén

Không ai thích tốc độ tải trang chậm. HTTP server có thể nén dữ liệu được gửi.

Cũng giống như bạn có thể nén một thư mục chứa tài liệu vào một "kho lưu trữ", sau đó gửi cho ai đó bằng một tệp qua email.

Server nén tất cả các response gửi đến client, sau đó client (trình duyệt) giải nén dữ liệu.

Kích thước dữ liệu nén thấp hơn dữ liệu giải nén nên bạn cần tải xuống ít byte hơn để mở trang web.

## Bánh quy

Web server cũng có thể đọc dữ liệu trình duyệt của bạn, như cookie.
Cookie là các tệp dữ liệu nhỏ mà một trang web lưu trữ trên máy tính của người dùng thông qua trình duyệt web của họ.
Chúng cho phép trang web ghi nhớ thông tin về người dùng, chẳng hạn như tùy chọn hoặc trạng thái đăng nhập của họ, từ lần truy cập này sang lần truy cập tiếp theo.
Cookie giúp cải thiện trải nghiệm người dùng khi sử dụng một số ứng dụng web.
Ví dụ: nó giúp người bán/cửa hàng biết họ có thể giới thiệu sản phẩm nào cho bạn dựa trên lịch sử tìm kiếm của bạn.

> [!WARNING]
> Cookie có thể không an toàn vì chúng lưu trữ thông tin trên máy tính của người dùng mà một trang web có thể truy cập hoặc những kẻ tấn công giành quyền truy cập vào máy tính hoặc mạng của người dùng.
>Nếu cookie chứa thông tin nhạy cảm, chẳng hạn như thông tin xác thực đăng nhập của người dùng, thông tin này có thể bị đánh cắp và sử dụng để mạo danh người dùng.
>Ngoài ra, cookie có thể được sử dụng để theo dõi hoạt động của người dùng trên Internet.
>Điều này có thể gây lo ngại về quyền riêng tư của nhiều người dùng. Một số trang web có thể sử dụng cookie để lưu trữ thông tin về sở thích của người dùng và sử dụng thông tin này cho mục tiêu quảng cáo.
>Điều này cũng có thể được coi là xâm phạm quyền riêng tư.
>Điều quan trọng là phải cẩn thận về những thông tin nào được lưu trữ trong cookie và thường xuyên xóa chúng để duy trì cả quyền riêng tư và bảo mật.

## Cache

Server có thể lưu trữ các request thường xuyên nhất.
Nếu request hiện tại của bạn giống với yêu cầu trước đó, server sẽ trả về cho bạn bản sao đã lưu của câu trả lời.
Ngoài ra, server có thể đặt thuộc tính tiêu đề đặc biệt để lưu trữ một số dữ liệu trong bộ đệm cục bộ của trình duyệt của bạn.
Vì vậy, nếu bộ đệm của bạn có response cho request của bạn, trình duyệt sẽ không phải gửi bất kỳ request nào đến server.






