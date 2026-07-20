# Tệp

Dữ liệu được lưu trữ trên đĩa theo địa chỉ nhất định. Đối với máy tính, những địa chỉ như vậy là những con số. Nó sử dụng chúng để tìm thông tin tương ứng. Tuy nhiên, con người không giỏi ghi nhớ các bộ số.

## Sự định nghĩa

Một tập tin được liên kết với một phần dữ liệu. Tuy nhiên, có một số hạn chế trong việc đặt tên file. Ví dụ: tên tệp chỉ được chứa những ký tự được hệ thống tệp cụ thể hỗ trợ

## Phần mở rộng tệp

Hệ điều hành sử dụng phần mở rộng tên tệp để ghi nhớ chương trình nào sẽ sử dụng để mở tệp có phần mở rộng nhất định. Tuy nhiên, phần mở rộng tên tệp không thực sự cần thiết: chúng chỉ loại bỏ nhu cầu đoán định dạng của tệp.

## Siêu dữ liệu tệp

Siêu dữ liệu là viết tắt của "dữ liệu về dữ liệu". Một trong những phần phổ biến nhất của dữ liệu đó là tên tệp như chúng ta đã thảo luận ở trên. Các ví dụ khác là kích thước tệp, thời gian tạo, thời gian truy cập lần cuối, v.v.


Ngoài ra, siêu dữ liệu bao gồm các thuộc tính tệp. Mỗi thuộc tính có hai trạng thái có thể có: đặt (bật) hoặc xóa (tắt). Thuộc tính tệp cho hệ thống tệp hoặc hệ điều hành biết liệu tệp có cần được xử lý đặc biệt hay không. Ví dụ: nếu một tệp có bộ thuộc tính chỉ đọc, nội dung của nó có thể được đọc, nhưng mọi nỗ lực sửa đổi chúng sẽ bị hệ thống tệp ngăn chặn cho đến khi thuộc tính này bị xóa. Nếu một tệp có tập thuộc tính ẩn, nó sẽ không hiển thị trong user interface đồ họa trừ khi người dùng yêu cầu hệ điều hành hiển thị tất cả các tệp ẩn một cách rõ ràng. Các thuộc tính cũng có thể được sử dụng để hạn chế quyền truy cập tệp đối với các nhóm người dùng cụ thể.

## Đường dẫn tuyệt đối và tương đối
Có hai loại đường dẫn:
- Đường dẫn đến tệp bắt đầu bằng thư mục gốc được gọi là **đường dẫn tuyệt đối** và đóng vai trò là mã định danh duy nhất của tệp.

> [!WARNING]
> Có vấn đề khi sử dụng đường dẫn tuyệt đối. 
> Khi bạn tạo một chương trình sẽ được cài đặt trên các máy tính khác nhau, bạn biết thư mục của chương trình đó trên hệ thống của mình nhưng bạn không biết những người dùng khác sẽ cài đặt nó ở đâu. 
> Thư mục của chương trình có thể ở bất kỳ đâu trên máy tính của họ, vì vậy việc sử dụng đường dẫn tuyệt đối để tham chiếu sẽ không hiệu quả. Đây là lúc **đường dẫn tương đối** phát huy tác dụng. 

- Chương trình của bạn có thể đánh địa chỉ thư mục làm việc bằng cách sử dụng một ký tự đặc biệt.
Thay vì tên thực của thư mục, vì vậy bạn có thể sử dụng đường dẫn như `./my_file` (đường dẫn tương đối) mà không chỉ định toàn bộ đường dẫn từ thư mục gốc.
Bạn chỉ cần để hệ điều hành của người dùng tìm ra nó! Bạn cũng có thể sử dụng `..` để đánh địa chỉ thư mục mẹ của thư mục làm việc.

> [!NOTE]
> Mỗi process chạy trên máy tính được liên kết với một **thư mục hoạt động** trên máy tính này; nó được theo dõi và quản lý bởi hệ điều hành.
> Về cơ bản, điều này có nghĩa là hệ điều hành của những người dùng khác sẽ tập trung vào thư mục chương trình của bạn khi họ chạy nó.