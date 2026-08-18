# Bảo mật web, OWASP

**Bảo mật web** là tập hợp các biện pháp và protocol nhằm bảo vệ dữ liệu khỏi vi-rút, thư rác và các mối đe dọa khác có thể gây hại cho trang web, ứng dụng và/hoặc dữ liệu của người dùng cụ thể

Ý tưởng chính của bảo mật web là Internet vốn là một kênh không an toàn để trao đổi thông tin.

- Không ai có thể an toàn 100%. Bất kỳ trang web hoặc tài khoản nào cũng có thể bị hack. Không có khái niệm được bảo vệ 100% khỏi điều này.
- Một lớp bảo mật là không đủ. 
Ví dụ: mật khẩu từ mạng xã hội hoặc trang web là một ý tưởng hay, nhưng chỉ mật khẩu thôi thì chưa đủ. Do đó, sau khi nhập tên người dùng và mật khẩu, thường cần có các phương tiện xác thực người dùng bổ sung như mã PIN một lần.

## Đe dọa



Nói chung, người dùng phải đối mặt với các mối đe dọa sau:
- **Phần mềm độc hại** chẳng hạn như vi-rút hoặc Trojan. Người dùng Internet có thể bị lừa tải phần mềm độc hại xuống máy tính. Phần mềm chống vi-rút giúp tránh chúng.
- **Tấn công DoS*** là một kiểu tấn công của hacker vào hệ thống trong đó người dùng thực nhận được lời từ chối dịch vụ.
- **Lừa đảo** là một loại lừa đảo trực tuyến trong đó kẻ tấn công giành được quyền truy cập vào thông tin bí mật của người dùng như tên người dùng và mật khẩu. Để giảm khả năng xảy ra một cuộc tấn công như vậy, xác thực người dùng hai bước được sử dụng. Mật khẩu cũng có thể được thay đổi định kỳ.
- **Lỗ hổng ứng dụng**. Nếu một trang web hoặc chương trình có thể bị hack thì nó có một điểm yếu, được gọi là lỗ hổng. Các lỗ hổng là khác nhau, chúng có cách phân loại và loại riêng.

## Lỗ hổng bảo mật


Các lỗ hổng bảo mật web được ưu tiên tùy thuộc vào khả năng khai thác, khả năng phát hiện và tác động lên phần mềm.

- **Khả năng khai thác** là điều mà hacker nên làm để khai thác lỗ hổng bảo mật. 
Khả năng khai thác cao là khi kẻ tấn công chỉ cần một trình duyệt web và khả năng khai thác thấp là khi kẻ tấn công cần các công cụ và lập trình nâng cao.
- **Khả năng phát hiện** trả lời câu hỏi mức độ dễ dàng phát hiện mối đe dọa. Có thể dễ dàng phát hiện xem thông tin được hiển thị trong URL hay thông báo lỗi. Trong trường hợp này, chúng tôi nhận được mức độ phát hiện cao nhất
- **Tác động hoặc Thiệt hại** là mức độ thiệt hại sẽ xảy ra nếu lỗ hổng bảo mật bị lộ hoặc bị tấn công.


Có nhiều rủi ro và điểm yếu có thể dẫn đến lỗ hổng bảo mật, những rủi ro và điểm yếu thường gặp nhất có thể tìm thấy trong [OWASP TOP-10 xếp hạng](https://owasp.org/Top10/2025/), được cập nhật ba đến bốn năm một lần.


OWASP là viết tắt của **Dự án bảo mật ứng dụng web mở**, một cộng đồng trực tuyến xuất bản các bài viết về chủ đề bảo mật ứng dụng web cũng như tài liệu, các công cụ và công nghệ khác nhau.
Với sự trợ giúp của danh sách TOP-10, người dùng có thể nhận biết được những rủi ro và mối đe dọa nghiêm trọng nhất, hậu quả cũng như biện pháp đối phó của chúng.

> [!NOTE]
> Bất chấp tất cả những điều trên, không phải lúc nào cũng có thể thấy trước tất cả các điểm yếu của một trang web hoặc một chương trình. Điều thường xảy ra là các công ty thuê những người chuyên tấn công sản phẩm của họ để tìm ra lỗ hổng. Điều này được thực hiện bằng cách sử dụng chương trình Bug Bounty đặc biệt.


## thẩm quyền giải quyết:

- https://hyperskill.org/learn/step/14755