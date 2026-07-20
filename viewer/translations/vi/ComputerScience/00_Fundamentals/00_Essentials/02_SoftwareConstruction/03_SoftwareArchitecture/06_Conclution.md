| Tính năng | MVC (Model-View-Controller) | MVP (Model-View-Presenter) | MVVM (Mẫu-View-ViewModel) | MVI (Model-View-Intent) |
|--------------|---------------------------------------|---------------------------|-----------------------------------|--------------------------|
| **Dữ liệu Flow** | Hai chiều | Hai chiều | Một chiều | Một chiều |
| **UI Sự phụ thuộc vào logic nghiệp vụ** | Cao | Trung bình | Thấp | Rất Thấp |
| **Khả năng kiểm tra** | Thấp | Trung bình | Cao | Rất cao |
| **Độ phức tạp** | Thấp | Trung bình | Trung bình | Cao |
| **Separation of Concerns** | Yếu | Trung bình | Mạnh mẽ | Rất Mạnh |
| **Trường hợp sử dụng tốt nhất** | Ứng dụng đơn giản | Ứng dụng cỡ trung bình | Ứng dụng quy mô lớn | Ứng dụng có quản lý trạng thái phức tạp |
| **UI Thay đổi linh hoạt** | Thấp | Trung bình | Cao | Rất cao |
| **Quản lý nhà nước** | Yếu | Trung bình | Trung bình | Mạnh (Trạng thái Immutable) |
| **Phụ thuộc vào Khung** | Cao | Trung bình | Trung bình | Thấp |


> [!IMPORTANT]
> Clean Architecture là software architecture, trong khi MVC, MVP, MVVM và MVI thường được sử dụng trong Lớp trình bày của nó. Trước tiên, bạn không cần phải triển khai Clean Architecture nhưng nếu có, bạn có thể chọn một trong các mẫu này cho UI.