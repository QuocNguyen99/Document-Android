# Unidirectional data flow

A unidirectional data flow (UDF) is a design pattern where state flows down and events flow up.  By following unidirectional data flow, you can decouple composables that display state in the UI from the parts of your app that store and change state.

The UI update loop for an app using unidirectional data flow looks like this:

- **Event**: Part of the UI generates an event and passes it upward, such as a button click passed to the ViewModel to handle; or an event is passed from other layers of your app, such as indicating that the user session has expired.

- **Update state**: An event handler might change the state.
- **Display state**: The state holder passes down the state, and the UI displays it.

![](../../resources/state_hosting.avif)

Following this pattern when using Jetpack Compose provides several advantages:

- **Testability**: Decoupling state from the UI that displays it makes it easier to test both in isolation.
- **State encapsulation**: Because state can only be updated in one place and there is only one source of truth for the state of a composable, it's less likely that you'll create bugs due to inconsistent states.
- **UI consistency**: All state updates are immediately reflected in the UI by the use of observable state holders, like `StateFlow` or `LiveData`.