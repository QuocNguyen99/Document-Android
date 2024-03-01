# Broadcast Receiver

Broadcast receiver is là một listener có thể đăng ký để nghe các broadcast messages từ hệ thống Android và các ứng dụng Android khác.
Theo tài liệu Android, Broadcast receiver được sử dụng để gửi tin nhắn trên các ứng dụng và bên ngoài luồng người dùng thông thường,
chẳng hạn như khi hệ thống khởi động hoặc thiết bị bắt đầu sạc.

Không giống như Activity và Service, Broadcast receiver không có vòng đời chuyên dụng. 
Thay vào đó, nó sẽ lắng nghe tất cả các thông báo sự kiện được chỉ định cho đến khi được unregistered.
