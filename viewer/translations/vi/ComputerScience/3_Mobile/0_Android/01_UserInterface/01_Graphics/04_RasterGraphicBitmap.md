#Bitmap

Có thể bạn đã quen thuộc với các định dạng hình ảnh raster như JPEG, PNG, GIF và WebP.
Tất cả đều phục vụ cùng một mục đích: lưu trữ ma trận màu pixel một cách gọn gàng bằng các thuật toán nén khác nhau

Nén hình ảnh là quan trọng nhưng mục tiêu là hiển thị chúng trên màn hình.
Và điều này chỉ có thể thực hiện được đối với dữ liệu pixel không nén, dữ liệu này cần nhiều bộ nhớ hơn gấp nhiều lần.
data structure được sử dụng cho mục đích này được gọi là **Bitmap**.

Khi bất kỳ hình ảnh raster nào được hiển thị trên màn hình (chẳng hạn như bên trong ImageView), trước tiên, nó sẽ được giải mã thành Bitmap.
Bất kể nó đến từ tài nguyên, tài sản, tệp, mạng hay bất kỳ nơi nào khác.

> [!NOTE]
> Raster là phương pháp thể hiện hình ảnh bằng cách sử dụng lưới pixel. 

## Các hoạt động được hỗ trợ bởi Bitmap 

### Giải mã

Nếu bạn có một tệp có tên `res/drawable/mountains.jpg`,
lệnh gọi `Resources.getDrawable(R.drawable.mountains)` sẽ trả lại cho bạn `BitmapDrawable`

Bạn cũng có thể lấy trực tiếp tài nguyên có thể vẽ raster dưới dạng Bitmap mà không cần trình bao bọc Drawable. 

Điều này được thực hiện bằng cách sử dụng `BitmapFactory.decode*`. 

`BitmapFactory` chứa một loạt các phương pháp giải mã khác như 
- `decodeFile`
- `decodeStream`
- `decodeByteArray`
- `decodeFileDescriptor`.
- `decodeResource`


### Thay đổi kích thước

```kotlin
val original = BitmapFactory.decodeResource(
    context.resources,
    R.drawable.mountains,
)

val quarter = Bitmap.createScaledBitmap(
    original,
    original.width / 2,
    original.height / 2,
    true // use bilinear filtering for better quality
)
```

Vấn đề phát sinh khi hình ảnh nguồn quá lớn để vừa với bộ nhớ ứng dụng.
Hình ảnh không thể được tải đầy đủ nhưng vẫn có thể được thu nhỏ lại một cách nhanh chóng nhờ tùy chọn giải mã `inSampleSize`. 
Ví dụ: đặt thành `2` có nghĩa là cứ mỗi ô vuông hai x hai pixel của ảnh gốc sẽ được hợp nhất thành một pixel. 

```kotlin
val quarter = BitmapFactory.decodeResource(
    context.resources,
    R.drawable.mountains,
    BitmapFactory.Options().apply {
        inSampleSize = 2
    }
)
```
Trước khi chúng tôi chỉ định `inSampleSize` (chúng tôi muốn hình ảnh nhỏ hơn bao nhiêu),
Trước tiên chúng ta cần biết kích thước của hình ảnh và kích thước mục tiêu của chúng ta.
Và đó là lúc tùy chọn `inJustDecodeBounds` phát huy tác dụng. 

Khi tùy chọn này được đặt thành `true`, phương thức giải mã đã chọn sẽ thực hiện một kiểu "chạy thử",
> [!NOTE]
> Một cách chạy thử trong lập trình là process trong đó bạn duyệt mã theo cách thủ công mà không thực sự thực thi mã đó trên máy tính.

đọc kích thước hình ảnh vào đối tượng tùy chọn được cung cấp mà không giải mã toàn bộ hình ảnh:

```kotlin
val dimensions = BitmapFactory.Options().apply { 
    inJustDecodeBounds = true
}
BitmapFactory.decodeResource(
    context.resources,
    R.drawable.mountains,
    dimensions
)
val screenWidth = context.resources.displayMetrics.widthPixels
val notTooWide = BitmapFactory.decodeResource(
    context.resources,
    R.drawable.mountains,
    BitmapFactory.Options().apply {
        inSampleSize = dimensions.outWidth / screenWidth
    }
)
```


Nếu bạn đang nhắm mục tiêu SDK 28 trở lên, bạn cũng nên thử lớp [ImageDecoder](https://developer.android.com/reference/android/graphics/ImageDecoder) mới.
Và khi bạn cần một số công cụ giải mã hình ảnh nghiêm túc, bạn nên bắt đầu bằng cách xem thư viện của bên thứ ba, chẳng hạn như [Picasso's BitmapUtils](https://github.com/square/picasso/blob/cbc5577ffe51c6bcc09c99e1d2780ca5b3bf78a6/picasso/src/main/java/com/squareup/picasso3/BitmapUtils.java)

### Khám phá nội dung

Vì mỗi Bitmap đều là **ma trận pixel** nên bạn có thể đọc màu của từng pixel.
Màu sắc của cả bốn góc, ví dụ:

```kotlin
val leftTop = bitmap.getPixel(0, 0)
val rightTop = bitmap.getPixel(bitmap.width - 1, 0)
val rightBottom = bitmap.getPixel(bitmap.width - 1, bitmap.height - 1)
val leftBottom = bitmap.getPixel(0, bitmap.height - 1)
```

Vì vậy, điều này hữu ích như thế nào? Vâng, nó phụ thuộc.
Ví dụ: nếu tất cả các pixel ở góc đều trong suốt (`Color.alpha(leftTop) == 0`, v.v.), thì bạn có thể xác định rằng hình ảnh có thể có các góc được bo tròn.

> [!CAUTION]
Lưu ý rằng việc đọc một pixel khá chậm. Vì vậy, nếu bạn cần đọc hàng trăm pixel
các pixel [`getPixels(int[] pixel, 
                bù int, 
                bước tiến int, 
                int x, 
                int y, 
                chiều rộng int, 
                int Height)`](https://developer.android.com/reference/android/graphics/Bitmap#getPixels(int[],%20int,%20int,%20int,%20int,%20int,%20int)) sẽ nhanh hơn đáng kể.

### Vẽ vào

Bitmap có thể được sử dụng làm bộ đệm vẽ. Điều này rất hữu ích trong nhiều trường hợp, chẳng hạn như:

- Tăng cường hình ảnh hiện có (thường là ảnh): thêm bộ lọc, hình mờ, vẽ đường và hình bằng ngón tay của người dùng, thêm văn bản hoặc bất kỳ đồ họa nào khác.
- Chuyển đổi các Drawable sang định dạng Bitmap (bao gồm cả vectơ). Hữu ích cho việc phân tích sâu hơn hoặc áp dụng các hiệu ứng tùy chỉnh
- Chụp ảnh màn hình ứng dụng của bạn
  - Ảnh chụp màn hình đầy đủ: Chụp toàn bộ hệ thống phân cấp chế độ xem
  - Ảnh chụp màn hình một phần: Chụp một chế độ xem cụ thể
- Áp dụng hiệu ứng tùy chỉnh cho lượt xem. Các hiệu ứng cơ bản như thang độ xám hoặc đảo màu có thể được thực hiện bằng `setLayerType`. Các hiệu ứng nâng cao hơn, chẳng hạn như làm mờ, yêu cầu chuyển đổi chế độ xem thành `Bitmap` (trước Android 12, nơi giới thiệu hỗ trợ làm mờ gốc)

Bitmap trong Android có thể là mutable hoặc immutable. 

Để **rút vào**, chúng ta cần một chiếc mutable. Chúng tôi có thể phân bổ Bitmap trống, yêu cầu `BitmapFactory` trả về mutable `Bitmap` hoặc tạo bản sao mutable của `Bitmap` hiện có.

Trong ví dụ của chúng tôi, chúng tôi sẽ sử dụng cấu hình `ARGB_8888`. Điều này có nghĩa là một byte cho mỗi kênh và bốn byte cho mỗi pixel, có độ trong suốt. Nó mang lại độ sâu màu tối ưu trong hầu hết các trường hợp:

```kotlin
// A)
val blank = Bitmap.createBitmap(
    800, 600,
    Bitmap.Config.ARGB_8888
)

// B)
val mutable = BitmapFactory.decodeFile(
    "/sdcard/photo.jpg",
    BitmapFactory.Options().apply {
        inMutable = true
    }
)

// C)
val mutableCopy = anotherBitmap.copy(
    Bitmap.Config.ARGB_8888,
    /*isMutable =*/ true
)
```
Bây giờ chúng ta có thể áp dụng một số thay đổi cho Bitmap, chẳng hạn như:

- `Bitmap.setPixel(x, y, color)` để thay đổi màu của một pixel.
- `Bitmap.setPixels(…)` để thay thế một vùng cụ thể của Bitmap hoặc thậm chí toàn bộ.
- `Bitmap.eraseColor(color)` để tô toàn bộ Bitmap bằng một màu. Không giống như `Canvas.drawColor`, `eraseColor` không cần pha trộn. Điều này có nghĩa là `canvas.drawColor(color)`: Trộn màu với các pixel hiện có, tùy thuộc vào chế độ vẽ.

Chúng ta cũng có thể gói `Bitmap` trong `Canvas` và áp dụng các thao tác vẽ cho nó. Tùy chọn này khá thú vị, vì vậy chúng ta hãy xem xét kỹ hơn.

Canvas là một bề mặt vẽ. Bạn có thể tạo một cái dễ dàng với `Canvas(bitmap)`. 
Sau đó, mọi thao tác vẽ đều được phản ánh trên `Bitmap`. Đoạn mã sau đây là một ví dụ về việc lấy một đối tượng có thể vẽ tùy ý và rasterize nó:

```kotlin
fun Context.rasterize(@DrawableRes res: Int): Bitmap {
    val drawable = ContextCompat.getDrawable(this, res)!!
    drawable.setBounds(0, 0, drawable.intrinsicWidth, drawable.intrinsicHeight)
    val bitmap = Bitmap.createBitmap(
        drawable.intrinsicWidth, drawable.intrinsicHeight,
        Bitmap.Config.ARGB_8888
    )
    val canvas = Canvas(bitmap)
    drawable.draw(canvas)
    return bitmap
}
```

> [!CAUTION]
> Hãy nhớ rằng không phải mọi Drawable đều có thứ nguyên nội tại và những thứ nguyên không trả về -1. Đây không phải là thứ nguyên createBitmap hợp lệ, nghĩa là IllegalArgumentException sẽ bị loại bỏ.

### Dùng làm trình đổ bóng

Với `BitmapShader`, bạn có thể vẽ bất kỳ hình dạng nào bạn thích và tô màu nó bằng Bitmap được chỉ định.
Bạn cũng có thể chọn `CLAMP`, `REPEAT` hoặc `MIRROR` là Bitmap, nếu hình dạng lớn hơn hình ảnh. 

```kotlin
// First, we need a Bitmap.
// Let's draw a smirking cat which is, um, a text.
val paint = TextPaint(Paint.ANTI_ALIAS_FLAG)
    .also { it.textSize = resources.displayMetrics.scaledDensity * 30 }
val catSmirk = "😼"
// figure out the size of our cat
val catBounds = Rect().also { paint.getTextBounds(catSmirk, 0, catSmirk.length, it) }
// create a bitmap of according size and paint it black
val catBitmap = Bitmap.createBitmap(catBounds.width(), catBounds.height(), Bitmap.Config.ARGB_8888)
    .also { it.eraseColor(Color.BLACK) }
// draw our cat to a Bitmap with help of Canvas
Canvas(catBitmap).drawText(catSmirk, 0f, -catBounds.top.toFloat(), paint)

// now let's show a single cat and a BitmapShader example
setContentView(LinearLayout(this).apply {
    orientation = LinearLayout.HORIZONTAL

    // show single smiley
    addView(ImageView(context).apply {
        imageBitmap = catBitmap
        scaleType = ImageView.ScaleType.CENTER_INSIDE
    }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1f))

    // draw an oval filled with mirrored tiled bitmap
    addView(ImageView(context).apply {
        imageDrawable = object : Drawable() {
            init {
                // reuse the Paint instance
                paint.shader = BitmapShader(catBitmap, Shader.TileMode.MIRROR, Shader.TileMode.MIRROR)
            }
            override fun draw(canvas: Canvas) {
                val (l, t, r, b) = bounds
                canvas.drawOval(
                    l.toFloat(), t.toFloat(), r.toFloat(), b.toFloat(), // bounds
                    paint // paint with bitmap shader
                )
            }
            override fun setAlpha(alpha: Int) {}
            override fun setColorFilter(colorFilter: ColorFilter?) {}
            override fun getOpacity(): Int = PixelFormat.TRANSLUCENT

        }
    }, LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MATCH_PARENT, 1f))
})
```
### Mã hóa

Bây giờ là lúc lưu nội dung của Bitmap.
Bạn có thể lấy chúng bằng phương thức `getPixels()`, nhưng mảng int không nén sẽ rất lớn. Vì vậy, tốt hơn hết bạn nên sử dụng `compress()` để chuyển đổi Bitmap sang một trong các định dạng raster phổ biến (JPEG, PNG hoặc WebP).

Phương thức `compress()` chấp nhận giá trị `quality` (0-100) và `OutputStream` sẽ nhận dữ liệu hình ảnh.


```kotlin
FileOutputStream("/sdcard/edited.webp").use { os ->
    check(photo.compress(Bitmap.CompressFormat.WEBP, 90, os))
}
```




















