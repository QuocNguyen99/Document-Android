# Thiết kế navigation graph của bạn

**navigation graph là data structure chứa từng đích trong ứng dụng của bạn và các kết nối giữa chúng.**

## Loại đích

Có ba loại đích chung: được lưu trữ, hộp thoại và hoạt động. Bảng sau đây phác thảo ba loại đích đến này và mục đích của chúng.

| Loại | Mô tả | Trường hợp sử dụng |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Được lưu trữ | Lấp đầy toàn bộ máy chủ điều hướng. Nghĩa là, kích thước của đích được lưu trữ giống với kích thước của máy chủ điều hướng và các đích đến trước đó không hiển thị. | Màn hình chính và chi tiết.                                                                                   |
| Hộp thoại | Trình bày các thành phần UI lớp phủ. UI này không bị ràng buộc với vị trí của máy chủ điều hướng hoặc kích thước của nó. Các điểm đến trước đó được hiển thị bên dưới điểm đến. | Cảnh báo, lựa chọn, biểu mẫu.                                                                                 |
| Activity| Thể hiện các màn hình hoặc tính năng độc đáo trong ứng dụng. |  Đóng vai trò là điểm thoát tới navigation graph, khởi động một hoạt động Android mới được quản lý riêng biệt với thành phần Navigation. |     

## Framework

Mặc dù quy trình làm việc chung giống nhau được áp dụng trong mọi trường hợp, **cách bạn tạo máy chủ điều hướng và graph chính xác như thế nào phụ thuộc vào UI framework mà bạn sử dụng.**

### Compose

Sử dụng thành phần kết hợp `NavHost`. Thêm `NavGraph` vào nó bằng Kotlin DSL. Bạn có thể tạo graph theo hai cách:
- **Là một phần của `NavHost`**: Trực tiếp xây dựng navigation graph như một phần của việc thêm NavHost.
- **Lập trình**: Sử dụng phương pháp `NavController.createGraph()` để tạo `NavGraph` và chuyển trực tiếp đến `NavHost`.

Trong Compose, sử dụng một đối tượng hoặc lớp có thể tuần tự hóa để xác định tuyến đường. **Tuyến đường mô tả cách đi đến đích và chứa tất cả thông tin mà đích đó yêu cầu**. Sau khi bạn đã xác định tuyến đường của mình, hãy sử dụng thành phần kết hợp NavHost để tạo navigation graph. Hãy xem xét ví dụ sau:

```kotlin
@Serializable
object Profile
@Serializable
object FriendsList

val navController = rememberNavController()

NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // Add more destinations similarly.
}
```

> [!CAUTION]
> Thay vì chuyển một loại tới `composable()`, bạn có thể chuyển một chuỗi tuyến đường hoặc một id số nguyên. 
> Tuy nhiên, điều này khiến việc quản lý việc chuyển các đối số bổ sung tới đích trở nên khó khăn hơn nhiều.


###Fragments:

Khi sử dụng các đoạn có chế độ xem UI framework, hãy sử dụng `NavHostFragment` làm máy chủ. Có một số cách để tạo navigation graph:

- **Lập trình**: Sử dụng Kotlin DSL để tạo `NavGraph` và áp dụng trực tiếp trên `NavHostFragment`.
Hàm `createGraph()` được sử dụng với Kotlin DSL cho cả hai phân đoạn và Compose là như nhau.
- **XML**: Ghi trực tiếp máy chủ điều hướng của bạn và graph vào XML.


## Biểu đồ lồng nhau

Luồng đăng nhập, trình hướng dẫn hoặc các luồng con khác trong ứng dụng của bạn thường được thể hiện tốt nhất dưới dạng biểu đồ điều hướng lồng nhau. Bằng cách lồng các luồng điều hướng con độc lập theo cách này, luồng chính của UI trong ứng dụng của bạn sẽ dễ hiểu và quản lý hơn.
