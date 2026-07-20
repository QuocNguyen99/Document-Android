# Inadequate Supply Chain Security


## What it is

This risk is about **your app being compromised through the software supply chain**, not just your own code. 


## Common attack scenarios:

- Inject malicious code into your codebase or during the build/release process (CI/CD).
- Abuse **third-party libraries/SDKs/vendors** with known or hidden vulnerabilities.
- Steal or misuse **signing keys/certificates** to distribute a “trusted” malicious version of the app.


## How to prevent it (most important actions)

- Enforce **secure development practices**: code reviews, security testing, and change control.
- Protect **signing keys/certs**: secure storage, restricted access, rotation, and audit logs.
- Use only **trusted and validated dependencies**; keep them updated and monitored.
- Secure **updates/patches/releases** with strong controls (approvals, integrity checks).
- Continuously **monitor and detect** supply chain issues: dependency scanning, build scanning, alerts, incident response readiness.