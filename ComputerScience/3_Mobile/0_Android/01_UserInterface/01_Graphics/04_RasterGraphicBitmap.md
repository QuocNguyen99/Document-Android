# Bitmap

You're probably familiar with raster image formats like JPEG, PNG, GIF, and WebP already.
They all serve the same purpose: storing a matrix of pixel colors compactly using different compression algorithms

Compressing images is important, but the goal is to show them on screen.
And this is only possible for uncompressed pixel data, which takes several times more memory.
The data structure used for this purpose is called a **Bitmap**.

When any raster image is shown on the screen (such as inside an ImageView), it's decoded to a Bitmap first.
No matter whether it comes from resources, assets, files, the network, or anywhere else.

> [!NOTE]
> A raster is a method of representing an image using a grid of pixels. 

## The operations supported by Bitmaps 

### Decoding

If you have a file called `res/drawable/mountains.jpg`,
the `Resources.getDrawable(R.drawable.mountains)` invocation will return you a `BitmapDrawable`

You can also obtain a raster drawable resource directly as a Bitmap, without a Drawable wrapper. 

This is done by using `BitmapFactory.decode*`. 

`BitmapFactory` contains a bunch of other decoding methods like 
- `decodeFile`
- `decodeStream`
- `decodeByteArray`
- `decodeFileDescriptor`.
- `decodeResource`


### Resizing

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

The problem arises when the source image is too big to fit into application memory.
The image cannot be loaded fully, but it can still be downscaled on the fly thanks to the `inSampleSize` decoding option. 
For example, setting it to `2` means that every two by two pixel square of the original image will be merged into a single pixel. 

```kotlin
val quarter = BitmapFactory.decodeResource(
    context.resources,
    R.drawable.mountains,
    BitmapFactory.Options().apply {
        inSampleSize = 2
    }
)
```
Before we specify `inSampleSize` (how much smaller image we want),
we need to know the dimensions of the image and our target dimensions first.
And that's where `inJustDecodeBounds` option comes into play. 

When this option is set to `true` the chosen decode method performs a kind of "dry run",
> [!NOTE]
> A dry run in programming is a process where you manually walk through your code without actually executing it on a computer.

reading image dimensions into the provided options object without decoding the whole image:

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


If you're targeting SDK 28 and higher, it's also worth checking out the new [ImageDecoder](https://developer.android.com/reference/android/graphics/ImageDecoder) class.
And when you need some serious image-decoding machinery, you'd do well to start by looking at the third-party library such as [Picasso's BitmapUtils](https://github.com/square/picasso/blob/cbc5577ffe51c6bcc09c99e1d2780ca5b3bf78a6/picasso/src/main/java/com/squareup/picasso3/BitmapUtils.java)

### Exploring contents

Since every Bitmap is a **pixel matrix**, you can read the colors of individual pixels.
The colors of all four corners, for example:

```kotlin
val leftTop = bitmap.getPixel(0, 0)
val rightTop = bitmap.getPixel(bitmap.width - 1, 0)
val rightBottom = bitmap.getPixel(bitmap.width - 1, bitmap.height - 1)
val leftBottom = bitmap.getPixel(0, bitmap.height - 1)
```

So, how is this useful? Well, it depends.
For example, if all corner pixels are transparent (`Color.alpha(leftTop) == 0` and so on), then you can determine that the image probably has rounded corners.

> [!CAUTION]
Note that reading a single pixel is quite slow. So if you need to read hundreds of pixels
the [`getPixels(int[] pixels, 
                int offset, 
                int stride, 
                int x, 
                int y, 
                int width, 
                int height)`](https://developer.android.com/reference/android/graphics/Bitmap#getPixels(int[],%20int,%20int,%20int,%20int,%20int,%20int)) method will be dramatically faster.

### Drawing into

A Bitmap can be used as a drawing buffer. This is useful in many cases, such as:

- Augmenting an existing image (usually a photo): adding filters, watermarks, drawing lines and shapes with the user's fingers, adding text, or any other graphics.
- Converting Drawables into Bitmap Format (including vector ones). Useful for further analysis or applying custom effects
- Taking Screenshots of Your App
  - Full screenshot: Capture the entire view hierarchy
  - Partial screenshot: Capture a specific view
- Applying Custom Effects to Views. Basic effects like grayscale or color inversion can be done using `setLayerType`. More advanced effects, like blur, require converting the view into a `Bitmap` (before Android 12, where native blur support was introduced)

Bitmaps in Android can be mutable or immutable. 

To **draw into**, we need a mutable one. We can allocate an empty Bitmap, request that `BitmapFactory` returns a mutable `Bitmap`, or make a mutable copy of an existing `Bitmap`.

In our example, we will use `ARGB_8888` config. This means one byte per channel and four bytes per pixel, with transparency. It gives optimal color depth in most cases:

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
Now we can apply some changes to the Bitmap, such as:

- `Bitmap.setPixel(x, y, color)` to change the color of a single pixel.
- `Bitmap.setPixels(…)` to replace a specific region of a Bitmap or even the whole thing.
- `Bitmap.eraseColor(color)` to fill the whole Bitmap with a color. Unlike `Canvas.drawColor`, `eraseColor` involves no blending. This means that `canvas.drawColor(color)`: Blends the color with existing pixels, depending on the paint mode.

We could also wrap the `Bitmap` in a `Canvas` and apply drawing operations to it. This option is quite interesting, so let's take a closer look.

Canvas is a drawing surface. You can create one easily with `Canvas(bitmap)`. 
Then, every drawing operation is reflected on the `Bitmap`. The following snippet is an example of taking an arbitrary drawable and rasterizing it:

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
> Keep in mind that not every Drawable has intrinsic dimensions, and those that don't return -1. This isn't a valid createBitmap dimension, meaning an IllegalArgumentException will be thrown.

### Using as a shader

With `BitmapShader`, you can draw any shape you like and fill it with the specified Bitmap.
You can also choose whether to `CLAMP`, `REPEAT` or `MIRROR` the Bitmap, if the shape is bigger than the image. 

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
### Encoding

Now it's time to save the contents of a Bitmap.
You can obtain them with the `getPixels()` method, but the uncompressed int array would be very large. So it's better to use `compress()` to convert the Bitmap to one of the common raster formats (JPEG, PNG, or WebP) instead.

The `compress()` method accepts a `quality` value (0-100), and the `OutputStream` that will receive the image data.


```kotlin
FileOutputStream("/sdcard/edited.webp").use { os ->
    check(photo.compress(Bitmap.CompressFormat.WEBP, 90, os))
}
```




















