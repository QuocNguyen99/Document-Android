# Ngẫu nhiên

## Các loại số ngẫu nhiên

Bạn có thể đặt một số hạn chế cho số ngẫu nhiên của mình bằng cách chọn một loại cụ thể. Mọi thứ bạn cần cho mục đích này đều nằm trong gói `kotlin.random`. Hãy xem đoạn mã dưới đây:

```kotlin
fun main() {
    // generates an integer value between Int.MIN_VALUE and Int.MAX_VALUE (inclusive)
    println( Random.nextInt() ) 
    // generates a long value between Long.MIN_VALUE and Long.MAX_VALUE (inclusive).
    println( Random.nextLong() ) 
    // generates a float value between 0 (inclusive) and 1.0 (exclusive)
    println( Random.nextFloat() )
    // generates a double value between 0 (inclusive) and 1.0 (exclusive)
    println( Random.nextDouble() )
    // same thing one more time
    println( Random.nextDouble() )
}
```

Chú ý nếu chạy lại thì số sẽ khác

## Phạm vi tùy chỉnh

chúng ta có thể chỉ định chúng một cách rõ ràng:

```kotlin
// generates a non-negative integer value less than 100 
Random.nextInt(100) 
// generates an integer value between 1 (inclusive) and 100 (exclusive)
Random.nextInt(1, 100) 

// generates a non-negative long value less than 100
Random.nextLong(100)
// generates a long value between 1 (inclusive) and 100 (exclusive)
Random.nextLong(1, 100) 
 
// generates a non-negative double value less than 5.0 
Random.nextDouble(5.0) 
// generates a double value between 0.0 (inclusive) and 5.0 (exclusive)
Random.nextDouble(0.0, 5.0) 
```

## Số giả ngẫu nhiên và gieo hạt

Chúng ta có thể tính toán tất cả nếu biết giá trị ban đầu và thuật toán của chuỗi.

Giá trị ban đầu đó được gọi là **seed**.

Đảm bảo rằng cùng một hạt giống sẽ tạo ra cùng một chuỗi nếu sử dụng cùng một phiên bản Kotlin runtime vì thuật toán giống nhau

```kotlin
val randomGenerator42 = Random(42) // the generator takes the seed
for (i in 0..5) {
    randomGenerator42.nextInt(100)
}
//this code will always generate the same six numbers — 33, 40, 41, 2, 41, 32
```
