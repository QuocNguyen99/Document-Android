# Kết nối HTTP client

## Trang bị thêm Serialization

Retrofit là một thư viện giúp đơn giản hóa giao tiếp HTTP bằng cách biến các API từ xa thành các interface khai báo, an toàn kiểu

Nó cho phép bạn tùy chỉnh các request của mình bằng các chú thích, chuyển đổi response `JSON` thành các đối tượng `Java`,
và xử lý các cuộc gọi không đồng bộ bằng callback hoặc coroutine.

Bạn có thể xác định mô hình trông như thế này:

```kotlin
@Serializable
class Drink(
    val id: Int,
    val image: String,
    val name: String,
    val type: String
)

/*
JSON example
[
  {
    "id": 1,
    "image": "https://raw.githubusercontent.com/hatepoint/hyperskill-networking/main/images/5.jpg",
    "name": "Caffè Americano",
    "type": "americanos"
  },
  {
    "id": 2,
    "image": "https://raw.githubusercontent.com/hatepoint/hyperskill-networking/main/images/2.jpg",
    "name": "Dark Roast Coffee",
    "type": "brewed"
  },
  ...
]
*/ 
```

Mô hình được sử dụng để thể hiện dữ liệu JSON mà bạn sẽ nhận (hoặc gửi) từ API,
Đó là một lớp có các trường sẽ được ánh xạ tương ứng với các thuộc tính JSON mà bạn nhận được dưới dạng câu trả lời từ server.
Chú thích `@Serializable`. Chú thích này đánh dấu lớp có khả năng được tuần tự hóa hoặc giải tuần tự hóa,
cho phép nó được chuyển đổi sang định dạng phù hợp để truyền qua mạng hoặc lưu trữ liên tục và sau đó được xây dựng lại thành đối tượng với dữ liệu gốc.


> [!NOTE]
> Serialization là process chuyển đổi trạng thái của đối tượng thành định dạng có thể được lưu trữ hoặc vận chuyển.
> Điều này đặc biệt hữu ích trong mạng vì nó cho phép gửi các cấu trúc dữ liệu phức tạp qua mạng ở dạng có thể được xây dựng lại chính xác ở phía bên kia

















































