# Cơ sở dữ liệu

**cơ sở dữ liệu** là collection dữ liệu được tổ chức cụ thể để máy tính xử lý tìm kiếm và truy xuất nhanh chóng.

> [!CAUTION]
> Sự khác biệt giữa cơ sở dữ liệu và tệp thông thường là tệp có thể có cấu trúc hoặc không, nhưng cơ sở dữ liệu phải có cấu trúc cụ thể.


Rõ ràng, chúng ta muốn nói rằng tệp này có một loại cấu trúc nào đó, nhưng từ góc nhìn của máy tính, nó vẫn là một tệp đơn giản cho đến khi bạn viết chương trình quản lý dữ liệu trong đó. Thông thường, thông tin trong cơ sở dữ liệu được nén và lưu trữ dưới dạng nhị phân chứ không phải văn bản thuần túy, vì vậy rõ ràng loại cấu trúc này dành cho máy tính chứ không phải con người.


Không giống như chúng ta, máy tính có thể dễ dàng hiểu được định dạng nhị phân của dữ liệu, nhưng điều gì cho phép chúng đọc và ghi dữ liệu một cách chính xác? **Đó là một chương trình có tên Database Management System**, chương trình này kiểm soát dữ liệu trong cơ sở dữ liệu.

##Database Management System

**Database Management System (DBMS) là một loại phần mềm cho phép người dùng xác định, tạo và kiểm soát dữ liệu.**

DBMS có thể tối ưu hóa các truy vấn và truy xuất dữ liệu từ cơ sở dữ liệu một cách tối ưu. Nó là trung gian hòa giải giữa người dùng và cơ sở dữ liệu, có nghĩa là người dùng có thể làm việc với nó thông qua giao diện của DBMS. Ngoài ra, nó cũng có thể giúp tách biệt dữ liệu khỏi người dùng.

**Mục tiêu khác của phần mềm này là giúp mọi người làm việc với các loại cơ sở dữ liệu khác nhau mà không làm lộ ra sự khác biệt thực tế của chúng.**

> [!NOTE]
> Hầu hết các hệ thống quản lý cơ sở dữ liệu đều có mô tả và hướng dẫn khá hay trên trang web của họ.
> Ngoài ra còn có các ngôn ngữ cụ thể như SQL mà bạn cần học để bắt đầu làm việc với chúng, nhưng nếu biết một số ngôn ngữ lập trình, bạn có thể làm việc với cơ sở dữ liệu bằng các công cụ của chúng.
> Ví dụ: có nhiều thư viện bằng Python và Java có thể hoạt động với DBMS.

## Truy cập dữ liệu

Tất nhiên, bạn có thể lưu trữ các tệp cục bộ, nhưng khi chúng tăng về số lượng, bạn sẽ không thể tìm thấy thông tin một cách nhanh chóng. Cơ sở dữ liệu cung cấp **lược đồ** và **siêu dữ liệu** cho phép tìm kiếm nhanh dữ liệu cần thiết.

## Tính nhất quán của dữ liệu

Một trong những tính năng tốt nhất của cơ sở dữ liệu là khả năng lưu giữ và khôi phục dữ liệu một cách chính xác. Điều đó không có nghĩa là DBMS biết cách làm cho đúng, nhưng một khi bạn xác định các quy tắc bằng cấu hình hoặc lược đồ, bạn có thể chắc chắn rằng sẽ không có gì vi phạm các quy tắc này.

> [!WARNING]
> Nếu nhiều người có quyền truy cập đồng thời vào cùng một dữ liệu thì có thể đã xảy ra sự cố.
> Các bản cập nhật trong tệp thường tuân theo quy tắc "lưu lần cuối sẽ thắng", điều này dẫn đến xung đột các bản cập nhật. 

Trong khi đó, cơ sở dữ liệu sẽ tách biệt những người dùng khác nhau và có thể được cấu hình để giải quyết xung đột giữa các bản cập nhật của họ.

Có một điều tốt nữa về cơ sở dữ liệu. Khi một số tập tin bị hỏng và không thể mở được, dữ liệu của bạn sẽ bị mất vĩnh viễn. Thay vào đó, bằng cách sử dụng DBMS, bạn có thể tạo bản sao lưu, sau đó khôi phục dữ liệu và tiếp tục công việc của mình.

## Phần kết luận

Với cơ sở dữ liệu bạn có thể:

- Lưu trữ, truy xuất và cập nhật dữ liệu;

- Nhận siêu dữ liệu;

- Truy cập cơ sở dữ liệu từ xa;

- Hạn chế quyền truy cập vào dữ liệu;

- Thực hiện cập nhật đồng thời;

- Phục hồi đến một thời điểm nào đó;

- Tự động kiểm tra các quy tắc về tính nhất quán của dữ liệu.


