# Chủ đề và ngoại lệ

Nếu một trong các luồng trong chương trình của bạn đưa ra một ngoại lệ mà bất kỳ phương thức nào trong ngăn xếp lệnh gọi không phát hiện được thì thread sẽ bị chấm dứt. Nếu ngoại lệ như vậy xảy ra trong một chương trình đơn luồng, toàn bộ chương trình sẽ dừng vì JVM chấm dứt chương trình đang chạy ngay khi không còn luồng **không phải daemon** nào nữa.

Ví dụ: 


```kotlin
fun main() {
    print(2 / 0)
}
```

Đầu ra:

```bash
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at ExampleKt.main(example.kt:6)
    at ExampleKt.main(example.kt)

Process finished with exit code 1
```
Mã `1` có nghĩa là process đã được hoàn thành và có lỗi.

Nếu xảy ra lỗi bên trong thread mới mà chúng tôi đã tạo, toàn bộ process sẽ không bị dừng:

```kotlin
fun main() {
    val thread = CustomThread()
    thread.start()
    thread.join() // wait for the thread with an exception to terminate
    println("I am printed!") // this line will be printed
}


class CustomThread : Thread() {
    override fun run() {
        println(2 / 0)
    }
}
```

Mặc dù có ngoại lệ chưa được phát hiện, chương trình sẽ được hoàn thành thành công.

```bash
Exception in thread "Thread-2" java.lang.ArithmeticException: / by zero
    at CustomThread.run(example.kt:14)
I am printed!

Process finished with exit code 0
```

Mã `0` có nghĩa là process đã được hoàn thành thành công.


Điều gì sẽ xảy ra nếu có lỗi trong thread chính trong khi mã thread tùy chỉnh là chính xác? Hãy xem:

```kotlin
fun main() {
    thread(block = {
        println("Hello from the custom thread!")
    })
    print(2 / 0)
    println("Hello from the main thread!")
}
```
Đầu ra của chương trình sẽ như sau:

```bash
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Thread_excKt.main(thread_exc.kt:7)
	at Thread_excKt.main(thread_exc.kt)
Hello from the custom thread!

Process finished with exit code 1
```

Kết quả là process bị lỗi (mã thoát `1`). Mã sau `print(2 / 0)` không thực thi nhưng khối mã trong thread tùy chỉnh thì có. Vì vậy, mặc dù có ngoại lệ trong thread chính, các luồng tùy chỉnh luôn hoạt động chính xác, ngay cả khi chương trình kết thúc với lỗi.

