# Tính bảo mật, tính toàn vẹn, tính sẵn sàng

**Ba đặc điểm cơ bản** xác định tính bảo mật của hệ thống máy tính. **Nó cung cấp framework để giải quyết các mục tiêu bảo mật cơ bản.**


## Bảo mật

- **Bảo mật như bảo vệ thông tin**: bảo mật có nghĩa là bảo vệ dữ liệu khỏi bị truy cập hoặc tiết lộ ngoài ý muốn. Nó đảm bảo chỉ những người dùng có quyền chính xác mới có thể truy cập thông tin.

- **Tính bảo mật như một chiến lược bảo mật**: Tính bảo mật hoạt động như một chiến lược bảo mật có nhiều lớp bảo vệ nhằm ngăn chặn việc tiết lộ thông tin trái phép. (bao gồm encryption, kiểm soát truy cập và xác thực đa yếu tố).

- **Bảo mật như một nghĩa vụ đạo đức**: bảo mật biểu thị nghĩa vụ đạo đức nhằm bảo vệ quyền riêng tư của người dùng bằng cách bảo vệ dữ liệu của họ khỏi bị truy cập hoặc tiết lộ trái phép. Vấn đề này là trọng tâm để duy trì sự tin cậy và uy tín của công ty.

## Chính trực

- **Tính toàn vẹn là bảo toàn tính bất biến của dữ liệu**: Tính toàn vẹn có nghĩa là bảo toàn tính bất biến và tính xác thực của dữ liệu. Nó đảm bảo rằng các cá nhân không được phép sẽ không sửa đổi hoặc xóa thông tin.

- **Tính toàn vẹn như một Cơ chế bảo vệ**: Tính toàn vẹn đóng vai trò là phương pháp bảo vệ bảo vệ dữ liệu khỏi những thay đổi trái phép bằng cách sử dụng các kỹ thuật và công cụ như kiểm soát tổng kiểm tra, kiểm tra hệ thống cũng như hệ thống Quản lý sự kiện và thông tin bảo mật (SIEM).

- **Tính chính trực là trách nhiệm của tổ chức**: Tính chính trực cũng biểu thị nghĩa vụ của tổ chức trong việc liên tục giám sát và bảo vệ dữ liệu để duy trì tính chính xác và nhất quán của dữ liệu. Nghĩa vụ này rất quan trọng để duy trì niềm tin của khách hàng và tuân thủ các tiêu chí pháp lý.

## Sẵn có

- **Tính sẵn sàng khi hoạt động không bị gián đoạn**: Đảm bảo rằng hệ thống thông tin và dữ liệu luôn sẵn sàng cho người dùng được ủy quyền để tạo điều kiện thuận lợi cho các hoạt động liên tục của tổ chức.

- **Tính sẵn có như một chiến lược phục hồi**: Tính sẵn sàng đóng vai trò là một chiến lược phục hồi nhằm bảo vệ hệ thống thông tin khỏi các lỗi và gián đoạn. Nó chứa các biện pháp khác nhau như dự phòng, lập kế hoạch kinh doanh liên tục và sao lưu thường xuyên.

- **Tính sẵn sàng là chìa khóa cho sự hài lòng của khách hàng**: Tính sẵn sàng là yếu tố quan trọng để đảm bảo sự hài lòng của khách hàng vì nó đảm bảo rằng khách hàng luôn có thể truy cập vào các dịch vụ và tài nguyên của tổ chức, đây là chìa khóa để đảm bảo sự tin cậy và lòng trung thành của họ.

## Tổng quan về các phương pháp bảo vệ dữ liệu

**Bảo mật**:

- Hạn chế truy cập (các mô hình kiểm soát truy cập khác nhau)
- Phương pháp mật mã
- Authentication
- Các biện pháp tổ chức (thỏa thuận không tiết lộ, v.v.)

**Chính trực**

- Kiểm soát phiên bản
- Tổng kiểm tra
- Chữ ký số
- Sao lưu

**Sẵn có**

- Phục hồi dữ liệu
- Cụm chuyển đổi dự phòng
- Mảng đĩa độc lập dự phòng (RAID)
- Chuyển đổi dự phòng


## Bộ ba CIA trong thực tế

Hãy tưởng tượng bạn đang hoàn tất hợp đồng với một công ty thương mại điện tử. Client muốn thiết lập một hệ thống dựa trên cấu trúc microservice. Hãy phân tích những gì chúng ta nên tập trung vào trong quá trình phân tích đề án kinh doanh thông qua lăng kính bộ ba CIA.

**Bảo mật**
Để bảo vệ tính bảo mật trong ứng dụng thương mại điện tử, các tổ chức có thể triển khai:

- **Dữ liệu Encryption**: Triển khai HTTPS protocol mã hóa trao đổi dữ liệu giữa client và server, giúp ngăn chặn việc chặn dữ liệu của bên thứ ba.

- **Bảo mật cấp ứng dụng**: Bằng cách giới thiệu Hệ thống quản lý danh tính để kiểm soát quyền truy cập vào các phần nhạy cảm của ứng dụng, như bảng quản trị.

- **Lưu trữ mật khẩu an toàn**: Bằng cách sử dụng các kỹ thuật băm nâng cao, như bcrypt, để bảo mật mật khẩu người dùng trong cơ sở dữ liệu.

- **Che giấu dữ liệu**: Che giấu dữ liệu sẽ ẩn dữ liệu cụ thể trong môi trường sản xuất và phi sản xuất, do đó bảo vệ thông tin nhạy cảm khỏi bị truy cập trái phép.

**Tính chính trực**
Để đảm bảo tính toàn vẹn dữ liệu trong ứng dụng thương mại điện tử, các quy trình có thể bao gồm:

- **Chữ ký số**: Sử dụng chữ ký số để xác minh tính toàn vẹn của dữ liệu được truyền giữa các vi dịch vụ khác nhau.

- **Kiểm soát quyền truy cập cấp dữ liệu**: Triển khai các chính sách kiểm soát quyền truy cập kỹ lưỡng để ngăn chặn việc sửa đổi trái phép dữ liệu sản phẩm hoặc thông tin người dùng.

- **Giám sát và cảnh báo tự động**: Bằng cách tích hợp các hệ thống giám sát tự động phát hiện và cảnh báo về các nỗ lực sửa đổi dữ liệu trái phép.

- **Blockchain cho các giao dịch tài chính**: Sử dụng công nghệ blockchain để ghi lại các giao dịch tài chính đảm bảo tính bất biến và minh bạch của mỗi giao dịch.

**Sẵn có**
Các chiến lược để đảm bảo tính khả dụng trong ứng dụng thương mại điện tử có thể bao gồm:

- **Tự động điều chỉnh quy mô**: Triển khai cơ chế tự động điều chỉnh quy mô để điều chỉnh tài nguyên một cách linh hoạt khi lưu lượng truy cập tăng đột biến, đảm bảo phân phối tải đồng đều.

- **Cân bằng tải**: Kết hợp bộ cân bằng tải để phân phối lưu lượng mạng giữa các server khác nhau nhằm ngăn chặn tình trạng quá tải.

- **Kế hoạch khắc phục thảm họa**: Phát triển các kế hoạch khắc phục thảm họa kỹ lưỡng trong đó trình bày chi tiết các quy trình xử lý các tình huống khẩn cấp khác nhau.

- **Dự phòng địa lý**: Thiết lập cơ sở hạ tầng dự phòng địa lý cho phép chuyển đổi nhanh chóng giữa các trung tâm dữ liệu khác nhau ở các vị trí địa lý khác nhau, đảm bảo tính liên tục của hoạt động ngay cả khi có sự cố cục bộ.



















