#Regular expression

Thao tác với dữ liệu văn bản là một công việc khá phổ biến trong lập trình cũng như trong đời sống. Ví dụ: chúng ta thường có thể cần phân tích một văn bản, tìm tất cả các chuỗi cụ thể trong một tệp, v.v. Xử lý dữ liệu văn bản có thể là một vấn đề khá khó khăn. Đó là lý do tại sao có một công cụ đặc biệt gọi là biểu thức chính quy giúp việc này trở nên dễ dàng và nhanh chóng hơn.

## Sự định nghĩa

**regular expression** (regex hoặc viết tắt là regrec) là một chuỗi các ký tự mô tả một mẫu chung cho một tập hợp các chuỗi. Những mẫu như vậy có thể được sử dụng để **tìm kiếm, chỉnh sửa và thao tác với văn bản**. Họ có thể kiểm tra xem toàn bộ chuỗi hoặc chuỗi con của nó có khớp với mẫu đã cho hay không hoặc thay thế chuỗi con bằng một chuỗi khác.


**Regexps** có thể được coi là một loại ngôn ngữ con được hầu hết các ngôn ngữ lập trình hỗ trợ, nhưng có một số khác biệt về cú pháp được gọi là "**flavors**". Trong chủ đề này, chúng ta sẽ xem xét **regexps** tách biệt với các ngôn ngữ lập trình để hiểu ý tưởng chung.


> [!TIP]
> bạn có thể truy cập [trang web biểu thức chính quy](https://regex101.com/) để thử nghiệm các biểu thức chính quy từ các ví dụ của chúng tôi. Chọn **PCRE** làm hương vị. Nó có nghĩa là các biểu thức **P**erl **C**compatible **R**egular **E** là tiêu chuẩn phổ biến nhất trong thực tế.

Sức mạnh thực sự của biểu thức chính quy xuất hiện khi bạn bắt đầu sử dụng các siêu ký tự đặc biệt được gọi là **ký tự đại diện**. Chúng cho phép bạn xác định một mẫu, do đó bạn có thể khớp các chuỗi không nhất thiết phải chứa một chuỗi ký tự giống hệt nhau. Bạn có thể bỏ qua một số ký tự trong một chuỗi hoặc khớp các ký tự khác nhau ở cùng một vị trí hoặc thậm chí lặp lại một ký tự nhiều lần.

## ký tự đại diện

### Ký tự dấu chấm

Ký tự dấu chấm `.` khớp với bất kỳ ký tự đơn nào bao gồm các chữ cái, chữ số, v.v., ngoại trừ ký tự dòng mới, trừ khi nó được chỉ định.

###Dấu chấm hỏi

Dấu chấm hỏi `?` là một ký tự đặc biệt có nghĩa là “ký tự đứng trước hoặc không có gì”. Dấu chấm hỏi `?` báo hiệu rằng ký tự đứng trước nó có thể xuất hiện một lần hoặc 0 lần trong chuỗi để khớp với mẫu. Khi nào chúng ta có thể sử dụng nó?

### Ký tự thoát

Nếu một phần của biểu thức chính quy thực tế là một ký tự đặc biệt thì điều này có thể được quản lý bằng ký tự thoát. Khi bạn tạo chuỗi có các ký tự đặc biệt, bạn có thể thoát chúng bằng dấu gạch chéo ngược kép `\\`


Vì vậy, nếu bạn cần tìm một ký tự đặc biệt như dấu chấm hoặc dấu chấm hỏi, bạn có thể thoát nó bằng `\\.`. Các ký tự mà bạn sử dụng ký hiệu thoát `\\` sẽ không được hiểu là đặc biệt.
