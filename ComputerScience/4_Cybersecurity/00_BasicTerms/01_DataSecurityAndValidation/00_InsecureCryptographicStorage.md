# Insecure cryptographic storage

## No cryptographic storage

Storing passwords in plain text might be less complex and faster to authenticate users, but it can expose sensitive data in case of data breaches. 
Data breaches can originate from an external attacker or within the organization.

## Weak hashing

MD5 and SHA1 are proven to be inadequate to hash sensitive information. They are already **broken**. If a weakness is found in a hash function that allows two files to have the same digest. Then it is considered to be broken.

Let's compare `MD5`, `SHA1`, `SHA256`, and `Bcrypt`. We will hash the message; `hello`.

![alt text](/resources/cybersecurity_insecure_crypto_weak_hashing.png)

You might be wondering, does it mean longer is always better? **No**. 
Technically **algorithms also matter** as MD5, SHA1, and SHA256 are **fast hashes**.
They are designed to be very fast, and output is always the same since they are **unsalted**. 
Salting is the process of adding random strings to the data before it's hashed, and it is used to protect the data from a **rainbow table attack**.

On the other hand, Bcrypt is salted; the hash varies every time it is computed because of the added salt, making it impractical to use a rainbow table attack.

> [!WARNING]
>  Bcrypt is also designed to be slow. The speed can be adjusted with the cost factor.


## Weak encryption

When storing data that needs to be accessed in its original form, we use encryption.
> [!NOTE]
> Hashing is not intended to retrieve the original data but rather to confirm the original data matches the stored data's hash. 

Encryption uses a **key** to change or encode the original content to seemingly random bits or ciphertext.
Without the proper key, it's impossible to decode the original data. Using a weak encryption algorithm may lead to unwanted parties accessing sensitive information.

> [!CAUTION]
> One of the attributes that makes encryption algorithms weak is insufficient key size

## References

- https://hyperskill.org/learn/step/20069



