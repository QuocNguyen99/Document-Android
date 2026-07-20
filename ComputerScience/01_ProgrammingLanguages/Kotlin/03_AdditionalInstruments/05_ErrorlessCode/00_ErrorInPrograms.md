# Error in programs

Suppose, you're writing a Kotlin program. Different errors may occur during its compilation or execution. 
We will divide all possible errors into two groups: **compile-time** errors and **run-time** errors.

> [!TIP]
> Remember: in many cases, you can avoid exceptions using conditions. So think about special cases in your program and add checks.

## Compile-time errors


Compile-time errors are errors that prevent a program compiling.
For example:
- syntax errors: incorrect keyword, typo, missing parenthesis or brace;
- incorrect imported package name;
- non-existing method invocation.

To avoid such errors, programmers use modern IDE (Integrated Development Environment) with a static code analyzer. 

## Run-time errors

Run-time errors (also known as "bugs") are errors that occur when the program is running. Run-time errors will cause your program to behave unexpectedly or may even stop the execution.

There are two subtypes of run-time errors:

- logic errors – when a program produces a wrong result because the code is not correct (for example, instead of "Hello!", your program outputs "Hi!");
- **unhandled exceptions** like division by zero, not found files, and other unexpected cases.

There are different strategies to find such errors:

- to debug your program;
- to write automatic tests for your program;
- to use code review practice as part of the development process. In general, this practice stands for a case when one or more developers visually inspect the source code of a program.