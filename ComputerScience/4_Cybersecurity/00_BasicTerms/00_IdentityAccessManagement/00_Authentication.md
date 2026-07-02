# Authentication

Authentication is a checkpoint that verifies identities, ensuring that only authorized individuals can interact with sensitive data and systems.

## The role of authentication in cybersecurity

it's a fundamental aspect of how we interact with digital systems. 
This verification is essential not only for human users but also for ensuring that servers, software, and APIs are legitimate and secure.

In the realm of cybersecurity, authentication's role extends across various domains. 
For instance
- Transport Layer Security (TLS), a protocol that secures internet communications, relies heavily on authentication to confirm the identity of web servers.
- Email security is another area where authentication plays a key role. Technologies like DomainKey Identified Mail (DKIM) authenticate emails by verifying that they originate from permitted servers, thereby reducing spam and phishing risks.

## How authentication works

At its core, authentication is about verifying if someone is who they claim to be in the digital space. But how does a computer, devoid of human intuition, accomplish this?

Authentication systems use specific criteria known as **factors**. These factors can be something a user knows (like a password), something they have (like a security token), or something inherent to them (like a fingerprint). Each of these **factors** contributes to constructing a digital identity that is unique and verifiable.

![alt text](/resources/cybersecurity_authentication_factors.png)

In addition to these main factors, location and time can also be used as additional authentication criteria.
Furthermore, digital certificates play a crucial role in authentication.

They are digital files that contain identity verification information, similar to ID cards in real life. These certificates, often digitally signed by a trusted authority, contain a public key linked to a private key held by the certificate's owner. This mechanism is widely used in securing web communications, notably in HTTPS protocol.

## Multi-Factor and Two-Factor Authentication

**Multi-Factor Authentication (MFA)** strengthens security by requiring two or more authentication factors. 
This approach significantly enhances protection, as it's much harder for attackers to counterfeit multiple authentication elements. 
For example, even if a hacker obtains a user's password, they still face the challenge of bypassing a biometric verification like a facial scan or acquiring a physical token.

**Two-Factor Authentication (2FA)** is a subset of MFA, utilizing exactly two distinct factors. 
A common implementation combines "something you know" (like a password) with "something you have" (such as a code sent to a phone). 
This method has proven effective in reducing the impact of phishing attacks and other security breaches.
In essence, both MFA and 2FA add layers of security beyond traditional single-factor methods. 
They are becoming increasingly vital in the realm of cybersecurity, offering robust protection against unauthorized access and enhancing overall system security

## SSO

Single Sign-On (SSO) is a authentication process allowing users to access multiple applications or websites **using one set of login credentials**. This approach offers numerous benefits in the digital landscape.

### Benefits when using SSO
- enhances user convenience by reducing the number of passwords they need to remember
- allowing centralized control of authentication policies
- providing a unified platform to enforce security measures.
- reducing the risk of phishing attacks by limiting the frequency of login prompts.


## References

- https://hyperskill.org/learn/step/38878




