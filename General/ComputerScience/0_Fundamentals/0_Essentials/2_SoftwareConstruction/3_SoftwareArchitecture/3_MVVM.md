# MVVM: Model-View-ViewModel


This pattern is based on MVC and MVP and aims to more clearly separate the development of the user interface (UI) from the business logic and behavior in an application.

MVVM addresses the drawbacks of the MVP pattern by suggesting a separation between the data presentation logic (Views or UI) and the core business logic of the application.
The distinct code layers of MVVM are:

- `Model`: This layer is responsible for abstracting the data sources. The `Model` works together with the `ViewModel` to retrieve and save data.
- `View`: The purpose of this layer is to notify the `ViewModel` about user actions. It observes the `ViewModel` and contains no application business logic.
- `ViewModel`: This layer exposes data streams relevant to the `View`. It also serves as a bridge between the `Model` and the `View`.

## Advantages of MVVM

- Users can perform unit testing without depending on the `View`.
- Testing does not require creating mockups as in MVP; it only needs to verify the appropriate observable variables.
- Uses XAML for the `View`, allowing UI modifications without affecting the code.
- Clearly separates the three components, making it very easy to develop, test, and debug the code.

## Disadvantages of MVVM
- When binding many variables to the `View`, the logic becomes scattered and grows over time, making code control more difficult.
- Two-way data binding consumes significant memory resources.









































