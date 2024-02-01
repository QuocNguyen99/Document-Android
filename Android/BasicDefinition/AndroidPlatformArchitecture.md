# Android Platform Architecture

Kiến trúc nền tảng Android bao gồm sáu lớp được xây dựng trên hạt nhân Linux.

## The Linux Kernel

Nhân Linux là cốt lõi của kiến trúc nền tảng Android.
Nó quản lý bộ nhớ cấp thấp và tất cả các trình điều khiển phần cứng có sẵn – chẳng hạn như trình điều khiển WiFi,
trình điều khiển máy ảnh, trình điều khiển âm thanh, trình điều khiển bluetooth, 
trình điều khiển màn hình và tất cả các trình điều khiển ngoại vi – thông qua [Daemon Low Memory Killer](https://source.android.com/docs/core/perf/lmkd).

## Hardware Abstraction Layer (HAL)

Lớp trừu tượng phần cứng (HAL) kết nối các khả năng của phần cứng với API framework Java cấp cao hơn bằng cách
xác định các interface tiêu chuẩn, cho phép bạn triển khai các chức năng cấp thấp mà 
không cần sửa đổi các hệ thống cấp cao hơn.

Việc triển khai HAL được đóng gói thành các mô-đun, được lưu trữ dưới dạng thư viện dùng chung 
(tệp .so) và được hệ thống Android tải vào thời điểm thích hợp.


## Android Runtime

Android Runtime (ART) là một ứng dụng Runtime System được sử dụng bởi hệ điều hành Android
và là một trong những tính năng cốt lõi trong hệ sinh thái Android. 
ART được phát minh để thay thế máy ảo Dalvik cho các thiết bị chạy Android phiên bản 5.0 (Lollipop) trở lên.

Vai trò chính của ART là thực thi định dạng Dalvik Executable (DEX) bằng cách dịch mã byte DEX 
thành mã máy mà hệ thống của bạn có thể hiểu được.

Kiến trúc ART được viết để chạy nhiều máy ảo trên các thiết bị có bộ nhớ thấp. 
Một số tính năng chính liên quan trực tiếp đến tốc độ chạy ứng dụng Android. 
Các tính năng chính của ART bao gồm:

- Ahead-of-time (AOT) và just-in-time (JIT)
- Thu gom rác nâng cao (GC)
- Chuyển đổi tệp DEX của gói ứng dụng thành mã máy cô đọng (trên Android 9 (API cấp 28+))
- Hỗ trợ gỡ lỗi tốt hơn, bao gồm chẩn đoán chi tiết và báo cáo sự cố, khả năng đặt nhiều điểm xem và hơn thế nữa

check out [Android Runtime (ART) and Dalvik](https://source.android.com/docs/core/runtime).

## Native C/C++ Libraries

Nền tảng Android bao gồm một cặp API gốc, hoạt động dựa trên Bộ công cụ phát triển gốc (NDK).

API gốc cho phép bạn quản lý các hoạt động gốc và truy cập các thành phần thiết bị vật lý như máy ảnh, cảm biến, đồ họa và âm thanh.
Chúng cũng được tiếp xúc với các lớp cấp cao hơn, do đó bạn có thể kiểm soát các thành phần của thiết bị vật lý trên khung API Java.

## Java API Framework (Application Framework)

The Java API framework is a collection of Android libraries written in Java and Kotlin
that provides the entire feature-set of the Android OS. 
Android APIs include an extensible View System, reusable components, 
and system managers which are used to build your Android applications by simplifying the reuse of interfaces.

One of the more powerful APIs in the Java API framework is Android Jetpack, 
which is pushed by Google. Jetpack accelerates development speed by reducing boilerplate code so that developers can focus on the code they care about.
Also, it provides solutions like Lifecycle, UI toolkit, Navigation, Security, Caching, Scheduler, 
Dependency Injection, and a lot more. You’ll cover this deeply in future posts.

## System App

System apps are pre-installed apps such as email, SNS messaging, calendars, internet browsing, contacts,
and more, which are located in the system partition with your ROM. The configuration of the System Apps may vary depending on the mobile phone manufacturer.
For more details, you can check out System Apps.
In this section, you covered the overall architecture of the Android platform. For more details, check out Android Platform Architecture.
