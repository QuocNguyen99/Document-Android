# Insufficient Input/Output Validation


## What it is

This risk happens when a mobile app (or its backend) **does not properly validate and sanitize input or output data** coming from untrusted sources (users, APIs, deep links, files, network responses). 
As a result, attackers can inject malicious data that leads to **data theft, data manipulation, crashes, or even code execution**.


## Common attack scenarios


- **SQL Injection**: Unvalidated input is inserted into database queries, allowing attackers to read/modify data.
- **Command Injection**: Input is passed into system commands or unsafe execution paths, enabling remote code execution.
- **XSS / Script Injection**: Untrusted data is rendered in WebViews or HTML-based outputs without sanitization, enabling session/data theft or UI manipulation.
- **Path Traversal / File Abuse**: File paths or filenames are not validated, allowing attackers to access or overwrite unintended files.
- **Malformed input/output causing crashes or corruption**: Unexpected formats (very long strings, special characters, broken JSON) can trigger instability, corrupted state, or incorrect processing.


## How to prevent it (most important actions)


- **Apply strict input validation**: allowlist expected formats, enforce type checks, length limits, and reject unexpected characters/structures.
- Use **context-aware protections**:
    - Parameterized queries / prepared statements for databases (no string concatenation for queries).
    - Safe APIs for file access (normalize paths, restrict directories, validate file types).
    - Never pass raw input into shell/command execution.
- Enforce **output encoding & sanitization**:
    - Encode output based on context (HTML, URL, JSON).
    - Sanitize any user-generated or untrusted content before rendering (especially in WebViews).
- **Add data integrity checks**: validate signatures/hashes where needed, detect tampering, validate schema for network responses.
- **Build defense-in-depth**: centralized validation utilities, consistent error handling, rate limits, and logging for suspicious payloads.
- Run **regular security testing**: code review + Static Application Security Testing/Dynamic Application Security Testing + dependency scanning + penetration testing of API inputs and edge cases.






















