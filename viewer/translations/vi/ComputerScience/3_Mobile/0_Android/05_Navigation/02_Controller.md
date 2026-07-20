# Bộ điều khiển Jetpack Navigation

Bộ điều khiển điều hướng là một trong những khái niệm chính trong điều hướng.**Nó chứa navigation graph và hiển thị các phương thức cho phép ứng dụng của bạn di chuyển giữa các đích đến trong graph.**

Khi sử dụng thành phần Navigation, bạn tạo bộ điều khiển điều hướng bằng lớp `NavController`. `NavController` là điều hướng trung tâm API. Nó theo dõi những điểm đến mà người dùng đã truy cập và cho phép người dùng di chuyển giữa các điểm đến.

> [!NOTE]
> Mỗi `NavHost` bạn tạo có `NavController` tương ứng riêng. `NavController` cung cấp quyền truy cập vào graph của NavHost.

## Tạo bộ điều khiển Jetpack Navigation

### Compose

Để tạo `NavController` khi sử dụng Jetpack Compose, hãy gọi `rememberNavController()`:

```kotlin
val navController = rememberNavController()
```

Bạn nên tạo `NavController` ở mức cao trong hệ thống phân cấp tổng hợp của mình. 
Nó cần phải đủ cao để tất cả các thành phần kết hợp cần tham chiếu đến nó đều có thể làm như vậy.

Làm như vậy cho phép bạn sử dụng `NavController` làm single source of truth để cập nhật các thành phần kết hợp bên ngoài màn hình của bạn. Điều này tuân theo các nguyên tắc của **state hoisting**.

### Lượt xem UI framework
Nếu bạn đang sử dụng Chế độ xem UI framework, bạn có thể truy xuất `NavController` của mình bằng một trong các phương pháp sau tùy thuộc vào ngữ cảnh:

**Kotlin**:

- `Fragment.findNavController()`
- `View.findNavController()`
- `Activity.findNavController(viewId: Int)`

**Java**:

- `NavHostFragment.findNavController(Fragment)`
- `Navigation.findNavController(Activity, @IdRes int viewId)`
- `Navigation.findNavController(View)`


Thông thường, **trước tiên bạn nhận được NavHostFragment, sau đó truy xuất NavController từ mảnh**. Đoạn mã sau đây chứng minh điều này:

```kotlin
val navHostFragment =
    supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
val navController = navHostFragment.navController
```


> [!CAUTION]
> Bạn có thể gặp sự cố khi tạo `NavHostFragment` bằng `FragmentContainerView` hoặc bằng cách thêm thủ công nó vào hoạt động của mình bằng `FragmentTransaction`. 
> Nếu bạn cố lấy `NavController` trong `onCreate()` bằng `Navigation.findNavController(Activity, @IdRes int)`, có thể không thành công. 
> Thay vào đó, bạn nên lấy `NavController` trực tiếp từ chính `NavHostFragment`, như trong ví dụ trước. 
> Điều này xảy ra vì lifecycle của phân đoạn có thể không được khởi tạo hoàn toàn khi `onCreate()` được gọi, khiến quá trình tra cứu `NavController` không thành công.