# Uniform Resource Identifier

**Uniform Resource Identifier** or URI also known as **aboslute URL** is a string of characters that is used to uniquely identify a resource on the internet.

It worth to mention that except well known `http://` and `https://` there are many other:


## URI Encoding and Decoding


URI(L) encoding is a method used to make sure that a URL only contains valid characters according to the **RFC 3986** standard, which includes digits, letters, and certain symbols within the ASCII character set. If a URL has characters outside this set, they are converted into a special format using percent-encoding, making them easily interpretable by servers.



> [!NOTE]
> It's important to note that URL encoding is not the same as encryption. 
> Encryption is about securing information with a secret key, while URL encoding aims to ensure a URL is interpretable by a server and prevent user manipulation.



Different programming languages offer APIs for both encoding and decoding URLs.

- **Python**: `urllib.parse.quote()` and `urllib.parse.unquote()`
- **JavaScript**: `encodeURIComponent()` and `decodeURIComponent()`
- **Java**: `java.net.URLEncoder` and `java.net.URLDecoder`
- **Go**: `url.QueryEscape()` and `url.QueryUnescape()`
- **C++**: does not have a built-in encoding/decoding tools, however you might use third-party `cpp-httplib`
- **Rust**: `url::percent_encoding`



## Common URI-Based Attacks via URI Parameters


Here are some common URI-based attacks:

**SQL Injection**: Attackers manipulate URI parameters to inject malicious SQL code into the application's database queries.
- Example: `https://example.com/products?category=electronics' OR 1=1 --`
- Impact: Can lead to unauthorized access, data leakage, or even data manipulation.
**Cross-Site Scripting (XSS)** Attackers inject malicious scripts into URIs, which are then executed in the victim's browser when they visit the manipulated URL.

- Example: `https://example.com/search?query=<script>alert("XSS");</script>`
- Impact: Allows attackers to steal user data, perform actions on behalf of users, or deface web pages.
**Path Traversal**: Attackers exploit inadequate URI validation to navigate outside the intended directory or file structure.
- Example: `https://example.com/download?file=../../../etc/passwd`
**Open Redirects**: Attackers create URLs that redirect users to malicious websites, often used in phishing attacks.
- Impact: Can lead to unauthorized access to sensitive files or directories.
- Example: `https://example.com/redirect?url=https://malicious.com`
- Impact: Trick users into visiting malicious websites, potentially leading to data theft or malware infection.
**Parameter Pollution**: Attackers manipulate URI parameters to confuse the application's processing logic.
- Example: `https://example.com/search?query=term1&query=term2`
- Impact: Can lead to unintended behavior, vulnerabilities, or errors in the application.

**HTTP Verb Tampering** — Attackers manipulate the `HTTP` request method (`GET`, `POST`, `PUT`, `DELETE`, etc.) in URIs to perform unauthorized actions.


**Information Disclosure** — Attackers manipulate URIs to reveal sensitive information such as internal server details or debugging information.


**Denial of Service (DoS)** — Attackers craft URIs to consume excessive server resources, making the application unavailable to legitimate users.

**Cookie Manipulation** — Attackers manipulate URIs to inject or modify cookies, potentially gaining unauthorized access or impersonating users.

## Secure URI Design and Implementation

Here are some best practices to ensure secure URI design and implementation:

1. **Input Validation**:

    - **Validate All User Inputs**: Ensure that all data received via URIs is validated for both type and content. Reject any input that doesn't conform to expected patterns or formats.

    - **Sanitize Inputs**: Sanitize input data to remove or escape potentially malicious characters to prevent injection attacks like SQL injection or Cross-Site Scripting (XSS).

2.  **Parameterized Queries** — When interacting with databases through URIs, use parameterized queries or prepared statements to prevent SQL injection attacks. Never concatenate user inputs directly into SQL queries.

3.  **Output Encoding** — Encode user-generated content before including it in URIs to prevent XSS attacks. Use functions like `url.QueryEscape` or `html.EscapeString` as appropriate.

4.  **HTTPS Usage** — Always use the HTTPS scheme (`https://`) in URIs to ensure encrypted communication between clients and servers, preventing data interception.

5.  **Session Management** — Avoid including sensitive session data in URIs. Instead, use secure cookies or session tokens for managing user sessions.

6.  **URL Whitelisting** — Implement URL whitelisting to only allow access to specific, trusted URIs. Reject any requests to unauthorized or unknown URIs.

7.  **Blacklisting** — Maintain a blacklist of known malicious URIs or URI patterns and deny access to them.

8.  **Proper Access Controls** — Ensure that URI-based access controls are enforced. Don't solely rely on URI obscurity for security. Use role-based access control (RBAC) or other authorization mechanisms.

9.  **Path Traversal Prevention** — Implement proper URI path validation and path traversal protection to restrict access to unauthorized directories and files.

10.  **Rate Limiting** — Implement rate limiting for URIs that involve sensitive operations or user authentication to prevent abuse and brute force attacks.


## URI Whitelisting and Blacklisting

**URI whitelisting** is an access control mechanism where you explicitly specify a list of allowed or permitted URIs that users or clients are allowed to access.


Suppose you have a web application with the following URIs:

- `/home`
- `/profile`
- `/dashboard`
- `/logout`

You could create a URI whitelist that includes only these URIs. Any attempt to access a URI not on the whitelist would result in access denial.

**URI blacklisting**, on the other hand, is an access control mechanism where you explicitly specify a list of disallowed or forbidden URIs that users or clients are not allowed to access. Any request to a URI on the blacklist is denied or restricted

You maintain a blacklist of URIs that are known to be used for phishing attacks or other malicious purposes.




