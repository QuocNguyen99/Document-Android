# Command Design Pattern


## Problem

When handling buttons with different functions, a common approach is to create multiple subclasses for each button. However, this leads to tight coupling between the GUI and business logic, making the code fragile and hard to maintain.

The Command Design Pattern offers a better solution by encapsulating requests as objects, allowing for the decoupling of the sender and receiver. This enhances code flexibility and scalability.

![NOTE]
>  a "volatile" variable is a directive to the compiler, indicating that a variable's value can be changed unexpectedly by external events

## Key Components

- Command Interface:
Declares an `execute()` method for executing operations.

- Concrete Command:
Implements the `execute()` method by invoking corresponding operations on the receiver.

- Receiver:
Knows how to perform the operations associated with carrying out a request.

- Invoker:
Asks the command to carry out the request.

- Client:
Creates a concrete command object and sets its receiver.

## Benefits:

- Decoupling: Separates the object that invokes the operation from the one that knows how to perform it.

- Undo/Redo Functionality:
Supports reversible operations by storing state.

- Command Queuing: Allows for queuing of requests, enabling delayed or scheduled execution.



## Considerations:

**Complexity**, Introducing numerous command classes can increase the system's complexity.






