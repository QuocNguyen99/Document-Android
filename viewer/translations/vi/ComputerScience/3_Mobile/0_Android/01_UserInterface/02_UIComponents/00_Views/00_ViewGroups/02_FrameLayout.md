#FrameLayout


Tất cả các phần tử con của FrameLayout thường được đặt ở góc trên cùng bên trái của màn hình.

Mọi thành phần của bố cục này sẽ được vẽ lên trên bố cục trước đó, vì vậy tốt hơn nên sử dụng bố cục này để giữ một `View` với các thuộc tính `height` và `width` được đặt thành `"match_parent"` vì nếu không, có thể khó kiểm soát chúng trên các kích thước màn hình khác nhau.

Cách duy nhất để kiểm soát việc định vị trẻ em là sử dụng các thuộc tính bố cục_trọng lực và bố cục_lề.