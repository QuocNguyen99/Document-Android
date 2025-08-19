# SSL Pinning Overview
## What is SSL Pinning?

SSL Pinning is a technique that helps prevent man-in-the-middle (MITM) attacks by restricting which server certificates or public keys an app will trust. Instead of trusting every certificate signed by trusted CAs, the app only accepts connections from servers with a specific certificate or public key.

## Types of Pinning

- Certificate Pinning: Pin the entire certificate. Requires app update when the certificate changes (even if it’s just renewed).

- Public Key Pinning: Pin only the public key. Allows changing/renewing the certificate as long as the key pair stays the same. More flexible for long-term maintenance.

## When to Use

- Use public key pinning if you control your backend and can manage your key pairs.

- Use certificate pinning for simple setups or if changing certificates is rare and app updates are not a problem.

## Best Practices

- Always include at least one backup pin (a second public key) in case you need to rotate certificates or keys.

- Review your pinning regularly, especially before certificate renewals.

- Handle pin validation errors gracefully to avoid locking out users.