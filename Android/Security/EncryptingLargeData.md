# Encrypting Large Data


## Key Size

Up to this moment, we already tried to encrypt small “Hello World” message. Lets try to encrypt larger one, larger then 250 symbols. Oops, 

`IllegalBlockSizeException`.

RSA was not designed to work with large amount of data. You can process messages only with limited length, that depends on the key size. The bigger key is, the bigger message can be encrypted.

> [!IMPORTANT]  
> Be aware that using big key sizes will increase encryption time and may affect application performance. Avoid large data encryption on main application thread.

During the key generation process, you are able to specify the key size with setKeySize() method:

```kotlin
// On Marshmallow and higher (API 23+)
val builder = KeyGenParameterSpec.Builder(alias, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
builder.setKeySize(1024)

// On Kitkat and up to Marshmallow (API 19 - 22)
val builder = KeyPairGeneratorSpec.Builder(context)
builder.setKeySize(1024)
```
> [!WARNING]  
> It’s not possible to customize key size on API 18, in Android Key Store provider.

Default key size will be used if nothing was set manually. Default value may depend on provider and platform version. For RSA keys, in Android Key Store provider, it is 2048-bit.

Supported RSA keys sizes are: 512, 768, 1024, 2048, 3072, 4096. Check more details on supported algorithms and key sizes in [documentation](https://developer.android.com/privacy-and-security/keystore#SupportedKeyPairGenerators).

There’s a formula that you can use to calculate maximum RSA message length. For a n-bit RSA key (with PKCS1 padding) direct encryption works for arbitrary binary messages up to: `floor(n/8)-11 bytes`

## What to do

Pretty bad situation here, no possibility to use asymmetric key, and symmetric is available only from API 23+. And not so many options to choose from, to escape it:

1. Create symmetric key with one of default Java Providers. Encrypt / decrypt message with it. Then encrypt this key raw data with RSA public key and save it somewhere to the disk. On decryption, get encrypted raw key data, decrypt it with RSA private key and use it for message decryption.

2. Separate large message on parts and encrypt / decrypt each of the part individually.

Unfortunately, even with ECB mode (in Android Key Store provider implementation) RSA algorithm can process only one block of data, and if message is longer than one block size — it will crash.

To workaround this, you can manually separate data and work with it parts (simulate the ECB mode). But again, RSA is not designed for tasks like this.

It will be more secure to continue with first option.

## Default Providers


And the first thing we are going to do is to: generate symmetric key with one of default Java Providers.


The most common default Java provider in android is the cut version of BC provider created by the popular third party Java cryptographic library provider — Bouncy Castle.

```kotlin
fun generateDefaultSymmetricKey(): SecretKey {
    val keyGenerator = KeyGenerator.getInstance("AES", "BC")
    return keyGenerator.generateKey()
}
```

KeyGenerator class is responsible for symmetric keys generation. Use one of its getInstance() methods to create an instance of the AES key.

You can fetch all available providers by calling Security.getProviders() method:

```kotlin
Security.getProviders().forEach { logi(it.name) }
```


> [!NOTE]  
> Available providers may vary across different platforms and vendors. If provider, that you are looking for, doesn’t exist on device, you can register your own (or some third party) provider by calling one of:
```kotlin
Security.addProvider(provider)
// With this you are able to control the most preferred provider for
// your application. See Encryption in Android (Part 2)
Security.insertProviderAt(provider, position)
```
Or you can use getInstance(algorithm) , that will return you the most preferred implementation, basing on your providers list.

```kotlin
val keyGenerator = KeyGenerator.getInstance("AES")
// Providers List:
// 1. Android Key Store
// 2. Custom Provider
// 3. BC
// Will output BC, if Android Key Store and Custom Provider do not // have AES algorithm.
keyGenerator.provider.name
```

## Symmetric Keys

Basically, we do not have symmetric keys up to 23 API. But starting from M, we can use just one symmetric key from Android Key Store provider.

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

Use KeyGenerator in pair with KeyGenParameterSpec to create one. Also do not forget about Cipher transformation that we will need for symmetric encryption:

```kotlin
companion object {
    var TRANSFORMATION_SYMMETRIC = "AES/CBC/PKCS7Padding"
}
```

## Key Wrapping

To protect our AES key and safely save it on device public persistent storage (such as preferences, files or databases), we will use RSA key, that is stored in Android Key Store, to encrypt and decrypt it. This process is also known as **key wrapping.**

```kotlin
fun wrapKey(keyToBeWrapped: Key, keyToWrapWith: Key?): String {
    cipher.init(Cipher.WRAP_MODE, keyToWrapWith)
    val decodedData = cipher.wrap(keyToBeWrapped)
    return Base64.encodeToString(decodedData, Base64.DEFAULT)
}
```

For this, Cipher has separate WRAP_MODE and wrap() method. To decrypt the key, use UNWRAP_MODE and unwrap() method.

```kotlin
fun unWrapKey(wrappedKeyData: String, algorithm: String, wrappedKeyType: Int, keyToUnWrapWith: Key?): Key {
    val encryptedKeyData = Base64.decode(wrappedKeyData, Base64.DEFAULT)
    cipher.init(Cipher.UNWRAP_MODE, keyToUnWrapWith)
    return cipher.unwrap(encryptedKeyData, algorithm, wrappedKeyType)
}
```

## Usage Example

Lets try to encrypt and decrypt large message, using new approach:

```kotlin

val message = "Very large message, bigger then 250 symblos..."

// Simple Shared Preferences wrapper, will be used to save wrapped key
val storage = Storage(context)

// Creates Android Key Store and provides manage functions
val keyStoreWrapper = KeyStoreWrapper(context)
```

Running on M and later, use one symmetric key :


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

Before M, use two, asymmetric and symmetric, keys:

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

## Initialization Vector

Initialization Vector is a fixed-size input to a cryptographic primitive. It is typically required to be random or pseudorandom. The point of an IV is to tolerate the use of the same key to encrypt several distinct messages.

And it is required for block algorithm modes (like CBC in AES) in most of providers, including the AndroidKeyStore provider as well as BC provider.

On API 18, with default Java’s BC provider key, if IV wasn’t specified during decryption, Cipher will fall into `IllegalArgumentException: Passed data is incorrect. There was no IV specified with it`

On API 23, with AndroidKeyStore provider key, InvalidKeyException will be thrown:

`InvalidKeyException: IV required when decrypting. Use IvParameterSpec or AlgorithmParameters to provide it.`

## Default Value

The easiest way to implement the Initialization Vector support, is to use byte array data that is generated by the Cipher during encryption. It can be retrieved with cipher.getIV() method:

```kotlin
cipher.init(Cipher.ENCRYPT_MODE, key)
val iv = cipher.iv // returns automatically generated IV value
...
// Encrypt data with Cipher
```
> [!NOTE]  
> Default value is generated during Cipher initialization, so cipher.init() must be called first, otherwise cipher.getIv() will return empty data.

Then, during decryption, initialize Cipher with IvParameterSpec created from generated IV value :

```kotlin
val ivSpec = IvParameterSpec(iv)
cipher.init(Cipher.DECRYPT_MODE, key, ivSpec)
...
// Decrypt data using Cipher, initialized with IV
```

Like a Salt value, an Initialization Vector can be stored in the public storage, along with encrypted data.

And one of the possible ways to store it, is to add IV data to the encryption result :

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

And parse it before decryption, from encrypted data:

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

## Custom Value

As Dorian Cussen’s mentioned in his blog, default IV value, provided by Cipher, mostly depends on the Provider implementation.

It is possible to face the [situation](https://stackoverflow.com/questions/31036780/android-cryptography-api-not-generating-safe-iv-for-aes) when cipher.getIV() is not implemented — returns “empty” or null array.

To be on the safe side and to avoid such an unpleasant moment — declare an Initialization Vector explicitly, using SecureRandom class.

To create custom IV value, use nextBytes(byte[] key) method, from SecureRandom class :

```kotlin
SecureRandom r = new SecureRandom();
byte[] ivBytes = new byte[16];
r.nextBytes(ivBytes);
```

The ivLength depends on the mode of operation. And for most modes, including CBC, the IV must have the same length as the block in it. AES algorithm uses 128-bit blocks, so Initialization Vector’s length is equal to 128 bits (ivLength = 16// bytes).

When custom IV value is generated, simply initialize Cipher instance with it:

```kotlin
cipher.init(Cipher.ENCRYPT_MODE, key, IvParameterSpec(iv))
cipher.init(Cipher.DECRYPT_MODE, key, IvParameterSpec(iv))
```

Note, generated value must be passed into init() method for both encryption and decryption modes.

## Empty Value

It is possible, but highly not recommended, to cheat on Cipher. Instead of generating new random Initialization Vector’s data each time before encryption, and then saving and parsing it before decryption, IV can be initialized once, as an array, with fixed length of static values and used everywhere, all the time:

```kotlin
// Create an array of 16 bytes, filled with 0 [0, 0, 0, 0 ..0]
val iv = ByteArray(16)
// Use this array during encryption and decryption as IV data
cipher.init(Cipher.ENCRYPT_MODE, key, IvParameterSpec(iv))
cipher.init(Cipher.DECRYPT_MODE, key, IvParameterSpec(iv))
```

Keep in mind that this implementation kills the essence of the IV.

## Randomized Encryption

To protect users data from using incorrect (not random or empty) IV, by default, AndroidKeyStore Provider is not allowing to use custom IV values :

```kotlin
val iv = ByteArray(16)
cipher.init(Cipher.ENCRYPT_MODE, key, IvParameterSpec(iv))
// will throw InvalidAlgorithmParameterException: Caller-provided IV // not permitted
cipher.doFinal(data.toByteArray())
```
On API 23, the setRandomizedEncryptionRequired method was added to KeyGenParameterSpec class, that should allow you to control whether IV may be custom or not. From documentation:
>Sets whether encryption using this key must be sufficiently randomized to produce different ciphertexts for the same plaintext every time.
When IND-CPA is required: in block modes which use an IV, such as GCM, CBC, and CTR, caller-provided IVs are rejected when encrypting, to ensure that only random IVs are used.


```kotlin
val builder = KeyGenParameterSpec.Builder()
// Forces to use only Default Generated, by Cipher, IV.
// Default value.
builder.setRandomizedEncryptionRequired(true)
// Enables to use Custom Generated IV's.
// Not working.
builder.setRandomizedEncryptionRequired(false)
```

***But it is not working***, (at least for AES and CBC). Even after disabling randomization, Cipher still crashes with InvalidAlgorithmParameterException and continue to require the Default Initialization Vector.

## Usage Example

Lets encrypt and decrypt message using symmetric AES keys with Initialization Vector:

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