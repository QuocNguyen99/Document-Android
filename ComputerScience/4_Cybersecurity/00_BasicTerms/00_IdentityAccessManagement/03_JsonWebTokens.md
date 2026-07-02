# Understanding JSON Web Tokens

## Definition

JWT is an open standard for securely exchanging information as JSON object between parties. It is trusted because it is digitally signed using a secret key (HMAC) or a public/private key pair (RSA/ECDSA), ensuring integrity and authenticity.

## Use Cases

1. **Authentication**: Used to verify users after login by sending a token with each request.  
2. **Authorization**: Includes claims (e.g., roles) to verify access rights.  
3. **Single Sign-On (SSO)**: Enables seamless authentication across multiple systems.  
4. **Stateless API Authentication**: Used in RESTful APIs for scalable, sessionless authentication.  
5. **Third-Party Access**: Grants limited access to resources (e.g., OAuth 2.0).  
6. **Cross-Domain Authentication**: Authenticates users across different domains or services.

## Structure of JWT

A JWT consists of three parts: `Header.Payload.Signature`.

- **Header**: Contains metadata about the token (e.g., type and signing algorithm).  
- **Payload**: Contains claims (key-value pairs) about the user or system.  
  - **Registered claims**: Predefined (e.g., `iss`, `sub`, `exp`).  
  - **Public claims**: Custom claims registered with IANA.  
  - **Private claims**: Custom claims for internal use.  
- **Signature**: Ensures integrity and authenticity by signing the encoded header and payload with a secret or private key.

Example signature using HMAC SHA256:
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

## Common Claims
- iss: Issuer of the token.
- sub: Subject (e.g., user ID).
- exp: Expiration time (UNIX timestamp).
- nbf: Not valid before (UNIX timestamp).
- iat: Issued at (UNIX timestamp).
- jti: Unique token ID.
## JWE and JWS
- JWS (JSON Web Signature): is a standard that enables the creation and validation of digital signatures for JWT tokens
- JWE (JSON Web Encryption): is a standard that enables the encryption of JWT tokens to protect their contents., ensuring only authorized parties can access the payload.
JWTs are widely used for secure, scalable, and stateless authentication in modern web applications.

## Common attacks on JWT

- **Brute Force on Weak Secrets**: Attackers guess weak signing secrets to forge valid tokens. **Use long, random secrets, rate limiting, and anomaly detection.**

- **'None' Algorithm Abuse**: An attacker changes the header to `alg: none` and tampers with claims if verification is weak. **Always reject unsigned tokens and enforce approved algorithms.**

- **Algorithm Confusion (RS256 → HS256)**: Attackers switch to HS256 and misuse the public key as an HMAC secret. **Fix by hardcoding expected algorithms and validating key types.**

- **Key Leakage**: Stolen signing keys let attackers mint valid tokens. Protect keys in secure vaults/HSMs, use encrypted transport, and rotate keys regularly.

## Token expiry and refresh strategies

JWT lifecycle management should balance security and user experience.

- **Set short access-token TTL**: Keep token lifetime brief to reduce misuse if stolen (often minutes to a few hours, based on risk).

- **Use refresh tokens**: Let users get new access tokens without logging in repeatedly. Keep refresh tokens longer-lived, but store and use them securely.

- **Validate refresh tokens strictly**: Verify integrity, check revocation, and manage issuance/storage carefully to prevent unauthorized access.



