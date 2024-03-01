# Android Operating System
Nền tảng của nền tảng Android là nhân Linux,
cho phép Android tận dụng một số tính năng bảo mật nhất định.
Nhân Linux đã được sử dụng trong hàng triệu hệ thống nhạy cảm về bảo mật kể từ
khi được tạo ra vào năm 1991, do đó, nó có lịch sử lâu dài luôn được nghiên cứu,
thử nghiệm và cải tiến bởi hàng nghìn nhà phát triển.

Theo tài liệu của Android,
Android sử dụng một số tính năng bảo mật chính của Linux bao gồm:

- Mô hình quyền dựa trên người dùng (File Permission)
- Cách ly quy trình
- Một cơ chế mở rộng cho việc giao tiếp an toàn giữa các quy trình (IPC).
- Khả năng loại bỏ các phần không cần thiết và/hoặc không an toàn của kernel

Một tính năng quan trọng khác của Linux là hệ điều hành đa người dùng của nó (Multi-User Linux),
cho phép nhiều người dùng truy cập vào các tài nguyên hệ thống độc lập như bộ nhớ,
tài nguyên CPU, RAM và ứng dụng. Bằng cách cách ly tài nguyên của người dùng khỏi nhau (Resource Isolation),
chúng có thể được bảo vệ khỏi nhau.

Nền tảng Android tận dụng hệ thống đa người dùng của Linux với Application Sandbox riêng của nó,
giúp cách ly tài nguyên ứng dụng khỏi nhau và bảo vệ ứng dụng và hệ thống khỏi các ứng dụng độc hại.

Dưới đây là một số điểm quan trọng về Hộp cát Ứng dụng:

1. Cách ly tài nguyên: Mỗi ứng dụng Android chạy trong một quy trình riêng biệt và
   có quyền truy cập vào một tập hợp cụ thể các tài nguyên hệ thống được cấp phép.
   Điều này bao gồm các tệp, cài đặt, và các thành phần khác của hệ thống.

2. Phân chia quyền: Hộp cát Ứng dụng giúp quản lý quyền truy cập của mỗi ứng dụng vào các tài nguyên hệ thống.
   Các quyền này được gán trong tệp AndroidManifest.xml của ứng dụng và được kiểm tra bởi hệ thống Android trước khi cấp cho ứng dụng.

3. Bảo mật: Hộp cát Ứng dụng đảm bảo rằng mỗi ứng dụng chỉ có thể truy cập và tương tác với
   các tài nguyên được phép mà nó cần để hoạt động. Điều này giúp ngăn chặn ứng dụng độc hại từ
   việc ảnh hưởng đến hệ thống hoặc dữ liệu người dùng.

4. Isolation (Cách ly): Mỗi ứng dụng chạy trong một không gian làm việc riêng biệt và
   không thể truy cập trực tiếp vào dữ liệu hoặc mã của ứng dụng khác.
   Điều này đảm bảo tính cách biệt giữa các ứng dụng và ngăn chặn việc chúng tương tác không mong muốn.