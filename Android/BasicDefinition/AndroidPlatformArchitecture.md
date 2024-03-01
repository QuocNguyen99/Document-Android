# Android Platform Architecture

![](../../resources/android-platform-architecture.avif)

Kiến trúc nền tảng Android bao gồm sáu lớp được xây dựng trên hạt nhân Linux.
(Lưu ý: Kiến trúc thực tế được xếp theo thứ tự ngược lại với hình trên.)

## The Linux Kernel

Nhân Linux là cốt lõi của kiến trúc nền tảng Android.
Nó quản lý bộ nhớ cấp thấp và tất cả các trình điều khiển phần cứng có sẵn – chẳng hạn như trình điều khiển WiFi,
trình điều khiển máy ảnh, trình điều khiển âm thanh, trình điều khiển bluetooth,
trình điều khiển màn hình và tất cả các trình điều khiển ngoại vi.

## Hardware Abstraction Layer (HAL)

Hardware Abstraction Layer (HAL) kết nối các khả năng của phần cứng với API Framework Java cấp cao hơn
bằng cách xác định các standard interface, cho phép bạn triển khai các chức năng cấp thấp mà không cần
sửa đổi các hệ thống cấp cao hơn.

Việc triển khai HAL được đóng gói thành các mô-đun, được lưu trữ dưới dạng thư viện dùng chung (tệp .so)
và được hệ thống Android tải vào thời điểm thích hợp.

## Android Runtime

Android Runtime (ART) là một ứng dụng Runtime System được sử dụng bởi hệ điều hành Android
và là một trong những tính năng cốt lõi trong hệ sinh thái Android.
ART được phát minh để thay thế máy ảo Dalvik cho các thiết bị chạy Android phiên bản 5.0 (Lollipop) trở lên.

Vai trò chính của ART là thực thi định dạng Dalvik Executable (DEX) bằng cách dịch mã byte DEX
thành mã máy mà hệ thống của bạn có thể hiểu được.

Kiến trúc ART được viết để chạy nhiều máy ảo trên các thiết bị có bộ nhớ thấp.
Một số tính năng chính liên quan trực tiếp đến tốc độ chạy ứng dụng Android.
Các tính năng chính của ART bao gồm:
- Tổng hợp trước thời gian (AOT) và đúng lúc (JIT)

- Thu gom rác nâng cao (GC)

- Chuyển đổi tệp DEX của gói ứng dụng thành mã máy cô đọng (trên Android 9 (API cấp 28+))

- Hỗ trợ gỡ lỗi tốt hơn, bao gồm chẩn đoán chi tiết và báo cáo sự cố, khả năng đặt nhiều điểm xem và hơn thế nữa

## Native C/C++ Libraries

Nền tảng Android bao gồm một cặp Native API, hoạt động dựa trên Native Development kit (NDK).
Native API cho phép bạn quản lý các native activities và truy cập các thành phần thiết bị vật lý như máy ảnh,
cảm biến, đồ họa và âm thanh. Chúng cũng được tiếp xúc với các lớp cấp cao hơn,
do đó bạn có thể kiểm soát các thành phần của thiết bị vật lý trên API Java Framework.

## Java API Framework (Application Framework)

API Java framework là tập hợp các thư viện Android được viết bằng Java và Kotlin,
cung cấp toàn bộ bộ tính năng của HĐH Android. API Android bao gồm View System có thể mở rộng,
các thành phần có thể tái sử dụng và trình quản lý hệ thống được sử dụng để xây dựng các ứng dụng
Android của bạn bằng cách đơn giản hóa việc sử dụng lại giao diện.

**Một trong những API mạnh mẽ hơn trong API Java Framework là Android Jetpack**, được phát triển bởi Google.
Jetpack tăng tốc độ phát triển bằng cách giảm mã soạn sẵn để nhà phát triển có thể tập trung vào mã họ quan tâm.

Ngoài ra, nó còn cung cấp các giải pháp như Lifecycle, UI toolkit, Navigation, Security,
Caching, Scheduler, Dependency Injection...

## System Apps

Ứng dụng hệ thống là các ứng dụng được cài đặt sẵn như email, nhắn tin SNS, lịch, internet browser,
danh bạ, v.v., nằm trong phân vùng hệ thống cùng với ROM của bạn.
Cấu hình của Ứng dụng hệ thống có thể khác nhau tùy thuộc vào nhà sản xuất điện thoại di động.