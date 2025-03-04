# MVC

MVC, or Model-View-Controller, is a design pattern that organizes an application into three parts:

- `Model`: Manages data and business logic, representing the application's state.
- `View`: Displays the user interface, showing data from the Model to users.
- `Controller`: Handles user inputs from the `View`, updates the `Model`, and ensures the `View` reflects changes.

When a user interacts with the View, the Controller processes the input, updates the Model, and the Model notifies the View to refresh

## Advantages of MVC
- Lightweight, resource-efficient.
- Simple structure.
- Easy to test and debug.
- Easy separation of `Model` and `View` components.
## Disadvantages of MVC
- Suitable only for large projects; for small projects, the model becomes bulky and time-consuming due to data transfer overhead.
- `Controller` complexity increases over time.
- `Controller` is tied to the `View`, so changes in the `View` require corresponding changes in the `Controller`.
