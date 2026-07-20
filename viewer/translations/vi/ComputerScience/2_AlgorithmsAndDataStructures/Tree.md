# Cây
Tree - cây là một dữ liệu cấu trúc có phân cấp, trong đó dữ liệu được tổ chức theo cấp thứ và được liên kết với nhau khi lưu trữ. Có nhiều loại cây đã được phát triển trong nhiều thập kỷ qua, để phù hợp với các ứng dụng khác nhau hoặc giải quyết những chế độ hạn chế nhất. Một số ví dụ có thể kể tới bao gồm: cây tìm kiếm nhị phân, cây B, treap, cây đỏ đen, cây splay

## Cây tìm kiếm nhị phân

Một cây tìm kiếm nhị phân (BST) - cây tìm kiếm nhị phân, như tên của nó, là một kho lưu trữ dữ liệu cấu trúc theo dạng cấu trúc thứ cấp. Cấu trúc dữ liệu này lưu trữ giá trị theo thứ tự sắp xếp. Mỗi nút trong một bao BST bao gồm các thuộc tính sau:

key: value được lưu trữ trong node.
left: con trỏ tới con left.
right: con trỏ tới bên phải.
p: con trỏ tới nút cha. Vui lòng kiểm tra một nút x trong phân tích tìm kiếm cây.

* Nếu y là nút bên trái của x thì y.key <= x.key
* Nếu y là nút bên phải của x thì y.key => x.key

![](../../resources/binary_tree.webp)


### ứng dụng của binary tree
* Cây nhị phân: Sử dụng để cài đặt phân tích cú pháp và biểu thức tính toán.
* Cây tìm kiếm nhị phân: Được sử dụng trong rất nhiều ứng dụng tìm kiếm, nơi mà dữ liệu vào liên tục.
* Heaps: Được sử dụng trong JVM để lưu trữ các đối tượng.
* Treaps: Sử dụng trong mạng không dây.

### Đống

Heap là một trường hợp đặc biệt của phân nhị cây, khi đó nút cha sẽ so sánh giá trị của nó với các nút con của nó để sắp xếp lại cho hợp lý. Hãy xem xét cách biểu diễn heap. Heap can bebiểu diễn bằng cách sử dụng cây hoặc mảng. Hai hình vẽ dưới dây cho cách biểu diễn một lần nghe bằng cách sử dụng cây nhị phân hoặc mảng.

![](../../resources/heaps_tree.webp)

![](../../resources/heaps_array.webp)

Có 2 kiểu heap:

* Min Heap - value của node cha sẽ nhỏ hơn hoặc bằng các con của nó. Nút ở gốc sẽ có giá trị nhỏ nhất trong heap.
* Max Heap - giá trị của nút cha sẽ lớn hơn hoặc bằng các con của nó. Nút ở gốc sẽ có giá trị lớn nhất trong heap.

### Các bước xây dựng Max Heap: 

Bước 1: Tạo một nút mới ở vị trí cuối cùng của Heap.
Bước 2: Gán giá trị mới cho nút này.
Bước 3: So sánh giá trị của nút con với giá trị cha.
Bước 4: If value of cha nhỏ hơn con thì chúng ta sẽ thay đổi.
Bước 5: Lặp lại bước 3 và 4 cho tới khi vẫn duy trì thuộc tính của Heap.

![](../../resources/build_heap.gif)

### Bước xóa nút gốc trong Max Heap:

![](../../resources/remove_root_node_heap.gif)
Bước 1: Xóa nút gốc.
Bước 2: Di chuyển phần tử cuối cùng có cấp thấp nhất lên nút gốc.
Bước 3: So sánh giá trị của nút con này với giá trị của cha.
Bước 4: If value of cha nhỏ hơn con thì chúng ta sẽ thay đổi.
Bước 5: Lặp lại bước 3 và 4 cho tới khi vẫn duy trì thuộc tính của Heap.