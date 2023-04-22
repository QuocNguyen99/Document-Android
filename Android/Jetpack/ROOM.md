# ROOM Database

    Room Database(**Room Persistence Library**) là một phần trong Android Architecture Components, nó giúp cho việc thao tác với SQLiteDatabase Object trở lên dễ dàng hơn, giảm thiểu số lượng câu truy vấn bằng những annotation sẵn có và xác minh truy vấn tại thời điểm biên dịch.

## Cấu Tạo ROOM Database

![loading-ag-65](../resources/room.webp)

* SQLite database: Đây chính là thành phần cốt lõi mà các data được lưu trữ trong đây. Và file này được lưu trong thiết bị.
* DAO (Data access object): Chứa các ánh xạ SQLite tới các hàm CRUD. Chắc hẳn bạn vẫn còn nhớ mình đã phải rất cẩn thận viết câu queries SQLite chứ, nếu chẳng may có sai thì phải dò lại rất cẩn thận. Nhưng bây giờ điều đó trở lên đơn giản hơn rất nhiều, khi bạn dùng DAO và call các method rồi Room sẽ làm tiếp những phần còn lại. (Cách queries cũ mình để phía dưới để lát nữa bạn tiện so sánh). 
* Entity: Đây chính là những đối tượng nhỏ bạn cần lưu trữ (table) Ex: user table, event table,... Hiện tại tất cả việc định nghĩa thuộc tính đã được support bằng annotations rất ngắn gọn.
* Room database: Đây là lớp abstract layer nằm ngoài cùng đóng vai trò quản lý SQLite database và cho phép truy cập tới tầng dưới cùng của SQLite. Room dùng DAO để thực hiện các queries tới database.


