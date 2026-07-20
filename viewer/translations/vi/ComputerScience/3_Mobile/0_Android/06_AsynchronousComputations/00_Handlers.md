# Trình xử lý

`Handler` là một lớp của Android SDK, được sử dụng để lên lịch các tác vụ tùy ý trên thread cụ thể.

**Trình xử lý** hoạt động với một hàng tin nhắn.
Nó cho phép chúng ta **lên lịch thực thi mã** tại một thời điểm nhất định trong tương lai, có hoặc không có **độ trễ** được chỉ định.

Trình xử lý cũng cho phép chúng tôi thực thi mã **bên ngoài thread** của chúng tôi.

1. xếp tác phẩm vào hàng đợi
2. thực hiện nó

để liên kết đối tượng xử lý của chúng tôi với Mainthread

- `Looper` - lớp được sử dụng để chạy vòng lặp tin nhắn cho thread

- `post()` - khiến `Runnable` được thêm vào hàng đợi tin nhắn với một khoảng thời gian cụ thể

- `Runnable` - giao diện để sử dụng cho bất kỳ lớp nào có phiên bản sẽ được thực thi bởi thread

## Thực thi có thể chạy được

Để xem cách sử dụng Trình xử lý, chúng tôi sẽ tạo một thao tác được thực hiện với độ trễ nhất định. Cụ thể, chúng ta sẽ tạo một hàm thay đổi màu sắc của một hoạt động.

Hãy bắt đầu bằng cách xác định mảng màu mà chúng ta muốn lặp qua:

```kotlin
private val colors = arrayOf(Color.RED, Color.GREEN, Color.BLUE)
private var color = colors[0]
```

Tiếp theo, chúng ta cần một Trình xử lý cho event loop bên trong thread chính:

```kotlin
private val handler = Handler(Looper.getMainLooper())
```

> [!WARNING]
> Khi nhập lớp Handler, IDE sẽ đưa ra hai lựa chọn: android.os.Handler và java.util.logging.Handler. Hãy chắc chắn chọn một cái liên quan đến Android!


Bây giờ, hãy khai báo một đối tượng `Runnable` bằng logic của chúng ta trong hàm có tên `run`:


```kotlin
private val updateLight: Runnable = object : Runnable {
    override fun run() {
        color = colors[(colors.indexOf(color) + 1) % colors.size]
        window.decorView.setBackgroundColor(color)
        handler.postDelayed(this, 1000)
    }
}
```

> [!NOTE]
> Như bạn có thể đã đoán, window.decorView.setBackgroundColor() là một cách (phi sản xuất) để thay đổi màu của toàn bộ hoạt động mà không giải quyết các phần tử cụ thể.

Khi chúng tôi sử dụng phương thức `postDelayed`, chúng tôi chuyển vào hai đối số: `this` (chính đối tượng Runnable của chúng tôi) và thời gian trễ (tính bằng mili giây) trước khi Runnable phải được thực thi. Trong `onStart`, chúng tôi chỉ cần chạy như sau:

```kotlin
override fun onStart() {
    super.onStart()
    handler.postDelayed(updateLight, 1000)
}
```
Điều này mang lại cho chúng ta một hoạt động nhấp nháy ba màu trong khoảng thời gian một giây!

Chúng ta cũng phải nhớ dừng việc thực thi nhiệm vụ của mình bằng phương thức `removeCallbacks()` nếu hoạt động bị dừng:


```kotlin
override fun onStop() {
    super.onStop()
    handler.removeCallbacks(updateLight)
}
```

Điều này đảm bảo rằng hoạt động của chúng tôi sẽ ngừng nhấp nháy nếu nó không hiển thị và nếu nó bị hủy, chúng tôi sẽ tránh memory leak và ngăn mọi tương tác với các chế độ xem tách rời.

## Multithreading có Bộ xử lý

Bây giờ, hãy thử tạo một thread riêng biệt để chúng ta có thể sử dụng nó để tăng bộ đếm và hiển thị kết quả trong `counterTextView`:

```kotlin
button.setOnClickListener {
    thread {
        for (i in 0..5) {
            handler.post {
                counterTextView.text = i.toString()
            }
            Thread.sleep(100) // let's pretend we're doing some work
        }
    }
}
```

## Tính năng bổ sung

Ngoài những chức năng được sử dụng trong các ví dụ trên, còn có các chức năng sau:

- `postAtTime(@NonNull Runnable r, long uptimeMillis)` — được sử dụng để chỉ định thời điểm thực hiện hành động. Nó sẽ chạy khi `SystemClock.uptimeMillis() >= uptimeMillis`.
- `postAtFrontOfQueue (Runnable r)` — khiến `Runnable r` được thực thi ở lần lặp tiếp theo thông qua hàng đợi tin nhắn.


