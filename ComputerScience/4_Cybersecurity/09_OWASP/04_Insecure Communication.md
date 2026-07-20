# Insecure Communication

## What it is

This risk happens when a mobile app **sends or receives data over insecure channels** or uses **broken/weak TLS configurations**, 
allowing attackers to **intercept (eavesdrop) or modify (Man-In-The-Middle)** traffic between the device and servers (or other devices).


## Common attack scenarios:

- **Plaintext traffic**: sensitive data is sent without encryption (HTTP, insecure sockets, insecure Wi-Fi/Bluetooth/NFC flows).
- **Weak/deprecated TLS**: old protocols or weak cipher suites allow traffic to be decrypted more easily.
- **Bad certificate acceptance**: the app accepts self-signed/expired/revoked/wrong-host certificates (often due to dev “shortcuts”).
- **Partial TLS usage**: TLS is used only for login, but other flows (API calls, session, tokens) are not consistently protected.
- **Mixed secure/insecure sessions**: third-party web views/analytics or redirects introduce insecure endpoints that leak session data.


## How to prevent it (most important actions)

- Treat networks as **untrusted by default**; assume traffic can be monitored or modified.
- Use **TLS everywhere** for all app-to-server communication (not only authentication).
- Enforce strict certificate validation:
    - Reject self-signed/expired/untrusted/revoked/wrong-host certificates
    - Require full chain verification and “fail closed” (do not silently proceed)
- Use **strong TLS configuration**:
    - Disable deprecated protocols/ciphers
    - Prefer modern cipher suites and appropriate key lengths
- Consider **certificate pinning** for high-risk apps (to reduce MITM even with rogue CAs).
- Avoid sending sensitive data through **alternate channels** (SMS, notifications, logs).
- For highly sensitive payloads, add **application-layer encryption** on top of TLS as defense-in-depth.
- During security testing, **inspect network traffic** to ensure nothing sensitive leaks over plaintext or weak TLS.


































