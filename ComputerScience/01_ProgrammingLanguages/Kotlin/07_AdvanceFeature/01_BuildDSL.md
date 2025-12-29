# Build DSL

## DSL-Specific Kotlin Features

Kotlin offers several features that make DSL design easy and elegant:

- **Lambda with receiver** - Allows for scoped configuration blocks.
- **Scope functions** - Functions like `apply`, `run`, `with`, and `also` help create fluent builder-style APIs. Learn more.
- **@DslMarker** - A special annotation that prevents conflicts between nested DSL scopes. We'll explore this in more detail below.


## Building the Validation DSL step-by-step

Our goal is to write clear Kotlin DSL code like:

```kotlin
validation {
    field("email") {
        mustNotBeEmpty()
        mustContain("@")
    }
    field("age") {
        mustBeGreaterThan(18)
    }
}
```

In this DSL block, we configure two fields (`email` and `age`) and assign rules to each. These rules will later be used to validate user input.


To implement this DSL, we must define:

- A `ValidationBuilder` to manage overall structure and store fields

- A `FieldBuilder` to manage the rules for a specific field

- Functions like `mustNotBeEmpty()` and `mustContain()` to define the actual rules

### Rules

A Rule is composition of an error message and a function that checks whether a given value is valid.

Here's how we define the structure for these rules:

```kotlin
typealias ErrorMessage = String
typealias ValidationResult = (String) -> Boolean

data class Rule(val errorMessage: ErrorMessage, val check: ValidationResult)
```

The `ValidationResult()` is a function that takes a `String` and returns `true` if the value passes the check. This design allows us to store the logic and execute it later.

### FieldBuilder

The first required builder is responsible for defining and collecting the validation rules for a single field.

```kotlin
annotation class ValidationDsl // our custom annotation   

@ValidationDsl 
class FieldBuilder(val name: String) {
    private val _rules = mutableListOf<Rule>()
    val rules: List<Rule> get() = _rules.toList()

    fun mustNotBeEmpty() {
        _rules.add(Rule("$name cannot be empty") {
            it.isNotEmpty()  // Check if field is not empty
        })
    }

    fun mustBeGreaterThan(number: Int) {
        _rules.add(Rule("$name must be greater than $number") {
            val parseResult = it.toIntOrNull() // Try to parse to Int
            parseResult != null && parseResult > number  // Compare if valid
        })
    }

    fun mustContain(char: Char) {
        _rules.add(Rule("$name must contain $char") {
            it.contains(char)
        })
    }
}
```
### ValidationBuilder

This other necessary builder will be responsible for managing all the fields and validating them against the registered rules.

```kotlin
@ValidationsDsl
class ValidationBuilder {     
    private val _fields = mutableListOf<FieldBuilder>()


    fun field(name: String, block: FieldBuilder.() -> Unit) {
        val fieldBuilder = FieldBuilder(name)
        block(fieldBuilder)
        _fields.add(fieldBuilder)
    }

    fun validate(data: Map<String, String>): List<String> {
        val errors = mutableListOf<String>()

        // Iterate over all fields and apply rules
        for (field in _fields) {
            val value = data[field.name] ?: ""

            for (rule in field.rules) {
                if (!rule.check(value)) errors.add(rule.errorMessage.format(field.name))
            }
        }

        return errors
    }
}
```

### DSL Entry Point

We need to connect our DSL somehow. Let's add a function that enables the top-level `validation()` block.

```kotlin
fun validation(block: ValidationBuilder.() -> Unit): ValidationBuilder {
    val builder = ValidationBuilder()
    block(builder)
    return builder
}
```

This function creates and returns a fully configured `ValidationBuilder` .

```kotlin
fun main() {
    // Create the validation DSL structure
    val validation = validation {
        field("email") {
            mustNotBeEmpty() // Rule: email must not be empty
            mustContain("@")  // Rule: email must contain @
        }
        field("age") {
            mustBeGreaterThan(18) // Rule: age must be greater than 18
        }
    }
    // Example input data to validate
    val data = mapOf(
        "email" to "userexample.com",
        "age" to "17"
    )

    // Run the validation and collect the result
    val result = validation.validate(data)
    if (result.isEmpty()) {
        println("All validations passed!")
    } else {
        println("Validation failed:")
        result.forEach { println("- $it") } // Print each error message
    }
}
```

## Controlling Scope with `@DslMarker` 

When designing complex and nested DSLs, it’s important to prevent unintended access to outer scopes.

Kotlin provides the `@DslMarker` annotation to help enforce scope rules.

```kotlin
// Assume basic DSL functions are defined like this:
@DslMarker
annotation class ValidationDsl
```

We then apply this annotation to our builder classes:

```kotlin
@ValidationDsl
class ValidationBuilder {  }

@ValidationDsl
class FieldBuilder(val name: String) {  }
```

Without `@DslMarker` we can accidentally create DSL like this:


```kotlin
// Assume basic DSL functions are defined like this:
fun validation(block: ValidationBuilder.() -> Unit) = ...
fun ValidationBuilder.field(name: String, block: FieldBuilder.() -> Unit) = ...

validation {
    field("name") {
        field("nested") {
            validation {
                // This is confusing and should not be allowed
            }
        }
    }
}
```

This type of nesting doesn’t make sense in our DSL. Without the `@DslMarker`, the compiler allows it. With this annotation applied, Kotlin will raise an error like:

```kotlin
// Compiler error:
fun field(name: String): Unit can’t be called in this context by implicit receiver. Use the explicit one if necessary
```
This ensures that each block can access only its relevant scope.

## Key principle: How a DSL Works

We just build a DSL, now let's see how it works under the hood. 
A DSL is essentially a configuration block that collects and stores logic to be executed later.

When we call `validation`, we build an internal object using a **lambda with a receiver**: the `ValidationBuilder` becomes the receiver (`this`) of that block.

This allows us to write DSL-style code like `field("email")` directly, instead of calling methods on an object explicitly.

Each `field` call creates a new context, a sub-builder, responsible for gathering rules related to that specific field.


Each rule, like `mustNotBeEmpty()`, is simply a lambda or function call that gets added to a list of validation checks. These rules are not executed immediately: when we later call something like `validate(data)`, that’s when the rules are evaluated. The DSL just collects all the logic, storing it in a structured way.

This separation between configuration and execution is what makes DSLs powerful: 
they allow users to **express intent** clearly, while the actual logic stays hidden inside well-designed builder classes.

## Benefits of using a DSL vs Traditional Code

Traditional validation approaches often involve imperative code with multiple `if` statements:

```kotlin
if (email.isEmpty()) {
    errors.add("email cannot be empty")
}
if (!email.contains("@")) {
    errors.add("email must contain '@'")
}
if (age.toIntOrNull()?.let { it <= 18 } != false) {
    errors.add("age must be greater than 18")
}
```


This can become verbose and harder to maintain as the number of validations grows.

Using a DSL:
- **Improves readability**: Validation rules are declared in a structured and human-readable format.
- **Enhances maintainability**: Adding or modifying rules is straightforward and localized.
- **Promotes reusability**: Common validation logic can be encapsulated within DSL functions.

## Extending the DSL

Once our DSL is structured, extending it is straightforward.

For example, we can define additional rule functions like `mustBeLessThan()` or `mustStartWith()` and add them to the `FieldBuilder`. 
These functions follow the same pattern as the ones we defined and allow the DSL to support more cases.

Another interesting improvement is making the DSL type-safe by passing a data class as a generic type to the validator. 

This would allow the DSL to access the fields directly, making validation safer and more expressive.



