# Ứng dụng hệ thống và mục đích chung

Android cung cấp khả năng tích hợp liền mạch giữa các ứng dụng khác nhau mà có thể thậm chí không biết về nhau. 
Một ứng dụng chỉ nói những điều như "Tôi muốn người dùng chọn một bức ảnh,"
ứng dụng Thư viện sẽ trả lời “Tôi có thể thực hiện việc này” rồi trả lại ảnh do người dùng đã chọn cho ứng dụng người gọi.

Như bạn có thể nhớ, Activities được bắt đầu sử dụng Ý định có thể chứa hành động, dữ liệu, danh mục và tính năng bổ sung. 
Ở đây chúng ta sẽ thảo luận về cách sử dụng chúng để thực hiện các hành động phổ biến bên ngoài ứng dụng của bạn.


## Cháy và quên


Trường hợp đơn giản nhất của sự tương tác như vậy là bắt đầu một hoạt động mà không mong đợi bất kỳ kết quả nào.
Hiển thị một tài liệu, gọi điện thoại, gửi e-mail và đừng bận tâm đến những gì xảy ra sau đó.
Trong những trường hợp như vậy, chúng tôi chỉ `startActivity()` với mục đích phù hợp.

Ví dụ: để quay số, chúng ta chỉ cần làm như sau:

```kotlin
startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:+1234567890")))
```

Thao tác này sẽ mở ứng dụng quay số có số này cho phép người dùng bắt đầu cuộc gọi.

Có một hành động khác, `ACTION_CALL`, để bắt đầu cuộc gọi ngay lập tức.
Đó là một hành động **“nguy hiểm”** hơn nên bị hạn chế hơn, chẳng hạn như không thể thực hiện các cuộc gọi khẩn cấp.
Nhưng điều thú vị nhất là nếu một ứng dụng khai báo quyền `CALL_PHONE` trong Manifest thì quyền runtime phải được cấp.
Điều này cần được tính đến khi thêm quyền mới vào Manifest vì nó có thể phá vỡ một số mã hiện có.

Hiển thị một tài liệu cũng khá thú vị.
Khi trình duyệt mở một liên kết trong ứng dụng, nó sẽ tạo ra một ý định với `ACTION_VIEW` và `CATEGORY_BROWSABLE`.
Tín hiệu thứ hai cho thấy Activity chịu trách nhiệm xem nội dung liên kết hứa hẹn sẽ không làm bất kỳ điều gì có hại vì một trang web trên Internet có thể tạo bất kỳ liên kết nào có thể có như `delete://com.example.notes/1`.
Nếu có Activity có thể xử lý một liên kết như vậy, nó sẽ không được mở từ trình duyệt do thiếu danh mục `BROWSABLE`.

Điều quan trọng khác là loại nội dung. Sự khác biệt giữa các URL này là gì?

- https://hyperskill.org/

- https://assets.ubuntu.com/v1/b2a3e33f-ubuntu-server-guide-2023-06-19.pdf

- https://upload.wikimedia.org/wikipedia/commons/1/16/En-uk-to_study.ogg

Tất cả đều sử dụng cùng một giao thức, HTTPS. Tất cả đều có thể được mở trong trình duyệt. Nhưng PDF cũng có thể được mở trong ứng dụng đọc sách và .ogg có thể được mở trong trình phát âm thanh. Vì vậy, sự khác biệt là ở loại phương tiện truyền thông.

- văn bản/html

- ứng dụng/pdf

- âm thanh/ogg

Để tìm ứng dụng tốt nhất có thể để xem nội dung cụ thể, hãy xem xét cài đặt loại phương tiện cùng với URI.

```kotlin
startActivity(
    Intent(Intent.ACTION_VIEW)
        .setDataAndType(Uri.parse("https://hyperskill.org/"), "text/html")
        .addCategory(Intent.CATEGORY_BROWSABLE)
)
startActivity(
    Intent(Intent.ACTION_VIEW)
        .setDataAndType(Uri.parse("https://…/….pdf"), "application/pdf")
        .addCategory(Intent.CATEGORY_BROWSABLE)
)
startActivity(
    Intent(Intent.ACTION_VIEW)
        .setDataAndType(Uri.parse("https://…/….ogg"), "audio/*")
        .addCategory(Intent.CATEGORY_BROWSABLE)
)
```

> [!NOTE]
> Phần mở rộng tập tin không phải là thứ trên Internet, nó có thể sai hoặc không có. Các trình duyệt biết loại tài liệu từ tiêu đề HTTP Loại nội dung nhưng để nhận được nó, phải bắt đầu kết nối với máy chủ.
> Việc này không nhanh và không đảm bảo thành công, đó là lý do tại sao bạn nên biết trước loại phương tiện, ít nhất là phần rộng hơn, như âm thanh/*, video/*, hình ảnh/*.


Bây giờ sang một ví dụ khác, hãy cung cấp cho người dùng của chúng ta một nút để gửi e-mail kèm theo báo cáo lỗi. Theo tài liệu `ACTION_SEND` và `ACTION_SENDTO`, chúng tôi có thể chỉ định loại thông báo `text/plain` và chuyển địa chỉ, chủ đề thông báo cũng như chính thông báo đó dưới dạng phần bổ sung. Hãy thử nó!


```kotlin
startActivity(
    Intent(Intent.ACTION_SENDTO)
        .setDataAndType(Uri.parse("mailto:"), "text/plain")
        .putExtra(Intent.EXTRA_EMAIL, "support@app.example.com")
        .putExtra(Intent.EXTRA_SUBJECT, "Bug report")
        .putExtra(Intent.EXTRA_TEXT, "Hello! Using your app, " +
            "I've experienced that it does … while I expect it would do ….")
)
```


Cần có lược đồ mailto: URI để làm cho Android chỉ hiển thị các ứng dụng e-mail, như được đề xuất bởi hướng dẫn chính thức.

##Nhận kết quả

Để khởi chạy Activity và nhận kết quả, chúng tôi cần cấu trúc tương tự như khi yêu cầu quyền. Nói chung, nó trông như sau:

```kotlin
private val launcher = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
) { result ->
    
}
```

Sau đó, chúng tôi `.launch(input parameter)` và sau đó nhận kết quả cho hàm lambda.

Ví dụ: để chọn một hình ảnh từ Thư viện, chúng ta có thể dựa vào hợp đồng `PickVisualMedia` hiện có.


```kotlin
private val photoPicker = registerForActivityResult(
    ActivityResultContracts.PickVisualMedia()
) { result: Uri? ->

}

fun pickPhoto() {
    photoPicker.launch(
        PickVisualMediaRequest(
            ActivityResultContracts.PickVisualMedia.ImageOnly
        )
    )
}
```

`ActivityResultContract` là trình bao bọc an toàn về loại giúp bạn tạo Intent gửi đi và trích xuất dữ liệu từ kết quả khi hoạt động trở lại.

`PickVisualMedia` sử dụng `MediaStore.ACTION_PICK_IMAGES` hoặc `Intent.ACTION_OPEN_DOCUMENT`, tùy thuộc vào phiên bản Android hiện tại.

Để thay đổi cách xây dựng ý định, chẳng hạn như tạo bộ chọn và cho phép người dùng quyết định mở ứng dụng nào, chúng ta có thể ghi đè hàm createIntent trong hợp đồng.

```kotlin
private val photoPicker = registerForActivityResult(
    object : ActivityResultContracts.PickVisualMedia() {
        override fun createIntent(context: Context, input: PickVisualMediaRequest): Intent =
            Intent.createChooser(super.createIntent(context, input))
    }
) { result: Uri? ->

}
```

Có thể đọc nội dung tệp bằng `contentResolver.openInputStream(uri)`, như đã đề cập trong chủ đề `ContentResolver`.

## Cung cấp tập tin

Nếu chúng ta muốn gửi tệp đính kèm đến ứng dụng khác thì sao? Tệp có thể quá lớn để gửi nó vào bộ nhớ bên trong Intent.
Thay vào đó, chúng ta cần chuyển `Uri` của tệp.

Nếu chúng ta muốn ứng dụng Camera chụp ảnh cho chúng ta thì sao? Máy ảnh hiện đại tạo ra các tệp lớn không thể chuyển lại vào bộ nhớ.
Cả Máy ảnh đều không thể cung cấp cho chúng tôi Uri của ảnh: nó không biết sẽ lưu trữ ảnh được chụp cho ứng dụng của chúng tôi trong bao lâu. **Chúng ta cần tạo một tệp trống và cung cấp Uri của nó cho Camera**.

Trong cả hai trường hợp, chúng tôi chuyển `Uri` của một tệp.
Nhưng chúng tôi không thể chỉ sử dụng lược đồ `file://`: tệp này ở chế độ riêng tư đối với ứng dụng của chúng tôi, do đó những người khác không thể truy cập được. Chúng tôi sẽ cần tạo `ContentProvider` để mở quyền truy cập vào các tệp của chúng tôi thông qua `content://` Uris. AndroidX cung cấp cho chúng tôi `FileProvider`: `ContentProvider` cho chính xác nhiệm vụ này.

Tóm lại chúng ta cần trải qua các bước sau:

- định cấu hình đường dẫn tệp có thể truy cập thông qua nhà cung cấp của chúng tôi

- lớp con `FileProvider`, cung cấp cấu hình của chúng tôi cho nó và đăng ký nó trong Manifest

- yêu cầu `FileProvider` tạo `Uri` cho tệp

- bắt đầu một hoạt động, chuyển `Uri` tới `Intent`

Bây giờ đến mã.

Cấu hình được lưu trữ dưới dạng tài nguyên XML. Tạo một tệp, ví dụ: res`/xml/provider_paths.xml`.

```xml
<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">

    <!--
    For sending an attachment, share 'docs/' private files directory,
    publicly visible as 'docs'.
    -->
    <files-path name="docs" path="docs/" />

    <!--
    For requesting photo capture, share 'photos/' private cache directory
    and expose it as 'photos'.
    We use cache directory to avoid dangling file if we fail to delete it after use.
    -->
    <cache-path name="photos" path="photos/" />

</paths>
```

Bây giờ chúng ta cần phân lớp `FileProvider` và chuyển tài nguyên cấu hình ID cho hàm tạo của nó.

```kotlin
package com.example.app

class AppFileProvider : FileProvider(R.xml.provider_paths)
```

Và đăng ký nhà cung cấp trong Manifest trong thẻ <application>.


```xml
<provider
    android:name="com.example.app.AppFileProvider"
    android:authorities="${applicationId}.fileprovider"
    android:exported="false"
    android:grantUriPermissions="true" />
```

Như thường lệ, tên chỉ định lớp của chúng tôi.
Chính quyền là các giá trị nhận dạng được phân tách bằng dấu chấm phẩy để tham chiếu từ bên ngoài ứng dụng và `${applicationId}` là trình giữ chỗ sẽ được tự động mở rộng sang tên gói của chúng tôi, ví dụ: `com.example.app`.
Thuộc tính đã xuất được đặt thành `false` làm cho nhà cung cấp không thể nhìn thấy được từ bên ngoài, ngoại trừ các trường hợp khi chúng tôi chuyển `Uri` ra bên ngoài ứng dụng, ngầm cấp quyền.
Và đó chính là thuộc tính cuối cùng, `grantUriPermission`.

Tại thời điểm này, cuối cùng chúng ta cũng có thể chia sẻ tệp từ các thư mục được chỉ định. Mẫu này trông như sau:

```kotlin
val docsDir = File(context.filesDir, "docs"); 
val docFile = File(docsDir, "com.example company income and expenses.csv"); 
val docUri = getUriForFile(context, "${context.packageName}.fileprovider", docFile); 
```

Quay lại phần đính kèm e-mail, chúng ta chỉ có thể gửi `Uri` này dưới dạng `EXTRA_STREAM`. Ứng dụng E-mail sẽ nhận nội dung tệp của chúng tôi thông qua `FileProvider` mà chúng tôi đã thiết lập trước đó.

```kotlin
startActivity(
    Intent(Intent.ACTION_SENDTO)
        .setDataAndType(Uri.parse("mailto:"), "text/csv")
        .putExtra(Intent.EXTRA_EMAIL, "accountant@app.example.com")
        .putExtra(Intent.EXTRA_SUBJECT, "Annual report")
        .putExtra(Intent.EXTRA_STREAM, docUri)
)
```

Với ảnh, chúng ta cần một số hành động bổ sung:

1. tạo một tập tin tạm thời trước khi khởi chạy máy ảnh

2. giữ nguyên tên tệp khi thay đổi cấu hình hoặc tái tạo process (Máy ảnh sẽ tiêu tốn rất nhiều RAM)

3. đọc nội dung file sau khi nhận được kết quả.

Đó là rất nhiều! Hãy kết hợp tất cả các điểm lại với nhau:

```kotlin
private var photoFile: File? = null

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Do standard things you need,
    // like setContentView() in Activity.
    ...

    // Retrieve file path if we're being recreated.
    photoFile = savedInstanceState?.getString("photoFilePath")?.let(::File)
}

override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)

    // Remember file path before we're destroyed.
    outState.putString("photoFilePath", photoFile?.path)
}

// Create activity launcher using a predefined contract.
private val takePhoto = registerForActivityResult(
    ActivityResultContracts.TakePicture(),
    ::onPhotoTaken
)

private fun takePhoto() {
    // Set everything up to make a photo.
    val photosDir = File(context.cacheDir, "photos"); 
    photoFile = File.createTempFile(/*prefix*/"photo", /*suffix*/".jpg", photosDir);
    // createTempFile() will create an empty file
    // with unique name and the specified prefix and suffix in photosDir.
    // ".jpg" is just a guess, Camera don't guarantee a JPEG file.
    // If we pass null, the suffix will be ".tmp" but this won't affect anything.

    val fileUri = getUriForFile(context, "${context.packageName}.fileprovider", photoFile!!)

    // Start camera!
    takePhoto.launch(fileUri)
}

private fun onPhotoTaken(success: Boolean) {
    if (success) {
        // Use the image, for example,
        imageView.setImageDrawable(
            BitmapFactory.decodeFile(
                photoFile!!.path // should never be null
            )
        )
    }

    // Clean up after use.
    // Even if the user has refused to take a picture and we have !success,
    // the file was already created.
    photoFile!!.delete()

    // Forget nonexistent file.
    photoFile = null
}
```

Để có các tính năng nâng cao hơn như chia tỷ lệ và cắt xén ảnh, bạn có thể tìm kiếm các thư viện nguồn mở trong các danh mục sau: Máy ảnh, Bộ chọn hình ảnh, Bộ cắt hình ảnh.
Nếu bạn cần tải ảnh lên từ Thư viện, hãy xem thread về cách truyền dữ liệu `ContentResolver` vào `OkHttp`.

## Kết luận
Android mang đến cho chúng ta cơ hội tuyệt vời để gọi các ứng dụng của bên thứ ba và liên lạc với chúng.

Rất nhiều tính năng đã được các ứng dụng khác nhau triển khai và chúng tôi không cần phải phát minh lại chúng.

Trong chủ đề này, bạn đã học cách mở trình quay số, trình duyệt, trình xem và trình phát, ứng dụng e-mail, thư viện và máy ảnh. Nhưng đó chỉ là những ví dụ và cơ hội tuyệt vời để tìm hiểu cách sử dụng FileProvider. Còn nhiều [ý định chung được liệt kê trong tài liệu chính thức](https://developer.android.com/guide/components/intents-common), hãy tham khảo khi bạn cần.







## tài liệu tham khảo

- [Ứng dụng hệ thống và mục đích chung](https://hyperskill.org/learn/step/30746)