# Data validation and sanitisation. Trustworthy

Data **validation** and **sanitization** are essential practices in cybersecurity, designed to ensure that only clean and appropriate data enters and operates within information systems. 
These processes play a vital role in protecting systems from malicious attacks, data breaches, and ensuring the integrity and privacy of data managed by organizations.

## Understanding data validation

There are two primary forms of validation:
- **Syntactic validation** checks the data's format, including its type and length, to ensure it conforms to the expected parameters. For instance, it verifies that an email input contains an `@` symbol and a valid domain.
- **Semantic validation**, on the other hand, confirms that the provided values are logical within the application's context, such as verifying that a user's age input does not suggest an implausible age.

> [!CAUTION]
> Without proper input validation, systems are exposed to risks, allowing attackers to inject potentially harmful data that could exploit vulnerabilities in a website, such as cross-site scripting (XSS) or SQL injection attacks. 
> It's essential to validate all data from sources that are not completely controlled, especially user-generated inputs through forms or other entry methods

**Adopting input validation at both the client-side and server-side is a recommended practice.**


The guiding principles for input validation emphasize:
- Treating all user input as untrusted, regardless of the source.
- Preferring input validation and rejection over attempting to sanitize potentially malicious data.

## Understanding data sanitization

By sanitizing inputs, applications remove or encode these and other potentially dangerous inputs, ensuring that malicious data is rendered ineffective before it can interact with the system's logic or database operations.

## Implementing input validation and sanitization

- **Defining valid input criteria**. It involves specifying exact requirements for each input field, including data type (e.g., string, integer), length (to prevent buffer overflow attacks), format (such as an email address pattern), range (applicable for numerical inputs), and a predefined set of allowed values (ideal for dropdowns or selections)

- **Incorporating built-in functions** and libraries from programming languages and frameworks significantly enhances the security and efficiency of input validation and saniti. For SQL queries, adopting parameterized queries or prepared statements is recommended, as these methods inherently manage the escaping of data, effectively blocking SQL injection threats.zation processes. For example, Java provides classes like java.util.regex for validating formats with regular expressions, and methods in `java.net.URI` ensure safe handling of URIs.

- **Client-side validation** significantly enhances user experience by offering immediate feedback on input errors, utilizing JavaScript and HTML5 attributes like required, pattern, min, and max to enforce input constraints.

- **Regular expressions** enable developers to specify detailed patterns that inputs must adhere to for validation.
Beyond format checks, regex can also be employed to remove unwanted characters, offering a line of defense against potential injection threats by cleaning input data

- **Escaping data** ensures special characters within user inputs are treated as literal characters, not executable code, across various contexts such as databases or web pages. For SQL queries, adopting parameterized queries or **prepared statements is recommended**, as these methods inherently manage the escaping of data, effectively blocking SQL injection threats. 

> [!NOTE]
> Predefined SQL queries, where placeholders are used for parameters instead of directly incorporating user input into the query.
> Pre-compiling the SQL template freezes the command structure, making it impossible for input data to be misinterpreted as code.










