# Nguyên tắc cơ bản của OOP

Mỗi đối tượng có thể được đặc trưng bởi một trạng thái và hành vi. Trạng thái hiện tại của đối tượng được thể hiện bằng **thuộc tính** của nó và hành vi của đối tượng được thể hiện bằng **phương thức** của đối tượng đó.

Có bốn nguyên tắc cơ bản của OOP. Chúng là encapsulation, trừu tượng, inheritance và polymorphism.

### 1. Encapsulation

    Encapsulation đề cập đến việc kết hợp dữ liệu với các phương thức hoạt động với nó đồng thời hạn chế quyền truy cập trực tiếp vào một số thành phần.

### 2. Inheritance

    Inheritance là một cơ chế xác định mối quan hệ cha-con giữa các lớp. Thông thường các đối tượng rất giống nhau, vì vậy inheritance cho phép lập trình viên sử dụng lại logic chung, đồng thời đưa các khái niệm độc đáo vào các lớp.

### 3. Polymorphism
**Polymorphism là khả năng của một đối tượng hoặc các phương thức của nó có nhiều dạng tùy thuộc vào loại của nó và các tham số của phương thức này hoặc phương thức kia**. Nó cho phép các lập trình viên xác định các cách triển khai khác nhau cho cùng một phương thức. Do đó, tên (hoặc giao diện) vẫn giữ nguyên nhưng các hành động được thực hiện có thể khác nhau. Ví dụ: hãy tưởng tượng một trang web đăng ba loại văn bản chính: tin tức, thông báo và bài viết. Chúng hơi giống nhau ở chỗ đều có tiêu đề, một số văn bản và ngày tháng. Nói cách khác, chúng khác nhau: các bài báo có tác giả, các bản tin có nguồn và các thông báo có ngày mà sau đó chúng trở nên không liên quan. Thật thuận tiện khi viết một lớp trừu tượng với thông tin chung cho tất cả các ấn phẩm để tránh sao chép nó mỗi lần và lưu trữ những gì khác biệt trong các lớp dẫn xuất thích hợp.

> [!NOTE]
> Không phải tất cả các ngôn ngữ đều hỗ trợ loại polymorphism này. Ví dụ: bạn có thể xác định các phương thức như vậy trong Java, Kotlin hoặc Scala, nhưng không thể định nghĩa bằng Python hoặc JavaScript.

### 4. Tính vật vật (trừu tượng)

Trừu tượng hóa dữ liệu có nghĩa là các đối tượng phải cung cấp một phiên bản trừu tượng, đơn giản hóa việc triển khai của chúng. Thông tin chi tiết về công việc nội bộ của họ thường không cần thiết đối với người dùng nên không cần phải trình bày chúng. Tính trừu tượng cũng có nghĩa là chỉ những đặc điểm phù hợp nhất của đối tượng mới được trình bày.



## Tính chất của giao diện

* Giao diện không cung cấp các công việc kế thừa như Lớp hay Lớp trừu tượng mà nó chỉ khai báo phương thức/sự kiện cho các lớp khác thực hiện nó.

* Nó không được khởi tạo nhưng nó có thể được tham chiếu bởi đối tượng của lớp thực thi nó. ví dụ:
    Người dùng IUserRepository = UserRepository mới();

* Không có giao diện lồng nhau (giao diện lồng nhau)

* Không có hàm tạo, hàm hủy, hằng, tĩnh và biến.

* Một giao diện có thể kế thừa từ một hoặc nhiều giao diện khác.
    giao diện công cộng IList<T> : ICollection<T>, IEnumerable<T>, IEnumerable

* Một giao diện có thể mở rộng một giao diện khác.

* Một lớp có thể triển khai một hoặc nhiều giao diện.

* Mọi phương thức, thuộc tính đều được mặc định là public.

## Tính chất của lớp trừu tượng

* Một lớp trừu tượng không thể khởi tạo được.
* Lớp trừu tượng có thể chứa các đối tượng và công cụ phương thức (phương thức trừu tượng – phương thức ảo).
* Một lớp trừu tượng không thể là Sealed Class. Vì Sealed Class không được phép kế thừa.
* Không thể kế thừa từ một Lớp hay Giao diện.
* Lớp dẫn xuất từ ​​Lớp trừu tượng phải triển khai tất cả các _**phương thức trừu tượng**_ của Lớp trừu tượng trong đó.
* Trong Lớp trừu tượng thì các **_abstract_method_** chỉ được khai báo. Còn nữa **_virtual Method_** thì có thể được xác định.
* Lớp trừu tượng có thể sử dụng các công cụ sửa đổi truy cập như: riêng tư, được bảo vệ, nội bộ. Nhưng các phương thức **_trừu tượng/ảo_** thì không thể sử dụng riêng tư.
* Lớp trừu tượng có thể có hàm tạo, hàm hủy, hằng, trường
* Multi next không được hỗ trợ.

## So sánh giao diện và lớp trừu tượng

|                                    | Giao diện | Lớp trừu tượng |
|:------------------------------------------------ |:-----------------------------------------------------------------------:| ---------------------------------------------:|
| Hàm tạo, trường và hằng số | Không | Có |
| Nhiều inheritance | Một lớp có thể thực hiện nhiều giao diện.(tạm thời coi là thừa kế) | Kế hoạch đa dạng không được hỗ trợ |
| Triển khai mặc định | Không thể xác định quá trình xử lý mã, chỉ có thể khai báo.                   | Có thể định nghĩa phương thức, thuộc tính. |
| Công cụ sửa đổi truy cập | Mọi phương thức, thuộc tính đều được mặc định là public.                       | Có thể xác định công cụ sửa đổi.                     |
| Thêm chức năng | Mọi phương thức, thuộc tính của giao diện cần được thực thi trong lớp. | Không cần thiết.                              |

Khi nào nên sử dụng Giao diện
-----------------

* Cần cung cấp các chức năng chung cho các lớp không liên quan.
* Cần nhóm các đối tượng dựa trên các phổ biến hành vi.
* Cần sử dụng đa hình vì một lớp có thể thực hiện nhiều giao diện.
* Cần tạo các (thành phần) thành phần được tổng hợp lành mạnh, dễ bảo trì và sử dụng như 1 plugin vì công việc triển khai cho giao diện được phân tách đặc biệt với nó.

Khi nào nên sử dụng Lớp trừu tượng
-------------------------------

* Cần sử dụng kế tiếp.
* Cần cung cấp các mặc định của các phương thức cũng như các biến phổ phương thức mà nhiều lớp dẫn đến có thể thực thi và ghi đè.
* Cần tạo nhiều phiên bản cho các thành phần (thành phần). Bạn có thể thêm các thuộc tính và phương thức vào Lớp trừu tượng mà không vi phạm mã hóa và tất cả các lớp kế hoạch đều được tự động cập nhật khi thay đổi.
  
  

# Giao diện

Giao diện là collection của các phương thức mô tả hành vi của một đối tượng. Để triển khai giao diện, một đối tượng phải triển khai tất cả các phương thức từ nó. Hành vi của một đối tượng là cố định và nó không thể thay đổi trong quá trình thực thi chương trình. Đó là sự khác biệt giữa con người và đồ vật.

