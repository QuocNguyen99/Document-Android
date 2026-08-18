# tin nhắn HTTP

HTTP dựa trên kiến ​​trúc "client-server" được xây dựng trên cơ sở nhắn tin. Tin nhắn HTTP là một cách để trao đổi dữ liệu giữa client và server trên Web. Có hai loại tin nhắn: **request** và **response**.

## Định dạng của tin nhắn

Trong HTTP protocol, tất cả tin nhắn đều bao gồm các chuỗi văn bản. Cả request và response đều có định dạng chuẩn hóa gần giống nhau:

1. **Dòng bắt đầu** có thể thay đổi:

	- đối với các request, nó cho biết loại request (**phương thức**) và URL nơi gửi yêu cầu đó (**target**);

	- đối với các response, nó chứa mã trạng thái để xác định sự thành công của hoạt động.
2. **Tiêu đề** mô tả thông báo và truyền tải các thông số khác nhau.

3. **Nội dung** nơi chứa dữ liệu tin nhắn.

Ví dụ:

```bash
GET /ewordly-service/topic/list?page=1&limit=3 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FiMGNhOTI3N2I1YmQxZWNjNTFjNmUiLCJhY2Nlc1Rva2VuRXhwaXJ5IjoiMjAyNS0wMi0xMlQxNDoxODoyNy45NDRaIiwiaWF0IjoxNzM5MjgzNTA3LCJleHAiOjE3MzkzNjk5MDd9.VX_vBqvxmiFVR3Et7BC_dVpKfm89Aum-AJsDKTtdsrY
User-Agent: PostmanRuntime/7.43.0
Accept: */*
Postman-Token: 5bd37ba9-316e-490f-9d3b-af3bc5ae4ca2
Host: mionix.ddns.net
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
 
HTTP/1.1 403 Forbidden
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 20 Mar 2025 06:48:17 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 53
Connection: keep-alive
X-Powered-By: Express
ETag: W/"35-6C0YABQYGKqodn17c9SuUdKRqxw"
 
{"message":"Invalid token with message: jwt expired"}
```

> [!NOTE]
> Dòng bắt đầu và tiêu đề là các thuộc tính bắt buộc nên các phần khác có thể trống.

## Phương thức

HTTP xác định một tập hợp các phương thức request chỉ định hành động mong muốn sẽ là gì đối với một tài nguyên nhất định.
Mặc dù thực tế là tên của chúng có thể là danh từ, nhưng các phương thức truy vấn này đôi khi được gọi là động từ HTTP.

## Mã trạng thái

Để các chương trình máy tính và trang web hoạt động thông qua HTTP hoạt động bình thường, ngoài nội dung của trang, server trả về mã gồm ba chữ số,
trong đó chỉ định response cho request. Với sự trợ giúp của mã này,
có thể chuyển hướng client đến một trang khác hoặc cho biết sự thay đổi của trang, cũng như phát hiện lỗi trong quá trình xử lý dữ liệu.


# Mã trạng thái HTTP

| Phạm vi mã | Danh mục | Mô tả |
|-------------|-----------------|--------------------------------------------------------------------------|
| 1xx | Thông tin | Mã bắt đầu bằng "1" được gọi là mã thông tin. Họ báo cáo về cách xử lý các request của client. |
| 2xx | Thành công | Các thông báo của lớp này thông báo rằng hành động mà client yêu cầu đã được chấp nhận thành công để xử lý. |
| 3xx | Chuyển hướng | Điều đó có nghĩa là phải thực hiện thêm hành động để hoàn thành request.      |
| 4xx | Lỗi client | Nó báo lỗi về phía client.                                      |
| 5xx | Lỗi Server | Mã cho biết thao tác không thành công do lỗi của server. |





