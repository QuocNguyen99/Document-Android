# Tokens

Tokens are digital tools used for authentication and authorization processes.
Once authenticated, the user is given a token instead of repeatedly entering login credentials. 
This token is then used for subsequent requests to access resources or services. 
Importantly, tokens contain essential information to validate a user's identity or permissions. 

## Session Tokens


Session Tokens are unique identifiers assigned to a user after they log in to a web service.

1. When a user provides their credentials, the web server authenticates the user, creates a session, and stores this session information in a database. 
2. It then sends a session ID back to the user's browser, usually in the form of a cookie.
3. This session ID is stored locally and used with each subsequent request to the server.
4. The server, upon receiving this session ID, looks it up in its database to retrieve the session information and confirms the user’s identity before responding to the request. 
5. This process allows the user to maintain a **stateful interaction** with web applications without having to reauthenticate for each action they perform.

## Access Tokens

Access Tokens take a different approach. In token-based authentication, when a user logs in, the server validates their credentials and issues an access token. 
This token is a signed piece of data that proves the user's identity and permissions.
1. The client stores this token and includes it in the Authorization header of HTTP requests to access protected resources. 
2. The server then decodes and verifies the token to confirm the user's permissions before fulfilling the request. 
3. Access Tokens are integral to stateless applications, where each request must be independently authenticated and authorized.



The key difference between the two lies in their use cases: session tokens are for maintaining user sessions in a stateful manner, while access tokens are for securing stateless interactions by providing access to resources without maintaining a session.
Access tokens are specifically designed to be short-lived and are destroyed when the user logs out, ensuring a higher level of security as they do not retain long-term access as session tokens do.

