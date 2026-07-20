#kiểu dữ liệu

## Các loại biến

Kiểu của biến được đặt khi biến được khai báo:

```kotlin
val text = "Hello, I am studying Kotlin now."
val n = 1
```

Trong trường hợp này, Kotlin biết rằng văn bản là một chuỗi và n là một số. Kotlin tự động xác định loại của cả hai biến. Cơ chế này được gọi là type inference.

Bạn cũng có thể chỉ định loại biến khi khai báo nó:


```kotlin
val text: String = "Hello, I am studying Kotlin now."
val n: Int = 1
```