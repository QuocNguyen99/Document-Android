# Bố cục XML


**Bố cục** trong Android được sử dụng để xác định ứng dụng user interface (UI).

Nói một cách đơn giản, bố cục là một mẫu trực quan cho màn hình ứng dụng của bạn, cho phép bạn kiểm soát các thuộc tính và vị trí của các thành phần.

Tạo bố cục trong tệp XML giúp bạn tách UI khỏi mã của mình. Mỗi tệp bố cục chỉ được chứa một phần tử gốc phải là đối tượng **View** hoặc **ViewGroup**.

- **ViewGroup** là View đặc biệt có thể chứa các Chế độ xem khác. Đây là lớp cơ sở cho Bố cục trong Android. Nói cách khác, ViewGroup hoạt động như một thùng chứa vô hình cho các đối tượng View. 
- Đối tượng **View** là các khối đơn giản phản hồi hành động của người dùng.


## Kết nối XML của bạn với Activity

Khi bạn biên dịch ứng dụng của mình, tất cả bố cục sẽ được biên dịch thành tài nguyên **bố cục**. 

Khi bạn khởi chạy ứng dụng của mình, hàm `onCreate()` có thể áp dụng tệp XML của bạn cho Activity bằng cách gọi `setContentView()`. Để ghép nối XML với Activity của bạn, hãy nhập tên của nó vào hàm `setContentView(R.layout.XML_FILENAME)`.

## Thuộc tính


```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

`xmlns` khai báo không gian tên XML. Không gian tên được sử dụng để loại bỏ xung đột tên thẻ trong tệp XML. Trong trường hợp này, chúng ta có `android`, `app` và `tools`.

- Không gian tên `xmlns:android` được sử dụng để truy cập các thuộc tính được cung cấp bởi nền tảng Android. Ví dụ: bạn nên sử dụng không gian tên android nếu bạn cần đặt ID cho một phần tử nào đó, đặt văn bản thành TextView hoặc thay đổi chiều rộng hoặc chiều cao.

- `xmlns:tools` được sử dụng để hiển thị các phần tử UI chỉ để xem ở chế độ thiết kế và sẽ không ảnh hưởng đến ứng dụng đã xây dựng của bạn.

- `xmlns:app` được sử dụng để truy cập các thuộc tính tùy chỉnh được xác định trong ứng dụng của bạn, theo mã của bạn hoặc bởi các thư viện bạn nhập: nói cách khác, các thuộc tính không được Android xác định.






