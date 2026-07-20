Nguyên tắc #Separation of Concerns (SoC)

Nguyên tắc **Separation of Concerns** (SoC) là một khái niệm cơ bản trong phát triển phần mềm khuyến khích chia hệ thống thành các phần riêng biệt và độc lập, trong đó mỗi phần giải quyết một mối quan tâm hoặc trách nhiệm cụ thể.

## Mục tiêu

Mục tiêu chính của SoC là:

- **Khả năng bảo trì**: Những thay đổi ở một phần không ảnh hưởng đến những phần khác.
- **Tính mô-đun**: Các thành phần có thể được phát triển, thử nghiệm và triển khai độc lập.
- **Khả năng sử dụng lại**: Các thành phần có thể được tái sử dụng trong các dự án khác nhau.

## Ví dụ

Trong phát triển web, SoC thường được triển khai bằng cách tách các thành phần sau:

- **User Interface (UI)**: Quản lý cách người dùng hiển thị và tương tác với thông tin.
- **Logic nghiệp vụ**: Xử lý các quy tắc và quy trình kinh doanh cốt lõi.
- **Truy cập dữ liệu**: Quản lý việc lưu trữ và truy xuất dữ liệu từ cơ sở dữ liệu hoặc các nguồn khác.

Ví dụ: trong ứng dụng web, HTML/CSS được sử dụng cho UI, các ngôn ngữ lập trình như JavaScript hoặc Python xử lý logic nghiệp vụ và SQL hoặc ORM chịu trách nhiệm truy cập dữ liệu.

> [!NOTE]
> Ánh xạ quan hệ đối tượng (ORM) là một kỹ thuật cho phép bạn truy vấn và thao tác dữ liệu từ cơ sở dữ liệu bằng cách sử dụng mô hình hướng đối tượng.

## Mối liên hệ với Nguyên tắc Single Responsibility (SRP)

**Nguyên tắc Single Responsibility (SRP)** nêu rõ rằng một lớp hoặc mô-đun chỉ được có một lý do để thay đổi.
SoC hỗ trợ SRP bằng cách đảm bảo rằng mỗi thành phần trong hệ thống tập trung vào một nhiệm vụ duy nhất, giảm độ phức tạp và tăng tính linh hoạt trong phát triển phần mềm.
