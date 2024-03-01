# App Shortcut

Phím tắt ứng dụng cho phép bạn khởi chạy một hành động cụ thể trong ứng dụng của mình. Bạn có thể hiển thị các phím tắt bằng cách nhấn và giữ biểu tượng ứng dụng và bạn có thể bắt đầu tác vụ bằng cách nhấp vào một mục trong danh sách như trong hình bên dưới:


![](../resources/shortcuts.avif)


Có ba loại shortcuts:

- Static shortcuts: Phím tắt tĩnh cung cấp liên kết đến các hành động nhất quán trong ứng dụng của bạn và thực hiện các tác vụ tĩnh, không phụ thuộc vào ngữ cảnh của người dùng. Ví dụ: Hiển thị các tin nhắn gần đây, viết bài hoặc tìm kiếm từ khóa.
- Dynamic shortcuts: Phím tắt động cung cấp liên kết đến các hành động cụ thể dựa trên ngữ cảnh của người dùng trong ứng dụng của bạn. Ví dụ: Gửi tin nhắn cho một người cụ thể hoặc điều hướng đến một vị trí cụ thể.
- Pinned shortcuts: Phím tắt được ghim (được hỗ trợ trên Android 8.0 trở lên) cho phép bạn ghim phím tắt vào trình khởi chạy được hỗ trợ. Bạn có thể chạy một tác vụ cụ thể bằng cách nhấp vào các phím tắt được ghim trên màn hình chính.

## Creating Static Shortcuts

Để tạo lối tắt tĩnh, trước tiên hãy tạo resource file mới:  `res/xml/shortcuts.xml`:

```xml
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
  <shortcut
    android:shortcutId="message"
    android:enabled="true"
    android:icon="@drawable/ic_message"
    android:shortcutShortLabel="@string/short_label"
    android:shortcutLongLabel="@string/long_label"
    android:shortcutDisabledMessage="@string/message_shortcut_disabled">
    <intent
      android:action="android.intent.action.VIEW"
      android:targetPackage="com.example.myapplication"
      android:targetClass="com.example.myapplication.ComposeActivity" />
    <categories android:name="android.shortcut.conversation" />
    <capability-binding android:key="actions.intent.CREATE_MESSAGE" />
  </shortcut>
</shortcuts>
```

Tiếp theo, để ứng dụng của bạn có thể hiển thị lối tắt, bạn phải khai báo lối tắt đó trong file Manifest như trong ví dụ bên dưới:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="io.getstream.example">
  <application ... >
    <activity android:name="Main">
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
      
      <meta-data android:name="android.app.shortcuts"
                 android:resource="@xml/shortcuts" /> 
    </activity>
  </application>
</manifest>
```

## Create dynamic shortcuts

Thư viện ShortManagerCompat Jetpack là một công cụ trợ giúp cho API ShortManager, cho phép bạn quản lý các phím tắt động trong ứng dụng của mình. Việc sử dụng thư viện Phím tắtManagerCompat giúp giảm mã soạn sẵn và giúp đảm bảo rằng các phím tắt của bạn hoạt động nhất quán trên các phiên bản Android. Thư viện này cũng cần thiết để đẩy các phím tắt động để chúng đủ điều kiện xuất hiện trên các nền tảng của Google—như Trợ lý—với Thư viện tích hợp phím tắt của Google.

API ShortManagerCompat cho phép ứng dụng của bạn thực hiện các thao tác sau bằng phím tắt động:
- Push and update: sử dụng pushDynamicShortcut() để xuất bản và cập nhật các phím tắt động của bạn. Nếu đã có các phím tắt động hoặc được ghim có cùng ID thì mỗi phím tắt có thể thay đổi sẽ cập nhật.
- Remove: xóa một bộ phím tắt động bằng cách sử dụng RemoveDynamicShortcuts(). Xóa tất cả các phím tắt động bằng cách sử dụng RemoveAllDynamicShortcuts().

Dưới đây là ví dụ về cách tạo lối tắt động và liên kết lối tắt đó với ứng dụng của bạn:

```kotlin
val shortcut = ShortcutInfoCompat.Builder(context, "id1")
        .setShortLabel("Website")
        .setLongLabel("Open the website")
        .setIcon(IconCompat.createWithResource(context, R.drawable.icon_website))
        .setIntent(Intent(Intent.ACTION_VIEW,
                Uri.parse("https://www.mysite.example.com/")))
        .build()

ShortcutManagerCompat.pushDynamicShortcut(context, shortcut)
```

## Create pinned shortcuts

Trên Android 8.0 (API cấp 26) trở lên, bạn có thể tạo lối tắt được ghim. Không giống như các phím tắt tĩnh và động, các phím tắt được ghim xuất hiện trong các trình khởi chạy được hỗ trợ dưới dạng các biểu tượng riêng biệt. Hình 1 cho thấy sự khác biệt giữa hai loại phím tắt này.

Để ghim lối tắt vào trình khởi chạy được hỗ trợ bằng ứng dụng của bạn, hãy hoàn thành các bước sau:

1. Sử dụng isRequestPinShortcutSupported() để xác minh rằng trình khởi chạy mặc định của thiết bị có hỗ trợ ghim phím tắt trong ứng dụng hay không.
2. Tạo một đối tượng ShortcutInfo theo một trong hai cách, tùy thuộc vào việc phím tắt có tồn tại hay không:
    a. Nếu phím tắt tồn tại, hãy tạo đối tượng ShortcutInfo chỉ chứa ID của phím tắt hiện có. Hệ thống tự động tìm và ghim tất cả các thông tin khác liên quan đến phím tắt.
    b. Nếu bạn đang ghim một lối tắt mới, hãy tạo một đối tượng ShortcutInfo chứa ID, Intent và gắn label cho lối tắt mới.
3. Ghim lối tắt vào trình khởi chạy của thiết bị bằng cách gọi requestPinShortcut(). Trong quá trình này, bạn có thể chuyển vào một đối tượng PendingIntent, đối tượng này chỉ thông báo cho ứng dụng của bạn khi ghim phím tắt thành công.
Sau khi phím tắt được ghim, ứng dụng của bạn có thể cập nhật nội dung của phím tắt bằng phương thức updateShortcuts().

Đoạn mã sau đây minh họa cách tạo lối tắt được ghim:

```kotlin

val shortcutManager = getSystemService(ShortcutManager::class.java)

if (shortcutManager!!.isRequestPinShortcutSupported) {
    // Enable the existing shortcut with the ID "my-shortcut".
    val pinShortcutInfo = ShortcutInfo.Builder(context, "my-shortcut").build()

    // Create the PendingIntent object only if your app needs to be notified
    // that the user let the shortcut be pinned. If the pinning operation fails,
    // your app isn't notified. Assume here that the app implements a method
    // called createShortcutResultIntent() that returns a broadcast intent.
    val pinnedShortcutCallbackIntent = shortcutManager.createShortcutResultIntent(pinShortcutInfo)

    // Configure the intent so that your app's broadcast receiver gets the
    // callback successfully. For details, see PendingIntent.getBroadcast().
    val successCallback = PendingIntent.getBroadcast(context, /* request code */ 0,
            pinnedShortcutCallbackIntent, /* flags */ 0)

    shortcutManager.requestPinShortcut(pinShortcutInfo,
            successCallback.intentSender)
}
```
