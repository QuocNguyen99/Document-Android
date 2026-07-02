# Weak Authentication / Authorization Controls

This risk happens when **the backend does not properly enforce authentication and authorization**, 
and instead **trusts the mobile app** (client)—for example trusting hidden UI, request parameters, or client-sent roles. 
Attackers can then call APIs directly and perform actions they shouldn’t be allowed to do.


## Common attack scenarios

- **Hidden service requests**: APIs accept requests without verifying the request is tied to a real authenticated user, allowing anonymous execution of sensitive actions.
- **Interface reliance**: A function is hidden in the app UI, but the backend does not verify permissions—attackers send the request anyway and gain admin-like actions.
- **Weak password policies** (e.g., 4-digit passwords): Even if hashed, short passwords are easy to crack after a data leak.
- **Insecure Direct Object Reference**: Backend checks the token exists but doesn’t confirm the requested user/object ID belongs to that token—attackers change IDs to access other users’ data.
- **Trusting client-supplied roles/groups** (e.g., LDAP roles in headers): Backend uses roles sent from the client without independent verification—attackers modify headers to claim admin privileges.


## How to prevent it (most important actions)

- **Enforce server-side authentication** for every sensitive endpoint (never assume the client/UI guarantees it).
- **Enforce server-side authorization** (RBAC/ABAC): verify the authenticated identity is allowed to perform the action.
- **Prevent Insecure Direct Object Reference**: bind requests to the authenticated user (token → user) and validate object ownership/permissions on every access.
- **Use strong credential policies**: minimum length, rate limits, lockouts, Multi-Factor Authentication where possible, and modern password hashing (salted, slow hashes).
- **Never trust client-sent roles/permissions**: derive roles from trusted sources (server-side directory/DB or validated token claims you control).
- **Add abuse protections**: throttling, anomaly detection, audit logs, and monitoring for privilege escalation attempts.






























