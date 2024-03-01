# Android encryption

## Java Cryptography Architecture

Android builds on the Java Cryptography Architecture (JCA), 
that provides API for digital signatures, certificates, encryption, 
keys generation and management.

![](../../Android/Security/resources/JCA.webp)

### KeyGenerator 
provides the public API for generating symmetric cryptographic keys.

### KeyPairGenerator 
an engine class which is capable of generating a private key and its 
related public key utilizing the algorithm it was initialized with.

### SecretKey 
a secret (symmetric) key. The purpose of this interface is to group (and provide type safety for)
all secret key interfaces (e.g., SecretKeySpec).

### PrivateKey 
a private (asymmetric) key. The purpose of this interface is to group
(and provide type safety for) all private key interfaces(e.g., RSAPrivateKey).

### PublicKey 
a public key. This interface contains no methods or constants.
It merely serves to group (and provide type safety for) all public key interfaces(e.g., RSAPublicKey).

### KeyPair
this class is a simple holder for a key pair (a public key and a private key).
It does not enforce any security, and, when initialized, should be treated like a PrivateKey.

### SecureRandom
generates cryptographically secure pseudo-random numbers.
We will not use it directly in this series, but it is widely used inside of KeyGenerator,
KeyPairGenerator components and Keys implementations.

### KeyStore
database with a well secured mechanism of data protection,
that is used to save, get and remove keys. Requires entrance password and passwords for each of the keys.
In other words it is protected file that you need to create, read and update (with provided API).

### Certificate
certificate used to validate and save asymmetric keys.

### Cipher
provides access to implementations of cryptographic ciphers for encryption, 
decryption, wrapping, unwrapping and signing.

### Provider 
defines a set of extensible implementations, independent API’s. 
Providers are the groups of different Algorithms or their customizations. 
There are 3d party providers, such as Bouncy Castle and Spongy Castle (android version of Bouncy Castle),
as well as providers available out of box, such as cut-down version of Bouncy Castle 


## KeyStore

And in 18 version of Android, AndroidKeyStore was introduced:

> The Android Key Store system lets you store cryptographic
keys in a container to make it more difficult to extract from the device.

> Once keys are in the key store, 
they can be used for cryptographic operations with the key material remaining non-exportable.

> Moreover, it offers facilities to restrict when and how keys can be used,
such as requiring user authentication for key use or restricting keys to be used only in certain cryptographic modes.


AndroidKeyStore is a JCA Provider implementation, where:

> Without it, before Android 18, you would need to create a file somewhere in your local 
or external device storage, where all of your keys would be kept (as you can understand, 
it is easy to extract that file). But with AndroidKeyStore you do not need to create anything, 
system will manage everything for you:

- If device manufacture supports Trusted Execution Environment(TEE), your keys will be saved there (the most secure option);
- If device manufacture doesn’t support TEE, keys will be stored in emulated software environment, provided by the system.