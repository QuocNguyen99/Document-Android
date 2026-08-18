# Định vị dịch vụ

Bộ định vị dịch vụ đóng vai trò là design pattern để quản lý các dependency dịch vụ trong một ứng dụng.
Chúng hoạt động như một cơ quan đăng ký hoặc vùng chứa tập trung có nhiệm vụ quản lý các dependency này.
Thay vì các thành phần trực tiếp khởi tạo dependency của chúng, chúng lấy chúng từ Bộ định vị dịch vụ.

## Trình định vị dịch vụ triển khai

Để triển khai **Bộ định vị dịch vụ**, bạn tạo một sổ đăng ký trung tâm để quản lý các phiên bản dịch vụ trong ứng dụng của mình.
Sổ đăng ký này đóng vai trò là single source of truth để truy cập các dịch vụ này trong ứng dụng của bạn. Trong ví dụ này, chúng tôi sẽ kiểm soát quyền truy cập vào dịch vụ có tên UserService, dịch vụ quản lý dữ liệu người dùng.

1. Trình định vị dịch vụ triển khai:

```kotlin
interface ServiceRegistry {
    fun <T : Any> registerService(clazz: Class<*>, service: T)
    fun <T : Any> getService(clazz: Class<T>): T
}

object ServiceLocator : ServiceRegistry {
    private val services = mutableMapOf<Class<*>, Any>()

    override fun <T : Any> registerService(clazz: Class<*>, service: T) {
        services[clazz] = service
    }

    override fun <T : Any> getService(clazz: Class<T>): T {
        return services[clazz] as T
    }
}

inline fun <reified T : Any> ServiceRegistry.register(service: T) {
    this.registerService(T::class.java, service)
}

inline fun <reified I : Any> ServiceRegistry.get(): I {
    return this.getService(I::class.java)
}
```

2. Đăng ký dịch vụ:

Đăng ký phiên bản dịch vụ của bạn với Bộ định vị dịch vụ, thường là khi lớp **Ứng dụng** tùy chỉnh của bạn khởi động.

```kotlin
class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // Register PreferenceService
        ServiceLocator.register<UserService>(UserServiceImpl())
    }
}
```

3. Truy xuất và sử dụng dịch vụ:

```kotlin
val userService = ServiceLocator.get<UserService>()
userService.loadUserData()
```

## Bộ định vị dịch vụ (SL) so với Dependency Injection (DI)

1. **Tính rõ ràng của sự phụ thuộc**:

    - **DI**: Các dependency được cung cấp cho lớp, làm cho chúng trở nên rõ ràng.

    ```kotlin
    class UserRepository @Inject constructor(private val userService: UserService)
    ```

    - **SL**: Lớp truy xuất các dependency, điều này có thể che khuất chúng.

    ```kotlin
    val userService: UserService = ServiceLocator.get<UserService>()
    ```

2. **Dễ kiểm tra**:

    - **DI**: Bạn có thể dễ dàng mô phỏng các dependency để thử nghiệm.

    ```kotlin
        @Mock lateinit var mockUserService: UserService 
        val userRepository = UserRepository(mockUserService)
    ```
    - **SL**: Giống như DI, bạn có thể dễ dàng thay thế các dependency mô phỏng để kiểm tra bằng cách đăng ký các đối tượng mô phỏng trong Bộ định vị dịch vụ.

    ```kotlin
        ServiceLocator.register<UserService>(mockUserService) 
    val userRepository = UserRepository(ServiceLocator.get<UserService>())
    ```

3. **Độ phức tạp của mã và gỡ lỗi**:

    - **DI**: Framework Dependency Injection có thể tăng thêm độ phức tạp. Một số framework bắt lỗi khi biên dịch chương trình, trong khi một số khung khác chỉ bắt lỗi ở runtime.

    - **SL**: Về mặt ngữ nghĩa đơn giản hơn nhưng có thể phát sinh lỗi tại runtime.

```kotlin
// Error occurs at runtime if not registered
val userService = ServiceLocator.get<UserService>() 
```

4. Hiệu suất:

    - **DI**: Hiệu suất thay đổi. Có thể có một số chi phí do phản ánh hoặc tạo mã hoặc không có gì cả. Nó phụ thuộc vào DI framework cụ thể và cách nó được triển khai.

    - **SL**: Hiệu suất cũng khác nhau. Nó có thể mang lại hiệu suất tốt hơn bằng cách tránh sự phản chiếu hoặc tạo mã, hoặc có thể không. Hiệu quả phụ thuộc vào cách triển khai Bộ định vị dịch vụ.

## Những lợi ích

Bộ định vị dịch vụ quản lý các dependency một cách hiệu quả,
mang lại một số lợi ích, đặc biệt là trong các tình huống sau:

1. **Separation of Concerns**: Thông qua `ServiceLocator`, các dịch vụ như `UserService` và `NetworkService` có thể được quản lý độc lập, thúc đẩy thiết kế mô-đun.

2. **Nhiều bộ định vị dịch vụ**: Bạn có thể có ServiceLocators riêng biệt cho các chức năng khác nhau, nâng cao cấu trúc tổ chức và sự rõ ràng của ứng dụng.

3. Tính đơn giản trong các thiết kế có cấu trúc tốt: Trái ngược với việc xử lý thủ công hoặc sử dụng các framework DI phức tạp, Bộ định vị dịch vụ quản lý các dependency một cách đơn giản.
Trong các thiết kế ứng dụng có cấu trúc tốt và ít phức tạp hơn, sự đơn giản này có thể mang lại lợi ích.

## Những cạm bẫy thường gặp và cách khắc phục sự cố

- **Dịch vụ chưa được đăng ký**:
Một vấn đề phổ biến là cố gắng truy xuất một dịch vụ chưa được đăng ký với Bộ định vị dịch vụ.

```kotlin
// Throws a NullPointerException if UserService isn't registered
val userService = ServiceLocator.get<UserService>()
```

Đảm bảo bạn đăng ký tất cả các dịch vụ quan trọng với Bộ định vị dịch vụ khi ứng dụng khởi động hoặc cung cấp cơ chế dự phòng.

- **Phụ thuộc vòng**:
Nếu các dịch vụ phụ thuộc lẫn nhau thì việc sử dụng Service Locator có thể dẫn đến sự phụ thuộc vòng tròn.


