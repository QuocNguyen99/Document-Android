# Insufficient Cryptography


## What it is

This risk occurs when a mobile app uses **weak, outdated, or incorrectly implemented cryptography** (encryption, hashing, key management, randomness, TLS config). 
As a result, attackers may **decrypt sensitive data, forge/tamper with protected content, or steal/abuse encryption keys**.


## Common attack scenarios:

- **Weak or deprecated algorithms**: using outdated crypto or insecure hashes that attackers can break or reverse.
- **Insufficient key length**: short/guessable keys make brute-force attacks feasible.
- **Poor key management**: keys stored insecurely, leaked in logs, or transmitted in plaintext.
- **Implementation flaws**: incorrect usage of crypto libraries, insecure random number generation, or custom crypto code with mistakes.
- **Missing salting / weak password hashing**: password hashes cracked via rainbow tables or fast brute force.
- **TLS downgrade / weak fallback**: attackers force weaker encryption during connection setup.
- **MitM data tampering**: weak crypto allows intercepted data to be decrypted, modified, and re-encrypted without detection.


## How to prevent it (most important actions)

- **Use Strong Encryption Algorithms**: rely on modern, widely accepted crypto (e.g., AES, RSA/ECC) and avoid deprecated options.
- **Ensure Sufficient Key Length**: follow current industry guidance for key sizes per algorithm.
- **Follow Secure Key Management Practices**: protect keys with strong access control; use secure storage (HSM/key vault where applicable).
- **Implement Encryption Correctly**: use well-reviewed libraries/frameworks; avoid custom crypto implementations.
- **Secure Storage of Encryption Keys**: store keys in OS-provided secure storage (iOS Keychain, Android Keystore), never plaintext.
- **Employ Secure Transport Layer**: use HTTPS/TLS with proper certificate validation and strong cipher configuration.
- **Validate and Authenticate**: use signatures/cert validation to ensure integrity and authenticity where needed.
- **Regularly Update Security Measures**: keep crypto libraries and platform components patched and up to date.
- **Conduct Security Testing**: perform crypto-focused reviews, penetration tests, and code audits.
- **Follow Industry Standards and Best Practices**: align with guidance from standards bodies (e.g., NIST/IETF).
- **Use Strong Hash Functions**: use modern password hashing/KDFs (e.g., bcrypt/scrypt/PBKDF2) and secure hashes (e.g., SHA-256) where appropriate.
- **Implement Salting:** always use strong random salts for password hashing.
- **Use Key Derivation Functions (KDFs)**: use KDFs for password-based secrets with sufficient iterations/work factors.
























