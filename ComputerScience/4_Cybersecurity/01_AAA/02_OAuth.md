# OAuth

OAuth is a widely adopted protocol for authorization in software applications, enabling secure designated access to resources hosted by different services. 

It allows users to grant third-party applications access to their server resources without sharing their credentials, using authorization tokens instead.


## OAuth authorization code flow

The process of obtaining authorization begins when the browser is redirected to the authorization endpoint located at the Token Service of the Authorization Server.

1. **Redirect to Authorization Endpoint**: The client's browser is directed to the authorization endpoint, marking the first step in requesting user consent for access to their resources.


2. **Authentication Check**: If the user has not yet authenticated themselves, the Token Service redirects the browser to the Authentication Service. Although these services are part of the same system, they serve distinct functions, with the latter specifically handling user authentication.


3. **User Authentication**: The user completes the authentication process. Successful authentication leads to the user being redirected back to the Token Service, signaling that the user's identity has been verified.

4. **Issuance of Authorization Code**: Once the user is authenticated, the Authorization Server issues a one-time authorization code. This code is sent back to the client as proof of the user's consent for the client to access their resources.


Following successful authorization, the client interacts with the token endpoint to exchange the authorization code for an access token. 
This exchange is performed securely by the client's backend.


1. **POST Request with Authorization Code**: The client's backend makes a secure POST request to the token endpoint, including the authorization code and the client's credentials. This request obtains the access token that will allow the client to access the user's resources.

2. **Validation and Token Issuance**: Upon receiving the request, the Authorization Server verifies the authenticity of the authorization code and the client's credentials. If the validation is successful, the server responds by issuing an access token to the client. Additionally, a refresh token may also be provided if it is supported and configured by the authorization server.


This process ensures that access to resources is granted securely, with explicit user consent and proper authentication and authorization checks in place. 
The separation of the authorization and token endpoints allows for a clear distinction of responsibilities within the OAuth framework, enhancing security and efficiency.


## Client Credentials Flow (OAuth2)

- Designed for server-to-server communication (no user involved).
- The client authenticates using its own `client_id` and `client_secret`.
- After successful authentication → receives an access token.
- The token grants access only to the client’s own resources, not user data.
- No user login or redirect → ideal for background jobs, automation, microservices.
- Requires strong security: secure credential storage + HTTPS.











