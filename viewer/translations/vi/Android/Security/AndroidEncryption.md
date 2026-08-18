# Android encryption

## Kiến trúc mật mã Java

Android xây dựng trên Kiến trúc mật mã Java (JCA), 
cung cấp API cho chữ ký số, chứng chỉ, encryption, 
tạo và quản lý khóa.

![](../../resources/JCA.webp)

### KeyGenerator 
cung cấp API công khai để tạo khóa mật mã đối xứng.

### KeyPairGenerator 
một lớp công cụ có khả năng tạo ra khóa riêng và 
khóa công khai liên quan sử dụng thuật toán mà nó được khởi tạo.

### SecretKey 
một khóa bí mật (đối xứng). Mục đích của interface này là nhóm (và cung cấp loại an toàn cho)
tất cả các interface khóa bí mật (ví dụ: SecretKeySpec).

### PrivateKey 
một khóa riêng (không đối xứng). Mục đích của interface này là nhóm
(và cung cấp loại an toàn cho) tất cả các interface khóa riêng (ví dụ: RSAPrivateKey).

### PublicKey 
một khóa công khai. Interface này không chứa phương thức hoặc hằng số.
Nó chỉ phục vụ cho việc nhóm (và cung cấp loại an toàn cho) tất cả các interface khóa công khai (ví dụ: RSAPublicKey).

### KeyPair
lớp này là nơi chứa đơn giản cho một cặp khóa (khóa chung và khóa riêng).
Nó không thực thi bất kỳ bảo mật nào và khi được khởi tạo, nó phải được xử lý như PrivateKey.

### SecureRandom
tạo ra các số giả ngẫu nhiên được bảo mật bằng mật mã.
Chúng tôi sẽ không sử dụng nó trực tiếp trong loạt bài này nhưng nó được sử dụng rộng rãi bên trong KeyGenerator,
Triển khai các thành phần và Khóa KeyPairGenerator.

### KeyStore
cơ sở dữ liệu với cơ chế bảo vệ dữ liệu được bảo mật tốt,
được sử dụng để lưu, lấy và xóa khóa. Yêu cầu mật khẩu truy cập và mật khẩu cho mỗi phím.
Nói cách khác, đây là tệp được bảo vệ mà bạn cần tạo, đọc và cập nhật (với API được cung cấp).

### Chứng chỉ
chứng chỉ được sử dụng để xác thực và lưu các khóa bất đối xứng.

### Mật mã
cung cấp quyền truy cập vào việc triển khai mật mã mật mã cho encryption, 
giải mã, gói, giải nén và ký.

### Nhà cung cấp 
định nghĩa một tập hợp các triển khai có thể mở rộng, API độc lập. 
Nhà cung cấp là các nhóm Thuật toán khác nhau hoặc các tùy chỉnh của chúng. 
Có các nhà cung cấp bên 3d, chẳng hạn như Lâu đài Bouncy và Lâu đài xốp (phiên bản Android của Lâu đài Bouncy),
cũng như các nhà cung cấp có sẵn, chẳng hạn như phiên bản rút gọn của Bouncy Castle 


##KeyStore

Và trong phiên bản thứ 18 của Android, AndroidKeyStore đã được giới thiệu:

> Hệ thống Android Key Store cho phép bạn lưu trữ mật mã
các khóa trong một thùng chứa để khiến việc trích xuất khỏi thiết bị trở nên khó khăn hơn.

> Khi chìa khóa đã ở trong kho chìa khóa, 
chúng có thể được sử dụng cho các hoạt động mã hóa với tài liệu chính không thể xuất khẩu được.

> Hơn nữa, nó còn cung cấp các phương tiện để hạn chế thời điểm và cách thức sử dụng khóa,
chẳng hạn như yêu cầu xác thực người dùng để sử dụng khóa hoặc hạn chế khóa chỉ được sử dụng trong một số chế độ mật mã nhất định.


AndroidKeyStore là triển khai Nhà cung cấp JCA, trong đó:

> Nếu không có nó, trước Android 18, bạn sẽ cần tạo một tệp ở đâu đó trong máy cục bộ của mình 
hoặc bộ lưu trữ thiết bị bên ngoài, nơi tất cả các khóa của bạn sẽ được lưu giữ (như bạn có thể hiểu, 
thật dễ dàng để giải nén tập tin đó). Nhưng với AndroidKeyStore bạn không cần phải tạo bất cứ thứ gì, 
hệ thống sẽ quản lý mọi thứ cho bạn:

- Nếu nhà sản xuất thiết bị hỗ trợ Môi trường thực thi tin cậy (TEE), khóa của bạn sẽ được lưu ở đó (tùy chọn an toàn nhất);
- Nếu nhà sản xuất thiết bị không hỗ trợ TEE, khóa sẽ được lưu trữ trong môi trường phần mềm giả lập do hệ thống cung cấp.

## Màn hình khóa

Nếu bạn muốn bảo mật dữ liệu của mình - hãy bảo vệ thiết bị của bạn.

> Để an toàn hơn, trước khi cung cấp quyền truy cập vào bất kỳ tính năng nào của ứng dụng, chúng tôi có thể yêu cầu người dùng thiết lập Màn hình khóa thiết bị của mình (nếu chưa được thiết lập).
Ngoài ra một số tính năng khác mà chúng tôi sẽ xem xét sau trong loạt bài này, chẳng hạn như Vân tay, yêu cầu phải thiết lập màn hình khóa.

**Và có một dịch vụ hệ thống đặc biệt — KeyguardManager, có thể giúp chúng tôi thực hiện nhiệm vụ này.**

Ví dụ:

```kotlin
private val keyguardManager: KeyguardManager

init {
    keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
}

fun isDeviceSecure(): Boolean = if (hasMarshmallow()) keyguardManager.isDeviceSecure else keyguardManager.isKeyguardSecure

// Used to block application if no lock screen is setup.
fun showDeviceSecurityAlert(): AlertDialog {
    return AlertDialog.Builder(context)
            .setTitle(R.string.lock_title)
            .setMessage(R.string.lock_body)
            .setPositiveButton(R.string.lock_settings, { _, _ -> context.openLockScreenSettings() })
            .setNegativeButton(R.string.lock_exit, { _, _ -> System.exit(0) })
            .setCancelable(BuildConfig.DEBUG)
            .show()
}

fun hasMarshmallow() = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
```

- **Phương pháp isDeviceSecure**— kiểm tra xem thiết bị có được bảo mật bằng PIN, hình mở khóa hoặc mật khẩu hay không. Có sẵn từ API 23.
- **Phương pháp isKeyguardSecure**— kiểm tra xem bộ bảo vệ bàn phím có được bảo mật bằng PIN, hình mở khóa hoặc mật khẩu hoặc thẻ SIM hiện đang bị khóa hay không. 
Có sẵn từ API 16. Đây không phải là lựa chọn tốt nhất để sử dụng vì nó cũng đang kiểm tra xem thẻ SIM có bị khóa hay không, nhưng nó hoàn toàn tốt hơn là không có gì.

Cách sử dụng: 

```kotlion
  if (!systemServices.isDeviceSecure()) {
        deviceSecurityAlert = systemServices.showDeviceSecurityAlert()
    }
```


## Chọn khóa

Giờ đây, khi thiết bị được bảo mật bằng Màn hình khóa, chúng tôi có thể tập trung vào việc bảo vệ dữ liệu nhạy cảm của ứng dụng, như Mật khẩu chính của người dùng và Bí mật (xem [Encryption](../Security/Encryption.md)). Chúng tôi đã biết rằng encryption sẽ được sử dụng cho việc này. Và đầu tiên điều chúng ta cần làm là chọn Khóa (đối xứng, bất đối xứng) và Thuật toán để sử dụng.

Ngoài ra, chúng tôi biết rằng **Khóa đối xứng có sẵn từ Android 23+ API** và **Không đối xứng từ 18+ API**. Lựa chọn của chúng tôi có thể dự đoán được, **chúng tôi sẽ sử dụng Khóa bất đối xứng**, nhưng vẫn chọn thuật toán nào?
Cho phép tìm kiếm trợ giúp trong [Tài liệu](https://developer.android.com/reference/javax/crypto/Cipher)

**RSA — thuật toán khả dụng duy nhất mà chúng tôi có thể sử dụng, trong Cipher, cho Khóa bất đối xứng của Android Key Store, trên các thiết bị API 18+.**

## Lưu trữ khóa

Trên Android, khóa mật mã được lưu trữ trong theKeyStore:


```kotlin

private val keyStore: KeyStore = createAndroidKeyStore()

private fun createAndroidKeyStore(): KeyStore {
    val keyStore = KeyStore.getInstance("AndroidKeyStore")
    keyStore.load(null)
    return keyStore
}

```

Và có một phương thức getInstance("type"), giúp tạo phiên bản KeyStore với loại đã cho bằng cách duyệt qua danh sách Nhà cung cấp bảo mật đã đăng ký, bắt đầu từ nhà cung cấp được ưu tiên nhất. Chúng tôi sẽ tìm kiếm loại “AndroidKeyStore”.

Ngoài ra còn có một phương thức kết cấu KeyStore khác: getInstance("type", "provider") —trả về đối tượng KeyStore thuộc loại được chỉ định từ Nhà cung cấp được chỉ định.

Nhưng lưu ý, nếu có nhiều hơn thì một loại đã đăng ký ở các Nhà cung cấp khác nhau, có cùng tên, phương thức getInstance(“type”) sẽ trả về cho bạn kết quả khớp đầu tiên trong số đó. Và điều này có hai mặt khác nhau:

- Bạn (hoặc nhà cung cấp thiết bị chẳng hạn) có thể tạo Nhà cung cấp của riêng mình và đặt nó làm nhà cung cấp được ưu tiên nhất, chỉ bằng cách đặt vị trí của nó. Về mặt lý thuyết, điều này có thể dẫn đến một số nhầm lẫn, trong đó bạn sẽ nhận được sai loại kho khóa không mong đợi;
- Mặt khác, phương pháp này có thể được sử dụng để khắc phục một số vấn đề tương thích, trong đó hệ thống sẽ thêm cách triển khai loại AndroidKeyStore mới, giữ nguyên quy ước tên, vào một Nhà cung cấp khác (có thêm một Nhà cung cấp hệ thống, được gọi là “AndroidKeyStoreBCWorkaround”, chúng tôi sẽ xem xét nó trong đoạn “Encryption & Giải mã”). Điều này cho phép chúng tôi giữ nguyên mã, hoạt động, trên các API khác nhau, điều này khá thú vị.

Phương pháp getInstance(“type”) cho đến nay vẫn hoạt động tốt với tôi. Các mẫu [Tài liệu](https://developer.android.com/privacy-and-security/keystore#WorkingWithKeyStoreEntries) cũng đề cập đến phương pháp này, vì vậy tôi khuyên bạn nên sử dụng nó để lấy phiên bản KeyStore, thay vào đó là phương thức getInstance(“loại”, “nhà cung cấp”) thay thế.

Sau khi lấy phiên bản, bạn phải gọi phương thức load(loadStoreParameter), phương thức này sẽ tải dữ liệu lưu trữ khóa dựa trên providedProtectionParameter.

Các tham số bảo vệ có thể được sử dụng để kiểm tra tính toàn vẹn của dữ liệu lưu trữ khóa hoặc để bảo vệ tính bảo mật của dữ liệu lưu trữ khóa nhạy cảm (chẳng hạn như PrivateKey).

Trong trường hợp nhà cung cấp AndroidKeyStore, chúng tôi chỉ cần chuyển null làm tham số và hệ thống sẽ tải dữ liệu dưới vỏ bọc, dựa trên mã nhận dạng ứng dụng của chúng tôi.

## Tạo khóa

Trên Android, khóa mật mã bất đối xứng được tạo bằng **KeyPairGenerator**:

```kotlin
fun createAndroidKeyStoreAsymmetricKey(alias: String): KeyPair {
    val generator = KeyPairGenerator.getInstance("RSA", "AndroidKeyStore")

    if (SystemServices.hasMarshmallow()) {
        initGeneratorWithKeyGenParameterSpec(generator, alias)
    } else {
        initGeneratorWithKeyPairGeneratorSpec(generator, alias)
    }
    
    // Generates Key with given spec and saves it to the KeyStore
    return generator.generateKeyPair()
}
```

Tương tự như kho khóa, có một phương thức getInstance(“thuật toán”, “nhà cung cấp”) nên được sử dụng để tạo khóa.

Ngoài ra còn có một phiên bản đơn giản khác của phương pháp đó - getInstance(“thuật toán”) . **Không sử dụng nó**. Phương pháp này đang tìm kiếm thuật toán trong số tất cả các Nhà cung cấp hiện có và không giống như kho khóa, nơi chúng tôi đang sử dụng loại “AndroidKeyStore” khá độc đáo, tên thuật toán phổ biến ở các Nhà cung cấp khác nhau (“RSA” tồn tại ở hầu hết mọi nơi). Ở đây chúng ta cần xác định rõ ràng nhà cung cấp mà chúng ta muốn sử dụng.

Phiên bản KeyPairGenerator phải được khởi tạo với thông số kỹ thuật. **Trước M, nên sử dụng lớp KeyPairGeneratorSpec để cung cấp nó**:

```kotlin

private fun initGeneratorWithKeyPairGeneratorSpec(generator: KeyPairGenerator, alias: String) {
    val startDate = Calendar.getInstance()
    val endDate = Calendar.getInstance()
    endDate.add(Calendar.YEAR, 20)

    val builder = KeyPairGeneratorSpec.Builder(context)
          .setAlias(alias)
          .setSerialNumber(BigInteger.ONE)
          .setSubject(X500Principal("CN=${alias} CA Certificate"))
          .setStartDate(startDate.time)
          .setEndDate(endDate.time)

    generator.initialize(builder.build())
}

```

Trong Android Key Store, mỗi khóa phải có một mã định danh - bí danh. Nếu bạn đang cố lưu khóa vào kho khóa, với bí danh đã tồn tại, nó sẽ bị ghi đè bằng khóa mới. Sử dụng phương thức trình tạo setAlias() để cung cấp bí danh.


Khóa bất đối xứng **phải** được ký bằng chứng chỉ. Nó chủ yếu được sử dụng trong liên lạc client-server, trong đó client (hoặc server) đang xác minh chứng chỉ, để chắc chắn rằng server thực sự là người mà anh ta tuyên bố (và không phải là người ở giữa). Bạn sẽ không thể lưu khóa bất đối xứng nếu không có chứng chỉ.


**Nếu muốn sử dụng cả khóa chung và khóa riêng trong một ứng dụng thì bạn chỉ cần tạo chứng chỉ giả, tự ký.**

Chứng chỉ yêu cầu ngày bắt đầu và ngày kết thúc (thời hạn hiệu lực), có thể được đặt bằng các phương thức trình tạo setStartDate và setEndDate. Ngoài ra, bạn cần cung cấp số sê-ri và chủ đề của chứng chỉ, số này có thể được sử dụng với các phương thức xây dựng setSerialNumber và setSubject.

Sau khi cung cấp các chi tiết chính, hãy khởi tạo phiên bản theKeyPairGenerator với thông số kỹ thuật bằng phương thức khởi tạo (đặc tả).

**Trong phiên bản Marshmallow**, KeyGenParameterSpec đã được giới thiệu. **Nó được sử dụng để khởi tạo các khóa bất đối xứng và đối xứng. KeyPairGeneratorSpec không được dùng nữa.**

```kotlin
@TargetApi(Build.VERSION_CODES.M)
private fun initGeneratorWithKeyGenParameterSpec(generator: KeyPairGenerator, alias: String) {
    val builder = KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_ECB)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_PKCS1)
    generator.initialize(builder.build())
}
```

KeyGenParameterSpec yêu cầu chỉ định mục đích sử dụng khóa. Ví dụ: không thể sử dụng các khóa được tạo bằng KeyProperties.PURPOSE_ENCRYPT để giải mã.

Ngoài ra, bạn **phải** chỉ định chế độ khối và phần đệm encryption (xem Encryption, Chế độ & Phần đệm) mà bạn muốn sử dụng với khóa này. Sử dụng các phương thức xây dựng setBlockModes và setEncryptionPaddings cho việc đó.

**Không cần phải xác định chứng chỉ giả theo cách thủ công nữa, KeyGenParameterSpec sẽ tự động thực hiện việc này**. Bạn vẫn có thể tùy chỉnh các giá trị mặc định bằng:

```kotlin
.setCertificateNotBefore(startDate) // By default, this date is Jan 1 1970.
.setCertificateNotAfter(endDate) // By default, this date is Jan 1 2048.
.setCertificateSerialNumber(number) // By default, the serial number is 1.
.setCertificateSubject(x500Principal) // By default, the subject is CN=fake.
```

Cuối cùng, phiên bản whenKeyPairGenerator được khởi tạo với thông số kỹ thuật, sử dụng phương thức generateKeyPair() để tạo cặp khóa riêng-công khai. Trong nhà cung cấp Android Key Store, phương pháp này sẽ tự động lưu khóa trong KeyStore.

## Quản lý khóa

KeyStore cung cấp các phương thức giúp chúng ta quản lý các khóa đã lưu:

```kotlin
fun getAndroidKeyStoreAsymmetricKeyPair(alias: String): KeyPair? {
       val privateKey = keyStore.getKey(alias, null) as PrivateKey?
       val publicKey = keyStore.getCertificate(alias)?.publicKey

   return if (privateKey != null && publicKey != null) {
       KeyPair(publicKey, privateKey)
   } else {
       null
   }
}

fun removeAndroidKeyStoreKey(alias: String) = keyStore.deleteEntry(alias)
```

**getKey(“bí danh”, “mật khẩu”)** — trả về khóa có bí danh đã cho hoặc null nếu bí danh đã cho không tồn tại hoặc không xác định mục nhập liên quan đến khóa. Trong Android Key Store, không cần mật khẩu.

**getCertificate(“bí danh”)** — trả về chứng chỉ hoặc null nếu bí danh đã cho không tồn tại hoặc không chứa chứng chỉ.

**deleteEntry(“bí danh”)** — xóa khóa có bí danh đã cho. KeyStoreException
sẽ bị loại bỏ nếu mục nhập không thể được gỡ bỏ.

## Encryption & Giải mã

**Trên Android, encryption và quá trình giải mã được thực hiện bằng Cipher:**

```kotlin
companion object {
    var TRANSFORMATION_ASYMMETRIC = "RSA/ECB/PKCS1Padding"
}

val cipher: Cipher = Cipher.getInstance(transformation)
```

Có một phương thức getInstance(“chuyển đổi”) cơ cấu đang tìm kiếm sự chuyển đổi nhất định giữa các Nhà cung cấp hiện có (như trong các thành phần mật mã khác mà chúng tôi đã xem xét ở trên) và nên được sử dụng để tạo một phiên bản Mật mã.

**Việc chuyển đổi thể hiện thuật toán sẽ được sử dụng cho encryption hoặc giải mã, ở định dạng**: ”Thuật toán/Chế độ/Đệm”.

Phương thức getInstance(“chuyển đổi”, "nhà cung cấp"), trong đó bạn có thể chỉ định rõ ràng Nhà cung cấp, cũng tồn tại ở đây. **Nhưng lưu ý, bạn không nên sử dụng nó với Cipher.**

```kotlin
val transformation = "RSA/ECB/PKCS1Padding"
val provider = "AndroidKeyStore"
// API 19
val cipher: Cipher = Cipher.getInstance(transformation)
cipher.provider.name // AndroidOpenSSL
// API 23, 24
val cipher: Cipher = Cipher.getInstance(transformation)
cipher.provider.name // AndroidKeyStoreBCWorkaround
val cipher: Cipher = Cipher.getInstance(transformation, provider)
// throws java.security.NoSuchAlgorithmException: 
// Provider AndroidKeyStore does not provide RSA/ECB/PKCS1Padding
```
> [!TIP]
> Như bạn có thể thấy, về mặt kỹ thuật, nhà cung cấp AndroidKeyStore không cung cấp thuật toán RSA cho Mật mã. Thay vào đó, có các nhà cung cấp AndroidOpenSSL và AndroidKeyStoreBCWorkaround biết cách sử dụng khóa nhà cung cấp AndroidKeyStore cho thuật toán này.


Để bắt đầu làm việc với phiên bản Cipher, chúng ta cần khởi tạo nó cho hoạt động cụ thể bằng Khóa. Sử dụng phương thức init(mode, key) với Cipher.ENCRYPT_MODE để khởi tạo cho encryption:

```kotlin
fun encrypt(data: String, key: Key?): String {
    cipher.init(Cipher.ENCRYPT_MODE, key)
    val bytes = cipher.doFinal(data.toByteArray())
    return Base64.encodeToString(bytes, Base64.DEFAULT)
}
```

Hoặc sử dụng phương thức init(mode, key) với Cipher.DECRYPT_MODE để khởi tạo Cipher cho quá trình giải mã:

```kotlin
fun decrypt(data: String, key: Key?): String {
    cipher.init(Cipher.DECRYPT_MODE, key)
    val encryptedData = Base64.decode(data, Base64.DEFAULT)
    val decodedData = cipher.doFinal(encryptedData)
    return String(decodedData)
}
```

Sau khi khởi tạo, hãy sử dụng phương thức doFinal(data) để mã hóa hoặc giải mã process bằng Mật mã này.

Bạn có thể khởi tạo lại phiên bản mật mã đã tạo bao nhiêu lần tùy thích.

## Ví dụ sử dụng

Để tóm tắt mọi thứ chúng ta đang nói đến, hãy thử mã hóa và giải mã tin nhắn “Xin chào thế giới” đơn giản:

```kotlin

var message = "Hello Word"

// Creates Android Key Store and provides manage functions
private val keyStoreWrapper = KeyStoreWrapper(context)

// Create and Save asymmetric key
keyStoreWrapper.createAndroidKeyStoreAsymmetricKey("MASTER_KEY")

// Get key from keyStore
var masterKey = keyStoreWrapper.getAndroidKeyStoreAsymmetricKeyPair("MASTER_KEY")

// Creates Cipher with given transformation and provides encrypt and decrypt functions
var cipherWrapper = CipherWrapper("RSA/ECB/PKCS1Padding")

// Encrypt message with the key, using public key
var encryptedData = cipherWrapper.encrypt(data, masterKey?.public)

// Output is:
// aB9Ce9d5oM0/yloLQikOz8RovWHLmoQf3ovlCiz+D9+0/y7ZDfx6SpPYsKFIK3df079DNVIGVXIW
// 63CIUrrc7zLPMCCHCnzoeNJMqj2z0mFclluXzr5mCDJYfU/63yPeUpCPuo3y1SfXPPPNYJKhz2pq
// TugVE+rWoql9019BwTKtBy80nOE4RDQnMe6M9FWcSv/k6NyFtml9iwwtGVuRGXpSgh9humMWT0Cu
// MxzHusdIaRaviY4mQLFS+iIyRC3Riu0OxbkgTWpDs937Vfv3LSslJSo2CvwqFEnMGhkGvMdjtNhJ
// vGnpzMYN/rYWt/cer8nreURscXN7o3IR8ZtPkA==

// Decrypt message with the key, using private key
var decryptedData = cipherWrapper.decrypt(data, masterKey?.private)

// Output is:
// Hello Word

```
