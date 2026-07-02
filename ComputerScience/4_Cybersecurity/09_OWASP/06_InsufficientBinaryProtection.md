# Insufficient Binary Protection


## What it is

This risk occurs when attackers can reverse engineer or tamper with the app binary (APK/IPA). 
Binaries may contain valuable assets (API keys, crypto secrets, business logic, AI models) and can be modified to bypass controls (paywalls, license checks) or redistributed as a malicious/fake app.


## Common attack scenarios:

- **Reverse engineering**: decompile the binary to extract secrets (API keys, crypto material), proprietary logic, or identify backend weaknesses.
- **Code tampering**: modify the binary to bypass license/payment checks, remove security controls, or unlock paid features.
- **Repackaging & redistribution**: publish a modified copy (often on third-party stores or under a new name), sometimes with malware or with payment identifiers changed so payments go to the attacker.
- **IP theft at scale**: extract and reuse proprietary algorithms or embedded AI models, giving competitors unfair advantage

## How to prevent it (most important actions)

- **Avoid embedding secrets in the binary**: don’t hardcode API keys/crypto secrets; use server-side controls and revocable tokens.
- **Make reverse engineering harder**: apply obfuscation/shrinking (especially on Android), reduce exposed symbols/strings, consider native/harder-to-decompile components where appropriate.
- **Don’t trust client-side checks**: enforce payments/entitlements and critical security decisions on the backend (local checks can be bypassed).
- **Add integrity/tamper detection**: detect repackaging or modified signatures at runtime and handle safely (block, degrade, or report).
- **Monitor and respond to clones**: detect unauthorized copies in app stores and use reporting/takedown processes; consider specialized services for high-profile apps.
- **Plan for rapid rotation**: ensure leaked keys/secrets can be revoked/rotated quickly without waiting for all users to update.

> [!Note]: There is no perfect protection against binary attacks. 
> The goal is to raise the cost for attackers and reduce the payoff—based on your app’s risk and business impact.




