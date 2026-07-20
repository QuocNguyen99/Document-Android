# Nướng

`Toast` là một thông báo xuất hiện trên bề mặt cửa sổ ứng dụng, lấp đầy khoảng trống cần thiết cho tin nhắn.

## Phương thức Toast cancel()

Bạn có thể sử dụng phương pháp `cancel()` để xóa Thông báo chúc mừng khỏi màn hình nếu thông tin trong đó không còn hiện hành. Tình huống này có thể phát sinh nếu người dùng đã chuyển sang màn hình tiếp theo hoặc màn hình trước đó và thông báo Toast dài vẫn được hiển thị.

## Bánh mì nướng.Callback


Toast.Callback đã được thêm vào Android 11 R (API 30). Nó cho phép bạn xác định chính xác thời điểm Toast xuất hiện và biến mất, như minh họa bên dưới:


```kotlin
val toast = Toast.makeText(this, "Here will be your text", Toast.LENGTH_SHORT)
toast.addCallback(object: Toast.Callback() {
    override fun onToastShown() {
        // Your code here
    }

    override fun onToastHidden() {
        // Your code here
    }
})
toast.show()
```

> [!WARNING]
> Tốt nhất không nên sử dụng tin nhắn Toast quá thường xuyên. Nếu không, bạn có thể gặp phải sự cố do hạn chế của hệ thống mà bạn không thể giải quyết.

























