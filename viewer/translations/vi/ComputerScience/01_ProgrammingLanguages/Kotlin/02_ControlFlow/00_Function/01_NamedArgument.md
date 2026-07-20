# Đối số được đặt tên

## Cải thiện khả năng đọc mã

Chúng ta có thể khai báo các biến tiêu chuẩn và chuyển chúng đi, nhưng đôi khi bạn phải làm việc với các hằng số chứ không phải các biến. Các đối số được đặt tên có thể làm cho mã của chúng ta dễ đọc hơn.

```kotlin
val amount = calcEndDayAmount(
    startAmount = 1000,
    ticketPrice = 10,
    soldTickets = 500
) 
```
## Sắp xếp lại các đối số

Bạn có thể thay đổi thứ tự của các đối số trong lệnh gọi hàm với sự trợ giúp của các đối số được đặt tên. Tất cả những gì bạn cần làm là chỉ định tên theo bất kỳ thứ tự nào bạn muốn:

```kotlin
val amount = calcEndDayAmount(
    ticketPrice = 10,
    soldTickets = 500,
    startAmount = 1000
)
```
## Đối số được đặt tên và vị trí

Bạn cũng có thể gọi một hàm với các đối số được đặt tên và thông thường (vị trí), miễn là các đối số được đặt tên được đặt sau các đối số vị trí:

```kotlin
calcEndDayAmount(1000, ticketPrice = 10, soldTickets = 500)  // 6000
```

Kotlin 1.4 trở lên cho phép bạn sử dụng các đối số vị trí sau các đối số được đặt tên, nhưng bạn cần duy trì thứ tự của chúng. Ví dụ:

```kotlin
calcEndDayAmount(ticketPrice = 10, 500, 1000)   // Incorrect invocation!
calcEndDayAmount(startAmount = 1000, 10, 500)   // OK


calcEndDayAmount(soldTickets = 500, ticketPrice = 10, startAmount = 500) // OK
calcEndDayAmount(soldTickets = 500, ticketPrice = 10, 500)  // Incorrect invocation!
```

## Đối số được đặt tên và giá trị mặc định

Các giá trị mặc định cho các tham số hàm có thể không đổi hoặc không. Chúng cũng có thể là một đối số hoặc một hàm được đặt tên khác.

```kotlin
fun sum2(a: Int, b: Int = a) = a + b
 
sum2(1)    // 1 + 1
sum2(2, 3) // 2 + 3
```
