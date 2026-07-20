#SharedPreferences

Việc lưu không nhất thiết phải có kết nối Internet. Giả sử chúng ta có một danh sách liên hệ trong ứng dụng của mình. Thông tin này được lưu trữ cục bộ trên điện thoại và có thể được đồng bộ hóa với các dịch vụ sao lưu. Chúng ta có thể lưu dữ liệu trong các tệp thông thường bằng các phương pháp ghi và đọc tệp tiêu chuẩn hoặc chúng ta có thể sử dụng một tính năng nhiều chức năng hơn: cơ sở dữ liệu.

## Các cách lưu dữ liệu trong Ứng dụng Android

Hệ thống Android cung cấp các tùy chọn lưu trữ khác nhau trong một ứng dụng.
Chúng tôi có thể lưu trữ dữ liệu một cách đơn giản trong bộ lưu trữ bên trong hoặc bên ngoài (thẻ SD), chúng tôi có thể sử dụng các khả năng tích hợp của cơ sở dữ liệu SQLite và các tệp lưu trữ thông tin theo cơ sở dữ liệu khóa-giá trị.
Trong phần này, chúng ta sẽ nói về việc lưu trữ dữ liệu khóa-giá trị.


> [!NOTE]
> khóa-giá trị còn được gọi là Bản đồ hoặc Từ điển, bộ cặp khóa-giá trị là data structure phổ biến lưu trữ các đối tượng theo khóa của chúng.
> Bạn có thể truy xuất các đối tượng trong cấu trúc bằng các phím. Thông thường, các khóa chuỗi hoặc số nguyên được sử dụng.

## Chế độ chia sẻ tùy chọn 

chúng ta hãy xem một số hằng số trong lớp Ngữ cảnh: `Context.MODE_PRIVATE` làm cho tệp SharedPreferences chỉ hiển thị với ứng dụng của bạn, `Context.MODE_WORLD_READABLE` cho phép các ứng dụng khác đọc các cài đặt này, `Context.MODE_WORLD_WRITEABLE` cho phép các ứng dụng khác ghi cài đặt của ứng dụng của chúng tôi. Lưu ý rằng hai cái cuối cùng không được dùng nữa kể từ API 17 vì lý do bảo mật. Chủ yếu `MODE_PRIVATE` được sử dụng nên chúng ta sẽ không chú ý nhiều hơn đến các chế độ khác.

## Các trường hợp sử dụng SharedPreferences

Đôi khi chúng tôi muốn giữ lại các giá trị cấu hình của ứng dụng của mình: chủ đề, kiểu dáng và kích thước phông chữ.

> [!NOTE]
> Lưu ý rằng một số loại dữ liệu được hỗ trợ có giới hạn: `Boolean`, `Float` (Không hỗ trợ kép!), `Int`, `Long`, `String`, `Set<String>`.
> Nếu chúng ta muốn lưu các kiểu phức tạp, đặc biệt là với kiểu lồng nhau, tốt nhất nên lưu chúng thành các tệp riêng biệt.

























