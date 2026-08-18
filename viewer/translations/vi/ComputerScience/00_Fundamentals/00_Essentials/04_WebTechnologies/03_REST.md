#REST

**REST (Chuyển trạng thái đại diện)** là **cách tương tác khá phổ biến giữa các client và dịch vụ** trên Internet.
**Đây là một tập hợp các hạn chế được xem xét** khi tạo ứng dụng và dịch vụ web. 
Phong cách kiến ​​trúc này được phát triển để giúp dễ dàng xây dựng các dịch vụ web tiện lợi.
Một dịch vụ được viết liên quan đến các quy tắc REST được gọi là **RESTful**.

> [!CAUTION]
> REST là NOT một protocol hoặc một tiêu chuẩn. REST thường hoạt động trên HTTP và là một trong những cách khả thi để sử dụng HTTP. Đây không phải là một tiêu chuẩn, REST là một tập hợp các đề xuất hữu ích.

## Lịch sử ngắn

Năm 2000, Roy Fielding xuất bản luận án tiến sĩ về "Phong cách kiến ​​trúc và Thiết kế kiến ​​trúc mạng". 
Trong bài báo này, ông đề xuất ý tưởng rằng nếu một hệ thống đáp ứng sáu điều kiện nhất định thì việc sử dụng nó sẽ trở nên thuận tiện hơn. Ông gọi khái niệm này là REST.

Với ý tưởng này, Roy đã trở thành một nhà cách mạng cho thời đại của mình. Chúng ta hãy nhìn vào những điều kiện này và xem chúng là gì.

## Sáu nguyên tắc REST

Việc tuân thủ sáu nguyên tắc quan trọng sau đây đảm bảo rằng bạn viết được dịch vụ RESTful:

1. **Mô hình tương tác Client-server**. Bằng cách tách user interface khỏi server kho dữ liệu, chúng tôi cải thiện và đơn giản hóa các hoạt động của ứng dụng.

2. **Không quốc tịch**. Mỗi request từ client đến server phải chứa đầy đủ thông tin cần thiết và không thể dựa vào bất kỳ trạng thái nào được lưu trữ ở phía server. Theo REST, dịch vụ không lưu trữ kết quả của thao tác trước đó. Nói một cách đơn giản, nó hoạt động theo khái niệm “Hỏi, trả lời, quên”.

3. **Có thể lưu vào cache**. Cặp request-response có thể được đánh dấu là được lưu vào cache và được lưu trữ ở phía người dùng. Có thể so sánh với bộ nhớ đệm trang web: nếu một trang được tải xuống một lần, nó có thể được truy cập mà không cần đánh địa chỉ lại server.

4. **Interface thống nhất**.
Nó chuẩn hóa giao tiếp bằng cách sử dụng các URI, phương thức HTTP (GET, POST, PUT, DELETE) và các loại phương tiện (JSON, XML), giúp có thể dự đoán được API và dễ sử dụng.
Nguyên tắc này đảm bảo một cách nhất quán để client tương tác với các tài nguyên.

1. **Hệ thống phân lớp**. Client không biết liệu nó được kết nối trực tiếp với server chính hay thông qua các trung gian như proxy hoặc bộ cân bằng tải.

2. **Code on demand [Tùy chọn]**. Theo request, dịch vụ phải cung cấp mã thực thi dưới dạng một applet hoặc tập lệnh để được thực thi ở phía client. Trong thực tế, nó rất hiếm khi được sử dụng.

## Phương thức HTTP cho dịch vụ RESTful

Trong khái niệm REST, tương tác với tài nguyên được thực hiện bằng cách gọi URL của tài nguyên và bốn phương thức HTTP cơ bản: `GET`, `POST`, `PUT`, `DELETE`. Chúng ta hãy xem xét chi tiết những tình huống chúng được sử dụng.

- `POST` được sử dụng để tạo tài nguyên mới. Nếu tài nguyên được tạo thành công, mã HTTP 201 (Đã tạo) sẽ được trả về và địa chỉ của tài nguyên đã tạo cũng được chuyển đến tiêu đề `Location`.
- `GET` được sử dụng để truy xuất hoặc đọc tài nguyên. Nếu phương thức `GET` thành công và không chứa lỗi địa chỉ, nó sẽ trả về biểu diễn tài nguyên XML hoặc JSON kết hợp với mã trạng thái HTTP 200 (OK). Trong trường hợp có lỗi, mã 404 (NOT FOUND) hoặc 400 (BAD REQUEST) thường được trả về.

- Phương thức `PUT` tạo tài nguyên theo ID được chỉ định hoặc cập nhật tài nguyên hiện có. Nếu cập nhật thành công, mã là 200 (OK); 204 (NO CONTENT) được trả về nếu không có nội dung nào trong nội dung response được truyền đi.

- Phương thức `DELETE` được sử dụng để xóa tài nguyên được xác định bởi URI (ID) cụ thể. Nếu xóa thành công, mã 200 (OK) HTTP sẽ được trả về, cùng với nội dung response chứa dữ liệu của tài nguyên từ xa. Cũng có thể sử dụng mã HTTP 204 (NO CONTENT) mà không cần nội dung response.




