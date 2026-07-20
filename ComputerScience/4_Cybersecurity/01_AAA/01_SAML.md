# SAML

SAML, or **Security Assertion Markup Language**, serves as an open standard that facilitates the transfer of authorization data between **identity providers (IdPs)** and **service providers (SPs)**. 
Utilizing an XML-based framework, SAML enables users to access multiple applications using a single set of credentials, thereby supporting the implementation of single sign-on (SSO) technology. This technology allows for streamlined access across various applications or web services without the need for separate login credentials for each service.

The SSO process, which is a key application of SAML, involves three main entities: 
- the principal (such as a user requesting access)
- the Identity Provider (which verifies user identities and generates SAML assertions)
- the Service Provider (which authorizes resource access).


## How SAML-based authentication works


![alt text](/resources/cybersecurity_aaa_saml_base_authentication.png)

Overview of how SAML-based authentication operates:

1. **Initiation of Login Request**: A user attempts to log into a web application, which triggers a login request. This request is then directed to the service provider (SP) involved.
2. **SAML Request Generation**: The service provider processes the login request and forwards it to the appropriate identity provider (IdP), generating a SAML request in the process. This request encompasses the user's identity information along with details about the service the user seeks to access.
3. **User Authentication**: The user is then prompted to enter login credentials (such as username and password) on the IdP's login page. 
The IdP verifies these credentials against its user directory, potentially incorporating additional security measures like multi-factor authentication based on the IdP's specific authentication protocols.
4. **Generation and Transmission of SAML Response**: Upon successful authentication, the IdP creates a SAML response, also known as a SAML assertion. 
This response contains authorization information including user roles, properties, and a digital signature, and can be encrypted to safeguard the exchange of information.
5. **Service Provider Authorization**: The service provider receives the SAML response and validates the digital signature to confirm its authenticity. 
It then deciphers the authorization information contained within the SAML assertion, determining whether the user is permitted to access the requested resources.



## Components of SAML

- **Authentication Assertion**: Confirms that a user has been authenticated by the IdP.

- **Attribute Assertion**: Contains specific information about the user, such as their email address, roles, or group memberships.

- **Authorization Decision Assertion**: Indicates whether the user is authorized to access the requested resources.





















