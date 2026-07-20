#JSON

JSON (hoặc Ký hiệu đối tượng JavaScript) là định dạng dựa trên văn bản để lưu trữ và truyền dữ liệu có cấu trúc. 

Mặc dù nó bắt nguồn từ ngôn ngữ JavaScript nhưng nó vẫn được coi là độc lập với ngôn ngữ.

Cú pháp nhẹ của JSON cho phép bạn dễ dàng lưu trữ và gửi mọi thứ từ số và chuỗi đến mảng và đối tượng đến các ứng dụng khác

## camelCase so với snake_case

Nếu bạn đã đọc kỹ các ví dụ về đối tượng JSON, bạn có thể có một câu hỏi còn sót lại: nên sử dụng kiểu viết từ ghép nào cho JSON?

**Việc lựa chọn đúng quy ước đặt tên JSON phụ thuộc trực tiếp vào programming language và thư viện của bạn. Bạn có thể sử dụng cả camelCase và snake_case; mọi lựa chọn sẽ hợp lệ nhưng không trộn chúng vào một JSON**.


## Ưu điểm của JSON

JSON là định dạng phổ biến để trao đổi dữ liệu trên Internet vì những ưu điểm mạnh mẽ của nó:

- độ nén;

- tính linh hoạt;

- khả năng đọc cao, ngay cả đối với những người ở xa lập trình;

- hầu hết các ngôn ngữ lập trình đều có chức năng và thư viện để đọc và tạo cấu trúc JSON.


JSON là định dạng phổ biến để truyền dữ liệu có cấu trúc qua mạng. Khi bạn [tuần tự hóa](/ComputerScience/1_ProgrammingLanguages/Kotlin/3_AdditionalInstruments/6_AdditionalCodeTools/0_Annotation/1_Serialize.md) dữ liệu thành JSON, bạn có thể dễ dàng giải tuần tự hóa dữ liệu đó trở lại mà không mất bất kỳ thông tin nào. Một trong những ưu điểm chính của JSON so với văn bản thuần túy là nó cho phép bạn mô tả mối quan hệ giữa các đối tượng thông qua các cặp lồng nhau và khóa-giá trị. Nhiều trang web bạn truy cập cũng có thể sử dụng JSON.


