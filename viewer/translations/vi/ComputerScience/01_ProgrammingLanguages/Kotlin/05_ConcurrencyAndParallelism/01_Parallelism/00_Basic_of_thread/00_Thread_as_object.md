# Thread làm đối tượng

## Chủ đề trong Kotlin

Kotlin ban đầu được thiết kế với sự hỗ trợ multithreading tích hợp. Các chủ đề được hỗ trợ ở cấp độ JVM, cấp độ ngôn ngữ (từ khóa đặc biệt) và cấp độ của thư viện tiêu chuẩn. Mỗi chương trình Kotlin có ít nhất một thread, được gọi là **chính**; nó được tạo tự động bởi JVM process để thực thi các câu lệnh bên trong hàm `main()`.

## Lớp dành cho chủ đề

thread là một chuỗi hướng dẫn mà chương trình có thể thực thi khi chạy. Mỗi thread được đại diện bởi một đối tượng - một thể hiện của lớp `java.lang.Thread` (hoặc lớp con của nó).


Lớp `Thread` có một phương thức tĩnh có tên `currentThread` để lấy tham chiếu đến đối tượng thread hiện đang thực thi

## Thông tin trên thread chính

Lớp `Thread` lưu trữ thông tin cơ bản về thread: tên, mã định danh (`long`), mức độ ưu tiên và một số đặc điểm khác có thể có được thông qua các chức năng của nó. 

Ví dụ dưới đây trình bày cách lấy các đặc tính của thread chính bằng cách tạo các tham chiếu đến nó thông qua một đối tượng của lớp `Thread`.

```kotlin
fun main() {
    val t: Thread = Thread.currentThread() // main thread

    println("Name: ${t.name}")
    println("ID: ${t.id}")
    println("Alive: ${t.isAlive}")
    println("Priority: ${t.priority}")
    println("Daemon: ${t.isDaemon}")
}
```


- `t.name` trả về tên của thread;

- `t.id` trả về mã định danh duy nhất của thread;

- `t.isAlive` cho chúng tôi biết thread đã được khởi động và chưa chết chưa;

- `t.priority` trả về mức độ ưu tiên của thread đã cho.

- `t.isDaemon` kiểm tra xem thread có phải là **daemon** hay không. 

> [!NOTE]
> Daemon thread (xuất phát từ thuật ngữ UNIX) là thread có mức độ ưu tiên thấp chạy trong nền để thực hiện các tác vụ như rác collection, v.v. JVM không đợi các luồng daemon dừng trước khi thoát, trong khi nó làm như vậy đối với các luồng không phải daemon.

Mỗi đặc tính có thể được thay đổi bằng cách đặt một giá trị mới