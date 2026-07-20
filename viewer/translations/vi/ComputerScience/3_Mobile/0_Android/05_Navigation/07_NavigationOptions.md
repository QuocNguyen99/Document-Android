# Tùy chọn Navigation

Tùy chọn Navigation, được biểu thị dưới dạng `NavOptions`. Lớp này chứa tất cả cấu hình đặc biệt để chuyển đến và quay lại từ đích đích, 
bao gồm cấu hình tài nguyên hoạt ảnh, hành vi bật lên và liệu đích đến có nên được khởi chạy ở chế độ trên cùng hay không.

##Compose

Theo mặc định, `navigate()` thêm đích đến mới của bạn vào back stack. Bạn có thể sửa đổi hành vi của `navigate()` bằng cách chuyển các tùy chọn điều hướng bổ sung tới lệnh gọi `navigate()` của mình.

Bạn có thể tạo một phiên bản `NavOptions` bằng cách sử dụng lambda đơn giản. Chuyển `navigate()` các đối số mà bạn có thể chuyển một cách rõ ràng tới `NavOptions.Builder`.

##XML

Định cấu hình thẻ hành động NavOptions trong xml navigation graph:

```xml
<fragment android:id="@+id/b"
            android:name="com.example.myapplication.FragmentB"
            android:label="b"
            tools:layout="@layout/b">
    <action android:id="@+id/action_b_to_a"
            app:destination="@id/a"
            app:enterAnim="@anim/nav_default_enter_anim"
            app:exitAnim="@anim/nav_default_exit_anim"
            app:popEnterAnim="@anim/nav_default_pop_enter_anim"
            app:popExitAnim="@anim/nav_default_pop_exit_anim"
            app:popUpTo="@+id/a"
            app:popUpToInclusive="true"/>
</fragment>
```

Khi navigation graph tăng cao, các hành động này sẽ được phân tích cú pháp và các đối tượng `NavAction` tương ứng được tạo với các cấu hình được xác định trong graph. Hành động này bao gồm các hoạt ảnh cùng với hành vi `popUpTo` giúp loại bỏ tất cả các đích khỏi ngăn xếp lùi. Tất cả các cài đặt này được ghi lại dưới dạng `NavOptions` và được gắn vào `NavAction`.

## Thêm chuyển tiếp phần tử được chia sẻ giữa các đích


#### XML
Các phần tử được chia sẻ được cung cấp theo chương trình thay vì thông qua tệp XML điều hướng của bạn. Mỗi đích `Activity` và `Fragment` đều có một lớp con của giao diện `Navigator.Extras` chấp nhận các tùy chọn bổ sung để điều hướng, **bao gồm các thành phần được chia sẻ**. Bạn có thể chuyển những `Extras` này khi gọi `navigate()`.
Ví dụ. 
- Phần tử được chia sẻ chuyển tiếp tới đích phân đoạn:

Lớp `FragmentNavigator.Extras` cho phép bạn ánh xạ các phần tử được chia sẻ từ đích này sang đích khác theo tên chuyển tiếp của chúng, tương tự như sử dụng `FragmentTransaction.addSharedElement()`. Sau đó, bạn có thể chuyển phần bổ sung cho `navigate()`, như trong ví dụ sau:

```kotlin
val extras = FragmentNavigatorExtras(view1 to "hero_image")

view.findNavController().navigate(
    R.id.confirmationAction,
    null, // Bundle of args
    null, // NavOptions
    extras)
```
- Phần tử chia sẻ chuyển tiếp tới đích hoạt động:

`Activities` dựa vào `ActivityOptionsCompat` để kiểm soát Chuyển đổi phần tử được chia sẻ như được nêu chi tiết trong tài liệu Bắt đầu hoạt động với phần tử được chia sẻ và như trong ví dụ bên dưới:


```kotlin
// Rename the Pair class from the Android framework to avoid a name clash
import android.util.Pair as UtilPair
...
val options = ActivityOptionsCompat.makeSceneTransitionAnimation(activity,
        UtilPair.create(view1, "hero_image"))
val extras = ActivityNavigatorExtras(options)
view.findNavController().navigate(
    R.id.details,
    null, // Bundle of args
    null, // NavOptions
    extras)
```


####Compose

Trong Compose, có một số API cấp cao giúp bạn tạo các phần tử dùng chung:

- `SharedTransitionLayout`: Bố cục ngoài cùng cần thiết để thực hiện chuyển đổi phần tử dùng chung. Nó cung cấp `SharedTransitionScope`. Các thành phần kết hợp cần phải có trong `SharedTransitionScope` để sử dụng các công cụ sửa đổi phần tử dùng chung.
- `Modifier.sharedElement()`: Công cụ sửa đổi gắn cờ cho `SharedTransitionScope` thành phần kết hợp cần khớp với một thành phần kết hợp khác.
- `Modifier.sharedBounds()`: Công cụ sửa đổi gắn cờ cho `SharedTransitionScope` rằng giới hạn của thành phần kết hợp này phải được sử dụng làm giới hạn vùng chứa nơi quá trình chuyển đổi sẽ diễn ra. Ngược lại với `sharedElement()`, `sharedBounds()` được thiết kế cho nội dung khác biệt về mặt hình ảnh.