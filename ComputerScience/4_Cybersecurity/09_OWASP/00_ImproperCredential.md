# Improper Credential

## Definition
This risk happens when a mobile app handles credentials unsafely, especially:
API keys, usernames/passwords embedded in code or config.


## Common attack scenarios

- **Hardcoded credentials**: attacker reverse-engineers the app → finds embedded credentials → accesses sensitive systems.

- **Insecure transmission**: attacker intercepts network traffic → captures credentials → impersonates the user.

- **Insecure storage**: attacker extracts stored credentials from the device → takes over the account.


## How to prevent it (most important actions)

- **Never hardcode credentials** in the app.
- **Secure transmission**: always use encrypted channels (e.g., TLS/HTTPS) and avoid exposing secrets in requests/logs.
- **Avoid storing user passwords** on the device; prefer secure, revocable access tokens.
- **Use strong authentication standards** and avoid “homegrown” auth logic.
- **Rotate and update** API keys/tokens regularly to reduce damage if something leaks.































