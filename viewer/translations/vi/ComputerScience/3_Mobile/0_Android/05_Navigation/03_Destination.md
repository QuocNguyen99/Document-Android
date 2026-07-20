# Điểm đến Navigation 

## Đích của hộp thoại

### Compose

Để tạo đích hộp thoại trong Compose, hãy thêm đích vào `NavHost` của bạn bằng chức năng `dialog()`. Về cơ bản, hàm này hoạt động giống như hàm có thể kết hợp, chỉ khác là nó tạo đích đến của hộp thoại chứ không phải đích được lưu trữ.

Ví dụ: 

```kotlin
@Composable
fun MyApp() {
    val navController = rememberNavController()
    NavHost(navController, startDestination = Home) {
        composable<Home> { HomeScreen(onNavigateToSettings = { navController.navigate(route = Settings) }) }
        dialog<Settings> { SettingsScreen() }
    }
}
```
Các đích đến `Dialog` xuất hiện trên đích trước đó trong `NavHost`. **Sử dụng chúng khi hộp thoại biểu thị một màn hình riêng trong ứng dụng của bạn cần lifecycle riêng và trạng thái đã lưu, độc lập với bất kỳ đích nào khác trong navigation graph** của bạn. Bạn có thể muốn sử dụng `AlertDialog` hoặc thành phần kết hợp có liên quan nếu muốn có hộp thoại cho lời nhắc ít phức tạp hơn, chẳng hạn như xác nhận.

> [!Lưu ý]
> Vì các trang tính dưới cùng trong Compose không được xây dựng trên `Dialog` nên chúng cần có loại đích riêng. 

### Lượt xem UI framework

### 1. Kotlin DSL

Nếu bạn đang làm việc với các đoạn và bạn đang sử dụng Kotlin DSL để tạo graph, việc thêm đích hộp thoại rất giống với khi sử dụng Compose.

Ví dụ: 

```kotlin
// Define destinations with serializable classes or objects
@Serializable
object Home
@Serializable
object Settings

// Add the graph to the NavController with `createGraph()`.
navController.graph = navController.createGraph(
    startDestination = Home
) {
    // Associate the home route with the HomeFragment.
    fragment<HomeFragment, Home> {
        label = "Home"
    }

    // Define the settings destination as a dialog using DialogFragment.
    dialog<SettingsFragment, Settings> {
        label = "Settings"
    }
}
```

### 2. XML
Nếu bạn hiện có DialogFragment, hãy sử dụng `<dialog>`element để thêm hộp thoại vào navigation graph của bạn, như trong ví dụ sau:

```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
            xmlns:app="http://schemas.android.com/apk/res-auto"
            android:id="@+id/nav_graph">

...

<dialog
    android:id="@+id/my_dialog_fragment"
    android:name="androidx.navigation.myapp.MyDialogFragment">
    <argument android:name="myarg" android:defaultValue="@null" />
        <action
            android:id="@+id/myaction"
            app:destination="@+id/another_destination"/>
</dialog>

...

</navigation>
```

### Điểm đến Activity & Fragment

Trong navigation graph của bạn, đích đến có thể là một hoạt động. 
Mặc dù best practice chỉ có một hoạt động duy nhất trong ứng dụng của bạn nhưng các ứng dụng thường sử dụng các hoạt động riêng biệt cho các thành phần hoặc màn hình riêng biệt trong một ứng dụng.
Đích Activity có thể hữu ích trong những trường hợp như vậy.

#### Compose và Kotlin DSL

Hàm `activity()` DSL nhận tham số loại cho tuyến đường nhưng không được tham số hóa cho bất kỳ lớp hoạt động triển khai nào.
Thay vào đó, bạn đặt `activityClass` tùy chọn trong lambda ở cuối. 
Tính linh hoạt này cho phép bạn xác định đích hoạt động cho hoạt động cần được khởi chạy bằng cách sử dụng mục đích ngầm định, trong đó lớp hoạt động rõ ràng sẽ không có ý nghĩa. 

Ví dụ:

```kotlin
activity<MyRoute> {
   label = getString(R.string.activity_title)
   // custom argument types, deepLinks...

   activityClass = MyActivity::class
}
```

Hàm `fragment()` DSL có thể được tham số hóa bằng lớp phân đoạn cho UI và loại tuyến đường được sử dụng để xác định duy nhất điểm đến này, 
theo sau là lambda nơi bạn có thể cung cấp cấu hình bổ sung như được mô tả trong phần Điều hướng bằng Kotlin DSL graph của bạn.


```kotlin
fragment<MyFragment, MyRoute> {
   label = getString(R.string.fragment_title)
   // custom argument types, deepLinks
}
```

####XML

Việc tạo đích đến cho hoạt động cũng tương tự như tạo đích đến cho mảnh. **Tuy nhiên, bản chất của điểm đến hoạt động khá khác nhau.**

Theo mặc định, thư viện Navigation gắn `NavController` vào bố cục `Activity` và navigation graph đang hoạt động nằm trong phạm vi `Activity` đang hoạt động. Nếu người dùng điều hướng đến một `Activity` khác thì navigation graph hiện tại không còn nằm trong phạm vi nữa. Điều này có nghĩa là đích `Activity` phải được coi là điểm cuối trong navigation graph.


```xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/navigation_graph"
    app:startDestination="@id/simpleFragment">

    <activity
        android:id="@+id/sampleActivityDestination"
        android:name="com.example.android.navigation.activity.DestinationActivity"
        android:label="@string/sampleActivityTitle" />
</navigation>
```

XML này tương đương với lệnh gọi startActivity() sau:

```kotlin
startActivity(Intent(context, DestinationActivity::class.java))
```

**Bạn có thể gặp những trường hợp cách tiếp cận này không phù hợp**. Ví dụ: bạn có thể không có sự phụ thuộc về thời gian biên dịch vào lớp hoạt động hoặc bạn có thể thích mức độ gián tiếp của việc thực hiện một ý định ngầm định. Bộ lọc ý định trong mục nhập tệp kê khai cho đích Activity chỉ ra cách bạn cần cấu trúc đích Activity.
