#ArrayDeque

chúng ta sẽ học cách làm việc với các collection như Ngăn xếp và Hàng đợi với sự trợ giúp của `ArrayDeque`.

> [!NOTE]
> Trong JVM, lớp Stack mô hình hóa và triển khai Stack data structure bằng chiến lược LIFO
> Đây là Lớp Java; nó không thuộc về collection Kotlin thuần túy, vì vậy bạn phải nhập nó để có thể sử dụng nó (nhập java.
> util.stack).  Nếu bạn muốn một giải pháp thay thế, collection dựa trên Kotlin, bạn có thể sử dụng ArrayDeque.

nếu bạn cần hành vi FIFO và LIFO, dù là cả hai hay chỉ một trong số chúng, thì tốt hơn nên sử dụng `ArrayDeque` vì nó hiệu quả hơn nhiều so với Java `Stack` hoặc `List` và nó thuần túy 100% Kotlin collection. Java Stack kế thừa từ lớp `Vector`. `Vector` triển khai một loạt đối tượng có thể phát triển; nó rất giống với `ArrayList`, nhưng `Vector` **được đồng bộ hóa**, có nghĩa là trong môi trường multithreading, nó giữ các thread khác ở trạng thái có thể chạy hoặc không thể chạy cho đến khi thread hiện tại giải phóng khóa của đối tượng để thực hiện một thao tác. Mặt khác, lớp `Vector` và một số phương thức của nó hiện đã lỗi thời và đã được thay thế bằng `ArrayDeque`, phù hợp hơn với các chiến lược FIFO/LIFO và **được tối ưu hóa hơn cho môi trường đồng thời và đa luồng**.

## Xếp chồng và xếp hàng

`ArrayDeque` là collection triển khai cả nguyên tắc `Queue` (Vào trước ra trước) và `Deque` (hàng đợi hai đầu, Vào trước ra trước, Vào sau cùng ra trước); Nó cho phép bạn thêm và xóa các phần tử ở cả hai bên hoặc hai đầu của collection.

Nó cũng triển khai interface `MutableList` và hỗ trợ các hoạt động lấy/đặt hiệu quả theo chỉ mục. Vì vậy, với nó, bạn cũng có thể sử dụng tất cả các phương pháp `MutableList` quen thuộc.

Bây giờ, tại sao chúng ta cần `ArrayDeque` nếu chúng ta có thể thực hiện các tác vụ tương tự bằng `MutableList`? Bạn nên sử dụng `ArrayDeque` **bất cứ khi nào bạn cần chức năng của “hàng đợi hai đầu”, hàng đợi hoặc ngăn xếp**: các phương thức của nó đã được điều chỉnh về mặt ngữ nghĩa để tuân thủ về mặt chức năng với các tác vụ đó.


```kotlin
fun main() {
    val deque = ArrayDeque<Int>()

    // as a queue, FIFO on both sides
    deque.addLast(1)
    deque.addLast(2)
    deque.addLast(3)
    println(deque) // [1, 2, 3]
    deque.removeFirst()
    deque.removeFirst()
    println(deque) // [3]

    // as a stack, LIFO on one side, i.e., the end
    deque.addLast(1)
    deque.addLast(2)
    println(deque) // [3, 1, 2]
    deque.removeLast()
    deque.removeLast()
    println(deque) // [3]
    // or LIFO on the other side, i.e., the start
    deque.addFirst(1)
    deque.addFirst(2)
    println(deque) // [2, 1, 3]
    deque.removeFirst()
    deque.removeFirst()
    println(deque) // [3]

}
```

## thêm phần tử

Hãy tưởng tượng rằng bạn muốn thêm các phần tử vào collection. Bạn có thể làm điều đó ở đầu hoặc cuối. Hãy nhớ rằng, nếu bạn muốn có hàng đợi, bạn phải thêm các phần tử vào cuối; nếu bạn muốn có một ngăn xếp, bạn có thể thêm chúng vào đầu. Dưới đây là một số phương pháp để thực hiện các tác vụ này:

- `add()`: thêm phần tử được chỉ định vào cuối danh sách và trả về true. Bạn có thể chuyển chỉ mục dưới dạng tham số để thêm phần tử vào một vị trí nhất định.

- `addAll()`: thêm tất cả các phần tử (collection) vào cuối hoặc, nếu bạn chuyển một chỉ mục, tại vị trí chỉ mục này. Nó trả về true vì danh sách luôn được sửa đổi do thao tác này.

- `addFirst()`: thêm phần tử được chỉ định vào collection. Nó có nghĩa là thêm nó vào đầu. Nó trả về Đơn vị.

- `addLast()`: nối phần tử được chỉ định vào deque. Nó có nghĩa là thêm nó vào cuối. Nó trả về Đơn vị.

## Xóa phần tử

Bước tiếp theo là xóa các thành phần của collection: bạn có thể process mục đầu tiên – hoặc làm sạch mục trên cùng. Dưới đây là một số phương pháp để thực hiện các tác vụ này:

- `remove()`: xóa một phiên bản duy nhất của phần tử được chỉ định khỏi collection nếu nó hiện diện. Nó sẽ trả về true nếu phần tử đã được xóa thành công và trả về false nếu nó không có trong collection.

- `removeAll()`: loại bỏ tất cả các phần tử collection cũng có trong collection được chỉ định. Nó sẽ trả về true nếu bất kỳ phần tử nào được chỉ định đã bị xóa khỏi collection và trả về false nếu collection không được sửa đổi.

- `removeAt()`: loại bỏ phần tử tại chỉ mục đã chỉ định khỏi danh sách. Nó sẽ trả về phần tử đã bị xóa hoặc ném `IndexOutOfBoundsException` nếu chỉ mục từ phần tử nằm ngoài giới hạn.

- `removeFirst()`: loại bỏ phần tử đầu tiên khỏi deque và trả về phần tử bị loại bỏ đó hoặc ném `NoSuchElementException` nếu deque trống.

- `removeFirstOrNull()`: loại bỏ phần tử đầu tiên khỏi deque và trả về phần tử bị loại bỏ đó hoặc trả về null nếu deque trống.

- `removeLast()`: loại bỏ phần tử cuối cùng khỏi deque và trả về phần tử bị loại bỏ đó hoặc ném `NoSuchElementException` nếu deque trống.

- `removeLastOrNull()`: loại bỏ phần tử cuối cùng khỏi deque và trả về phần tử bị loại bỏ đó hoặc trả về null nếu deque trống.

## Lấy các phần tử

Hãy tưởng tượng rằng bạn muốn biết ai đang xếp hàng ở siêu thị hoặc chiếc đĩa bẩn đầu tiên hay cuối cùng trong đống đó là gì mà không cần xử lý. Bạn có thể nhận được các phần tử của collection bằng:

- `get()`: trả về phần tử tại chỉ mục được chỉ định trong danh sách (và bạn cũng có thể sử dụng []) hoặc ném `IndexOutOfBoundsException` nếu chỉ mục từ phần tử nằm ngoài giới hạn.

- `first()`: trả về phần tử đầu tiên hoặc ném `NoSuchElementException` nếu deque trống.

- `firstOrNull()`: trả về phần tử đầu tiên hoặc `null` nếu deque trống.

- `last()`: trả về phần tử cuối cùng hoặc ném `NoSuchElementException` nếu deque trống.

- `lastOrNull()`: trả về phần tử cuối cùng hoặc `null` nếu deque trống.


## ArrayDeque vs MutableList, bạn nên chọn cái nào?

`ArrayDeque` và `MutableList` có các đặc tính hiệu suất khác nhau cho các hoạt động khác nhau

### 1. **Thêm/bớt phần tử ở đầu**:

- **ArrayDeque**: Việc thêm hoặc xóa một phần tử khỏi đầu hàng đợi thường xảy ra trong thời gian không đổi `O(1)`. Điều này là do cấu trúc hai chiều của `ArrayDeque`.

- **MutableList**: Việc thêm hoặc xóa một phần tử khỏi đầu danh sách yêu cầu phải dịch chuyển tất cả các phần tử tiếp theo, làm cho các thao tác này tỷ lệ thuận với kích thước của danh sách — `O(n)`.
### 2. **Thêm/bớt phần tử ở cuối**:
- **ArrayDeque**: Giống như lúc đầu, việc thêm hoặc bớt một phần tử ở cuối hàng đợi thường diễn ra theo thời gian không đổi `O(1)`.
- **MutableList**: Việc thêm một phần tử vào cuối danh sách thường diễn ra trong thời gian không đổi `O(1)`, ngoại trừ khi cần thay đổi kích thước mảng. Việc xóa khỏi cuối danh sách cũng xảy ra trong `O(1)`.
### 3. **Truy cập các phần tử**:
- **ArrayDeque**: Việc truy cập một phần tử tùy ý theo chỉ mục có thể mất nhiều thời gian hơn trong `MutableList` vì biểu diễn bên trong của `ArrayDeque` là một bộ đệm tròn.

- **MutableList**: Truy cập vào các phần tử theo chỉ mục xảy ra trong thời gian không đổi `O(1)`.

> [!TIP]
> Trong thực tế, việc lựa chọn giữa ArrayDeque và MutableList phụ thuộc vào thao tác nào thường xuyên và quan trọng nhất đối với ứng dụng của bạn.