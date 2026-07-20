#Recursion

Recursion trong lập trình là khi một hàm gọi chính nó.

## Thiết kế một chức năng

Mỗi hàm đệ quy bao gồm các bước sau:

- **Vỏ cơ bản tầm thường** dừng recursion. Đây là trường hợp chúng tôi biết kết quả. Ví dụ: nếu chúng tôi tìm thấy một con búp bê mà chúng tôi không thể mở được, chúng tôi sẽ lấy nó và tự hào nói: "đó là con búp bê nhỏ nhất của chúng tôi!"

- Một **bước rút gọn** (một hoặc nhiều, hãy tưởng tượng rằng con búp bê của chúng ta chứa hai con búp bê bên trong nó!) đưa chúng ta từ bài toán hiện tại sang một bài toán đơn giản hơn. Ví dụ, nếu con búp bê của chúng ta có thể mở được, chúng ta sẽ mở nó ra và xem bên trong có gì.

## Các loại recursion

1. **recursion trực tiếp**

Đó là trường hợp một hàm chỉ gọi chính nó một lần. Giai thừa đệ quy của chúng tôi là một ví dụ điển hình:

```kotlin
fun factorialRecursive(n: Int): Int = if (n == 0 || n == 1) 1 else n * factorialRecursive(n - 1)
```

2. **recursion gián tiếp**

Đây là trường hợp khi một hàm sử dụng một số hàm khác, hàm này sẽ gọi hàm cũ. Không cần thiết phải làm như vậy, nhưng một phiên bản sửa đổi của hàm giai thừa có thể là một ví dụ:


```kotlin
fun weirdFactorialRecursive(n: Int): Int = if (n == 0 || n == 1) 1 else factorialCompute(n)

fun factorialCompute(n: Int): Int = n * weirdFactorialRecursive(n - 1)
```

3. **Đuôi recursion**

Một hàm sử dụng đuôi recursion nếu lệnh gọi đệ quy là điều cuối cùng mà hàm thực hiện.

```kotlin
fun tailFactorialRecursive(n: Int, cur: Int = 1): Int {
    if (n == 0) return cur
    return tailFactorialRecursive(n - 1, cur * n)
}
```
> [!NOTE]
> Tại sao đuôi recursion lại nổi bật như một loại riêng biệt? Bởi vì các trình biên dịch hiện đại có thể làm việc với nó hiệu quả hơn. Để tính toán một lệnh gọi khác của hàm recursion, compiler thường đẩy khung ngăn xếp lên ngăn xếp các thao tác sẽ được thực hiện, do đó, tạo ra một tập hợp các biến cục bộ mới, gây tốn thời gian và không gian. Trong trường hợp đuôi recursion, compiler chỉ có thể quay lại phần đầu của hàm để tiếp tục làm việc với các biến tương tự mà nó đã có trong khung ngăn xếp hiện tại.

4. **Nhiều recursion**

Đây là trường hợp khi một hàm thực hiện nhiều lệnh gọi đến chính nó.

```kotlin
fun fibonacci(n: Int): Int {
    if (n <= 0) return 0
    if (n == 1) return 1
    return fibonacci(n - 1) + fibonacci(n - 2)
}
```

> [!CAUTION]
> Tuy nhiên, giải pháp này cực kỳ kém hiệu quả, vì recursion phân nhánh mỗi khi chúng ta cần một số khác; do đó, số lượng cuộc gọi và tính toán tăng theo cấp số nhân.

### Tối ưu hóa

- phương pháp tối ưu hóa có thể bao gồm việc thay thế recursion bằng một vòng lặp, có thể được sử dụng

- Ngoài việc biến recursion thành một vòng lặp, còn có một phương pháp khác để tối ưu hóa nó, đó là **memoization**. Ví dụ: gọi `f(6)` sẽ gọi `f(5)` và `f(4)`, và đến lượt `f(5)` cũng sẽ gọi `f(4)`. Phiên bản cơ bản sẽ tính toán `f(4)` hai lần và điều đó càng trở nên tồi tệ hơn đối với những số được sử dụng thường xuyên hơn. Hãy lưu nó vào một mảng sau khi chúng ta tính toán nó và làm cho tất cả các nhánh recursion khác trước tiên kiểm tra xem giá trị đã được tính toán chưa. Nếu không, họ sẽ làm, nhưng nếu giá trị đã có sẵn thì có thể sử dụng ngay.

```kotlin
val fibList = MutableList(1000){0}

fun coolerFibonacci(n: Int): Int {
    if (n <= 0) return 0
    if (n == 1) return 1
    return if (fibList[n] != 0) fibList[n]
    else {
        fibList[n] = coolerFibonacci(n - 1) + coolerFibonacci(n - 2)
        fibList[n]
    }
}
```

##Ưu điểm và nhược điểm

Nó phụ thuộc vào programming language. Theo quy định, trong Python và Java, các vòng lặp hiệu quả hơn về mặt **thời gian** và **bộ nhớ**. **Recursion chậm hơn và "nặng hơn" vì mỗi lệnh gọi hàm sẽ chiếm thêm bộ nhớ và các hàm đệ quy thường được gọi nhiều lần.**

Trong trường hợp đó, tại sao lại là recursion? Chà, nó có một lợi thế nhất định so với các vòng lặp: trong một số trường hợp, nó mang tính trực quan. Nếu bạn chắc chắn rằng một hàm nào đó sử dụng chính nó, thì việc viết 3-4 dòng mã đệ quy sẽ nhanh hơn nhiều so với việc nghĩ chính xác một vòng lặp sẽ hoạt động như thế nào. Nếu bạn thiếu thời gian nhưng không phải lo lắng về việc tiêu tốn bộ nhớ thì recursion là sự lựa chọn dành cho bạn.

Vì vậy, recursion thường chậm hơn và kém hiệu quả về bộ nhớ hơn nhưng nó giúp tiết kiệm thời gian của nhà phát triển.
