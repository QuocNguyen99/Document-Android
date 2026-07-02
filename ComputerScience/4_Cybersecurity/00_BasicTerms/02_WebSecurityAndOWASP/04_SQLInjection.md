# SQL injections

SQL injection (SQLi) is a web security vulnerability that allows an attacker to execute arbitrary SQL queries on the database. 

## Preventing SQL injection attacks

Let's take a look at how you can protect your web application from this type of attack:

1. Validate user input. Check that it is valid, and format it accordingly. 
Escape user-supplied input, so that the DBMS does not consider the user input data as SQL statements.

2. Use the latest versions of the development environment and language, as a rule, they protect against SQLi.

3. Make sure that users don't see error messages that leak sensitive information about the inner workings of the application.

4. Do not use accounts with full rights to connect to the database, it is better to limit the rights. 
Try to use specially created users with limited privileges. This can minimize the impact of an SQL injection attack.














