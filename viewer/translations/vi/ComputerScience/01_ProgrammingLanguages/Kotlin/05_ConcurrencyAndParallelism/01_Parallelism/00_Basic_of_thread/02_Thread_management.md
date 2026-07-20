Quản lý #Thread

chúng ta sẽ xem xét hai phương thức thường được sử dụng trong lập trình multithreading: `sleep()` và `join()`. Cả hai phương pháp đều có thể tạo ra `InterruptedException`.

## Đang ngủ

Phương thức `Thread.sleep()` khiến thread hiện đang thực thi tạm dừng thực thi trong số mili giây được chỉ định.

Một cách khác để tạo trạng thái ngủ thread hiện tại là sử dụng lớp đặc biệt `TimeUnit` từ gói `java.util.concurrent`, ví dụ:

`TimeUnit.MILLISECONDS.sleep(2000)` thực hiện `Thread.sleep` trong 2000 mili giây;

Hiện có nhiều giai đoạn khác: `NANOSECONDS`, `MICROSECONDS`, `MILLISECONDS`, `SECONDS`, `MINUTES`, `HOURS` và `DAYS`. 

## Tham gia

Phương thức `join` buộc thread hiện tại phải chờ hoàn thành một thread khác mà phương thức được gọi trên đó.

Phiên bản quá tải của phương thức `join` mất thời gian chờ tính bằng mili giây:

```kotlin
thread.join(2000)
```