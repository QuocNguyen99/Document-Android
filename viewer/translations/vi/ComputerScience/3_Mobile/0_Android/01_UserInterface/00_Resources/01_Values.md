# Giá trị


## Chuỗi

Tài nguyên chuỗi được biểu thị bằng thẻ `<string>`. Bạn nên lưu trữ tài nguyên chuỗi trong tệp strings.xml, nhưng bạn có thể sử dụng nhiều tệp.

Mỗi phần tử `<string>` có thuộc tính "name" và một giá trị:


```xml
<resources>
   <string name="app_name">Android</string>
   <string name="btn_text">Click Me</string>
   <string name="btn_action">Send Me</string>
</resources>
```

Nếu bạn tạo nhiều tệp có tài nguyên, hãy đảm bảo rằng tên tệp là duy nhất.
Lưu ý rằng các tài nguyên cùng loại và cùng tên trong cùng một thư mục sẽ gây ra xung đột và Công cụ đóng gói nội dung Android (**aapt**) sẽ không biên dịch chúng.
Công cụ aapt phân tích cú pháp, lập chỉ mục và biên dịch tài nguyên thành định dạng nhị phân được tối ưu hóa cho nền tảng Android.

### Ngoại lệ đối với tài nguyên được bản địa hóa

Android cho phép nhiều tệp tài nguyên có cùng tên miễn là chúng được đặt trong các thư mục khác nhau đủ tiêu chuẩn theo ngôn ngữ hoặc khu vực. Điều này là do Android hỗ trợ bản địa hóa tài nguyên, trong đó các phiên bản khác nhau của tệp tài nguyên được cung cấp cho các ngôn ngữ hoặc khu vực khác nhau.

Khi ứng dụng chạy, Android sẽ tự động chọn phiên bản tài nguyên phù hợp dựa trên cài đặt ngôn ngữ thiết bị của người dùng. Nếu không tìm thấy tài nguyên cụ thể cho ngôn ngữ, tài nguyên mặc định (`res/values/strings.xml`) sẽ được sử dụng.

Do đó, các tệp có cùng tên như `strings.xml` có thể cùng tồn tại mà không có xung đột vì chúng được đặt trong các thư mục đủ điều kiện theo các ngôn ngữ khác nhau (`e.g., values, values-vi, values-fr, etc.`).

## Màu sắc

Để xử lý màu sắc, bạn có thể cần phải cải tiến [định dạng rgb và cmyk](https://99designs.com/blog/tips/correct-file-formats-rgb-and-cmyk/). Sử dụng thẻ `<color>` để chỉ định các màu và sắc thái khác nhau. Bạn có thể sử dụng một trong các định dạng và giá trị sau:

- #RGB
- #RRGGBB
- #ARGB
- #AARRGGBB

Ví dụ:

```xml
<resources>
   <color name="colorPrimary">#6200EE</color>
   <color name="colorPrimaryDark">#3700B3</color>
   <color name="colorAccent">#03DAC5</color>
   <color name="green_lime">#CDDC39</color>
   <color name="indigo">#3F51B5</color>
</resources>
```

## Kiểu và chủ đề

**Tài nguyên kiểu dáng giúp bạn duy trì giao diện nhất quán cho ứng dụng của mình.** Kiểu là một tập hợp các thuộc tính kiểm soát hình thức và hoạt động của View.
Chúng được lưu trữ trong các tệp `styles.xml` hoặc `themes.xml`.

Việc chỉ định thuộc tính `style` cho thẻ View sẽ áp dụng các giá trị thuộc tính của kiểu cho View.

```xml
<!-- styles.xml -->
<resources>
    <style name="GreenPadded">
        <item name="android:background">@android:color/holo_green_light</item>
        <item name="android:padding">8dp</item>
    </style>
</resources>
```

```xml
<!-- layout -->
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    style="@style/GreenPadded" />
```

Chủ đề là một kiểu được áp dụng cho một phạm vi nhất định: vùng chứa, hoạt động hoặc ứng dụng. 
Trong ví dụ bên dưới, chủ đề ảnh hưởng đến giao diện của `TextView` bên trong `FrameLayout`:

```xml
<!-- styles.xml -->
<resources>
    <style name="GreenPadded">
        <item name="android:background">@android:color/holo_green_light</item>
        <item name="android:padding">8dp</item>
    </style>
    <style name="BigCenteredText">
        <item name="android:textSize">34sp</item>
        <item name="android:gravity">center</item>
    </style>
</resources>
```

```xml
<!-- layout -->
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    style="@style/GreenPadded"
    android:theme="@style/BigCenteredText">

    <TextView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:text="Look at me, I'm themed!" />

</FrameLayout>
```


Một chủ đề cho toàn bộ `<application>` hoặc `<activity>` có thể được chỉ định trong tệp kê khai:

```xml
<manifest ...>
   <application
       android:icon="@mipmap/ic_launcher"
       android:label="Android Manifest"
       android:theme="@style/AppTheme">
       ...
</manifest>
```

## Kích thước

Android hỗ trợ nhiều đơn vị đo lường: **dp**, **sp**, **pt**, **px**, **mm** và **in**.

Trước đây, các nhà phát triển sử dụng pixel khi làm việc với giao diện máy tính. 
Nhưng với sự xuất hiện của mật độ hiển thị ngày càng đa dạng, cách tiếp cận này trở thành nguồn gốc của nhiều vấn đề.
Ở độ phân giải cao hơn, các phần tử trông rất nhỏ. Vì vậy, các đơn vị đo lường mới bắt đầu xuất hiện độc lập với độ phân giải màn hình.

Các pixel không phụ thuộc vào mật độ (dp) được điều chỉnh để mật độ màn hình có cùng kích thước vật lý giữa các thiết bị khác nhau. **Các nhà phát triển sử dụng chúng để chỉ định kích thước của các phần tử UI.**

**Pixel có thể mở rộng (sp) được thiết kế cho kích thước văn bản**. Chúng hoạt động tương tự như dp nhưng người dùng có thể điều chỉnh tỷ lệ trong Cài đặt Android.
Điều này cho phép người dùng thay đổi kích thước văn bản mà không cần điều chỉnh lại tỷ lệ toàn bộ user interface.

```xml
<resources>
    <dimen name="font_size">18sp</dimen>
    <dimen name="space">1dp</dimen>
    <dimen name="btn_size">100dp</dimen>
</resources>
```

Hệ thống tài nguyên truy xuất thứ nguyên và nhân nó với `resources.displayMetrics.density` cho `dp`,
hoặc bởi `resources.displayMetrics.scaledDensity` cho `sp`, cung cấp giá trị tính bằng pixel cho mật độ màn hình hiện tại và tùy chọn của người dùng.




























