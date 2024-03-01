# Content Provider

Content Provider quản lý cách truy cập và chia sẻ dữ liệu của ứng dụng của bạn với các ứng dụng khác. Theo Android Docs, Content Provider cho phép ứng dụng của bạn chia sẻ bất kỳ loại dữ liệu liên tục nào, có thể được lưu trữ trong file system, cơ sở dữ liệu SQLite, Room của Jetpack hoặc trên web.

Content Provider bảo mật dữ liệu bằng cách yêu cầu các quyền cụ thể. Nếu ứng dụng yêu cầu không có các quyền cần thiết thì ứng dụng đó không thể truy vấn dữ liệu của Content Provider.