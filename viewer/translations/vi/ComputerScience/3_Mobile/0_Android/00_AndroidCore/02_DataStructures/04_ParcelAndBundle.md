# Bưu Kiện Và Bundle

Thông thường, bạn cần chuyển một số đối tượng giữa các hoạt động, lưu trữ trạng thái nhất thời khi thay đổi cấu hình hoặc gửi đối tượng đến các thành phần hệ thống hoặc ứng dụng khác.

Trong Android, chúng tôi sử dụng `Bundle` để truyền dữ liệu đến các thành phần Android dưới dạng kho lưu trữ dữ liệu `key-value`. `Bundle` chỉ có thể chứa một số loại đối tượng nhất định:

- **Các loại nguyên thủy**
- **Chuỗi**
- **Có thể tuần tự hóa** (interface Java tiêu chuẩn)
- **Parcelable** (interface dành riêng cho Android)
- **Danh sách và mảng** thuộc các loại được liệt kê ở trên

Trong chủ đề này, chúng tôi sẽ tập trung vào các đối tượng `Parcelable`.

## Tại sao chúng ta cần Parcelable?

`Parcelable` là một cách tiếp cận dành riêng cho Android dành cho đối tượng serialization.
Nó được thiết kế với một số tối ưu hóa nhất định để hoạt động nhanh hơn giải pháp Java tiêu chuẩn, nhưng hiện tại đây không phải là mối quan tâm của chúng tôi, đặc biệt là khi bạn có thể đạt được tốc độ xấp xỉ bằng nhau. Vấn đề là với `Parcelable`, bạn có thể chắc chắn tại thời điểm biên dịch rằng đối tượng của bạn có thể thực sự được tuần tự hóa, điều này không xảy ra nếu bạn sử dụng Java serialization.


> [!NOTE]
> Đối tượng Serialization là process dùng để chuyển đổi một đối tượng thành định dạng có thể dễ dàng lưu trữ, truyền tải và tái tạo lại sau này. process này thường được sử dụng trong lập trình để lưu các đối tượng vào một tệp, gửi chúng qua mạng hoặc lưu trữ chúng trong cơ sở dữ liệu.

## Chúng tôi triển khai nó như thế nào?


Có hai cách đơn giản để triển khai `Parcelable` trong dự án của bạn.

- Bạn có thể tạo một lớp triển khai `Parcelable`, ghi đè một số phương thức và thêm trường tĩnh:

```kotlin
class Person(
    val id: String?,
    val name: String?,
    val age: Int,
) : Parcelable {
    override fun describeContents(): Int {
        return 0
    }

    override fun writeToParcel(dest: Parcel, flags: Int) {
        dest.writeString(id)
        dest.writeString(name)
        dest.writeInt(age)
    }

    companion object {
        @JvmField
        val CREATOR: Parcelable.Creator<Person> = object : Parcelable.Creator<Person> {
            override fun createFromParcel(parcel: Parcel): Person {
                // we retrieve values in the same order we put it in
                return Person(parcel.readString(), parcel.readString(), parcel.readInt())
            }

            override fun newArray(size: Int): Array<Person?> {
                return arrayOfNulls(size)
            }
        }
    }
}
```

- Ngoài ra, Kotlin còn cung cấp cho chúng ta một cách dễ dàng để tạo một lớp `Parcelable` hiện có. Chúng ta có thể sử dụng chú thích `@Parcelize` đặc biệt trên lớp. Giờ đây, bạn không phải lo lắng về việc ghi đè các phương thức `writeToParcel()` và `createFromParcel()` cũng như tạo trường `CREATOR` tĩnh — chúng sẽ được tạo tự động.

Để sử dụng chú thích này, bạn nên thêm một plugin mới vào tệp `build.gradle`:

```groovy
plugins {
    ...
    id 'kotlin-parcelize'
}
```

Hãy sửa đổi phiên bản trước của lớp `Person` bằng chú thích:

```kotlin
@Parcelize
class Person(
    val id: String,
    val name: String,
    val age: Int,
) : Parcelable
```

## Parcelable trong Bundle

Như chúng tôi đã nói trước đó, chúng tôi sử dụng `Bundle` để truyền dữ liệu giữa các hoạt động và các thành phần Android khác. `Bundle` có thể chứa Nguyên thủy, Chuỗi, mảng của chúng và `Parcelable`.

```kotlin
val bundle = Bundle()
bundle.putString("key", "value")
bundle.putParcelable("PersonKey", Person("0", "John", 22))
```
Và, chỉ cần đưa nó vào, chúng ta có thể truy xuất dữ liệu:

```kotlin
val stringValue = bundle.getString("key") // "value"
val parcelableValue = bundle.getParcelable<Person>("PersonKey") // Person("0", "John", 22)
```

Chúng ta có thể sử dụng nó ở đâu? Ví dụ: chúng tôi có thể truyền dữ liệu đến hoạt động của mình bằng `Intent`:

```kotlin
val intent = Intent(this, Activity::class.java)
val bundle = Bundle()
bundle.putString("key", "value")
intent.putExtras(bundle)
startActivity(intent)
```

Trong đoạn mã trước, chúng tôi đã thêm gói bằng phương thức `putExtras()`.
Nhưng nó hoạt động như thế nào? Trên thực tế, ý định có gói `Intent.extras` riêng chứa các giá trị của chúng tôi.
Nghĩa là, chúng ta có thể thêm `Parcelable` ngay vào Intent như thế này:

```kotlin
val intent = Intent(context, Destination::class.java)

intent.putExtra("person", Person("0", "John", 22))
context.startActivity(intent)
```

Và đây là cách chúng tôi lấy dữ liệu tại đích:

```kotlin
val person = if (Build.VERSION.SDK_INT >= 33) {
    // this is the new method but it could be used only with API >= 33
    intent.getParcelableExtra("person", Person::class.java)
} else {
    // the following method is deprecated in the API 33 but if your application minSdk < 33 you should use it
    intent.getParcelableExtra<Person>("person")
}
```

##PersistableBundle

Không giống như `Serializable`, `Parcelable` không được thiết kế để lưu trữ dữ liệu liên tục. 

Vì vậy, nếu bạn muốn lưu nó liên tục, bạn phải chuyển đổi qua lại thành một loại biểu diễn có thể lưu lại lâu dài.
Để giải quyết vấn đề này và sử dụng một lớp cho cả runtime và dữ liệu liên tục, bạn có thể sử dụng `PersistableBundle`.

Nó là một lớp liên tục ánh xạ các khóa chuỗi thành các loại khác nhau, có thể được lưu và sau đó lấy ra để sử dụng.
Tuy nhiên, `PersistableBundle` hỗ trợ ít loại hơn `Bundle`.

`Bundle` thông thường có thể chứa các loại dữ liệu tùy chỉnh khác nhau (và cũng phức tạp), nhưng có thể khó lưu dữ liệu đó một cách liên tục.

`PersistableBundle` hỗ trợ các loại sau:

- Int
- Dài
- Gấp đôi
- IntArray
- DoubleArray
- PersistableBundle
- Boolean

Nhưng làm thế nào chúng ta có thể viết nó liên tục ở đâu đó? Nếu ứng dụng của bạn chạy trên API >= 30,
bạn có thể sử dụng các phương thức `readFromStream()` và `writeToStream()` như thế này:

```kotlin
// Initialize OutputStream to the destination of your choice
val outputStream: OutputStream = ...

try {
    // Write serialized object to that destination
    persistableBundle.writeToStream(outputStream)
} finally {
    // Don't forget to close stream after you wrote your data
    outputStream.close()
}
// Initialize InputStream
// It is important that source file was written by writeToStream() of appropriate PersistableBundle,
// else it would be impossible to read
val inputStream: InputStream = ...

try {
    // Retrieve the object equal to original
    val retrievedPersistableBundle = PersistableBundle.readFromStream(inputStream)
} finally {
    // Close stream to avoid memory leaks
    inputStream.close()
}
```

nếu bạn muốn lưu trữ gói của mình liên tục, hãy chọn `PersistableBundle`.

































