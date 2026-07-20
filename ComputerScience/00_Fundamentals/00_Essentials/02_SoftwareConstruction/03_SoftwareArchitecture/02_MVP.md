# MVP - Model View Presenter

The MVP architecture pattern provides an easy way to structure project code.
Its widespread acceptance stems from its ability to offer modularity, testability, and a cleaner, more maintainable codebase. It consists of the following three components:

- `Model`: The Model represents a set of classes that describe the data and business logic. It also defines the business rules for the data, meaning how the data can be changed and manipulated.
- `View`: The `View` is responsible for user interactions, and it tracks user actions to notify the `Presenter`.
- `Presenter`: The `Presenter` acts as an intermediary between the `View` and the `Model`.


It retrieves data from the `Model` and displays it on the `View`, while also handling user events from the `View` and passing them to the `Model` for processing.
The `Presenter` is also responsible for handling complex processing logic or business logic, preventing the `View` from performing these tasks.

## Advantages of MVP

- Clearer and more intuitive structure compared to MVC.
- Easy to write unit tests for the `Presenter` since it operates independently of the `View` 

## Disadvantages of MVP

- The model grows larger over time.
- The `Presenter` expands as more business logic is added, making it harder for users to manage and break down the code when it becomes too large.




