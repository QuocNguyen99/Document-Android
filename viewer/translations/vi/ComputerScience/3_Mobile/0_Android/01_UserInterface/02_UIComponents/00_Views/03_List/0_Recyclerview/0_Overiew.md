#RecyclerView

**RecyclerView** là một thành phần để tạo danh sách có thể cuộn. Nó được sử dụng trong hầu hết mọi ứng dụng Android hiện đại và được giới thiệu là ứng dụng thay thế cho **ListView**, vốn có rất nhiều sai sót.

## Giới thiệu về RecyclerView

RecyclerView được giới thiệu cùng với Android 5.0. Nó có sẵn trong Thư viện hỗ trợ và cũng có thể được sử dụng với các phiên bản Android cũ hơn.

Ý tưởng chính của RecyclerView là tạo danh sách động. Nó linh hoạt, giàu tính năng và hiệu quả trong việc sử dụng tài nguyên. Nó chứa từ "Recycler" trong tên của nó vì một lý do: khi View được cuộn ra khỏi màn hình, nó sẽ biến mất nhưng không bị phá hủy. Thay vào đó, nó sẽ được tái sử dụng bởi những vật phẩm mới sắp được trình chiếu trên màn hình. Về mặt kỹ thuật, ListView cũng có thể làm được điều này. Nhưng nó cần sự trợ giúp của **Adapter** với **ViewHolder** và điều này đòi hỏi rất nhiều mã boilerplate. Hiệu suất của RecyclerView tốt hơn nhiều, vì vậy thật tuyệt vời khi làm việc với các tập dữ liệu lớn. Tất cả những gì bạn phải làm là xác định hình thức của các mục và cung cấp dữ liệu cần thiết.

RecyclerView có thể lưu trữ Chế độ xem theo nhiều cách khác nhau: theo chiều dọc, chiều ngang hoặc trong lưới. **LayoutManager** được sử dụng để sắp xếp chúng. Và thư viện RecyclerView cung cấp sẵn ba LayoutManagers: `LinearLayoutManager`, `GridLayoutManager` và `StaggeredGridLayoutManager`. Bạn cũng có thể tạo LayoutManager của riêng mình hoặc sử dụng mã của bên thứ ba.

Như đã giải thích, RecyclerView được sử dụng để hiển thị dữ liệu. Hình thức của từng mục có thể được xác định trong các tệp XML có liên quan. Và `RecyclerView.Adapter` được sử dụng để tạo View cho mỗi mục và điền dữ liệu của bạn vào đó. Có thể bạn đã quen thuộc với Bộ điều hợp: chúng cũng được sử dụng với `Spinner`, `GridView`, `ListView`, v.v.

## phương thức bộ chuyển đổi Recyclerview

- `onCreateViewHolder()` tạo ra ViewHolders đúng như tên gọi của nó. ViewHolders là cần thiết cho tất cả các mục sẽ được hiển thị trong RecyclerView. Chúng được tạo ra với số lượng mục có thể vừa với màn hình bất kỳ lúc nào và sẽ được sử dụng lại.
- `onBindViewHolder()` được sử dụng để liên kết dữ liệu từ vật phẩm với View. Nó được gọi nhiều lần với cùng một bộ chủ sở hữu để cho phép sử dụng lại.
- `getItemCount()` cho phép RecyclerView xác định tổng số mục trong danh sách.

Bạn có thể thắc mắc "`LayoutInflater` là gì và điều gì đang thực sự xảy ra ở đây?" `LayoutInflater` là một lớp có thể biến bố cục thành các đối tượng View, đây chính xác là những gì chúng ta cần. Phương thức chịu trách nhiệm cho việc này là `inflate()`. Và chúng tôi chuyển cho nó ba đối số: ID của tài nguyên bố cục mà chúng tôi yêu cầu, gốc **ViewGroup** để sử dụng và `false`, chỉ định rằng không nên tạo tệp đính kèm cho bố cục gốc. Sau đó, chúng tôi có thể nhận được đối tượng View.
## thẩm quyền giải quyết:

- [Recyclerview](https://hyperskill.org/learn/step/18600)