#Http Client

Để tương tác qua HTTP, chúng tôi sử dụng các thư viện được gọi là máy khách HTTP. 
Mục đích của họ là gửi các yêu cầu HTTP và xử lý phản hồi.
Đây là một số thư viện được sử dụng rộng rãi nhất:

- **HttpURLConnection** là một phần của thư viện Java tiêu chuẩn. Nó là cái cũ nhất trong số chúng và có khả năng tương thích ngược nhất. Nó rất dễ sử dụng nhưng nó chỉ cung cấp API đồng bộ/chặn và không hỗ trợ HTTP/2.

- **Java HttpClient** là một thư viện Java gốc khác thường có sẵn trong Java 11. Nó sử dụng các chế độ hoạt động đồng bộ và không đồng bộ và có hỗ trợ HTTP/2. Tuy nhiên, nó không hỗ trợ nén trong suốt.

- **Apache HttpClient** là thư viện nguồn mở bên ngoài và là ứng dụng khách được sử dụng phổ biến nhất bên ngoài thư viện chuẩn Java. Nó có một bộ tính năng và tùy chọn cấu hình phong phú. Tốt nhất nên sử dụng nó nếu bạn cần sự linh hoạt cao độ trong việc định cấu hình và tùy chỉnh hành vi.

- **OkHttp** là máy khách HTTP và HTTP/2 được sử dụng để xây dựng các ứng dụng Java và Kotlin. 

## OkHttp là một trong những ứng dụng khách được sử dụng phổ biến nhất, Tại sao **OkHttp**?

Nhờ HTTP, giờ đây bạn có thể truyền dữ liệu và phương tiện thông qua mô hình giao tiếp client-server.
OkHttp hoạt động hiệu quả với:

- kết nối tổng hợp;

- hỗ trợ gzip, giúp thu nhỏ kích thước tải xuống;

- bộ nhớ đệm phản hồi cho phép mạng không lặp lại các yêu cầu;

- Hỗ trợ HTTP/2.


OkHttp khôi phục các sự cố kết nối phổ biến, chẳng hạn như gửi yêu cầu đến một địa chỉ thay thế, nếu một dịch vụ có nhiều địa chỉ IP. 
Ngoài ra, nó còn hỗ trợ chặn cuộc gọi đồng bộ và cuộc gọi không đồng bộ với lệnh gọi lại.

## Bộ nhớ đệm phản hồi với OkHttp

Bộ nhớ đệm phản hồi cho phép `OkHttp` tránh lặp lại các yêu cầu qua mạng. Điều đó thật tuyệt vời vì nó giúp tăng tốc hiệu suất ứng dụng và tăng hiệu quả.

**Bộ nhớ đệm phản hồi** sẽ được lưu trữ trong một thư mục, nghĩa là tất cả dữ liệu đã tải xuống trước đó sẽ được truy cập từ các tài nguyên được lưu trong bộ nhớ đệm cục bộ. Trong Android, thư mục chứa dữ liệu bộ đệm phải ở chế độ riêng tư để các ứng dụng không đáng tin cậy không thể truy cập dữ liệu.

best practice phải có một phiên bản `OkHttpClient()` có thể truy cập được trong toàn bộ ứng dụng. Nếu không, hai phiên bản bộ đệm có thể dẫm lên nhau, làm hỏng bộ đệm phản hồi và có thể làm hỏng ứng dụng của bạn.
 
`OkHttp` **bộ nhớ đệm phản hồi sử dụng các tiêu đề HTTP để xác định hành vi của bộ nhớ đệm**. 
Nó có thể được định cấu hình trên máy chủ, chẳng hạn như thời gian phản hồi được lưu vào bộ đệm với các tiêu đề phản hồi như `Cache-Control: max-age=1000`. 

Bạn cũng có thể ngăn OkHttp sử dụng bộ đệm với `CacheControl.FORCE_NETWORK`. Ngoài ra, bạn có thể buộc nó sử dụng bộ nhớ đệm thay vì mạng bằng `CacheControl.FORCE_CACHE`. Tất cả những điều đó có thể được thực hiện bằng cách chuyển giá trị `CacheControl` vào phương thức `cacheControl()` của `Request.Builder`.

> [!CAUTION]
> Xin lưu ý rằng việc buộc sử dụng bộ đệm có thể dẫn đến mã phản hồi 504 được gọi là lỗi Yêu cầu không thỏa mãn nếu không có dữ liệu bộ đệm. Nếu không, nó sẽ hiển thị dữ liệu được lưu trong bộ nhớ đệm cho đến khi dữ liệu mới nhất được tải xuống.



