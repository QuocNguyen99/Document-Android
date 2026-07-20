# Mutable Trạng thái Flow

## Tìm hiểu `MutableStateFlow.value` và `MutableStateFlow.update {}`

## 1. giá trị là thread-safe

- Bạn có thể đọc và ghi `.value` một cách an toàn từ nhiều coroutine mà không gây ra sự cố.
- Kotlin sử dụng synchronization nội bộ (như tài liệu tham khảo nguyên tử) để đảm bảo an toàn cho thread.
- Tuy nhiên, `value = value + 1` không phải là nguyên tử — nó liên quan đến việc đọc-sửa đổi-ghi, điều này có thể dẫn đến tình trạng xung đột.

## 2. `update {}` là nguyên tử

- `MutableStateFlow<T>.update {}` đảm bảo cập nhật nguyên tử và nhất quán dựa trên giá trị hiện tại.

- Sử dụng nội bộ vòng lặp so sánh và đặt: 
  - Đọc giá trị hiện tại.
  - Áp dụng chức năng của bạn.
  - Chỉ cập nhật nếu giá trị không thay đổi.
  - Thử lại nếu có sự sửa đổi đồng thời.
- Ngăn chặn tình trạng mất bản cập nhật khi nhiều coroutine cập nhật luồng cùng lúc.

## 3. Khi nào nên sử dụng `.value` và `.update {}`

Bạn có thể sử dụng phép gán trực tiếp khi:
- Bạn không dựa vào giá trị trước đó.
- Bạn đang ở trong bối cảnh đơn luồng hoặc an toàn với coroutine.

Sử dụng bản cập nhật khi:
- Bạn sửa đổi giá trị dựa trên trạng thái hiện tại của nó.
- Có nhiều bản cập nhật đồng thời.






