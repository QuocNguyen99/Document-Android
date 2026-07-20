# cà ri

Khái niệm này cho phép bạn chuyển đổi một hàm có nhiều đối số thành một chuỗi các hàm, mỗi hàm có một đối số duy nhất. Nói cách khác, nó chia một hàm nhận nhiều đối số thành một chuỗi các hàm nhận một đối số.

```kotlin
fun  ((T1, T2) -> R).curried() = 
    fun(p1: T1) = fun(p2: T2) = this(p1, p2)
```


Trong ví dụ này, chúng tôi đã tạo một hàm cà ri. Hàm `curried()` nhận một hàm có hai tham số và trả về một hàm nhận một tham số và trả về một hàm khác cũng nhận một tham số. Thay vì lấy tất cả các đối số cùng một lúc, hàm lấy đối số đầu tiên và trả về một hàm mới nhận đối số thứ hai.

## Nộp đơn

Để hiểu cách áp dụng Currying, hãy xem xét một hàm tính tổng giá của các mặt hàng với mức chiết khấu nhất định. Hàm này nhận hai đối số: giá gốc và tỷ lệ chiết khấu.

```kotlin
fun calculateTotalPrice(price: Double, discount: Double): Double {
    return price - (price * discount / 100)
}
```
Chúng ta có thể sử dụng kỹ thuật Currying để biến hàm này thành một chuỗi hàm, mỗi hàm lấy một đối số.

```kotlin
fun calculateTotalPrice(price: Double): (Double) -> Double {
    return { discount -> price - (price * discount / 100) }
}
```

Bây giờ, chúng ta có thể tạo một hàm mới cho một tỷ lệ chiết khấu cụ thể. Hàm mới này lấy giá gốc làm đối số và trả về giá đã chiết khấu.

```kotlin
val calculateWith30PercentOff = calculateTotalPrice(100.0)
println(calculateWith30PercentOff(30.0))  // Output: 70.0
```

## Cà ri đang hoạt động

Bây giờ chúng ta hãy xem một ví dụ phức tạp hơn để hiểu cách sử dụng cà ri trong các ứng dụng thực tế. Giả sử chúng ta đang làm việc trên phần mềm cho dịch vụ giao hàng và chúng ta có một hàm tính toán chi phí giao hàng dựa trên trọng lượng của gói hàng, khoảng cách đến điểm đến và hình thức giao hàng (tiêu chuẩn hoặc chuyển phát nhanh).

```kotlin
fun calculateDeliveryCost(weight: Double, distance: Double, type: String): Double {
    val baseCost = if (type == "standard") 5.0 else 10.0
    val weightCost = weight * 0.5
    val distanceCost = distance * 0.3
    return baseCost + weightCost + distanceCost
}
```

Chức năng này hoạt động tốt nhưng có thể được cải thiện bằng cách sử dụng cà ri. Chúng tôi có thể sử dụng chức năng này để có thể tạo các chức năng mới cho các loại `weights`, `distances` và `delivery` cụ thể.

```kotlin
fun calculateDeliveryCost(weight: Double): (Double) -> (String) -> Double {
    return { distance -> { type -> 
        val baseCost = if (type == "standard") 5.0 else 10.0
        val weightCost = weight * 0.5
        val distanceCost = distance * 0.3
        baseCost + weightCost + distanceCost
    }}
}
```

Bây giờ, chúng ta có thể tạo các hàm mới cho trọng lượng và khoảng cách cụ thể

```kotlin
val calculateFor10KgAnd50Km = calculateDeliveryCost(10.0)(50.0)
println(calculateFor10KgAnd50Km("standard")) // Output: 35.0
println(calculateFor10KgAnd50Km("express"))  // Output: 40.0
```

## Lặn sâu

Currying cung cấp một số lợi thế có thể nâng cao đáng kể mã Kotlin của bạn:

- **Khả năng sử dụng lại mã**: Currying cho phép bạn tạo các hàm mới từ các hàm hiện có với một số đối số được điền sẵn. Điều này có thể giúp tăng khả năng sử dụng lại mã. Bạn có thể tạo bao nhiêu hàm cụ thể tùy thích từ một hàm chung, mỗi hàm được điều chỉnh cho phù hợp với trường hợp sử dụng cụ thể.

- **Tính toán bị trì hoãn**: Currying cho phép bạn trì hoãn việc tính toán. Bạn có thể tạo một hàm với một số đối số và thực hiện hàm đó sau với các đối số còn lại. Điều này đặc biệt hữu ích trong các tình huống mà việc tính toán tốn kém và bạn muốn trải rộng chúng theo thời gian.

- **Các hàm bậc cao hơn**: Currying cho phép bạn tạo các hàm bậc cao hơn. Nó cho phép bạn truyền các hàm dưới dạng tham số và trả về chúng dưới dạng kết quả. Các hàm bậc cao hơn là nền tảng của lập trình hàm và Currying cung cấp một cách đơn giản để tạo ra chúng.

- **Chức năng Composition**: Cà ri có thể hỗ trợ chức năng composition. Trong kỹ thuật này, bạn kết hợp các hàm đơn giản để xây dựng các hàm phức tạp hơn. Với Currying, bạn có thể dễ dàng soạn thảo các hàm giúp nâng cao khả năng đọc và bảo trì.