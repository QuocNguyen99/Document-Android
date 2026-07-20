# Security Misconfiguration

## What it is

Security misconfiguration happens when a mobile app is shipped with **unsafe or incorrect security settings** (configs, permissions, access controls, crypto, network rules, session handling).
These mistakes can enable **unauthorized access**, data exposure, or privileged actions—often due to rushed releases, human error, or leaving development settings in production.

## Common attack scenarios:

- **Insecure default settings**: weak defaults, unnecessary permissions, or default credentials left unchanged.
- **Improper access controls**: misconfigured authorization allowing access to sensitive data or privileged actions.
- **Weak encryption or hashing**: outdated/incorrect crypto choices that make sensitive data easier to recover.
- **Lack of secure communication**: allowing HTTP or weak TLS settings that enable eavesdropping / MITM.
- **Unprotected storage**: passwords, API keys, or tokens stored in plaintext or weakly protected formats.
- **Insecure file permissions**: files or preferences stored as world-readable/world-writable (Android).
- **Misconfigured session management**: weak token/session handling enabling session hijacking or impersonation.
- **Insecure file provider path settings**: exported FileProvider exposes broad paths, enabling access to internal resources.
- **Exported activities**: internal Activities/Services/Providers exported or browsable, creating extra attack surface.
- **Unnecessary permissions**: requesting permissions not needed for core functionality, increasing privacy/security risk.

## How to prevent it (most important actions)

- **Secure default configurations**: review and harden all defaults before release; remove unsafe flags and dev shortcuts.
- **Default credentials**: never ship hardcoded or unchanged default usernames/passwords.
- **Insecure permissions**: avoid world-readable/world-writable storage and overly permissive file modes.
- **Least privilege principle**: request only permissions strictly required for features.
- **Secure network configuration**: disallow cleartext traffic; use strong TLS and consider certificate pinning where appropriate.
- **Disable Debugging**: ensure release builds are not debuggable; reduce sensitive logging and remove debug endpoints.
- **Disable backup mode (Android)**: exclude sensitive app data from device backups where applicable.
- **Limit application attack surface**: export only the Activities/Services/Providers that must be exported; lock down intent filters and FileProvider paths.
- **Regular review & testing**: run configuration reviews, automated scans, and security testing to catch misconfigurations early.


















