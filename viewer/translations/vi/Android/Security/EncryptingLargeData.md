# Mã hóa dữ liệu lớn


## Kích thước phím

Cho đến thời điểm này, chúng tôi đã cố gắng mã hóa tin nhắn nhỏ “Xin chào thế giới”. Hãy thử mã hóa cái lớn hơn, lớn hơn 250 ký hiệu. Ối, 

`IllegalBlockSizeException`.

RSA không được thiết kế để hoạt động với lượng dữ liệu lớn. Bạn chỉ có thể gửi tin nhắn process với độ dài giới hạn, điều này phụ thuộc vào kích thước khóa. Chìa khóa càng lớn thì thông điệp càng lớn có thể được mã hóa.

> [!IMPORTANT]  
> Xin lưu ý rằng việc sử dụng kích thước khóa lớn sẽ tăng thời gian encryption và có thể ảnh hưởng đến hiệu suất ứng dụng. Tránh dữ liệu lớn encryption trên ứng dụng chính thread.

Trong quá trình tạo khóa process, bạn có thể chỉ định kích thước khóa bằng phương thức setKeySize():

```kotlin
// On Marshmallow and higher (API 23+)
val builder = KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
builder.setKeySize(1024)

// On Kitkat and up to Marshmallow (API 19 - 22)
val builder = KeyPairGeneratorSpec.Builder(context)
builder.setKeySize(1024)
```
> [!WARNING]  
> Không thể tùy chỉnh kích thước khóa trên API 18, trong nhà cung cấp Android Key Store.

Kích thước khóa mặc định sẽ được sử dụng nếu không có gì được đặt thủ công. Giá trị mặc định có thể phụ thuộc vào nhà cung cấp và phiên bản nền tảng. Đối với khóa RSA, trong nhà cung cấp Android Key Store, khóa này là 2048-bit.

Các kích thước khóa RSA được hỗ trợ là: 512, 768, 1024, 2048, 3072, 4096. Kiểm tra thêm chi tiết về các thuật toán được hỗ trợ và kích thước khóa trong [tài liệu](https://developer.android.com/privacy-and-security/keystore#SupportedKeyPairGenerators).

Có một công thức mà bạn có thể sử dụng để tính độ dài tin nhắn RSA tối đa. Đối với khóa RSA n-bit (có phần đệm PKCS1), encryption trực tiếp hoạt động với các tin nhắn nhị phân tùy ý lên đến: `floor(n/8)-11 bytes`

##Phải làm gì

Tình huống khá tệ ở đây, không có khả năng sử dụng khóa bất đối xứng và đối xứng chỉ có sẵn từ API 23+. Và không có nhiều lựa chọn để lựa chọn, để thoát khỏi nó:

1. Tạo khóa đối xứng với một trong các Nhà cung cấp Java mặc định. Mã hóa/giải mã tin nhắn với nó. Sau đó mã hóa dữ liệu thô của khóa này bằng khóa chung RSA và lưu nó ở đâu đó vào đĩa. Khi giải mã, hãy lấy dữ liệu khóa thô được mã hóa, giải mã nó bằng khóa riêng RSA và sử dụng nó để giải mã tin nhắn.

2. Tách tin nhắn lớn thành từng phần và mã hóa/giải mã từng phần riêng lẻ.

Thật không may, ngay cả với chế độ ECB (trong quá trình triển khai của nhà cung cấp Android Key Store), thuật toán RSA chỉ có thể process một khối dữ liệu và nếu tin nhắn dài hơn một kích thước khối — nó sẽ bị lỗi.

Để giải quyết vấn đề này, bạn có thể tách dữ liệu theo cách thủ công và xử lý các phần của nó (mô phỏng chế độ ECB). Nhưng một lần nữa, RSA không được thiết kế cho những tác vụ như thế này.

Sẽ an toàn hơn nếu tiếp tục với tùy chọn đầu tiên.

## Nhà cung cấp mặc định


Và điều đầu tiên chúng ta sẽ làm là: tạo khóa đối xứng với một trong những Nhà cung cấp Java mặc định.


Nhà cung cấp Java mặc định phổ biến nhất trong Android là phiên bản rút gọn của nhà cung cấp BC được tạo bởi nhà cung cấp thư viện mật mã Java bên thứ ba nổi tiếng - Bouncy Castle.

```kotlin
fun generateDefaultSymmetricKey(): SecretKey {
    val keyGenerator = KeyGenerator.getInstance("AES", "BC")
    return keyGenerator.generateKey()
}
```

Lớp KeyGenerator chịu trách nhiệm tạo khóa đối xứng. Sử dụng một trong các phương thức getInstance() của nó để tạo một phiên bản của khóa AES.

Bạn có thể tìm nạp tất cả các nhà cung cấp có sẵn bằng cách gọi phương thức Security.getProviders():

```kotlin
Security.getProviders().forEach { logi(it.name) }
```


> [!NOTE]  
> Các nhà cung cấp có sẵn có thể khác nhau trên các nền tảng và nhà cung cấp khác nhau. Nếu nhà cung cấp mà bạn đang tìm kiếm không tồn tại trên thiết bị, bạn có thể đăng ký nhà cung cấp của riêng mình (hoặc một số bên thứ ba) bằng cách gọi một trong những:
```kotlin
Security.addProvider(provider)
// With this you are able to control the most preferred provider for
// your application. See Encryption in Android (Part 2)
Security.insertProviderAt(provider, position)
```
Hoặc bạn có thể sử dụng getInstance(algorithm) , điều này sẽ mang lại cho bạn cách triển khai ưu tiên nhất, dựa trên danh sách nhà cung cấp của bạn.

```kotlin
val keyGenerator = KeyGenerator.getInstance("AES")
// Providers List:
// 1. Android Key Store
// 2. Custom Provider
// 3. BC
// Will output BC, if Android Key Store and Custom Provider do not // have AES algorithm.
keyGenerator.provider.name
```

## Phím đối xứng

Về cơ bản, chúng tôi không có khóa đối xứng lên tới 23 API. Nhưng bắt đầu từ M, chúng ta chỉ có thể sử dụng một khóa đối xứng từ nhà cung cấp Android Key Store.

```kotlin

@TargetApi(23)
fun createAndroidKeyStoreSymmetricKey(alias: String): SecretKey {
    val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
    val builder = KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_CBC)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
    keyGenerator.init(builder.build())
    return keyGenerator.generateKey()
}

fun getAndroidKeyStoreSymmetricKey(alias: String): SecretKey? = keyStore.getKey(alias, null) as SecretKey?
``` 

Sử dụng KeyGenerator kết hợp với KeyGenParameterSpec để tạo một cái. Ngoài ra, đừng quên phép biến đổi Mật mã mà chúng ta sẽ cần cho encryption đối xứng:

```kotlin
companion object {
    var TRANSFORMATION_SYMMETRIC = "AES/CBC/PKCS7Padding"
}
```

## Gói chìa khóa

Để bảo vệ khóa AES của chúng tôi và lưu khóa này một cách an toàn trên bộ nhớ liên tục công khai của thiết bị (chẳng hạn như tùy chọn, tệp hoặc cơ sở dữ liệu), chúng tôi sẽ sử dụng khóa RSA được lưu trữ trong Android Key Store để mã hóa và giải mã khóa. process này còn được gọi là **gói khóa.**

```kotlin
fun wrapKey(keyToBeWrapped: Key, keyToWrapWith: Key?): String {
    cipher.init(Cipher.WRAP_MODE, keyToWrapWith)
    val decodedData = cipher.wrap(keyToBeWrapped)
    return Base64.encodeToString(decodedData, Base64.DEFAULT)
}
```

Đối với điều này, Cipher có phương thức WRAP_MODE và Wrap() riêng biệt. Để giải mã khóa, hãy sử dụng phương thức UNWRAP_MODE và unwrap().

```kotlin
fun unWrapKey(wrappedKeyData: String, algorithm: String, wrappedKeyType: Int, keyToUnWrapWith: Key?): Key {
    val encryptedKeyData = Base64.decode(wrappedKeyData, Base64.DEFAULT)
    cipher.init(Cipher.UNWRAP_MODE, keyToUnWrapWith)
    return cipher.unwrap(encryptedKeyData, algorithm, wrappedKeyType)
}
```

## Ví dụ sử dụng

Hãy thử mã hóa và giải mã tin nhắn lớn, sử dụng phương pháp mới:

```kotlin

val message = "Very large message, bigger then 250 symblos..."

// Simple Shared Preferences wrapper, will be used to save wrapped key
val storage = Storage(context)

// Creates Android Key Store and provides manage functions
val keyStoreWrapper = KeyStoreWrapper(context)
```

Chạy trên M trở lên, sử dụng một khóa đối xứng:


```kotlin
// Create and Save asymmetric key
keyStoreWrapper.createAndroidKeyStoreSymmetricKey("MASTER_KEY")
    
// Get key from keyStore
val masterKey = keyStoreWrapper.getAndroidKeyStoreSymmetricKey("MASTER_KEY")

// Creates Cipher with symmetric transformation and provides encrypt and decrypt functions
val cipher = CipherWrapper("AES/CBC/PKCS7Padding")
    
// Encrypt message  
val encryptedMessage = cipher.encrypt(message, masterKey)
  
// Decrypt message  
val decryptedMessage = cipher.decrypt(encryptedMessage, masterKey)

// Ooops, InvalidKeyException: no IV set when one expected
```

Trước M, sử dụng hai phím, bất đối xứng và đối xứng:

```kotlin


// Creates Cipher with asymmetric transformation and provides wrap and unwrap functions
val cipherForWrapping = CipherWrapper("RSA/ECB/PKCS1Padding")
    
// Creates Cipher with symmetric transformation and provides encrypt and decrypt functions
val cipherForEncryption = CipherWrapper("AES/CBC/PKCS7Padding")

// ---------------- Create Keys
    
// Create AES BC provider key  
val symmetricKey = keyStoreWrapper.generateDefaultSymmetricKey()
  
// Create RSA AndroidKeyStore Provider key and save it into keystore
val masterKey = keyStoreWrapper.createAndroidKeyStoreAsymmetricKey(MASTER_KEY)

// Wrap AES Secret key with RSA Public key 
val encryptedSymmetricKey = cipherForWrapping.wrapKey(symmetricKey, masterKey.public)
    
// And save it to Shared Preferences  
storage.saveEncryptionKey(encryptedSymmetricKey)
    
//----------------- Encrypt / Decrypt with keys
  
// Get RSA master key from Android Key Store
masterKey = keyStoreWrapper.getAndroidKeyStoreAsymmetricKeyPair("MASTER_KEY")

// Get AES wrapped raw data from preferences
val encryptionKey = storage.getEncryptionKey()

// Unwrap AES key data with RSA Private key
symmetricKey = cipherForWrapping.unWrapKey(encryptionKey, ALGORITHM_AES, Cipher.SECRET_KEY, masterKey?.private) as SecretKey
  
// Encrypt message with AES Secret key
val encryptedMessage = cipherForEncryption.encrypt(message, symmetricKey)
  
// Encrypt message with AES Secret key
val decryptedMessage = cipherForEncryption.decrypt(encryptedMessage, symmetricKey)

// Ooops, InvalidKeyException: no IV set when one expected
```

## Vector khởi tạo

Vector khởi tạo là đầu vào có kích thước cố định cho nguyên thủy mật mã. Nó thường được yêu cầu là ngẫu nhiên hoặc giả ngẫu nhiên. Mục đích của IV là cho phép sử dụng cùng một khóa để mã hóa một số tin nhắn riêng biệt.

Và nó được yêu cầu cho các chế độ thuật toán khối (như CBC trong AES) ở hầu hết các nhà cung cấp, bao gồm nhà cung cấp AndroidKeyStore cũng như nhà cung cấp BC.

Trên API 18, với khóa nhà cung cấp BC mặc định của Java, nếu IV không được chỉ định trong quá trình giải mã, Cipher sẽ rơi vào `IllegalArgumentException: Passed data is incorrect. There was no IV specified with it`

Trên API 23, với khóa nhà cung cấp AndroidKeyStore, InvalidKeyException sẽ được đưa ra:

`InvalidKeyException: IV required when decrypting. Use IvParameterSpec or AlgorithmParameters to provide it.`

## Giá trị mặc định

Cách dễ nhất để triển khai hỗ trợ Vector khởi tạo là sử dụng dữ liệu mảng byte được Mật mã tạo ra trong encryption. Nó có thể được truy xuất bằng phương thức cipher.getIV():

```kotlin
cipher.init(Cipher.ENCRYPT_MODE, key)
val iv = cipher.iv // returns automatically generated IV value
...
// Encrypt data with Cipher
```
> [!NOTE]  
> Giá trị mặc định được tạo trong quá trình khởi tạo Cipher, vì vậy cipher.init() phải được gọi trước, nếu không cipher.getIv() sẽ trả về dữ liệu trống.

Sau đó, trong quá trình giải mã, hãy khởi tạo Mật mã với IvParameterSpec được tạo từ giá trị IV được tạo:

```kotlin
val ivSpec = IvParameterSpec(iv)
cipher.init(Cipher.DECRYPT_MODE, key, ivSpec)
...
// Decrypt data using Cipher, initialized with IV
```

Giống như giá trị Salt, Vector khởi tạo có thể được lưu trữ trong bộ lưu trữ công cộng cùng với dữ liệu được mã hóa.

Và một trong những cách khả thi để lưu trữ nó là thêm dữ liệu IV vào kết quả encryption:

```kotlin
fun encrypt(data: String, key: Key?, useInitializationVector: Boolean = false): String {
    cipher.init(Cipher.ENCRYPT_MODE, key)

    var result = ""
    if (useInitializationVector) {
        val iv = cipher.iv
        val ivString = Base64.encodeToString(iv, Base64.DEFAULT)
        result = ivString + IV_SEPARATOR
    }
    val bytes = cipher.doFinal(data.toByteArray())
    result += Base64.encodeToString(bytes, Base64.DEFAULT)

    return result
}
```

Và phân tích nó trước khi giải mã, từ dữ liệu được mã hóa:

```kotlin
fun decrypt(data: String, key: Key?, useInitializationVector: Boolean = false): String {
    var encodedString: String

    if (useInitializationVector) {
        val split = data.split(IV_SEPARATOR.toRegex())
        if (split.size != 2) throw IllegalArgumentException("Passed data is incorrect. There was no IV specified with it.")

        val ivString = split[0]
        encodedString = split[1]
        val ivSpec = IvParameterSpec(Base64.decode(ivString, Base64.DEFAULT))
        cipher.init(Cipher.DECRYPT_MODE, key, ivSpec)
    } else {
        encodedString = data
        cipher.init(Cipher.DECRYPT_MODE, key)
    }

    val encryptedData = Base64.decode(encodedString, Base64.DEFAULT)
    val decodedData = cipher.doFinal(encryptedData)
    return String(decodedData)
}
```

## Giá trị tùy chỉnh

Như Dorian Cussen đã đề cập trong blog của mình, giá trị IV mặc định do Cipher cung cấp chủ yếu phụ thuộc vào việc triển khai Nhà cung cấp.

Có thể phải đối mặt với [tình huống](https://stackoverflow.com/questions/31036780/android-cryptography-api-not-generating-safe-iv-for-aes) khi cipher.getIV() không được triển khai - trả về mảng “trống” hoặc rỗng.

Để đảm bảo an toàn và tránh khoảnh khắc khó chịu như vậy - hãy khai báo rõ ràng một Vector khởi tạo, sử dụng lớp SecureRandom.

Để tạo giá trị IV tùy chỉnh, hãy sử dụng phương thức nextBytes(byte[] key), từ lớp SecureRandom :

```kotlin
SecureRandom r = new SecureRandom();
byte[] ivBytes = new byte[16];
r.nextBytes(ivBytes);
```

ivLength phụ thuộc vào chế độ hoạt động. Và đối với hầu hết các chế độ, bao gồm CBC, IV phải có cùng độ dài với khối trong đó. Thuật toán AES sử dụng các khối 128 bit nên độ dài của Vector khởi tạo bằng 128 bit (ivLength = 16// byte).

Khi giá trị IV tùy chỉnh được tạo, chỉ cần khởi tạo phiên bản Cipher với nó:

```kotlin
cipher.init(Cipher.ENCRYPT_MODE, key, IvParameterSpec(iv))
cipher.init(Cipher.DECRYPT_MODE, key, IvParameterSpec(iv))
```

Lưu ý, giá trị được tạo phải được chuyển vào phương thức init() cho cả chế độ encryption và chế độ giải mã.

## Giá trị trống

Có thể, nhưng không được khuyến khích, gian lận trên Cipher. Thay vì tạo dữ liệu của Vector khởi tạo ngẫu nhiên mới mỗi lần trước encryption, sau đó lưu và phân tích cú pháp trước khi giải mã, IV có thể được khởi tạo một lần, dưới dạng một mảng, với độ dài cố định của các giá trị tĩnh và được sử dụng ở mọi nơi, mọi lúc:

```kotlin
// Create an array of 16 bytes, filled with 0 [0, 0, 0, 0 ..0]
val iv = ByteArray(16)
// Use this array during encryption and decryption as IV data
cipher.init(Cipher.ENCRYPT_MODE, key, IvParameterSpec(iv))
cipher.init(Cipher.DECRYPT_MODE, key, IvParameterSpec(iv))
```

Hãy nhớ rằng việc triển khai này sẽ giết chết bản chất của IV.

## Encryption ngẫu nhiên

Để bảo vệ dữ liệu của người dùng khỏi việc sử dụng IV không chính xác (không phải ngẫu nhiên hoặc trống), theo mặc định, Nhà cung cấp AndroidKeyStore không cho phép sử dụng các giá trị IV tùy chỉnh:

```kotlin
val iv = ByteArray(16)
cipher.init(Cipher.ENCRYPT_MODE, key, IvParameterSpec(iv))
// will throw InvalidAlgorithmParameterException: Caller-provided IV // not permitted
cipher.doFinal(data.toByteArray())
```
Trên API 23, phương thức setRandomizedEncryptionRequired đã được thêm vào lớp KeyGenParameterSpec, phương thức này sẽ cho phép bạn kiểm soát xem IV có thể tùy chỉnh hay không. Từ tài liệu:
>Đặt xem encryption sử dụng khóa này có phải được ngẫu nhiên hóa đủ để tạo ra các bản mã khác nhau cho cùng một bản rõ mọi lúc hay không.
Khi cần có IND-CPA: trong các chế độ khối sử dụng IV, chẳng hạn như GCM, CBC và CTR, các IV do người gọi cung cấp sẽ bị từ chối khi mã hóa, để đảm bảo rằng chỉ sử dụng các IV ngẫu nhiên.


```kotlin
val builder = KeyGenParameterSpec.Builder()
// Forces to use only Default Generated, by Cipher, IV.
// Default value.
builder.setRandomizedEncryptionRequired(true)
// Enables to use Custom Generated IV's.
// Not working.
builder.setRandomizedEncryptionRequired(false)
```

***Nhưng nó không hoạt động***, (ít nhất là đối với AES và CBC). Ngay cả sau khi tắt tính năng ngẫu nhiên hóa, Cipher vẫn gặp sự cố với InvalidAlgorithmParameterException và tiếp tục yêu cầu Vector khởi tạo mặc định.

## Ví dụ sử dụng

Cho phép mã hóa và giải mã tin nhắn bằng khóa AES đối xứng với Vector khởi tạo:

```kotlin
val message = "Very large message, bigger then 250 symblos..."

// Simple Shared Preferences wrapper, will be used to save wrapped key
val storage = Storage(context)

// Creates Android Key Store and provides manage functions
val keyStoreWrapper = KeyStoreWrapper(context)

// Create and Save asymmetric key
keyStoreWrapper.createAndroidKeyStoreSymmetricKey("MASTER_KEY")
    
// Get key from keyStore
val masterKey = keyStoreWrapper.getAndroidKeyStoreSymmetricKey("MASTER_KEY")

// Creates Cipher with symmetric transformation and provides encrypt and decrypt functions
val cipher = CipherWrapper("AES/CBC/PKCS7Padding")
    
// Encrypt message with IV
val encryptedMessage = cipher.encrypt(message, masterKey, useInitializationVector = true)

// Decrypt message with IV
val decryptedMessage = cipher.decrypt(encryptedMessage, masterKey, useInitializationVector = true)
```