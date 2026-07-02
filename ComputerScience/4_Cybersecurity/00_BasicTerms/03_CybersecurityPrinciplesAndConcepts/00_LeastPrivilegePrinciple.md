# Least Privilege Principle

**Least Privilege Principle** or **POLP** for short is a computer security concept and best practice that revolves around restricting access rights and permissions for users, processes, and systems to only the minimum level necessary for them to perform their required tasks.

## Strategies for implementing POLP

1. **User Role-Based Access Control (RBAC)**: Assign permissions based on specific job roles or functions. Users are only granted access to the resources necessary for their roles.

2. **Permission auditing**: Regularly review and audit permissions to ensure that they are appropriate and necessary. Remove any unnecessary or excessive permissions.

3. **Separation of duties**: Divide tasks and responsibilities among different individuals to prevent a single user from having too much power or control.

4. **Default deny**: Adopt a "default deny" approach, where access is denied by default and only granted when explicitly needed.

One of the most natural ways to implement POLP is to use **IDM**

## Identity Management System

IDentity Management (IDM) systems are tools and frameworks that help organizations manage and control user identities, access rights, and authentication processes within their digital systems.

Following the principle of **separation of concern**, each component (or sub-system) handles a single logical function and depends on other components for operations that are out of scope for the component. 
An Identity Management System should consist of logical components for the following services


![alt text](/resources/least_privilege_principle_identity_management_system.png)


- **Authentication Service** — responsible for authenticating users; provides user self-service for password resets, sign-ups, and other services.

- **Federation Service** — responsible for cross-domain Single Sign-on for web applications.

- **Token Service** — responsible for security token issuance and introspection. Primarily for API access and for modern web and mobile application access.

- **User Management Service** — Responsible for user provisioning operations.









