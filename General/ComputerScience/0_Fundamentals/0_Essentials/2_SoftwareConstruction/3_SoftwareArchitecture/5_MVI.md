## MVI

MVI (Model-View-Intent) is also a popular architecture in modern Android development since Jetpack Compose has brought declarative programming to our lives.

MVI pattern focuses on the single source of truth principle to provide immutable states to other layers and unidirectional and immutability of states that represent the result of user actions and configure UI screens.


![](/resources/mvi-func2.avif)


Unlike MVVM and MVP, the definition of each component of the MVI (Model-View-Intent) is slightly different:

Intent: Intent is a definition of interfaces and functions that handle user actions (UI events, such as button click events). The functions transform UI events into Model’s interfaces and deliver the result to Model for manipulating it. As its name implies, we could say we have the intention to perform Model functions.

Model: The definition of Model in MVI is completely different compared to MVP and MVVM. In MVI, Model is a functional mechanism that takes the output from Intent and manipulates it to UI states that could be rendered in View. The UI states are immutable and come from business logic, which follows single source of truth and unidirectional data flow.

View: View in MVI has the same responsibilities as MVP and MVVM, which represents the screen and user interactions, such as listeners, and does not contain business logic. One of the biggest differences in implementation from other patterns is that the MVI ensures unidirectional data flow, so View renders UI elements depending on UI states that come from the Model.