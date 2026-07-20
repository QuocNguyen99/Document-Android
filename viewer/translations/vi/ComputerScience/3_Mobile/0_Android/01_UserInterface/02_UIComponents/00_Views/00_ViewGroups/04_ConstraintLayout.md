# Bố cục ràng buộc

`ConstraintLayout` tương tự như `RelativeLayout`: 

- Nó sắp xếp các view dựa trên sự kết nối giữa các view anh em với view cha mẹ, giúp nó thân thiện hơn với người dùng.
- `ConstraintLayout` tương thích ngược lên đến API cấp 9.

- `Constraints` đóng vai trò là liên kết hoặc căn chỉnh tới chế độ xem khác hoặc bố cục gốc.
Chúng chỉ định vị trí của chế độ xem dọc theo trục ngang hoặc trục dọc và mỗi chế độ xem phải có ít nhất một ràng buộc cho mỗi trục.

- `ConstraintLayout` cho phép bạn tạo bố cục phức tạp và linh hoạt mà không cần bố cục lồng nhau.
Điều này làm giảm sự phức tạp của hệ thống phân cấp bố cục của bạn, giúp quản lý các tệp bố cục XML của bạn dễ dàng hơn.
Bằng cách giảm nhu cầu về bố cục lồng nhau, ConstraintLayout cũng có thể cải thiện hiệu suất ứng dụng của bạn.


## So sánh giữa Bố cục ràng buộc và Bố cục tương đối

Cả hai trình quản lý bố cục này đều có điểm mạnh và điểm yếu riêng.
Hiểu được những khác biệt này có thể giúp bạn đưa ra quyết định sáng suốt về việc nên sử dụng cái nào trong ứng dụng Android của mình.

Đây là những điều bạn nên ghi nhớ:

- **Định vị**: `RelativeLayout` định vị các chế độ xem dựa trên mối quan hệ của chúng với các chế độ xem phụ và bố cục gốc. Ngược lại, `ConstraintLayout` sử dụng hệ thống định vị dựa trên ràng buộc, trong đó các mối quan hệ được xác định thông qua các ràng buộc.

- **Độ phức tạp**: `RelativeLayout` đơn giản hơn và rất phù hợp với các bố cục cơ bản. Mặt khác, `ConstraintLayout` rất linh hoạt và được trang bị tốt hơn để xử lý các bố cục phức tạp mà không cần bố cục lồng nhau.

- **Lồng nhau**: với `RelativeLayout`, bạn thường cần lồng nhiều bố cục vào nhau để đạt được các thiết kế phức tạp hơn. **Điều này có thể dẫn đến các vấn đề về hiệu suất**. Tuy nhiên, `ConstraintLayout` khuyến khích hệ thống phân cấp phẳng, **cải thiện hiệu suất và hiệu suất.**

- **Tính linh hoạt**: `RelativeLayout` có độ linh hoạt hạn chế khi có bố cục phức tạp. ConstraintLayout linh hoạt hơn, cung cấp các tính năng nâng cao như chuỗi, hướng dẫn, rào cản, v.v., có thể được sử dụng để tạo bố cục phức tạp và linh hoạt.

- **Hiệu suất**: hiệu suất của `RelativeLayout` có thể giảm sút với các bố cục lồng nhau. Ngược lại, hệ thống phân cấp phẳng được `ConstraintLayout` khuyến khích sẽ cải thiện hiệu suất vì hệ thống chỉ cần thực hiện một phép đo duy nhất và vượt qua bố cục.

- **Responsive design**: `RelativeLayout` ít phù hợp hơn để tạo bố cục đáp ứng thích ứng với các kích thước và hướng màn hình khác nhau. `ConstraintLayout` rất phù hợp cho mục đích này: nó cho phép mức độ kiểm soát cao đối với kích thước và vị trí của các khung nhìn.


































