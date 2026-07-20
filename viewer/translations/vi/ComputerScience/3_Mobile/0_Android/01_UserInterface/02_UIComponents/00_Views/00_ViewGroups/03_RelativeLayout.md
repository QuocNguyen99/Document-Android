#RelativeLayout

`RelativeLayout` chứa các chế độ xem con ở các vị trí tương đối, nghĩa là mỗi phần tử có thể được định vị tương đối với một phần tử khác hoặc liên quan đến chính bố cục (trên, dưới, trái, phải, giữa).

Theo mặc định, mỗi thành phần được căn chỉnh theo chiều ngang ở bên trái và theo chiều dọc ở đầu bố cục của bạn. Nếu bạn không thay đổi các thuộc tính này, mỗi phần tử sẽ được đặt lên trên phần tử trước đó. 

- `android:layout_above` đặt cạnh dưới của phần tử lên trên phần tử đã chọn.
- `android:layout_below` đặt cạnh trên của phần tử bên dưới phần tử đã chọn.
- `android:layout_toStartOf` đặt cạnh cuối của phần tử này vào đầu phần tử đã chọn.
- `android:layout_toEndOf` đặt cạnh đầu của phần tử này vào cuối phần tử đã chọn.
- `android:layout_toLeftOf` đặt cạnh phải của phần tử vào cạnh trái của phần tử đã chọn.
- `android:layout_toRightOf` đặt cạnh trái của phần tử vào cạnh phải của phần tử đã chọn.
