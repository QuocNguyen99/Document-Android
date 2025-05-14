# Navigation

Navigation refers to the interactions that let users navigate across, into, and back out from the different pieces of content within your app.

## Key concepts

- **Host**: A UI element that contains the current navigation destination. In **Compose** is `NavHost`, **Fragment**: `NavHostFragment` 

- **Graph**: **A data structure that** defines all the navigation destinations within the app and how they connect together. Both Views and Compose use `NavGraph`

- **Controller**: The central coordinator for managing navigation between destinations. 
The controller offers methods for navigating between destinations, handling deep links, managing the back stack, and more.  Both Views and Compose use `NavController`

- **Destination**: A node in the navigation graph. When the user navigates to this node, the host displays its content. Both Views and Compose use `NavDestination`

- **Route**: Uniquely identifies a destination and any data required by it.
You can navigate using routes. Routes take you to destinations. Usage as Any serializable data type.

## Benefits and features

- **Animations and transitions**: Provides standardized resources for animations and transitions.
- **Deep linking**: Implements and handles deep links that take the user directly to a destination.
- **Type safety**: Includes support for passing data between destinations with type safety.
- **ViewModel support**: Enables scoping a `ViewModel` to a navigation graph to share UI-related data between the graph's destinations.
- **Fragment transactions**: Fully supports and handles fragment transactions.












