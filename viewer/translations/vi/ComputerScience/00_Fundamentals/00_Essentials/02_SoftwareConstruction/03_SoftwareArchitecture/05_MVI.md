Kiến trúc # MVI (Model-View-Intent)

![](/resources/mvi-func2.avif)

MVI (Model-View-Intent) là architectural pattern được sử dụng trong quá trình phát triển Android, nhấn mạnh vào unidirectional data flow và xóa separation of concerns. Nó bao gồm ba thành phần chính:

- **Mô hình**: Thể hiện trạng thái của ứng dụng, bao gồm dữ liệu và logic nghiệp vụ.
Model đảm bảo tính bất biến và quản lý trạng thái của ứng dụng.
- **View**: Chịu trách nhiệm hiển thị UI dựa trên trạng thái hiện tại của `Model`.
`View` cũng thu thập các tương tác của người dùng và chuyển đổi chúng thành `Intents`.
- **Intent**: Thể hiện hành động hoặc sự kiện của người dùng. `Intents` được gửi từ `View` đến `Model` để kích hoạt cập nhật trạng thái hoặc thực hiện các hoạt động khác.



## Thuận lợi

1. **Unidirectional data flow**: Đơn giản hóa việc quản lý trạng thái, giúp quá trình chuyển đổi trạng thái trở nên rõ ràng và có thể dự đoán được.
2. **Separation of concerns**: Tách biệt rõ ràng việc quản lý trạng thái khỏi kết xuất UI, mang lại mã sạch hơn và dễ bảo trì hơn. 
3. **Khả năng mở rộng**: Dễ dàng xử lý các chuyển đổi trạng thái và logic nghiệp vụ phức tạp, giúp nó phù hợp với các ứng dụng lớn.
4. **Khả năng kiểm tra**: Đơn giản hóa việc kiểm tra đơn vị đối với quá trình chuyển đổi trạng thái và logic nghiệp vụ nhờ sự phân tách rõ ràng giữa các thành phần.
5. **Trải nghiệm người dùng nhất quán**: Đảm bảo UI luôn phản ánh trạng thái hiện tại của ứng dụng, mang lại trải nghiệm người dùng mượt mà và có thể dự đoán được.

## Nhược điểm

1. **Độ phức tạp tăng lên**: MVI tạo thêm độ phức tạp cho kiến ​​trúc ứng dụng, đặc biệt là khi áp dụng các khái niệm lập trình phản ứng và unidirectional data flow.
2. **Đường cong học tập dốc**: Các nhà phát triển mới sử dụng MVI hoặc lập trình phản ứng có thể gặp khó khăn để hiểu và triển khai mẫu này.
3. **Mã Boilerplate**: MVI thường yêu cầu viết thêm mã để quản lý unidirectional data flow, xử lý sự kiện và quản lý trạng thái, dẫn đến mã lặp đi lặp lại và khó duy trì.
4. **Các mối lo ngại về hiệu suất**: Tùy thuộc vào quy mô triển khai và ứng dụng, MVI có thể gây ra chi phí hiệu suất do chuyển đổi dữ liệu bổ sung, xử lý sự kiện và cập nhật trạng thái.
5. **Thách thức tích hợp với các thành phần khác**: Khi được sử dụng với bố cục XML, việc tham chiếu ViewModels có thể làm cho kiến ​​trúc kém hiệu quả hơn, dẫn đến sự phụ thuộc giữa View và ViewModel.


## Tài liệu tham khảo

- https://ebdz.dev/blog/mvi-ampamp-mobile-dev
- https://www.scaler.com/topics/android/mvi-architecture-android