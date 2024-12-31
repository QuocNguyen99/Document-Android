# Hashing and security

## Hash functions

Hash functions are algorithms that take an input (or 'message') and return an output of fixed length. 

## MD5 and SHA

MD5 and SHA are two of the most well-known and widely used hash functions. MD5, which stands for 'Message Digest algorithm 5', produces a 128-bit hash, while SHA-1 produces a 160-bit hash. SHA-256, a more secure version of SHA, produces a 256-bit hash, and SHA-512 produces a 512-bit hash.


Although MD5 is faster and produces a shorter hash than SHA-512, it has been shown to be vulnerable to collision attacks, where two different inputs produce the same hash. Therefore, MD5 has fallen out of use in favor of more secure hash functions like SHA-512.

> [!NOTE]
> It's important to note that hash functions provide one-way encryption, meaning it is computationally infeasible to retrieve the original message from the hash. Therefore, they are primarily used for verification and comparison rather than decryption.

## MessageDigest Class

The MessageDigest class in Kotlin is part of the Java Cryptography Architecture (JCA) and provides functionality for cryptographic hash functions.

It allows you to create instances of various hash algorithms, such as MD5, SHA-1, SHA-256, SHA-512, etc. 

**The primary use** of the `MessageDigest` class is to compute the hash value (digest) of a given input message or data. This can be useful in several scenarios, including:

1. **Password storage**: When storing passwords, it is considered best practice not to store them directly. Instead, you can use a hash function like SHA-256 to compute the hash of the password and store the hash value. When a user attempts to log in, you can compute the hash of the entered password and compare it with the stored hash to verify the authenticity.

2. **Data integrity**: Hash functions can be used to ensure the integrity of data. By computing the hash of a file or a message before transmitting or storing it, you can later compare the computed hash with the received data to check if any modifications or tampering has occurred.

3. **Digital signatures**: Digital signatures use hash functions to generate a unique hash value of a message or document. This hash value is then encrypted with the signer's private key, creating a digital signature. The recipient can use the signer's public key to decrypt the signature and verify the integrity and authenticity of the message.

To use the `MessageDigest` class in Kotlin, you need to follow these steps:

1. Get an instance of the `MessageDigest` class for the desired algorithm using the `getInstance()` method, specifying the algorithm name (e.g., "SHA-512").

2. Call the `update()` method on the `MessageDigest` instance to provide the input data or message to be hashed. You can update the digest multiple times if needed.

3. Call the `digest()` method to compute the final hash value as an array of bytes.

Example: 

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
Output:

```bash
MD5: 5f4dcc3b5aa765d61d8327deb882cf99
SHA-256: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
SHA-512: b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86
```

The computed hash can be used for integrity checks or verifying file integrity.

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

## Bcrypt

Bcrypt is a password hashing library designed to be secure against brute-force attacks.


Bcrypt is adaptive: as computing power increases, the computational cost of the hash can be increased. Additionally, Bcrypt automatically generates the "salt" for each hash, which prevents dictionary and rainbow table attacks.

> [!NOTE]
> A rainbow table is a precomputed table for caching the outputs of a cryptographic hash function, usually for cracking password hashes. Passwords are typically stored not in plain text form, but as hash values. If such a database of hashed passwords falls into the hands of attackers, they can use a precomputed rainbow table to recover the plaintext passwords. 

> [!NOTE]
> The "salt" is a random value that is added to the password before applying the hash function. The salt is stored alongside the password hash and is used to prevent dictionary and rainbow table attacks.


Here's how it works: a BCrypt hash function, for example, `hashpw()`, returns different values even for the same input because it incorporates a randomly generated salt during the hashing process. 

The salt is added to the input before hashing, making the resulting hash unique. The randomness and uniqueness of the salt ensure that even if two users have the same password, their hashed values will be different. To check if two different values correspond to the same hash value, a specific function is needed. 

BCrypt provides a check function, for example, `checkpw()`, which takes the input value and the stored hash value as arguments. It internally extracts the salt from the stored hash, applies it to the input, and hashes the input again. Then, it compares the newly generated hash with the stored hash. 

If they match, it means the input values correspond to the same hash value, indicating that the input is correct. This function ensures secure password verification without exposing the actual hash or salt.


The computational cost of Bcrypt is a balance between security and efficiency. A higher cost means brute-force attacks will be slower, but it also means user authentication will be slower (higher salt value). Therefore, a cost should be chosen high enough to deter attacks but not so high that it makes the application inefficient with the right salt value.

To work with BCrypt, we can use the jBCrypt library, which can be installed via Gradle.

```kotlin
dependencies {
    implementation("org.mindrot:jbcrypt:0.4")
}
```


In the following example, we demonstrate how to use BCrypt to obtain the hash and verify it against a stored value:

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