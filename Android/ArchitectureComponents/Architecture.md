# Architecture

Architecture is one of the essential parts of modern Android development, which decides the overall code complexity and expense of your project management.

![](../../resources/architecture.avif)

As the number of features in a project increases, the lines of code and code cohesiveness increase accordingly. Application architecture extensively affects your project’s complexity, scalability, and robustness and makes it easier to test. By defining the boundaries between each layer, you can define their responsibilities clearly and separate each responsibility by modularizing them as dedicated roles.

Historically, the trends of architecture for Android have changed over the last few years, depending on available solutions and best practices.

Seven to eight years ago, Android projects were built with MVC and MVP architecture patterns, but now most projects are built with MVVM and MVI architecture patterns since useful subscription solutions have been introduced, such as RxKotlin, Kotlin Flows, and LiveData.

In this section, you’ll learn about the most popular architecture patterns in recent years: MVVM, MVI, and Clean Architecture.


## MVVM

Nowadays MVVM (Model-View-ViewModel) is one of the most popular architecture designs in modern Android development since Google officially announced Architecture Components, such as ViewModel, LiveData and Data Binding.

Historically it has already been used by WPF developers for more than a decade since The Model-View-ViewModel Pattern was introduced by Microsoft.

## MVI

MVI (Model-View-Intent) is also a popular architecture in modern Android development since Jetpack Compose has brought declarative programming to our lives.

MVI pattern focuses on the single source of truth principle to provide immutable states to other layers and unidirectional and immutability of states that represent the result of user actions and configure UI screens.


![](../../resources/mvi-func2.avif)


Unlike MVVM and MVP, the definition of each component of the MVI (Model-View-Intent) is slightly different:

Intent: Intent is a definition of interfaces and functions that handle user actions (UI events, such as button click events). The functions transform UI events into Model’s interfaces and deliver the result to Model for manipulating it. As its name implies, we could say we have the intention to perform Model functions.

Model: The definition of Model in MVI is completely different compared to MVP and MVVM. In MVI, Model is a functional mechanism that takes the output from Intent and manipulates it to UI states that could be rendered in View. The UI states are immutable and come from business logic, which follows single source of truth and unidirectional data flow.

View: View in MVI has the same responsibilities as MVP and MVVM, which represents the screen and user interactions, such as listeners, and does not contain business logic. One of the biggest differences in implementation from other patterns is that the MVI ensures unidirectional data flow, so View renders UI elements depending on UI states that come from the Model.

## Clean Architecture

The clean architecture has been used widely in modern Android development since dependency injection solutions (like Dagger) and multi-module project environments have been introduced. **Also, this theory can be used with other architectures, such as MVP, MVVM, and MVI.**


This architecture brings the following advantages: isolating modules, increasing reusability, improving scalability, and making it easy to write unit test cases. **But if you’re working on a small project, which doesn’t need complicated business logic, this architecture might be overkill**, so you should investigate if the architecture gives advantages to your project.

Before diving into the clean architecture theory, we will discuss the [SOLID](../../General/SOLIDPrinciple.md) design principles, which were introduced in one of Uncle Bob’s clean book series.