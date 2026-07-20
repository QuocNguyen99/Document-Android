# Liên kết sâu

Trong Android, deep link là một liên kết đưa bạn trực tiếp đến một điểm đến cụ thể trong ứng dụng.

## Rõ ràng deep link

deep link rõ ràng là một phiên bản duy nhất của deep link sử dụng `PendingIntent` để đưa người dùng đến một vị trí cụ thể trong ứng dụng của bạn. 

Khi người dùng mở ứng dụng của bạn thông qua deep link rõ ràng, ngăn xếp điều hướng sẽ bị xóa và thay thế bằng đích của deep link. 
Nếu bạn đang sử dụng biểu đồ lồng nhau, đích bắt đầu từ mỗi cấp độ của biểu đồ lồng nhau cũng được thêm vào ngăn xếp.
Điều này có nghĩa là khi người dùng nhấn nút Quay lại từ đích deep link, họ sẽ điều hướng quay lại điểm đích bắt đầu của các biểu đồ lồng nhau, giống như thể họ đã vào ứng dụng của bạn từ điểm nhập chính.

Bạn có thể sử dụng lớp `NavDeepLinkBuilder` để xây dựng `PendingIntent`, như trong ví dụ bên dưới. 

```kotlin
val pendingIntent = NavDeepLinkBuilder(context)
    .setGraph(R.navigation.nav_graph)
    .setDestination(R.id.android)
    .setArguments(args)
    .createPendingIntent()
```

> [!NOTE]
> Lưu ý rằng nếu ngữ cảnh được cung cấp không phải là `Activity` thì hàm tạo sẽ sử dụng `PackageManager.getLaunchIntentForPackage()` làm hoạt động mặc định để khởi chạy, nếu có.


Theo mặc định, `NavDeepLinkBuilder` **khởi chạy deep link rõ ràng của bạn vào phiên khởi chạy mặc định Activity được khai báo trong tệp kê khai ứng dụng của bạn**. 
Nếu `NavHost` của bạn nằm trong một hoạt động khác, bạn phải chỉ định tên thành phần của nó khi tạo trình tạo deep link:

```kotlin
val pendingIntent = NavDeepLinkBuilder(context)
    .setGraph(R.navigation.nav_graph)
    .setDestination(R.id.android)
    .setArguments(args)
    .setComponentName(DestinationActivity::class.java)
    .createPendingIntent()
```

Nếu bạn hiện có `NavController`, bạn cũng có thể tạo deep link bằng cách sử dụng `NavController.createDeepLink()`.

> [!CAUTION]
> Các API này cho phép liên kết sâu tới bất kỳ màn hình nào trong ứng dụng của bạn. 
> Nếu một màn hình yêu cầu người dùng thực hiện một số hành động, chẳng hạn như đăng nhập, trước khi họ có thể truy cập màn hình đó, 
> làm theo hướng dẫn về Navigation có điều kiện để chuyển hướng người dùng có điều kiện khi họ đến màn hình đó bằng deep link.

## deep link tiềm ẩn

deep link tiềm ẩn đề cập đến một đích cụ thể trong ứng dụng. Khi deep link được gọi—ví dụ: khi người dùng nhấp vào liên kết—khi đó, Android có thể mở ứng dụng của bạn tới đích tương ứng.

Liên kết sâu có thể được so khớp theo URI, hành động có mục đích và loại MIME. Bạn có thể chỉ định nhiều loại đối sánh cho một deep link, **nhưng lưu ý rằng đối số URI được ưu tiên trước, sau đó là hành động và sau đó là loại MIME.**

Ví dụ:

```xml
<fragment android:id="@+id/a"
          android:name="com.example.myapplication.FragmentA"
          tools:layout="@layout/a">
        <deepLink app:uri="www.example.com"
                app:action="android.intent.action.MY_ACTION"
                app:mimeType="type/subtype"/>
</fragment>
```


Khi áp dụng thông tin cho deep link ẩn, hãy lưu ý những điều sau:

- Các URI không có lược đồ được giả định là http hoặc https. Ví dụ: `www.google.com` khớp với cả `http://www.google.com` và `https://www.google.com`.
- Tham số đường dẫn, được biểu thị dưới dạng `{placeholder_name}`, khớp với một hoặc nhiều ký tự (ví dụ: `http://www.example.com/users/{id}` khớp với `http://www.example.com/users/4`) và thành phần Navigation cố gắng phân tích chúng thành các loại đối số đã xác định, mặc định là Chuỗi nếu không tìm thấy đối số khớp.
- Có thể sử dụng phần giữ chỗ tham số truy vấn cùng với các tham số đường dẫn (ví dụ: `http://www.example.com/users/{id}?myarg={myarg}` khớp với `http://www.example.com/users/4?myarg=28`).
- Tham số truy vấn có giá trị mặc định hoặc không thể rỗng là tùy chọn (ví dụ: `http://www.example.com/users/{id}?arg1={arg1}&arg2={arg2}` khớp với `http://www.example.com/users/4?arg2=28`).
- Các tham số truy vấn không liên quan không ảnh hưởng đến việc khớp URI (ví dụ: `http://www.example.com/users/{id}` khớp với `http://www.example.com/users/4?extraneousParam=7`).

Để bật liên kết sâu ngầm, bạn cũng phải bổ sung vào tệp `Manifest.xml` của ứng dụng. 
Thêm một phần tử `<nav-graph>` vào một hoạt động trỏ đến navigation graph hiện có, như trong ví dụ sau:


```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.myapplication">

    <application ... >

        <activity name=".MainActivity" ...>
            ...

            <nav-graph android:value="@navigation/nav_graph" />

            ...

        </activity>
    </application>
</manifest>
```
Khi xây dựng dự án của bạn, thành phần Navigation sẽ thay thế phần tử `<nav-graph>` bằng các phần tử `<intent-filter>` được tạo để khớp với tất cả các liên kết sâu trong navigation graph.

Khi kích hoạt deep link ẩn, **trạng thái của back stack phụ thuộc vào việc Intent ẩn có được khởi chạy** với cờ `Intent.FLAG_ACTIVITY_NEW_TASK` hay không:

- **Khi cờ được đặt**: Tác vụ back stack bị xóa và thay thế bằng đích deep link. Đích bắt đầu từ mỗi cấp độ của biểu đồ lồng nhau sẽ được thêm vào ngăn xếp, cho phép người dùng điều hướng quay lại ngăn xếp như thể họ đã vào ứng dụng từ điểm nhập chính.

- **Khi cờ không được đặt**: Ngăn xếp tác vụ vẫn còn trên ứng dụng trước nơi deep link ẩn được kích hoạt. Nhấn nút Quay lại sẽ đưa người dùng trở lại ứng dụng trước đó, trong khi nút Lên sẽ bắt đầu tác vụ của ứng dụng tại đích gốc trong navigation graph.


## Xử lý liên kết sâu

Chúng tôi thực sự khuyên bạn nên luôn sử dụng `launchMode` mặc định của `standard` khi sử dụng Navigation. **Khi sử dụng chế độ khởi chạy tiêu chuẩn, Navigation tự động xử lý các liên kết sâu** bằng cách gọi `handleDeepLink()` đến process bất kỳ liên kết sâu rõ ràng hoặc ẩn nào trong Intent. Tuy nhiên, điều này không tự động xảy ra nếu `Activity` được sử dụng lại khi sử dụng `launchMode` thay thế như `singleTop`. Trong trường hợp này, cần phải gọi thủ công `handleDeepLink()` trong `onNewIntent()`, như trong ví dụ sau:

```kotlin
override fun onNewIntent(intent: Intent?) {
    super.onNewIntent(intent)
    navController.handleDeepLink(intent)
}
```
