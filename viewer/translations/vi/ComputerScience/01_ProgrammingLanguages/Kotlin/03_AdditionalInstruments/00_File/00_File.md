# Tài liệu

Lớp cốt lõi để xử lý tệp là **File** từ gói `java.io`. Kotlin cung cấp chức năng bổ sung khi triển khai Java thông qua **Chức năng mở rộng**. Điều này có nghĩa là chỉ cần nhập `java.io.File` vào dự án của mình, bạn có thể sử dụng chức năng từ cả triển khai Tệp Java và Kotlin. Chúng ta hãy xem xét kỹ hơn các chức năng mở rộng này.

### readText
Đầu tiên, có `readText()` giúp bạn đọc toàn bộ tệp chỉ bằng một biến `String`.

```kotlin
import java.io.File


val fileName = "src/reading.txt"
val lines = File(fileName).readText()
print(lines)
```

> [!CAUTION]
> Nếu chúng tôi cố đọc một tệp khác – `new.txt`. Nếu không có tệp như vậy trong hệ thống tệp thì `FileNotFoundException` sẽ bị ném ra.

Trên thực tế, biến `file` của chúng tôi không mở tệp mà chỉ cung cấp tham chiếu với đường dẫn đến tệp đó. Hơn thế nữa, `readText()` còn tự động mở và đóng tệp!


Chúng tôi cũng có thể cung cấp bộ ký tự cụ thể để đọc tệp:

```kotlin
val line = File(fileName).readText(Charsets.US_ASCII)
```

> [!TIP]
> Chỉ cần lưu ý rằng theo mặc định `readText()` có mã hóa bộ ký tự `UTF-8`, nhưng bạn có thể thay đổi nó bất cứ khi nào bạn muốn.

### readLines

Chức năng `readLines()` cung cấp chức năng đọc tất cả các dòng từ một tệp và lưu trữ chúng trong `List`:

```kotlin
val fileName = "src/reading.txt"
val lines = File(fileName).readLines()
for (line in lines){
    println(line)
} 
```

### readBytes


Hàm `readBytes()` có thể hữu ích nếu bạn cần lưu trữ nội dung tệp dưới dạng mảng byte:

> [!NOTE]
> Hàm này trả về `ByteArray`. Cấu trúc `Array` tương tự như `MutableList`, bạn không thể thay đổi kích thước của nó nhưng bạn có thể sửa đổi các phần tử. Bạn có thể dễ dàng chuyển đổi MutableList sang `ByteArray` và ngược lại với các chức năng `toByteArray()` và `toMutableList()`.

> [!CAUTION]
> Kotlin không khuyến nghị sử dụng các chức năng `readText`, `readLines`, `readBytes` với các tệp lớn hơn `2GB`, vì điều này có thể gây ra `OutOfMemoryError`.

### forEachLine

`forEachLine()` là cách được khuyên dùng để đọc các tệp lớn:

```kotlin
val fileName = "src/reading.txt"
File(fileName).forEachLine { println(it) }
```

Phương pháp đọc lambda này cung cấp một hành động (`println()` trong trường hợp của chúng tôi) cho mỗi dòng.



### Dấu tách tập tin

Trong ví dụ của chúng tôi, chúng tôi đã sử dụng biến `fileName` với giá trị đường dẫn `src/reading.txt`. 

> [!WARNING]
> Lưu ý rằng dấu phân cách đường dẫn tệp là ký tự phụ thuộc vào nền tảng. Ví dụ: đối với Windows, đó là `\`, và đối với UNIX và MAC thì đó là `/`.

Để tránh lỗi khi truy cập file, chúng ta có thể sử dụng `File.separator` từ thư viện `java.io.File`. `File.separator` trả về giá trị của dấu phân cách hệ thống tùy thuộc vào hệ thống được sử dụng. Vì vậy, ví dụ của chúng tôi có thể như sau:

```kotlin
val separator = File.separator
val fileName = "src${separator}reading.txt"
val lines = File(fileName).readLines()
for (line in lines){
    println(line)
}
```

### Ghi tập tin

Ghi tập tin với `writeText()`.  tạo một đối tượng `File(pathName: String)` và sử dụng hàm `writeText(text: String)` để đặt nội dung văn bản của tệp:


```kotlin
val myFile = File("MyFile.txt") //file name must be indicated in parentheses 
myFile.writeText("It is awfully hard work doing nothing!")
```

> [!TIP]
> Lưu ý, nếu bạn chỉ tạo một đối tượng Tệp, bạn sẽ không tạo một tệp, nó chỉ là một đối tượng.



> [!CAUTION]
> Luôn có khả năng tệp bạn sắp đọc hoặc ghi đã được mở trong một process khác hoặc có thể có các hạn chế truy cập. Trong những trường hợp như vậy, `AccessDeniedException` sẽ bị loại bỏ.

### Ghi đè và nối thêm

Để làm điều này, bạn có thể sử dụng tính năng tương tự `writeText()` cho `File()`, tính năng này chỉ định đường dẫn đến tài liệu mà chúng tôi muốn ghi đè. 

Được rồi, còn nếu bạn muốn giữ lại nội dung hiện tại dưới dạng `String` của tệp và thêm nội dung khác vào đó thì sao? Sau đó, chúng ta sẽ cần hàm `appendText(text: String)`

### Ghi mảng byte

Đôi khi bạn cần viết `Bytes` chứ không phải `Strings`. Chúng ta hãy xem xét ngắn gọn hai lựa chọn khác để ghi tập tin. 
- `writeBytes(array: ByteArray)` – với chức năng này, chúng ta có thể ghi một mảng byte vào tệp này.

```kotlin
val arrayOfBytes = byteArrayOf(1, 2, 3) // create an array
File(fileName).writeBytes(arrayOfBytes)
```
- `appendBytes(array: ByteArray)` – hàm này tương tự như phương thức `appendText()`, chỉ áp dụng cho mảng byte:

```kotlin
val arrayOfBytes = byteArrayOf(0, 1, 2)
File(fileName).appendBytes(arrayOfBytes)
```
## Phân cấp tệp
Bạn có thể sắp xếp dữ liệu bạn lưu trữ trên đĩa bằng cách sắp xếp các tệp vào các thư mục. Thư mục mẹ có thể bao gồm các thư mục khác, còn được gọi là thư mục con, dẫn đến hệ thống phân cấp tệp. 

### Tệp và Thư mục

Kotlin cung cấp nhiều phương pháp khác nhau để làm việc với các thư mục và tệp. Ví dụ: bạn có thể sử dụng thư viện `java.io`. Hãy xem xét một số phương pháp phổ biến nhất:

- `File.isDirectory` kiểm tra File có phải là thư mục hay không.

- `File.isFile` xác minh xem Tệp có thực sự là một tệp hay không.

- `File.exists()` kiểm tra sự tồn tại của tập tin.

- `File.resolve(String)` trả về một file có tên String trong thư mục -.

- `File.resolve(File)` trả về một File File từ một thư mục.

- `File.createNewFile()` tạo một tập tin mới.

- `File.mkdir()` tạo một thư mục mới.

### Các phương thức lặp qua phân cấp tệp

Bạn có thể điều hướng qua hệ thống phân cấp tệp bằng các phương thức `java.io.File`:

- `File.getParentFile()` trả về một thể hiện của `java.io.File` đại diện cho thư mục mẹ của một tập tin, hoặc `null` nếu tập tin không có cha (cho biết nó là thư mục gốc).

- `File.getParent()` trả về biểu diễn chuỗi của thư mục mẹ của một tệp hoặc `null` nếu tệp không có thư mục mẹ.

- `File.listFiles()` trả về một mảng các tệp nằm trong một thư mục nhất định hoặc `null` nếu phiên bản không phải là một thư mục.

- `File.list()` trả về một mảng các tệp và thư mục trong thư mục được chỉ định bởi tên đường dẫn trừu tượng này.

`kotlin.io` cung cấp các phương thức đặc biệt cho phép bạn xem toàn bộ hệ thống phân cấp tệp. Hãy xem xét ba phương pháp cơ bản:

- `File.walk(direction)`: `FileTreeWalk` cung cấp các tập tin và thư mục trong thư mục này mà bạn có thể truy cập; bạn cần chỉ định cách bạn sẽ lặp lại (lên hoặc xuống cấu trúc phân cấp).

- `File.walkBottomUp()`: `FileTreeWalk` cung cấp các thư mục và tập tin trong thư mục này mà bạn có thể truy cập. Nó sử dụng tìm kiếm theo chiều sâu, truy cập các thư mục sau khi tất cả các tệp của chúng đã được truy cập.

- `File.walkTopDown()`: `FileTreeWalk` cung cấp các thư mục và tập tin trong thư mục này để bạn truy cập. Tìm kiếm theo chiều sâu được sử dụng và các thư mục được truy cập trước tất cả các tệp của chúng.

Lớp `FileTreeWalk` được thiết kế thành `iterate` thông qua một hệ thống tệp nhất định. Nó cho phép bạn duyệt qua tất cả các tập tin trong một thư mục. Phương thức iterator trả về một iterator duyệt qua các tệp. Bạn có thể `iterate` qua cấu trúc này hoặc chuyển đổi nó thành danh sách có chức năng `toList()`.

## Con đường

Trong kotlin `Path` chuyển đổi chuỗi tên được chỉ định bằng chuỗi đường dẫn cơ sở và một số tên bổ sung của đường dẫn con thành đối tượng Đường dẫn của hệ thống tệp mặc định để thực hiện các thao tác cơ bản trên tệp và thư mục một cách dễ dàng. 

- `Path.listDirectoryEntries()`: lấy được danh sách các file trong một thư mục nhất định.

- `Path.copyTo()`: sao chép nguồn tới đích.

- `Path.moveTo()`: di chuyển file tới đích mới.

- `Path.writeText()`: tạo file văn bản mới.

- `Path.readText()`: đọc toàn bộ file dưới dạng chuỗi.

- `Path.readLines()`: đọc toàn bộ file dưới dạng collection các dòng.

- `Path.walk()`: để truy cập các thư mục theo cách đệ quy một cách hiệu quả.

- `Path.copyToRecursively()`: để sao chép toàn bộ thư mục và nội dung của nó sang một đường dẫn khác.


## Làm việc với hệ thống phân cấp tệp 

### Lấy nội dung thư mục và thư mục gốc/tệp gốc với `File` và `Path`

Hàm `Files.listFiles()` in nội dung (tệp và thư mục) của thư mục đã chọn 
bạn cũng có thể sử dụng `Path.listDirectoryEntries()`.

```kotlin
// with File
val helloWorld = File("/Files/CompletedProjects/HelloWorld")
val helloWorldFilesNames = helloWorld.listFiles().map{it.name} // [Doc.pdf, Reviews.txt]

val reviews = File("/Files/CompletedProjects/HelloWorld/Reviews.txt")
val reviewsFiles = reviews.listFiles() // null

val soundtracks = File("/Files/Music/SoundTracks")
val soundtracksFiles = soundtracks.listFiles() // []

// with Path
val helloWorld = Path("/Files/CompletedProjects/HelloWorld")
val helloWorldFilesNames = helloWorld.listDirectoryEntries().map { it.name } // [Doc.pdf, Reviews.txt]

val reviews = Path("/Files/CompletedProjects/HelloWorld/Reviews.txt")
val reviewsFiles = if (reviews.isDirectory()) reviews.listDirectoryEntries() else emptyList() // []

val soundtracks = Path("/Files/Music/SoundTracks")
val soundtracksFiles = if (soundtracks.isDirectory()) soundtracks.listDirectoryEntries() else emptyList() // []
```

`reviewsFiles` là `null` vì các bài đánh giá hoàn toàn không phải là một thư mục 
và không thể bao gồm các tệp hoặc thư mục con khác. 
Mặt khác, `soundtracks` là một thư mục không có tệp nên kết quả là một mảng trống.

Thuộc tính `File.parent` hoặc `Path.parent` cung cấp cho bạn tên gốc của tệp hoặc thư mục.


Thuộc tính `The File.parentFile` hoặc `Path.parentFile` cung cấp cấp độ gốc của tệp hoặc thư mục dưới dạng `File`.

Trước đây, chúng tôi đã đề cập đến phương pháp `File.walk(direction)` để phân cấp tệp.
Thuộc tính hướng phác thảo cách chúng ta duyệt qua hệ thống phân cấp tệp của mình; nó có thể là `FileWalkDirection.BOTTOM_UP` hoặc `FileWalkDirection.TOP_DOWN`.
Ngoài ra, bạn có thể sử dụng `Path.walk()` và sử dụng tùy chọn trình tự hoặc có thể lặp lại để thực hiện hướng.

```kotlin
// with File
val files: File = File("/Files")
println("TOP_DOWN: ")
files.walk(FileWalkDirection.TOP_DOWN).forEach { println(it) }

println("BOTTOM_UP: ")
files.walk(FileWalkDirection.BOTTOM_UP).forEach { println(it) }

// with Path
val dir: Path = Path("/Files")
println("TOP_DOWN: ")
dir.walk().forEach { println(it) }

println("BOTTOM_UP: ")
dir.walk().asIterable().reversed().forEach { println(it) }
```

Bạn có thể đạt được kết quả tương tự bằng cách sử dụng các phương pháp sau:

- `File.walkBottomUp()` (giống như `File.walk(FileWalkDirection.BOTTOM_UP)`);

- `File.walkTopDown()` (giống như `File.walk(FileWalkDirection.TOP_DOWN)`).

Do đó, ba phương pháp này cho phép chúng ta duyệt toàn bộ cấu trúc tệp theo cách đệ quy.

### Làm việc với hệ thống phân cấp

Giả sử chúng ta có một phiên bản `java.io.File` có tên `completedProjects`, tham chiếu đến thư mục `CompletedProjects`.
Bây giờ chúng ta sẽ có hai thư mục con chứa dữ liệu dự án.

```kotlin
// with File
val completedProjects: File = File("/Files/CompletedProjects")
val projects = completedProjects.walk()
projects.maxDepth(1) // HelloWorld and JCalculator

// with Path
val completedProjects: Path = Path("/Files/CompletedProjects")
val projects = Files.walk(completedProjects, 1)
```

Để tìm dự án `HelloWorld`, chúng ta sẽ duyệt qua cây tệp:

```kotlin
val helloWorldProject: File = projects.first { it.name == "HelloWorld" }
```

Bạn cũng có thể lấy thư mục `HelloWorld` bằng cách sử dụng phương thức `File.listFiles()`:

```kotlin
val helloWorldProject: File = completedProjects.listFiles().first { it.name == "HelloWorld" }
```

### Sao chép tập tin

Nếu bạn cần sao chép một tệp, hãy sử dụng chức năng `copyTo()`:

```kotlin 
// with File
val fileIn = File("newFile.txt")
val fileOut = File("copyNewFile")
fileIn.copyTo(fileOut)

// with Path
val fileIn = Path("newFile.txt")
val fileOut = Path("copyNewFile.txt")
fileIn.copyTo(fileOut)
```
Xin lưu ý rằng nếu bạn cần ghi đè lên tệp, bạn nên bao gồm tham số `overwrite`:

```kotlin
// With File
val fileIn = File("newFile.txt")
val fileOut = File("copyNewFile")
fileIn.copyTo(fileOut, overwrite = true)

// With Path
val fileIn = Path("newFile.txt")
val fileOut = Path("copyNewFile.txt")
fileIn.copyTo(fileOut, overwrite = true)
```

Để sao chép toàn bộ thư mục theo cách đệ quy, bạn có thể sử dụng hàm `copyRecursively()`:

```kotlin 
// with File
val fileIn = File("outDir")
val fileOut = File("newDir")
fileIn.copyRecursively(fileOut)

// with Path
val pathIn = Path("outDir")
val pathOut = Path("newDir")
pathIn.copyToRecursively(pathOut)
```

Hãy nhớ rằng nếu bạn cần ghi đè các thư mục và tệp, bạn cũng nên giới thiệu tham số `overwrite` hoặc theo các liên kết (chỉ trong Đường dẫn) với tùy chọn `followLinks`:

```kotlin 
// with File
val fileIn = File("outDir")
val fileOut = File("newDir")
fileIn.copyRecursively(fileOut, overwrite = true)

// with Path
val pathIn = Path("outDir")
val pathOut = Path("newDir")
pathIn.copyToRecursively(pathOut, overwrite = true, followLinks = true)
```

## Tệp và Đường dẫn: Khi nào nên sử dụng?

### `File` (java.io.File)
- Đại diện cho một tập tin hoặc thư mục.
- Được sử dụng cho **các thao tác tệp cơ bản** (kiểm tra sự tồn tại, xóa, tạo).
- **không xử lý được các thao tác đường dẫn phức tạp**.

### `Path` (java.nio.file.Path)
- Một cách mạnh mẽ hơn để xử lý đường dẫn tập tin.
- Hoạt động tốt với Đầu vào/Đầu ra (Tệp) mới của Java để vận hành tệp hiệu quả.
- Được khuyến nghị để xử lý các tệp lớn hoặc khi làm việc với đường dẫn tệp một cách linh hoạt.


### ZipFile với java.util.zip

Lớp `java.util.zip.ZipFile` trong Java API dùng để đọc các mục từ tệp ZIP.
Nó hoạt động như một điểm truy cập vào dữ liệu nén trong kho lưu trữ ZIP,
cho phép các nhà phát triển trích xuất các tập tin và thư mục một cách thuận tiện đồng thời quản lý tài nguyên một cách hiệu quả.

### Mở và truy cập ZipFile trong Java

Lớp The` java.util.zip.ZipFile` được sử dụng để đọc các mục từ tệp ZIP. 
Dưới đây là cách bạn có thể mở tệp ZIP và duyệt qua các mục của nó bằng interface `Enumeration`.


```kotlin 
import java.util.zip.ZipFile
import java.util.Enumeration
import java.util.zip.ZipEntry

fun openAndAccessZipFile(filePath: String) {
    // First, you need to create a `ZipFile` instance by specifying the file path of the ZIP file you want to open:
    val zipFile = ZipFile(filePath)
    //Once you have the `ZipFile` instance, you can get an enumeration of the ZIP file entries:
    val entries: Enumeration<*> = zipFile.entries()
    // Then, you can cycle through the entries using a while loop:
    while (entries.hasMoreElements()) {
        val entry = entries.nextElement() as ZipEntry
        println("Entry name: ${entry.name}")
        // Now you can extract the entry or read its contents
    }
    zipFile.close()
}

fun main() {
    try {
        val zipFilePath = "path/to/your/zipfile.zip"
        openAndAccessZipFile(zipFilePath)
    } catch (IOException e) {
        System.err.println("Error opening ZIP file: " + e.getMessage());
    }

}
```

### Đọc nội dung ZipEntry

Để đọc nội dung của `ZipEntry`, trước tiên bạn phải lấy `InputStream` cho mục nhập bằng phương pháp `getInputStream` của `ZipFile`.
Điều này cho phép bạn đọc byte từ mục nhập giống như bất kỳ luồng đầu vào nào khác trong Java.

```kotlin 
import java.util.zip.ZipFile;
import java.util.zip.ZipEntry;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ZipEntryReader {
    public static void main(String[] args) {
        String zipFilePath = "path/to/your/zipfile.zip";
        String entryName = "example.txt"; // Name of the ZipEntry you want to read

        try (ZipFile zipFile = new ZipFile(zipFilePath)) {
            ZipEntry entry = zipFile.getEntry(entryName);
            if (entry != null) {
                try (InputStream stream = zipFile.getInputStream(entry);
                     BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println(line);
                    }
                }
            } else {
                System.out.println("Entry not found in the zip file");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Trích xuất tệp từ ZipFile trong Java

Để trích xuất các tệp từ ZipFile sang một thư mục nhất định trong Java, hãy làm theo các bước sau:

```kotlin
//Open the zip file: Utilize the ZipFile class from the java.util.zip package to open the zip file.
ZipFile zipFile = new ZipFile("path/to/your.zip");
//Create Output Directory: Ensure the directory where you want to extract files exists or create it.
File destDir = new File("output/directory/path");
if (!destDir.exists()) {
    destDir.mkdir();
}
// Iterate through the entries: Get the ZIP file entries and iterate through them.
Enumeration<? extends ZipEntry> entries = zipFile.entries();
Explain code
while (entries.hasMoreElements()) {
    ZipEntry entry = entries.nextElement();
    File entryDestination = new File(destDir, entry.getName());
    if (entry.isDirectory()) {
        entryDestination.mkdirs();
    } else {
        entryDestination.getParentFile().mkdirs();
        InputStream in = zipFile.getInputStream(entry);
        OutputStream out = new FileOutputStream(entryDestination);
        IOUtils.copy(in, out); // Apache Commons IO
        in.close();
        out.close();
    }
}
// Handle IOException: Use try-catch blocks to handle potential IOExceptions.
try {
    // ... code to extract files ...
} catch (IOException e) {
    // ... handle exception ...
}
// Close the zip file: Lastly, remember to close the ZipFile.
zipFile.close();
```

> [!CAUTION]
> Đừng quên xử lý tài nguyên đúng cách để tránh rò rỉ. 
> Bạn có thể sử dụng câu lệnh try-with-resources để quản lý tài nguyên tự động.


