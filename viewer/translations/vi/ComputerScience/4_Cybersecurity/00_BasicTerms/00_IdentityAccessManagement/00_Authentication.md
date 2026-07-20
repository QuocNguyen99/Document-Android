#Authentication

Authentication là điểm kiểm tra xác minh danh tính, đảm bảo rằng chỉ những cá nhân được ủy quyền mới có thể tương tác với dữ liệu và hệ thống nhạy cảm.

##Vai trò của xác thực trong an ninh mạng

đó là khía cạnh cơ bản về cách chúng ta tương tác với các hệ thống kỹ thuật số. 
Việc xác minh này không chỉ cần thiết đối với người dùng mà còn để đảm bảo rằng máy chủ, phần mềm và API là hợp pháp và an toàn.

Trong lĩnh vực an ninh mạng, vai trò của xác thực mở rộng trên nhiều lĩnh vực khác nhau. 
Ví dụ
- Bảo mật lớp vận chuyển (TLS), một giao thức bảo mật thông tin liên lạc qua internet, chủ yếu dựa vào xác thực để xác nhận danh tính của máy chủ web.
- Bảo mật email là một lĩnh vực khác mà xác thực đóng vai trò quan trọng. Các công nghệ như DomainKey Thư nhận dạng (DKIM) xác thực email bằng cách xác minh rằng chúng có nguồn gốc từ các máy chủ được phép, từ đó giảm rủi ro thư rác và lừa đảo.

## Cách xác thực hoạt động

Về cốt lõi, xác thực là xác minh xem ai đó có phải là người mà họ tuyên bố có mặt trong không gian kỹ thuật số hay không. Nhưng làm thế nào một chiếc máy tính, vốn không có trực giác của con người, có thể thực hiện được điều này?

Hệ thống Authentication sử dụng tiêu chí cụ thể được gọi là **yếu tố**. Những yếu tố này có thể là thứ mà người dùng biết (như mật khẩu), thứ họ có (như token bảo mật) hoặc thứ gì đó vốn có của họ (như dấu vân tay). Mỗi **yếu tố** này đều góp phần xây dựng danh tính kỹ thuật số duy nhất và có thể xác minh được.

![văn bản thay thế](/resources/cybersecurity_authentication_factors.png)

Ngoài các yếu tố chính này, địa điểm và thời gian cũng có thể được sử dụng làm tiêu chí xác thực bổ sung.
Hơn nữa, chứng chỉ kỹ thuật số đóng một vai trò quan trọng trong việc xác thực.

Chúng là các tệp kỹ thuật số chứa thông tin xác minh danh tính, tương tự như thẻ ID ngoài đời thực. Các chứng chỉ này, thường được ký điện tử bởi cơ quan đáng tin cậy, chứa khóa chung được liên kết với khóa riêng do chủ sở hữu chứng chỉ nắm giữ. Cơ chế này được sử dụng rộng rãi trong việc bảo mật thông tin liên lạc trên web, đặc biệt là trong giao thức HTTPS.

## Đa yếu tố và hai yếu tố Authentication

**Multi-Factor Authentication (MFA)** tăng cường bảo mật bằng cách yêu cầu hai hoặc nhiều yếu tố xác thực. 
Cách tiếp cận này tăng cường đáng kể khả năng bảo vệ vì kẻ tấn công khó có thể giả mạo nhiều yếu tố xác thực hơn nhiều. 
Ví dụ: ngay cả khi tin tặc lấy được mật khẩu của người dùng, họ vẫn phải đối mặt với thách thức bỏ qua xác minh sinh trắc học như quét khuôn mặt hoặc lấy token vật lý.

**Authentication (2FA) hai yếu tố** là tập hợp con của MFA, sử dụng chính xác hai yếu tố riêng biệt. 
Cách triển khai phổ biến là kết hợp "thứ bạn biết" (như mật khẩu) với "thứ bạn có" (chẳng hạn như mã được gửi tới điện thoại). 
Phương pháp này đã được chứng minh là có hiệu quả trong việc giảm tác động của các cuộc tấn công lừa đảo và các vi phạm bảo mật khác.
Về bản chất, cả MFA và 2FA đều bổ sung các lớp bảo mật ngoài các phương pháp một yếu tố truyền thống. 
Chúng ngày càng trở nên quan trọng trong lĩnh vực an ninh mạng, cung cấp khả năng bảo vệ mạnh mẽ chống lại truy cập trái phép và tăng cường bảo mật hệ thống tổng thể

##SSO

Đăng nhập một lần (SSO) là xác thực process cho phép người dùng truy cập nhiều ứng dụng hoặc trang web **bằng cách sử dụng một bộ thông tin xác thực đăng nhập**. Cách tiếp cận này mang lại nhiều lợi ích trong bối cảnh kỹ thuật số.

###Lợi ích khi sử dụng SSO
- tăng cường sự thuận tiện cho người dùng bằng cách giảm số lượng mật khẩu họ cần nhớ
- cho phép kiểm soát tập trung các chính sách xác thực
- cung cấp một nền tảng thống nhất để thực thi các biện pháp bảo mật.
- giảm nguy cơ bị tấn công lừa đảo bằng cách hạn chế tần suất nhắc đăng nhập.


## Tài liệu tham khảo

- https://hyperskill.org/learn/step/38878




