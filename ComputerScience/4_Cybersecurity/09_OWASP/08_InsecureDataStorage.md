# Insecure Data Storage

## What it is

Sensitive data is stored on the device in a way that can be read or modified by attackers (e.g., plaintext files/databases, weak or missing encryption, insecure caches). 
Risks increase with physical access, malware, rooted/jailbroken devices, backups, and exposed logs.


## Common attack scenarios:

- **Plaintext secrets**: passwords/tokens/API keys stored unencrypted in local files, databases, SharedPreferences.
- **Insecure caching**: auth tokens/session data cached without protection or proper expiry, enabling impersonation.
- **Unprotected logs**: PII or sensitive API responses/errors written to logs or crash reports and later extracted.
- **Backup extraction**: sensitive sandbox data included in device backups and recovered by attackers.
- **Root/jailbreak scraping**: elevated access allows direct reading/tampering of app storage.
- **Temporary files leakage**: sensitive data left behind in temp files after processing.
- **Cloud storage misconfigurations**: overly permissive storage settings expose stored data

## How to prevent it (most important actions)
- **Use Strong Encryption**: encrypt sensitive data at rest with modern algorithms; protect keys properly.
- **Secure Data Transmission**: always use HTTPS/TLS when data moves between app and server.
- **Implement Secure Storage Mechanisms**: use platform secure storage (iOS Keychain, Android Keystore/encrypted storage).
- **Employ Proper Access Controls**: require authentication/authorization before reading or writing sensitive data.
- **Validate Input and Sanitize Data**: prevent injection and ensure only expected data is stored/processed.
- **Apply Secure Session Management**: use strong random tokens, proper expiration, and protect tokens from leakage.
- **Regularly Update and Patch Dependencies**: keep libraries/SDKs up to date to avoid known storage-related issues.
- **Stay Informed**: monitor advisories and platform changes that affect storage/security best practices.


















