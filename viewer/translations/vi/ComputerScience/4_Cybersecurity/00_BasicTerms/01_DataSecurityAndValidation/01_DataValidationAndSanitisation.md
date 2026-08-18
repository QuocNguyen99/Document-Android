# Xác thực và vệ sinh dữ liệu. Đáng tin cậy

**xác thực** và **khử trùng** dữ liệu là các biện pháp thiết yếu trong an ninh mạng, được thiết kế để đảm bảo rằng chỉ có dữ liệu sạch và phù hợp mới được đưa vào và vận hành trong hệ thống thông tin. 
Các quy trình này đóng vai trò quan trọng trong việc bảo vệ hệ thống khỏi các cuộc tấn công nguy hiểm, vi phạm dữ liệu và đảm bảo tính toàn vẹn và quyền riêng tư của dữ liệu do tổ chức quản lý.

## Hiểu xác thực dữ liệu

Có hai hình thức xác nhận chính:
- **Xác thực cú pháp** kiểm tra định dạng của dữ liệu, bao gồm loại và độ dài của dữ liệu, để đảm bảo dữ liệu tuân thủ các tham số dự kiến. Chẳng hạn, nó xác minh rằng đầu vào email có chứa ký hiệu `@` và miền hợp lệ.
- **Xác thực ngữ nghĩa**, mặt khác, xác nhận rằng các giá trị được cung cấp là hợp lý trong ngữ cảnh của ứng dụng, chẳng hạn như xác minh rằng thông tin tuổi mà người dùng nhập vào không gợi ý độ tuổi hợp lý.

> [!CAUTION]
> Nếu không có input validation thích hợp, các hệ thống sẽ gặp rủi ro, cho phép kẻ tấn công chèn dữ liệu có hại tiềm ẩn có thể khai thác các lỗ hổng trong trang web, chẳng hạn như tấn công chèn tập lệnh chéo trang (XSS) hoặc tấn công tiêm SQL. 
> Điều cần thiết là phải xác thực tất cả dữ liệu từ các nguồn không được kiểm soát hoàn toàn, đặc biệt là thông tin đầu vào do người dùng tạo thông qua biểu mẫu hoặc các phương thức nhập khác

**Việc áp dụng input validation ở cả phía client và phía server là một phương pháp được khuyến nghị.**


Các nguyên tắc hướng dẫn dành cho input validation nhấn mạnh:
- Coi tất cả thông tin đầu vào của người dùng là không đáng tin cậy, bất kể nguồn nào.
- Ưu tiên input validation và từ chối thay vì cố gắng vệ sinh dữ liệu độc hại tiềm ẩn.

## Hiểu về vệ sinh dữ liệu

Bằng cách vệ sinh đầu vào, các ứng dụng sẽ loại bỏ hoặc mã hóa những đầu vào này cũng như các đầu vào tiềm ẩn nguy hiểm khác, đảm bảo rằng dữ liệu độc hại sẽ không còn hiệu quả trước khi có thể tương tác với logic hoặc hoạt động cơ sở dữ liệu của hệ thống.

## Triển khai input validation và vệ sinh

- **Xác định tiêu chí đầu vào hợp lệ**. Nó liên quan đến việc chỉ định các yêu cầu chính xác cho từng trường đầu vào, bao gồm loại dữ liệu (ví dụ: chuỗi, số nguyên), độ dài (để ngăn chặn các cuộc tấn công tràn bộ đệm), định dạng (chẳng hạn như mẫu địa chỉ email), phạm vi (áp dụng cho đầu vào số) và một tập hợp các giá trị được phép xác định trước (lý tưởng cho danh sách thả xuống hoặc lựa chọn)

- **Kết hợp các chức năng tích hợp** và thư viện từ các ngôn ngữ và framework lập trình giúp tăng cường đáng kể tính bảo mật và hiệu quả của input validation và saniti. Đối với các truy vấn SQL, bạn nên áp dụng các truy vấn được tham số hóa hoặc câu lệnh đã chuẩn bị sẵn, vì các phương pháp này vốn đã quản lý việc thoát dữ liệu, ngăn chặn hiệu quả các quy trình chèn SQL. Ví dụ: Java cung cấp các lớp như java.util.regex để xác thực các định dạng bằng biểu thức chính quy và các phương thức trong `java.net.URI` đảm bảo xử lý URI an toàn.

- **Xác thực phía client** nâng cao đáng kể trải nghiệm người dùng bằng cách cung cấp phản hồi ngay lập tức về lỗi đầu vào, sử dụng các thuộc tính JavaScript và HTML5 như bắt buộc, mẫu, tối thiểu và tối đa để thực thi các ràng buộc đầu vào.

- **Biểu thức chính quy** cho phép nhà phát triển chỉ định các mẫu chi tiết mà dữ liệu đầu vào phải tuân thủ để xác thực.
Ngoài việc kiểm tra định dạng, biểu thức chính quy còn có thể được sử dụng để loại bỏ các ký tự không mong muốn, cung cấp một tuyến phòng thủ chống lại các mối đe dọa tiêm nhiễm tiềm ẩn bằng cách làm sạch dữ liệu đầu vào.

- **Thoát dữ liệu** đảm bảo các ký tự đặc biệt trong thông tin đầu vào của người dùng được xử lý dưới dạng ký tự chữ, không phải mã thực thi, trên nhiều ngữ cảnh khác nhau như cơ sở dữ liệu hoặc trang web. Đối với các truy vấn SQL, nên sử dụng các truy vấn được tham số hóa hoặc **các câu lệnh đã chuẩn bị sẵn**, vì các phương pháp này vốn đã quản lý việc thoát dữ liệu, ngăn chặn một cách hiệu quả các mối đe dọa tiêm nhiễm SQL. 

> [!NOTE]
> Truy vấn SQL được xác định trước, trong đó phần giữ chỗ được sử dụng cho các tham số thay vì kết hợp trực tiếp thông tin đầu vào của người dùng vào truy vấn.
> Biên dịch trước mẫu SQL sẽ đóng băng cấu trúc lệnh, khiến dữ liệu đầu vào không thể bị hiểu sai thành mã.










