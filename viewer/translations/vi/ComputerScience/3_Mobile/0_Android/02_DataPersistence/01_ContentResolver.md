#ContentResolver

Các ứng dụng có thể trao đổi dữ liệu với nhau. 
Mọi hệ điều hành đều có bộ máy riêng để trao đổi dữ liệu cục bộ và Android không phải là ngoại lệ.

## Lý lịch

Trong hệ điều hành UNIX, bạn có thể nói chuyện với process đang chạy (thường là daemon) bằng cách sử dụng kênh được đặt tên,
đây là một loại tệp đặc biệt có thể truy cập được thông qua hệ thống tệp.
Hoặc bạn có thể mở một ổ cắm tới một số cổng đã biết 
(ví dụ: 5432 cho PostgreSQL hoặc 27015 cho Counter-Strike).

Tình hình ở Android lại khác: các quy trình nói chung có thời gian tồn tại ngắn và thời gian bắt đầu khá rẻ,
và các process nền có thể dễ dàng bị loại bỏ để giải phóng một số bộ nhớ cho ứng dụng hiển thị.
Điều đó có nghĩa là việc liên tục chờ đợi kết nối, việc tạo kênh và liên kết cổng trở nên khá phi thực tế. 
Mặt khác, Android có khái niệm về một ứng dụng có thể được xác định bằng tên gói và có sẵn để liên lạc với thế giới bên ngoài thông qua các thành phần được hiển thị trong tệp kê khai.
Điều này cho phép chúng tôi khởi động một ứng dụng nếu nó không chạy process, yêu cầu một số dữ liệu, truy xuất câu trả lời và rời khỏi phiên giao tiếp để cho phép Android OS tiêu diệt process nếu không cần thiết nữa.

Để cung cấp dữ liệu, Android có khái niệm ContentProvider.
Nó là một thành phần kê khai cho các hoạt động tệp và cơ sở dữ liệu do chủ sở hữu dữ liệu thực hiện.
Ví dụ: ứng dụng Điện thoại cung cấp lịch sử cuộc gọi và ứng dụng Thư viện cung cấp ảnh và video.
Trong chủ đề này, chúng ta sẽ nói về đối tác của nó, ContentResolver, cho phép truy xuất hoặc sửa đổi dữ liệu này mà không cần sở hữu nó.

## Truy vấn nội dung ứng dụng


Để thực hiện một truy vấn, chúng ta cần một số đối số:

- Nội dung `Uri` trỏ đến một số dữ liệu trong một nhà cung cấp cụ thể.
Nói chung, cú pháp Uri là `scheme://authority/path?query#fragment`, nhưng trong sơ đồ trường hợp của chúng tôi sẽ là nội dung, quyền hạn sẽ là mã định danh của content provider và phần đường dẫn dành riêng cho nhà cung cấp.

- `projection` tùy chọn, một mảng tên cột trong bảng cho câu lệnh SQL SELECT. Nếu không được chỉ định, được hiểu là SELECT *.

- `selection` tùy chọn và các đối số của nó cho mệnh đề SQL WHERE.

- Thứ tự `sort` tùy chọn cho mệnh đề SQL ORDER BY.


Tóm lại,
một truy vấn phải được diễn giải như phép chiếu `SELECT` `FROM` `some.application.provider/path` `WHERE` lựa chọn(args) `ORDER BY` sortOrder.
Hãy xem xét một ví dụ.

Bất kỳ ứng dụng nào cũng có thể khai báo các nhà cung cấp nội dung của riêng mình, nhưng cũng có một số nhà cung cấp nội dung được tích hợp sẵn.
Trong ví dụ của chúng tôi, chúng tôi sẽ sử dụng `MediaStore.Images.Media` tiêu chuẩn.

Giả sử chúng ta đã khai báo và cấp quyền `android.permission.READ_EXTERNAL_STORAGE` cần thiết,
hãy yêu cầu Thư viện cung cấp hình ảnh và xuất kết quả ra logcat:

```kotlin
contentResolver.query(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    arrayOf(
        MediaStore.Images.ImageColumns._ID,
        MediaStore.Images.ImageColumns.WIDTH,
        MediaStore.Images.ImageColumns.HEIGHT,
        MediaStore.Images.ImageColumns.DISPLAY_NAME,
    ),
    null, null, null,
)?.use { c ->
    while (c.moveToNext()) {
        println("#${c.getInt(0)} ${c.getInt(1)}x${c.getInt(2)} ${c.getString(3)}")
    }
}
```

Ở đây, contentResolver được yêu cầu trên đối tượng Ngữ cảnh,
`EXTERNAL_CONTENT_URI` là Uri bằng `content://media/external/images/media` và trỏ đến thư viện tích hợp,
`_ID`, `WIDTH`, `HEIGHT` và `DISPLAY_NAME` là tên cột và giá trị rỗng dành cho mệnh đề SQL `WHERE` và `ORDER BY`.
Bản thân hàm `query()` trả về một Con trỏ mà chúng ta sử dụng để truy xuất dữ liệu được yêu cầu.
Và đây là đầu ra mẫu:


```bash
#16381 960x640 IMG_20190612_094235_278.jpg
#16382 1280x1042 IMG_20190612_094319_554.jpg
#20160 960x1280 IMG_20190723_164455_836.jpg
#20184 1280x960 IMG_20190725_101159_817.jpg
#102052 1201x1600 IMG-6ebc062cbe3ae090471ad589956f3728-V.jpg
#106869 1080x1920 Screenshot_20210221-215728_Firefox.png
#114634 1080x1920 Screenshot_20210312-213908_Files.png
#114658 741x721 Drakeposting.jpg
#114679 1080x1920 Screenshot_20210408-025741_Fennec.png
#123136 1080x1920 Screenshot_20210423-000157_Telegram_FOSS.png
#123137 1080x1920 Screenshot_20210423-000208_Telegram_FOSS.png
#123208 1080x1920 Screenshot_20210530-023249_Fennec.png
#128659 300x300 1206-SMD-Resistor-1206-Resistor-.jpg
#132046 937x1070 Big_Smoke.jpg
#136196 1080x1920 Screenshot_20211013-150809_Telegram_FOSS.png
#136198 1080x1920 Screenshot_20211016-022700_Telegram_FOSS.png
#136233 1080x1920 Screenshot_20211109-131236_Slack.png
```

Nếu bạn cần hạn chế truy vấn bằng cách nào đó, đây là ví dụ về tìm nạp hình ảnh có chiều rộng và chiều cao lớn hơn 1000px và được sắp xếp theo khu vực:

```kotlin
Cursor query(
    Uri uri, 
    String[] projection, 
    String selection, 
    String[] selectionArgs, 
    String sortOrder
)
```


```kotlin
contentResolver.query(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    arrayOf(
        MediaStore.Images.ImageColumns._ID,
        MediaStore.Images.ImageColumns.WIDTH,
        MediaStore.Images.ImageColumns.HEIGHT,
        MediaStore.Images.ImageColumns.DISPLAY_NAME,
    ),
    "${MediaStore.Images.ImageColumns.WIDTH} > ? AND ${MediaStore.Images.ImageColumns.HEIGHT} > ?",
    arrayOf("1000", "1000"),
    MediaStore.Images.ImageColumns.WIDTH + " * " +
        MediaStore.Images.ImageColumns.HEIGHT,
)
```

Có sẵn đầy đủ các hoạt động CRUD, vì vậy bạn có thể sử dụng các chức năng chèn, cập nhật, xóa giống như SQLiteDatabase,
nếu chúng được hỗ trợ bởi ContentProvider cụ thể được sử dụng để phục vụ request của bạn.

## Sửa đổi dữ liệu

- **Xóa** không phải là khoa học tên lửa:
bạn chỉ cần chuyển `Uri` của một bản ghi cụ thể hoặc bảng `Uri` và điều kiện lọc cho hàm `delete()` và thế là xong.

- Các chức năng **Cập nhật** và **chèn** thú vị hơn nhiều vì chúng mang theo một số dữ liệu.
Nội dung hàng được đại diện bởi ContentValues.
Đây là một bản đồ không đồng nhất, tương tự như Bundle, nhưng hỗ trợ ít loại dữ liệu hơn.
Bộ loại bị hạn chế bởi cơ sở dữ liệu SQLite chỉ có thể xử lý
`INTEGER` (Byte..Long), `REAL` (Float..Double), `TEXT` (Chuỗi) và `BLOB` (ByteArray).
Kết quả là hàm `insert()` trả về Uri của hàng mới.
Khi xử lý `MediaStore`, chúng tôi `insert()` siêu dữ liệu, `openOutputStream()` và cung cấp nội dung đa phương tiện.

Ở dạng đơn giản, nó có thể trông như thế này:

```kotlin
val uri = contentResolver.insert(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    ContentValues().apply {
        put(MediaStore.Images.Media.TITLE, title)
        put(MediaStore.Images.Media.DESCRIPTION, description)
        put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
    }
)
contentResolver.openOutputStream(uri!!)!!.use { out -> 
    sourceFile.inputStream().use {
        it.copyTo(out)
    }
}
```
> [!NOTE]
> Trong thực tế, một hình ảnh có thể được chèn bằng hàm MediaStore.Images.Media.insertImage(), nhưng giờ đây bạn đã biết cách chèn dữ liệu vào bất kỳ content provider nào, không chỉ MediaStore.

## Thao tác với tệp

Trong ví dụ trước, **Uri đang trỏ đến một bảng cơ sở dữ liệu**.
**Một số Uris khác có thể trỏ đến các tệp**, nghĩa là bạn có thể đọc hoặc thậm chí ghi chúng bằng `ContentResolver`.
Lưu ý rằng bạn có thể không truy cập được mục nhập hệ thống tệp cơ bản,
hoặc thậm chí có thể không tồn tại nếu ContentProvider sử dụng một số hệ thống tệp ảo như tệp zip.
content provider phải được coi như một hộp đen che giấu bạn một số hoạt động triển khai.

Tiếp tục với ví dụ về Thư viện, các hình ảnh riêng biệt là các tệp. Uris trỏ đến chúng có thể được lấy theo nhiều cách, ví dụ:

- Bằng cách nối một đường dẫn với id. Một số chức năng tiện ích phục vụ mục đích này có sẵn.

```kotlin
val imageUri =
    ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, id)
```

- Bằng cách bắt đầu một hoạt động cho `Intent(Intent.ACTION_PICK, Media.EXTERNAL_CONTENT_URI)` để cho phép người dùng chọn một hình ảnh từ Thư viện.
Là kết quả của hoạt động, một Intent khác sẽ được trả về với ý định.data chứa Uri của hình ảnh đã chọn,
ví dụ: `content://media/external/images/media/149214`.


Chúng ta có thể làm gì với nó?


- **Hiển thị hình ảnh**: chỉ cần gọi imageView.setImageURI(intent.data) hoặc sử dụng thư viện thứ 3.

- **Lưu Uri và duy trì quyền truy cập vào nó** bằng cách gọi `contentResolver.takePersistableUriPermission`:
điều này sẽ làm cho dữ liệu đó có thể truy cập được khi khởi động lại thiết bị.
Hãy nhớ rằng điều này không làm cho dữ liệu bị khóa mà người dùng vẫn có thể xóa nó.

- Sao chép hình ảnh vào dữ liệu riêng tư của ứng dụng:
`contentResolver.openInputStream(intent.data)` sẽ trả về InputStream có thể đọc được từ,
và sao chép InputStream vào một tệp là một thao tác phổ biến.

- Lấy bộ mô tả tệp cho các thao tác tệp nâng cao:
Phương thức `contentResolver.openFileDescriptor` trả về `ParcelFileDescriptor`,
cho phép thực hiện các thao tác I/O tương tự như java.io.File. Tuy nhiên, không giống như `java.io.File`,
`ParcelFileDescriptor` có thể được chuyển giữa các ứng dụng vì đây là "Bưu kiện".
Dưới đây là ví dụ về ánh xạ bộ nhớ chỉ đọc để có quyền truy cập ngẫu nhiên vào nội dung tệp:

```kotlin
contentResolver.openFileDescriptor(intent.data!!, "r")!!.use {
    val buffer = FileInputStream(it.fileDescriptor)
        .channel.map(FileChannel.MapMode.READ_ONLY, 0, it.statSize)
}
```

Kỹ thuật này được lớp `MediaPlayer` sử dụng bởi vì, không giống như `InputStream` tuần tự đơn giản,
bộ mô tả tệp có thể cung cấp nguồn dữ liệu có thể tìm kiếm cần thiết để cho phép người dùng phát một số âm thanh hoặc video từ một điểm cụ thể, không chỉ từ đầu.


## Tệp và tài nguyên

`content://` không phải là sơ đồ `Uri` duy nhất được `ContentResolver` hỗ trợ.
Ngoài ra còn có `android.resource://` và `file://`.

Mở tệp theo cách này có vẻ không thực tế vì các tệp thông thường có thể được truy cập trực tiếp bằng `java.io.File`.
Tuy nhiên, cách tiếp cận này đảm bảo khả năng tương thích tốt hơn.
Ví dụ: một ứng dụng có thể trả về `content:// Uri` hoặc `file:// one`,
và người dùng nó sẽ không thấy có gì khác biệt.

Điều tương tự cũng áp dụng cho tài nguyên Uris: `android.resource://com.example.app/drawable/something_beautiful` hoặc `"android.resource://com.example.app/" + R.drawable.something_beautiful`
chỉ là những Uris bình thường có thể được xử lý theo cách tương tự như với `content://`.


## Gọi phương thức từ xa

Ngoài việc yêu cầu Con trỏ, chèn ContentValues hoặc trao đổi tệp,
Máy phân giải content provider hỗ trợ interface gọi phương thức từ xa đơn giản.
Có `call(uri: Uri, method: String, arg: String?, extras: Bundle?)`:
Bundle? phương thức cho phép ContentProviders triển khai các phương thức tùy chỉnh,
và để ContentResolvers gọi chúng và nhận kết quả.

## Kết luận

`ContentResolver` là một công cụ để tương tác với dữ liệu của các ứng dụng khác.
Nó hỗ trợ các hoạt động cơ sở dữ liệu CRUD, hoạt động tệp và các lệnh gọi phương thức tùy chỉnh.
Các hoạt động cơ sở dữ liệu được sử dụng rộng rãi trên Android OS để truy cập siêu dữ liệu phương tiện, nhật ký cuộc gọi, danh bạ,
từ điển và cài đặt của người dùng.
Toàn bộ danh sách các nhà cung cấp nội dung tích hợp đều có sẵn và có thể cực kỳ hữu ích trong một số trường hợp nhất định.
Thao tác với tệp là cần thiết để nhận được phương tiện quá lớn để có thể truyền dưới dạng chuỗi hoặc mảng byte,
và yêu cầu quyền truy cập ngẫu nhiên để có thể tìm kiếm được âm thanh và video.


## tài liệu tham khảo
- [ContentResolver](https://hyperskill.org/learn/step/24720)