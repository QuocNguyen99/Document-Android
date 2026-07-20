# Băm và bảo mật

## Hàm băm

Hàm băm là các thuật toán lấy đầu vào và trả về đầu ra có độ dài cố định. 

## MD5 và SHA

`MD5` và `SHA` là hai trong số các hàm băm nổi tiếng và được sử dụng rộng rãi nhất. 

- `MD5`, viết tắt của "Thuật toán thông báo thông báo 5", tạo ra hàm băm `128-bit`.
- `SHA-256`, phiên bản an toàn hơn của `SHA`, tạo ra hàm băm `256-bit`, `SHA-1` tạo ra hàm băm 160 bit và `SHA-512` tạo ra hàm băm `512-bit`.


Mặc dù `MD5` nhanh hơn và tạo ra hàm băm ngắn hơn `SHA-512`, nhưng nó đã được chứng minh là dễ bị tấn công va chạm, trong đó hai đầu vào khác nhau tạo ra cùng một hàm băm.
Do đó, `MD5` đã không còn được sử dụng để thay thế cho các hàm băm an toàn hơn như `SHA-512`.

> [!IMPORTANT]
> Điều quan trọng cần lưu ý là các hàm băm cung cấp encryption một chiều, nghĩa là không thể truy xuất thông báo gốc từ hàm băm về mặt tính toán. Do đó, chúng chủ yếu được sử dụng để xác minh và so sánh hơn là giải mã.

## Lớp MessageDigest

Lớp `MessageDigest` trong Kotlin **là một phần của Kiến trúc mật mã Java (JCA)** và cung cấp chức năng cho các hàm băm mật mã.

Nó cho phép bạn tạo các phiên bản của các thuật toán băm khác nhau, chẳng hạn như `MD5`, `SHA-1`, `SHA-256`, `SHA-512`, v.v. 

**Công dụng chính** của lớp `MessageDigest` là tính giá trị băm (thông báo) của thông báo hoặc dữ liệu đầu vào nhất định. Điều này có thể hữu ích trong một số trường hợp, bao gồm:

1. **Lưu trữ mật khẩu**: Khi lưu trữ mật khẩu, best practice được coi là không lưu trữ chúng trực tiếp. Thay vào đó, bạn có thể sử dụng hash function như SHA-256 để tính toán hàm băm của mật khẩu và lưu trữ giá trị băm. Khi người dùng cố gắng đăng nhập, bạn có thể tính toán hàm băm của mật khẩu đã nhập và so sánh nó với hàm băm được lưu trữ để xác minh tính xác thực.

2. **Tính toàn vẹn của dữ liệu**: Hàm băm có thể được sử dụng để đảm bảo tính toàn vẹn của dữ liệu. Bằng cách tính toán hàm băm của một tệp hoặc tin nhắn trước khi truyền hoặc lưu trữ nó, sau này bạn có thể so sánh hàm băm được tính toán với dữ liệu nhận được để kiểm tra xem có bất kỳ sửa đổi hoặc giả mạo nào xảy ra hay không.

3. **Chữ ký số**: Chữ ký số sử dụng hàm băm để tạo ra giá trị băm duy nhất của tin nhắn hoặc tài liệu. Giá trị băm này sau đó được mã hóa bằng khóa riêng của người ký, tạo chữ ký số. Người nhận có thể sử dụng khóa chung của người ký để giải mã chữ ký và xác minh tính toàn vẹn cũng như tính xác thực của tin nhắn.

Để sử dụng lớp `MessageDigest` trong Kotlin, bạn cần làm theo các bước sau:

1. Lấy một phiên bản của lớp `MessageDigest` cho thuật toán mong muốn bằng phương pháp `getInstance()`, chỉ định tên thuật toán (ví dụ: "SHA-512").

2. Gọi phương thức `update()` trên phiên bản `MessageDigest` để cung cấp dữ liệu đầu vào hoặc thông báo cần băm. Bạn có thể cập nhật thông báo nhiều lần nếu cần.

> [!TIP]
> Đối với dữ liệu lớn, chẳng hạn như tệp, hãy sử dụng `update()` theo từng khối thay vì tải mọi thứ vào bộ nhớ cùng một lúc. Điều này giúp process đầu vào lớn một cách hiệu quả mà không sử dụng quá nhiều bộ nhớ.

3. Gọi phương thức `digest()` để tính giá trị băm cuối cùng dưới dạng một mảng byte.

Ví dụ: 

```kotlin
import java.security.MessageDigest

fun String.hash(mode: String): String {
    val bytes = this.toByteArray()
    val md = MessageDigest.getInstance(mode)
    val digest = md.digest(bytes)
    return digest.fold("", { str, it -> str + "%02x".format(it) })
}

fun main() {
    val password = "password"
    println("MD5: " + password.hash("MD5"))
    println("SHA-256: " + password.hash("SHA-256"))
    println("SHA-512: " + password.hash("SHA-512"))
}
```
Đầu ra:

```bash
MD5: 5f4dcc3b5aa765d61d8327deb882cf99
SHA-256: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
SHA-512: b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86
```

Hàm băm được tính toán có thể được sử dụng để kiểm tra tính toàn vẹn hoặc xác minh tính toàn vẹn của tệp.

```kotlin
import java.io.File
import java.security.MessageDigest

fun File.hash(algorithm: String): ByteArray {
    val digest = MessageDigest.getInstance(algorithm)
    this.inputStream().use { inputStream ->
        val bytes = inputStream.readBytes()
        digest.update(bytes)
    }
    return digest.digest()
}

fun main() {
    val file = File("path/to/your/file")
    val sha256 = file.hash("SHA-256")
    println("File hash SHA-256: ${sha256.joinToString("") { "%02x".format(it) }}")
}
```

```bash
File hash SHA-256: 6dcd4ce23d88e2ee95838f7b014b6284f4956a8e612c4f8fb229f2e8b004b5a6
```

##Bcrypt

Bcrypt là thư viện băm mật khẩu được thiết kế để bảo mật trước các cuộc tấn công vũ phu.


Bcrypt có tính thích ứng: khi sức mạnh tính toán tăng lên, chi phí tính toán của hàm băm có thể tăng lên. Ngoài ra, Bcrypt tự động tạo ra "muối" cho mỗi hàm băm, giúp ngăn chặn các cuộc tấn công từ điển và bảng cầu vồng.

> [!NOTE]
> Bảng Rainbow là một bảng được tính toán trước để lưu vào bộ đệm các kết quả đầu ra của cryptographic hash function, thường dùng để bẻ khóa các hàm băm mật khẩu. Mật khẩu thường được lưu trữ không phải ở dạng văn bản thuần túy mà ở dạng giá trị băm. Nếu cơ sở dữ liệu mật khẩu băm như vậy rơi vào tay kẻ tấn công, chúng có thể sử dụng bảng Rainbow được tính toán trước để khôi phục mật khẩu văn bản gốc. 

> [!NOTE]
> "Muối" là một giá trị ngẫu nhiên được thêm vào mật khẩu trước khi áp dụng hash function. Muối được lưu trữ cùng với hàm băm mật khẩu và được sử dụng để ngăn chặn các cuộc tấn công từ điển và bảng cầu vồng.


Sau đây là cách hoạt động: BCrypt hash function, chẳng hạn như `hashpw()`, trả về các giá trị khác nhau ngay cả đối với cùng một đầu vào vì nó kết hợp muối được tạo ngẫu nhiên trong quá trình băm process. 

Muối được thêm vào đầu vào trước khi băm, làm cho hàm băm thu được là duy nhất. Tính ngẫu nhiên và duy nhất của muối đảm bảo rằng ngay cả khi hai người dùng có cùng mật khẩu, giá trị băm của họ sẽ khác nhau. Để kiểm tra xem hai giá trị khác nhau có tương ứng với cùng một giá trị băm hay không, cần có một hàm cụ thể. 

BCrypt cung cấp chức năng kiểm tra, ví dụ: `checkpw()`, lấy giá trị đầu vào và giá trị băm được lưu trữ làm đối số. Nó trích xuất nội bộ muối từ hàm băm được lưu trữ, áp dụng nó vào đầu vào và băm lại đầu vào. Sau đó, nó so sánh hàm băm mới được tạo với hàm băm được lưu trữ. 

Nếu chúng khớp nhau, điều đó có nghĩa là các giá trị đầu vào tương ứng với cùng một giá trị băm, cho biết rằng đầu vào là chính xác. Chức năng này đảm bảo xác minh mật khẩu an toàn mà không để lộ hàm băm hoặc muối thực tế.


Chi phí tính toán của Bcrypt là sự cân bằng giữa tính bảo mật và hiệu quả. Chi phí cao hơn có nghĩa là các cuộc tấn công vũ phu sẽ chậm hơn, nhưng điều đó cũng có nghĩa là việc xác thực người dùng sẽ chậm hơn (giá trị muối cao hơn). Do đó, nên chọn chi phí đủ cao để ngăn chặn các cuộc tấn công nhưng không quá cao đến mức khiến ứng dụng hoạt động kém hiệu quả với giá trị muối phù hợp.

Để làm việc với BCrypt, chúng ta có thể sử dụng thư viện jBCrypt, có thể được cài đặt qua Gradle.

```kotlin
dependencies {
    implementation("org.mindrot:jbcrypt:0.4")
}
```


Trong ví dụ sau, chúng tôi trình bày cách sử dụng BCrypt để lấy hàm băm và xác minh nó dựa trên giá trị được lưu trữ:

```kotlin
import org.mindrot.jbcrypt.BCrypt

fun hashPassword(password: String): String {
    return BCrypt.hashpw(password, BCrypt.gensalt()) // we can use 10 or 12 as salt value
}

fun checkPassword(password: String, hashedPassword: String): Boolean {
    return BCrypt.checkpw(password, hashedPassword)
}

fun main() {
    val password = "MySuperPassword"
    val hashedPassword = hashPassword(password)

    println(checkPassword("MySuperPassword", hashedPassword))  // Returns true
    println(checkPassword("OtherPassword", hashedPassword))  // Returns false
}
```