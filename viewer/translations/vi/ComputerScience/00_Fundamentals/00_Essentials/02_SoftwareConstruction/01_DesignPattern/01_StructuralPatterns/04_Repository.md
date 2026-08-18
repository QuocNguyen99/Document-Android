#Repository


Repository Design Pattern là mẫu cấu trúc trừu tượng hóa quyền truy cập dữ liệu, cung cấp một cách tập trung để quản lý các hoạt động dữ liệu.

## Các khái niệm chính

- **Tính trừu tượng của quyền truy cập dữ liệu**: Bằng cách đóng gói logic truy cập dữ liệu, repository pattern tách logic nghiệp vụ khỏi các nguồn dữ liệu cơ bản, thúc đẩy separation of concerns sạch.
- **Quản lý dữ liệu tập trung**: Nó tập trung chức năng truy cập dữ liệu phổ biến, làm cho cơ sở mã dễ bảo trì và kiểm tra hơn.

## Những lợi ích

- **Tách logic nghiệp vụ khỏi truy cập dữ liệu**: Sự tách biệt này cho phép bảo trì dễ dàng hơn và linh hoạt hơn trong việc thay đổi nguồn dữ liệu mà không ảnh hưởng đến logic nghiệp vụ.
- **Khả năng kiểm tra nâng cao**: Với logic truy cập dữ liệu được trừu tượng hóa, việc kiểm tra đơn vị trở nên đơn giản hơn vì các dependency có thể bị mô phỏng hoặc sơ khai
