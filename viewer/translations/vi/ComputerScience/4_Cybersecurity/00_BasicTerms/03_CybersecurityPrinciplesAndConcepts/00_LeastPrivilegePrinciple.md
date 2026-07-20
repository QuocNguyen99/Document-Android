# Nguyên tắc Least Privilege

**Nguyên tắc Least Privilege** hoặc **POLP** gọi tắt là một khái niệm bảo mật máy tính và best practice xoay quanh việc hạn chế quyền và quyền truy cập đối với người dùng, quy trình và hệ thống ở mức tối thiểu cần thiết để họ thực hiện các tác vụ được yêu cầu.

## Chiến lược triển khai POLP

1. **Kiểm soát truy cập dựa trên vai trò của người dùng (RBAC)**: Chỉ định quyền dựa trên vai trò hoặc chức năng công việc cụ thể. Người dùng chỉ được cấp quyền truy cập vào các tài nguyên cần thiết cho vai trò của họ.

2. **Kiểm tra quyền**: Thường xuyên xem xét và kiểm tra các quyền để đảm bảo rằng chúng phù hợp và cần thiết. Loại bỏ mọi quyền không cần thiết hoặc quá mức.

3. **Tách nhiệm vụ**: Phân chia nhiệm vụ và trách nhiệm giữa các cá nhân khác nhau để ngăn chặn việc một người dùng có quá nhiều quyền lực hoặc quyền kiểm soát.

4. **Từ chối mặc định**: Áp dụng phương pháp "từ chối mặc định", trong đó quyền truy cập bị từ chối theo mặc định và chỉ được cấp khi thực sự cần thiết.

Một trong những cách tự nhiên nhất để triển khai POLP là sử dụng **IDM**

## Hệ thống quản lý danh tính

Hệ thống Quản lý danh tính (IDM) là các công cụ và khung giúp các tổ chức quản lý và kiểm soát danh tính người dùng, quyền truy cập và quy trình xác thực trong hệ thống kỹ thuật số của họ.

Theo nguyên tắc **tách biệt mối quan tâm**, mỗi thành phần (hoặc hệ thống con) xử lý một chức năng logic duy nhất và phụ thuộc vào các thành phần khác để thực hiện các hoạt động nằm ngoài phạm vi của thành phần đó. 
Hệ thống quản lý danh tính phải bao gồm các thành phần logic cho các dịch vụ sau


![văn bản thay thế](/resources/least_privilege_principle_identity_management_system.png)


- **Dịch vụ Authentication** — chịu trách nhiệm xác thực người dùng; cung cấp cho người dùng khả năng tự phục vụ để đặt lại mật khẩu, đăng ký và các dịch vụ khác.

- **Dịch vụ liên kết** — chịu trách nhiệm đăng nhập một lần trên nhiều miền cho các ứng dụng web.

- **Dịch vụ Token** — chịu trách nhiệm về bảo mật phát hành token. Chủ yếu để truy cập API và truy cập web hiện đại và mobile application.

- **Dịch vụ quản lý người dùng** — Chịu trách nhiệm về các hoạt động cấp phép người dùng.









