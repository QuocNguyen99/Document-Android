#LiveData

`LiveData` là lớp chứa dữ liệu có thể quan sát được. Không giống như `LiveData` có thể quan sát thông thường, lifecycle nhận biết được, nghĩa là nó tôn trọng lifecycle của các thành phần ứng dụng khác, chẳng hạn như hoạt động, phân đoạn hoặc dịch vụ. 

## Ưu điểm khi sử dụng LiveData
- Đảm bảo UI khớp với trạng thái dữ liệu của bạn
- Không rò rỉ bộ nhớ
- Không có sự cố do hoạt động bị dừng
- Không cần xử lý lifecycle thủ công nữa

> [!NOTE]
> `StateFlow` là một phần của Coroutine Kotlin, giúp nó tương thích liền mạch với các tính năng của coroutine như chức năng tạm ngưng, viewModelScope và các API dựa trên luồng khác.
> Ngược lại, `LiveData` vốn không hỗ trợ coroutine và thường yêu cầu các bộ chuyển đổi như `liveData {}` hoặc `.asLiveData()` để kết nối giữa mã coroutine và bộ quan sát `LiveData`.



