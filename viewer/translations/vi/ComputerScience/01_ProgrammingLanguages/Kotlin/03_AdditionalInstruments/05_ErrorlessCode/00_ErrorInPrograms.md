#Lỗi trong chương trình

Giả sử bạn đang viết chương trình Kotlin. Các lỗi khác nhau có thể xảy ra trong quá trình biên dịch hoặc thực thi. 
Chúng tôi sẽ chia tất cả các lỗi có thể xảy ra thành hai nhóm: lỗi **thời gian biên dịch** và lỗi **thời gian chạy**.

> [!TIP]
> Hãy nhớ: trong nhiều trường hợp, bạn có thể tránh được ngoại lệ bằng cách sử dụng các điều kiện. Vì vậy, hãy nghĩ đến các trường hợp đặc biệt trong chương trình của bạn và thêm séc.

## Lỗi thời gian biên dịch


Lỗi thời gian biên dịch là lỗi ngăn cản quá trình biên dịch chương trình.
Ví dụ:
- lỗi cú pháp: sai từ khóa, lỗi đánh máy, thiếu dấu ngoặc đơn hoặc dấu ngoặc nhọn;
- tên gói nhập không chính xác;
- lời gọi phương thức không tồn tại.

Để tránh những lỗi như vậy, các lập trình viên sử dụng IDE (Môi trường phát triển tích hợp) hiện đại với bộ phân tích mã tĩnh. 

## Lỗi thời gian chạy

Lỗi thời gian chạy (còn được gọi là "lỗi") là lỗi xảy ra khi chương trình đang chạy. Lỗi thời gian chạy sẽ khiến chương trình của bạn hoạt động không như mong đợi hoặc thậm chí có thể dừng quá trình thực thi.

Có hai loại lỗi thời gian chạy:

- lỗi logic – khi một chương trình tạo ra kết quả sai do mã không chính xác (ví dụ: thay vì "Xin chào!", chương trình của bạn sẽ xuất ra "Xin chào!");
- **các trường hợp ngoại lệ chưa được xử lý** như chia cho 0, không tìm thấy tệp và các trường hợp không mong muốn khác.

Có nhiều chiến lược khác nhau để tìm ra những lỗi như vậy:

- để gỡ lỗi chương trình của bạn;
- viết bài kiểm tra tự động cho chương trình của bạn;
- sử dụng thực hành code review như một phần của quá trình phát triển process. Nói chung, cách thực hành này là dành cho trường hợp khi một hoặc nhiều nhà phát triển kiểm tra trực quan source code của một chương trình.