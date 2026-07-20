# Lưu trữ mật mã không an toàn

## Không lưu trữ bằng mật mã

Việc lưu trữ mật khẩu ở dạng văn bản thuần túy có thể ít phức tạp hơn và nhanh hơn để xác thực người dùng, nhưng nó có thể làm lộ dữ liệu nhạy cảm trong trường hợp vi phạm dữ liệu. 
Vi phạm dữ liệu có thể bắt nguồn từ kẻ tấn công bên ngoài hoặc từ bên trong tổ chức.

## Băm yếu

MD5 và SHA1 được chứng minh là không đủ khả năng để băm thông tin nhạy cảm. Họ đã **hỏng** rồi. Nếu tìm thấy điểm yếu trong hash function cho phép hai tệp có cùng thông báo. Sau đó, nó được coi là bị phá vỡ.

Hãy so sánh `MD5`, `SHA1`, `SHA256` và `Bcrypt`. Chúng tôi sẽ băm tin nhắn; `hello`.

![văn bản thay thế](/resources/cybersecurity_insecure_crypto_weak_hashing.png)

Bạn có thể thắc mắc, phải chăng điều đó có nghĩa là càng lâu càng tốt? **KHÔNG**. 
Về mặt kỹ thuật **thuật toán cũng quan trọng** vì MD5, SHA1 và SHA256 là **băm nhanh**.
Chúng được thiết kế để hoạt động rất nhanh và đầu ra luôn giống nhau vì chúng **không được thêm muối**. 
Salting là process thêm các chuỗi ngẫu nhiên vào dữ liệu trước khi băm và nó được dùng để bảo vệ dữ liệu khỏi **cuộc tấn công bảng cầu vồng**.

Mặt khác, Bcrypt bị muối; hàm băm thay đổi mỗi lần nó được tính toán do lượng muối được thêm vào, khiến việc sử dụng tấn công bảng cầu vồng là không thực tế.

> [!WARNING]
> Bcrypt cũng được thiết kế để hoạt động chậm. Tốc độ có thể được điều chỉnh với hệ số chi phí.


## encryption yếu

Khi lưu trữ dữ liệu cần được truy cập ở dạng ban đầu, chúng tôi sử dụng encryption.
> [!NOTE]
> Băm không nhằm mục đích truy xuất dữ liệu gốc mà là để xác nhận dữ liệu gốc khớp với hàm băm của dữ liệu được lưu trữ. 

Encryption sử dụng **phím** để thay đổi hoặc mã hóa nội dung gốc thành các bit hoặc văn bản mã hóa dường như ngẫu nhiên.
Nếu không có khóa thích hợp thì không thể giải mã được dữ liệu gốc. Việc sử dụng thuật toán encryption yếu có thể khiến các bên không mong muốn truy cập thông tin nhạy cảm.

> [!CAUTION]
> Một trong những thuộc tính khiến thuật toán encryption yếu là kích thước khóa không đủ

## Tài liệu tham khảo

- https://hyperskill.org/learn/step/20069



