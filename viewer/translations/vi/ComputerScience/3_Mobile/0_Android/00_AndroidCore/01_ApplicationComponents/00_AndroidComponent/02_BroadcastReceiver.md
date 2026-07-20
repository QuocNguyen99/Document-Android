#BroadcastReceiver

`BroadcastReceiver` là **thành phần** phản hồi các tin nhắn quảng bá trên toàn hệ thống.
Đây có thể là tin nhắn từ chính hệ thống và từ bất kỳ ứng dụng nào (bao gồm cả ứng dụng của bạn). 

Ví dụ về thông báo hệ thống bao gồm thay đổi ngày hoặc giờ, bật Chế độ trên máy bay, thay đổi trạng thái pin, v.v.

> [!NOTE]
> Mỗi tin nhắn quảng bá được gói trong Intent. Chuỗi hành động của Intent xác định sự kiện đã xảy ra (ví dụ: android.intent.action.AIRPLANE_MODE).

## BroadcastReceiver được sử dụng như thế nào?

Bạn bắt đầu bằng cách tạo `BroadcastReceiver` của mình:

```kotlin
class YourBroadcastReceiver : BroadcastReceiver() {
    
}
```

receiver phải có phương thức `onReceive()`. Phương thức này được gọi khi `BroadcastReceiver` đang nhận được phát sóng Intent:

```kotlin
class YourBroadcastReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        //Your code here
    }
}
```

Người nhận có thể là:  
- **tĩnh**:
Tùy chọn tĩnh là khi lớp con BroadcastReceiver được thêm vào tệp kê khai
- **động**:
Tùy chọn động là khi phiên bản `BroadcastReceiver` được **đăng ký** trong suốt thời gian tồn tại của ứng dụng.

Sự khác biệt chính giữa các tùy chọn này là receiver tĩnh sẽ hoạt động cho dù ứng dụng có chạy hay không.

nếu ứng dụng của bạn chưa chạy thì hệ thống sẽ khởi chạy ứng dụng đó khi chương trình phát sóng được gửi. Ngược lại, bộ thu động chỉ được kích hoạt khi ứng dụng đang chạy. Vì vậy, tất cả các bộ thu động đều chưa được đăng ký tại thời điểm ứng dụng ngừng hoạt động.

Trước tiên, hãy xem cách sử dụng receiver tĩnh. Với tùy chọn này, bạn chỉ cần khai báo receiver trong file `AndroidManifest.xml` bên trong khối ứng dụng:

## Tĩnh receiver

Với tùy chọn này, bạn chỉ cần khai báo receiver trong file `AndroidManifest.xml` bên trong khối ứng dụng:

```xml
<receiver
    android:name=".YourBroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.AIRPLANE_MODE" />
    </intent-filter>
</receiver>
```

Nó đơn giản như vậy. Bây giờ, khi bạn thực hiện hành động đã chỉ định, phương thức `onReceive()` cũng sẽ được kích hoạt.

## Động receiver

Máy thu động được tạo ra khác nhau. Bạn không cần sử dụng tệp kê khai vì receiver sẽ được khởi tạo và đăng ký trực tiếp trong mã.

Thay vào đó, bạn cần tạo receiver và bộ lọc để kiểm tra hành động bạn đã chọn. Việc này được thực hiện theo cách sau:

```kotlin
val receiver: BroadcastReceiver = YourBroadcastReceiver()
val filter = IntentFilter(Intent.ACTION_AIRPLANE_MODE_CHANGED)
applicationContext.registerReceiver(receiver, filter)
```

Như bạn có thể thấy ở trên, bước cuối cùng là đăng ký receiver. Bây giờ, khi bạn thực hiện hành động đã chỉ định, phương thức `onReceive()` cũng sẽ kích hoạt.

Nếu bạn muốn tắt receiver của mình, chỉ cần thêm dòng này vào điểm bạn muốn hủy đăng ký:

```kotlin
applicationContext.unregisterReceiver(receiver)
```

## Nhiều hành động

Bạn có thể cần ứng dụng của mình phản hồi nhiều loại tin nhắn. ví dụ,
Cả `AIRPLANE_MODE_CHANGED` và `DATE_CHANGED`.

Bạn nên thêm một bộ lọc duy nhất để không cần phải tạo nhiều bộ lọc. Bạn có thể xem cách thêm nhiều hành động bằng cách sử dụng phương pháp tĩnh bên dưới:

```xml
<receiver
    android:name=".YourBroadcastReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.AIRPLANE_MODE" />
        <action android:name="android.intent.action.DATE_CHANGED" />
    </intent-filter>
</receiver>
```
Và ví dụ sau đây minh họa cách thêm nhiều hành động một cách linh hoạt:

```kotlin
val filter = IntentFilter().apply {
    addAction(Intent.ACTION_AIRPLANE_MODE_CHANGED)
    addAction(Intent.ACTION_DATE_CHANGED)
}
```

Nếu bạn cần một kết quả khác nhau cho mỗi hành động, bạn có thể sử dụng biểu thức when trong phương thức `onReceive()` của mình:

```kotlin
when (intent.action) {
    Intent.ACTION_AIRPLANE_MODE_CHANGED ->
        Toast.makeText(context, "Airplane mode was changed", LENGTH_LONG).show()
    Intent.ACTION_DATE_CHANGED ->
        Toast.makeText(context, "The date was changed", LENGTH_LONG).show()
}
```

















