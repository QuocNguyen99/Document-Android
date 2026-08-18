#Kiến trúc ứng dụng

## Nguyên tắc kiến ​​trúc chung

Khi ứng dụng Android tăng kích thước, điều quan trọng là phải xác định kiến ​​trúc cho phép ứng dụng mở rộng quy mô, tăng độ mạnh mẽ của ứng dụng và giúp ứng dụng dễ kiểm tra hơn.

Kiến trúc ứng dụng xác định ranh giới giữa các phần của ứng dụng và trách nhiệm của mỗi phần.
Để đáp ứng các nhu cầu nêu trên, bạn nên thiết kế kiến ​​trúc ứng dụng của mình tuân theo một số nguyên tắc cụ thể.

### 1. Separation of concerns

Nguyên tắc quan trọng nhất cần tuân theo là separation of concerns. Một lỗi phổ biến là viết tất cả mã của bạn trong `Activity` hoặc `Fragment`.
Các lớp dựa trên UI- này chỉ nên chứa logic xử lý UI và các tương tác của hệ điều hành.
Bằng cách giữ cho các lớp này gọn gàng nhất có thể, bạn có thể tránh được nhiều vấn đề liên quan đến thành phần lifecycle và cải thiện khả năng kiểm tra của các lớp này.


### 2. Lái UI từ mô hình dữ liệu

Một nguyên tắc quan trọng khác là bạn nên điều khiển UI của mình từ các mô hình dữ liệu, tốt nhất là các mô hình liên tục.

> [!NOTE]
> mô hình liên tục đề cập đến data structure hoặc biểu diễn thông tin trong ứng dụng phần mềm được lưu trữ trong bộ lưu trữ lâu dài, không thay đổi như cơ sở dữ liệu
>
Các mô hình liên tục là lý tưởng vì những lý do sau:
- Người dùng của bạn không bị mất dữ liệu nếu Android OS phá hủy ứng dụng của bạn để giải phóng tài nguyên.
- Ứng dụng của bạn tiếp tục hoạt động trong trường hợp kết nối mạng không ổn định hoặc không khả dụng.

Mô hình dữ liệu đại diện cho dữ liệu của một ứng dụng. Chúng độc lập với các thành phần UI và các thành phần khác trong ứng dụng của bạn.
Điều này có nghĩa là chúng không bị ràng buộc với UI và thành phần ứng dụng lifecycle nhưng vẫn sẽ bị hủy khi OS quyết định xóa process của ứng dụng khỏi bộ nhớ.

### 3. Single source of truth

Khi một loại dữ liệu mới được xác định trong ứng dụng của bạn, bạn nên gán Single Source of Truth (SSOT) cho nó.
SSOT là chủ sở hữu của dữ liệu đó và chỉ SSOT mới có thể sửa đổi hoặc thay đổi dữ liệu đó.
Để đạt được điều này, SSOT hiển thị dữ liệu bằng loại immutable và để sửa đổi dữ liệu, SSOT hiển thị các chức năng hoặc nhận sự kiện mà các loại khác có thể gọi.

Mô hình này mang lại nhiều lợi ích:
- Nó tập trung tất cả các thay đổi đối với một loại dữ liệu cụ thể vào một nơi.
- Nó bảo vệ dữ liệu để các loại khác không thể giả mạo nó.
- Nó làm cho những thay đổi đối với dữ liệu dễ theo dõi hơn. Vì vậy, lỗi dễ dàng được phát hiện hơn.

### 4. Unidirectional Data Flow

Trong UDF, trạng thái chỉ diễn ra theo một hướng.
Các sự kiện sửa đổi luồng dữ liệu theo hướng ngược lại.

Trong Android, trạng thái hoặc dữ liệu thường chuyển từ các loại phân cấp có phạm vi cao hơn sang các loại có phạm vi thấp hơn.
Các sự kiện thường được kích hoạt từ các loại có phạm vi thấp hơn cho đến khi chúng đạt tới SSOT cho loại dữ liệu tương ứng. 

Mẫu này đảm bảo tính nhất quán của dữ liệu tốt hơn, ít xảy ra lỗi hơn, dễ gỡ lỗi hơn và mang lại tất cả lợi ích của mẫu SSOT.



## Kiến trúc ứng dụng

Xem xét các nguyên tắc kiến trúc chung được đề cập trong phần trước, mỗi ứng dụng phải có ba lớp
- [Lớp UI](/General/ComputerScience/3_Mobile/0_Android/3_Architecture/3_AppArchitecture/1_UILayer.md)
- [Domain Layer](/General/ComputerScience/3_Mobile/0_Android/3_Architecture/3_AppArchitecture/2_DomainLayer.md)
- [Data Layer](/General/ComputerScience/3_Mobile/0_Android/3_Architecture/3_AppArchitecture/3_DataLayer.md)

## Quản lý sự phụ thuộc giữa các thành phần

Các lớp trong ứng dụng của bạn phụ thuộc vào các lớp khác để hoạt động bình thường.
Bạn có thể sử dụng một trong các mẫu thiết kế sau để thu thập các dependency của một lớp cụ thể:

- **Dependency injection (DI)**: Dependency injection cho phép các cô gái xác định sự phụ thuộc của chúng mà không cần xây dựng chúng. Tại runtime, một lớp khác chịu trách nhiệm cung cấp các dependency này.
- **Bộ định vị dịch vụ**: Mẫu bộ định vị dịch vụ cung cấp một sổ đăng ký trong đó các lớp có thể lấy các dependency của chúng thay vì xây dựng chúng.

Các mẫu này cho phép bạn mở rộng quy mô mã của mình vì chúng cung cấp các mẫu rõ ràng để quản lý các dependency mà không cần sao chép mã hoặc tăng thêm độ phức tạp.
Hơn nữa, các mẫu này cho phép bạn nhanh chóng chuyển đổi giữa triển khai thử nghiệm và sản xuất.




