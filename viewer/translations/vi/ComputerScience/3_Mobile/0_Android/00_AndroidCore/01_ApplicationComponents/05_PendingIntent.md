#PendingIntent

Như bạn đã biết, **ý định** là một đối tượng nhắn tin giúp ứng dụng của bạn tương tác với các thành phần ứng dụng khác.
Trong chủ đề này, bạn sẽ tìm hiểu cách sử dụng `PendingIntent` để chỉ định một hành động cần thực hiện trong tương lai, chẳng hạn như đưa ra lời nhắc hoặc cảnh báo.


Phải có bốn đối số: `context`, `requestCode`, `intent` và `flags`; và có thể bị kích hoạt ngay cả khi ứng dụng của bạn bị đóng.
`PendingIntents` thường được sử dụng để tạo thông báo và cũng có thể được sử dụng với RemoteViews. Bây giờ là lúc để thực hành!

## Giới thiệu về PendingIntent
`PendingIntent` là một đối tượng bao bọc `Intent` để chúng ta có thể chuyển nó sang một ứng dụng khác:
nó cho phép bạn ủy quyền cho một ứng dụng khác kích hoạt `Intent` với các quyền tương tự như ứng dụng của bạn.
Một trong những điều thú vị về `PendingIntent` là **nó có thể được kích hoạt ngay cả sau khi process của ứng dụng của chúng tôi bị tắt.** `PendingIntents` thường được sử dụng với `AlarmManager` hoặc `NotificationManager` để triển khai chức năng thông báo và chúng tôi sẽ đề cập đến các ví dụ này sau trong chủ đề này. Chúng cũng có thể được sử dụng với `RemoteViews` (thông báo hoặc tiện ích tùy chỉnh).


> [!NOTE]
> Hãy nhớ rằng PendingIntent hầu như luôn cần phải rõ ràng.
> Điều này có nghĩa là tên thành phần phải được đặt rõ ràng cho một trong các thành phần của bạn để đảm bảo nó được gửi đến đúng nơi.

## Tạo PendingIntent

Trước khi tạo `PendingIntent`, trước tiên bạn cần xác định `Intent` mà bạn muốn sử dụng với nó. Sau đó, bạn có thể tạo `PendingIntent` bằng phương thức được yêu cầu: `getActivity()`, `getBroadcast()` hoặc `getService()`.

Các đối số cũng phải được chuyển đến bốn tham số sau:

- `context` : cung cấp `Context` của người gọi.

- `requestCode`: có thể dùng để phân biệt `PendingIntent` với các loại khác.

- `intent`: Intent sẽ được sử dụng để gọi Activity, Broadcast hoặc Service.

- `flags`: ảnh hưởng đến hoạt động của PendingIntent.

Đây là một ví dụ:

```kotlin
val intent = Intent(applicationContext, Receiver::class.java)
val pendingIntent = PendingIntent.getBroadcast(this, 1, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
```

Có một số cờ có sẵn:

- `FLAG_CANCEL_CURRENT`: nếu `PendingIntent` đã tồn tại, phiên bản hiện tại sẽ bị hủy trước khi phiên bản mới được tạo.
Bạn chỉ có thể sử dụng tính năng này để truy xuất `PendingIntent` mới khi thay đổi dữ liệu bổ sung trong `Intent`.
Bằng cách hủy `PendingIntent` trước đó, chỉ những thực thể có dữ liệu mới mới có thể khởi chạy nó.
Nói một cách đơn giản, cờ này làm cho PendingIntent cũ không hợp lệ, vì vậy chỉ có cái mới mới hoạt động.
Nếu bạn đang thắc mắc về cách Android kiểm tra xem `PendingIntents` có bằng nhau hay không: **chúng khớp nếu hành động, danh mục, dữ liệu MIME-, loại, gói và thành phần requestCode, Intent đều bằng nhau**. Mọi dữ liệu bổ sung đều bị bỏ qua.

- `FLAG_NO_CREATE`: nếu `PendingIntent` được mô tả không tồn tại, nó sẽ trả về null thay vì tạo nó.

- `FLAG_ONE_SHOT`: `PendingIntent` này chỉ có thể được sử dụng một lần.

- `FLAG_UPDATE_CURRENT`: nếu `PendingIntent` tồn tại, dữ liệu bổ sung của nó sẽ được thay thế. Hữu ích khi bạn đang tạo `PendingIntents` trong đó chỉ có các tính năng bổ sung thay đổi.

- `FLAG_IMMUTABLE`: `PendingIntent` được tạo phải là immutable.

Bắt đầu với `Build.VERSION_CODES.S`, cần phải chỉ định rõ ràng khả năng thay đổi của `PendingIntents` khi tạo bằng `FLAG_IMMUTABLE` hoặc `FLAG_MUTABLE`.

## PendingIntent và thông báo

Bạn có thể nhận thấy rằng việc nhấp vào thông báo ứng dụng thường đưa bạn đến ứng dụng đã gửi thông báo đó.
Đây là một ví dụ về cách có thể sử dụng `PendingIntent`, vì vậy hãy thử triển khai hành vi này!

Hãy tưởng tượng bạn đang tạo một ứng dụng nhắc nhở sẽ cung cấp cho người dùng thông báo nhiệm vụ vào những thời điểm cụ thể.
Để đạt được điều này, trước tiên bạn cần xác định `Intent` sẽ mở hoạt động của bạn:

```kotlin
val intent = Intent(context, MainActivity::class.java)
```

Sau đó, bạn cần tạo `PendingIntent` sẽ được kích hoạt khi nhấp vào thông báo:

```kotlin
val pIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
```
Hầu như ở đó! Bây giờ, trong trình tạo Thông báo của bạn, hãy thêm dòng `.setContentIntent(pIntent)`:


```kotlin
val notificationBuilder = NotificationCompat.Builder(context, "channel1")
    .setContentTitle("Reminder")
    .setContentText("Time to study!")
    //your other notification settings here
    .setContentIntent(pIntent)
```

Xong! Khi nhấp vào thông báo này, Activity của bạn sẽ bật lên trên màn hình.

## PendingIntent và báo động

Trong một số trường hợp, bạn có thể cần thực thi một cái gì đó vào một thời điểm nhất định trong ngày.
Các ứng dụng như báo thức, danh sách việc cần làm, lời nhắc và lịch thường có tùy chọn "Nhắc nhở".
Tôi hy vọng bạn đã đoán được rằng `PendingIntent` cũng có thể giúp chúng tôi ở đây!
Nhưng làm cách nào bạn có thể kích hoạt `Intent` vào một thời điểm cụ thể?

Dịch vụ báo thức được sử dụng để gửi tin nhắn một lần (hoặc định kỳ) tại một thời điểm nhất định.
Những cảnh báo này không phụ thuộc vào một ứng dụng cụ thể và đó là lý do tại sao chúng có thể được sử dụng để kích hoạt các sự kiện do ứng dụng của bạn sở hữu ngay cả khi ứng dụng đó đã đóng.

Trong ví dụ này, chúng tôi sẽ tạo thông báo để cung cấp tại một thời điểm nhất định.
Các chi tiết sẽ được mã hóa cứng trong trường hợp này, nhưng bạn có thể dễ dàng chỉnh sửa chúng.
Chúng tôi sẽ sử dụng một phiên bản lịch để đặt ngày và giờ:

```kotlin
val calendar = Calendar.getInstance()
calendar.set(Calendar.YEAR, 2038)
calendar.set(Calendar.MONTH, Calendar.JANUARY)
calendar.set(Calendar.DAY_OF_MONTH, 19)

calendar.set(Calendar.HOUR_OF_DAY, 3)
calendar.set(Calendar.MINUTE, 14)
calendar.set(Calendar.SECOND, 7)
val chosenTime = calendar.timeInMillis
```

Hãy nhớ rằng các tháng trong Lịch.MONTH bắt đầu từ 0 (0 — Tháng 1, 1 — Tháng 2, v.v.). Tuy nhiên, bạn có thể sử dụng tên của tháng thay vì số của tháng đó.


Bây giờ chúng ta cần tạo `Intent` và `PendingIntent` bằng cách sử dụng kỹ thuật được mô tả trước đó.
Tiếp theo, lấy AlarmManager và sử dụng phương pháp `.set()` để đặt báo thức một lần:

```kotlin
val intent = Intent(applicationContext, Receiver::class.java)
val pendingIntent = PendingIntent.getBroadcast(this, 1, intent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)

val am: AlarmManager = getSystemService(ALARM_SERVICE) as AlarmManager
am.set(AlarmManager.RTC_WAKEUP, chosenTime, pendingIntent)
```

Vì vậy, đó là nó. Vào thời điểm xác định, báo thức của bạn sẽ kích hoạt `PendingIntent` và... sẽ không có gì xảy ra.
Tại sao? Bởi vì ứng dụng vẫn chưa biết phải làm gì với nó! Để khắc phục sự cố, chúng tôi cần nhận `PendingIntent` bằng `BroadcastReceiver`.

`BroadcastReceiver` phản hồi các tin nhắn quảng bá từ hệ thống hoặc ứng dụng khác. Để đạt được điều này, một lớp mới mở rộng `BroadcastReceiver` phải được tạo. Chúng tôi cũng cần triển khai phương thức `onReceive()` có chứa mã để kích hoạt thông báo:




```kotlin
class Receiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val intent = Intent(context, MainActivity::class.java)
        val pIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
        val notificationBuilder = NotificationCompat.Builder(context, "channel1")
            .setSmallIcon(R.drawable.photo)
            .setContentTitle("Reminder")
            .setContentText("Time to study!")
            .setStyle(NotificationCompat.BigTextStyle())
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pIntent)
        val mNotificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        mNotificationManager.notify(1, notificationBuilder.build())
    }
}
```

Để hoàn thành bước cuối cùng, hãy đi tới `AndroidManifest.xml` và thêm dòng <receiver android:name=".Receiver"/> .
Nếu bạn đã chỉ định một tên khác cho lớp receiver của mình, chỉ cần thay đổi ".Receiver" thành tên bạn đã sử dụng.

Bây giờ thông báo của bạn sẽ đến vào thời điểm đã chọn.



## thẩm quyền giải quyết

- [PendingIntent](https://hyperskill.org/learn/step/12503)

















