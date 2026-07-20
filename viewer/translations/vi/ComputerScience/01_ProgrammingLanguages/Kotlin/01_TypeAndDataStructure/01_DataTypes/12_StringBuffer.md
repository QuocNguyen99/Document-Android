#StringBuffer

`StringBuffer` là giải pháp thay thế thread an toàn cho `StringBuilder`, được thiết kế để sử dụng trong môi trường đa luồng. Nó đảm bảo synchronization, chỉ cho phép một thread truy cập vào các phương thức của nó tại một thời điểm, ngăn chặn tình trạng chạy đua. 

## Trình xây dựng của StringBuffesr

- **Trình tạo mặc định**: Tạo một `StringBuffer` trống với dung lượng mặc định là 16 ký tự:
```kotlin
val buffer = StringBuffer()
```
- **Với nội dung ban đầu**: Khởi tạo với một chuỗi đã cho:
```kotlin
val buffer = StringBuffer("Kotlin")
```
- **Với công suất được chỉ định**: Đặt công suất ban đầu tùy chỉnh:
```kotlin
val buffer = StringBuffer(10)
```

## Các phương pháp chính

`StringBuffer` chia sẻ các phương thức với `StringBuilder`, chẳng hạn như `append()`, `insert()`, `delete()`, `reverse()` và `replace()`.

> **Lưu ý**: Phương thức `toString()` tạo một đối tượng `String` mới. Những thay đổi đối với `StringBuffer` sau khi gọi `toString()` không ảnh hưởng đến `String`.

##Thread Safety

Tất cả các phương pháp `StringBuffer` đều được đồng bộ hóa, giúp thread an toàn. Tuy nhiên, synchronization chỉ áp dụng cho các phương thức của nó chứ không áp dụng cho chính đối tượng. Đảm bảo tài nguyên được chia sẻ được đồng bộ hóa bên ngoài khi được sử dụng trên các luồng.

### Ví dụ:
```kotlin
fun main() {
        val sharedSequence = StringBuilder("InitialData")
    val stringBuffer = StringBuffer()

        val thread1 = Thread {
        synchronized(sharedSequence) {
            stringBuffer.append(sharedSequence)
        }
        println("Thread 1: $stringBuffer")
    }

        val thread2 = Thread {
        synchronized(sharedSequence) {
            sharedSequence.append("ModifiedByThread2")
        }
        println("Thread 2: $sharedSequence")
    }

        thread1.start()
    thread2.start()
    thread1.join()
    thread2.join()

    println("Final StringBuffer content: $stringBuffer")
    println("Final shared sequence content: $sharedSequence")
}
```

## Các phương pháp hay nhất

### Sử dụng `StringBuilder` Khi:
1. Các hoạt động đơn luồng như nối chuỗi, ghi nhật ký hoặc tạo nội dung động.
2. Các tác vụ quan trọng về hiệu suất trong đó synchronization là không cần thiết.

### Sử dụng `StringBuffer` Khi:
1. Hoạt động đa luồng yêu cầu thao tác chuỗi an toàn thread.
2. Tạo văn bản đồng thời hoặc lưu các chuỗi được chia sẻ vào bộ nhớ đệm trên các luồng.

## Đánh đổi hiệu suất

`StringBuffer` chậm hơn `StringBuilder` do chi phí synchronization. Sử dụng `StringBuilder` nếu không cần thread safety.

### Ví dụ:
```kotlin
const val N = 99999999

fun main() {
        val buffer = StringBuffer()
        val builder = StringBuilder()
    
    val bufferTime = measureTimeMillis {
        for (i in N downTo 1) buffer.append("")
    }

    val builderTime = measureTimeMillis {
    for (i in N downTo 1) builder.append("")
    }
    
    println("StringBuffer: $bufferTime ms")
    println("StringBuilder: $builderTime ms")
}
```
**Đầu ra:**
```bash
StringBuffer: 1999 ms
StringBuilder: 193 ms
```