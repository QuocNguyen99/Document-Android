# hợp đồng

Đôi khi, khi viết mã, mọi thứ có vẻ đúng nhưng compiler vẫn đưa ra cảnh báo. 
Ví dụ: nó có thể không xác định được (với tất cả khả năng phân tích mạnh mẽ của mình) rằng một biến không thể là `null` và đề xuất sử dụng toán tử `?`. 

Bạn có nên lắng nghe và tuân theo ngay cả khi biết compiler sai? Hoặc có cách nào để đưa compiler vào cùng trang với bạn để cuối cùng mọi người đều hài lòng không?

## Hiểu hợp đồng

Hợp đồng là các thỏa thuận giữa các phần khác nhau của mã cho phép một hàm mô tả rõ ràng hành vi của nó theo cách mà compiler hiểu được. 

Thông tin này có thể giúp compiler đưa ra quyết định thông minh, chẳng hạn như khi nào **cho phép phát sóng thông minh** hoặc **xác định khởi tạo biến**.

Hãy xem xét ví dụ sau:

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // Compiler automatically casts 's' to 'String'
}
```

Ở đây, compiler chuyển đổi thông minh thành một Chuỗi bên trong câu lệnh if.

Tuy nhiên, nếu chúng tôi trích xuất kiểm tra null thành một hàm riêng biệt, compiler sẽ mất bối cảnh này:


```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // No smartcast :(
}
```

Đây là nơi các hợp đồng phát huy tác dụng. 
Bằng cách thêm hợp đồng vào hàm `isNotNull`, chúng tôi có thể thông báo cho compiler rằng khi `isNotNull` trả về `true`, receiver của hàm (như s) không phải là `null`.


```kotlin
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.contract

@OptIn(ExperimentalContracts::class)
fun String?.isNotNull(): Boolean {
    contract {
        returns(true) implies (this@isNotNull != null)
    }
    return this != null
}

fun foo(s: String?) {
    if (s.isNotNull()) s.length // Smartcast :)
}
```

Bây giờ, compiler sẽ biết từ hợp đồng rằng `s` chắc chắn không phải là loại `String?` (dựa trên lời của chúng tôi), 
vì vậy, nó sẽ truyền thông minh tới `String` bên trong câu lệnh `if`, mặc dù việc kiểm tra null nằm trong một hàm riêng biệt.

## Cú pháp của hợp đồng

Mẫu hợp đồng tiêu chuẩn như sau:

```kotlin
function {
    contract {
        Effect
    }
}
```

Điều này có thể được hiểu là "việc gọi hàm dẫn đến Hiệu ứng được chỉ định".


Tính đến thời điểm hiện tại, có hai loại hợp đồng chính: `returns–implies` và `callsInPlace`.

### "trả lại"–"ngụ ý" hợp đồng

Hợp đồng `returns–implies` được sử dụng để chỉ định rằng một hàm sẽ trả về một loại nhất định bằng cách ngụ ý **điều kiện**.

Điều này cho phép compiler giả định rằng sau khi hàm được gọi, phần ngụ ý của hợp đồng sẽ được thỏa mãn, trên thực tế, đây là một biểu thức boolean.
### Hợp đồng "callsInPlace"

Hợp đồng `callsInPlace` được sử dụng để chỉ định rằng tham số hàm lambda được gọi tại chỗ.
Có bốn loại lời gọi có thể: 

- `AT_MOST_ONCE`: lambda được gọi 0 hoặc một lần.
- `AT_LEAST_ONCE`: lambda được gọi ít nhất một lần.
- `EXACTLY_ONCE`: lambda được gọi đúng một lần.
- `UNKNOWN`: chưa rõ số lượng lệnh gọi.

Hợp đồng `callsInPlace` đặc biệt hữu ích khi bạn biết rằng lambda sẽ gán giá trị cho một biến nhưng compiler thì không. 
Bằng cách sử dụng hợp đồng, bạn có thể cho compiler biết rằng lambda sẽ gán giá trị cho biến và compiler sẽ cho phép biên dịch mã.

```kotlin
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.InvocationKind
import kotlin.contracts.contract

@OptIn(ExperimentalContracts::class)
fun myRun(block: () -> Unit) {
    contract {
       callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block()
}

fun main() {
    val x: Int
    myRun {
        x = 10 // The compiler is satisfied :)
    }
    println(x) // 10
}
```

## Hợp đồng trong thư viện chuẩn

Hợp đồng được sử dụng rộng rãi trong thư viện tiêu chuẩn. Dưới đây là một số ví dụ:

- Chức năng mở rộng `isNullOrEmpty`:

```kotlin
public inline fun CharSequence?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }

    return this == null || this.length == 0
}
```
- `run` và các chức năng có phạm vi khác:


```kotlin
public inline fun <R> run(block: () -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block()
}
```

## Những hạn chế và tương lai của hợp đồng

Mặc dù hợp đồng là một tính năng đầy hứa hẹn nhưng chúng hiện có một số hạn chế:
- Chúng chỉ có thể được áp dụng cho các hàm cấp cao nhất trong phần thân.
- Lệnh gọi hợp đồng phải là câu lệnh đầu tiên trong nội dung hàm.
- compiler tin tưởng các hợp đồng vô điều kiện, do đó, lập trình viên có trách nhiệm đảm bảo rằng các hợp đồng họ viết là chính xác và hợp lý.














