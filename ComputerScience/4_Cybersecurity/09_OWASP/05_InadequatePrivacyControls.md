## Inadequate Privacy Controls

## What it is

This risk happens when an app collects, uses, stores, or shares Personally Identifiable Information (PII) without strong privacy safeguards. PII can include names, addresses, emails, IP addresses, payment details, location data, and highly sensitive categories (health, religion, sexuality, political opinions). 
If mishandled, PII can be leaked, altered, or destroyed, causing serious harm to users and major regulatory exposure for the business.

## Common attack scenarios:

- **PII leaks through logs/crash reports**: Developers (or third-party SDKs) accidentally log sensitive data, which ends up in device logs, crash analytics, or error screens.
- **PII in URL query parameters**: Sensitive data is sent in URLs, then gets stored in server logs, analytics tools, browser history, or proxies.
- **PII exposure via backups**: App sandbox data is included in device backups; attackers who obtain backups can extract sensitive information.
- **Uninstall/reinstall data persistence (Android)**: Misconfiguration (e.g., preserving data on uninstall) allows a later app with the same package ID to access leftover user data.
- **PII extracted after another breach**: Attackers first compromise storage/network/auth (e.g., insecure comms or weak auth) and then harvest PII from files, clipboard, or logs.


## How to prevent it (most important actions)

- **Minimize PII**: collect and keep only what is necessary; reduce granularity (coarse location), frequency (less often), and retention (delete after expiry).
- **Anonymize/pseudonymize where possible**: hashing, bucketing, masking, or adding noise depending on the use case.
- **Use clear consent for optional PII**: allow users to opt in/out and understand the tradeoffs.
- **Secure storage and transport**: treat PII like other sensitive data—encrypt at rest, use TLS in transit, and avoid exposing it in logs/URLs.
- **Strong access control**: require proper authentication/authorization for any PII access.
- **Defense in depth for high-risk data**: add extra protection layers for critical categories (e.g., device-backed key protection).
- **Prevent accidental leakage**: sanitize logs/errors, review third-party SDKs, and avoid clipboard/query-parameter exposure.
- **Validate through security testing**: threat model PII flows; use static/dynamic checks to detect logging, URL leakage, and backup-related issues.

































