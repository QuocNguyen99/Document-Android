# Architecture


## MVVM

Nowadays MVVM (Model-View-ViewModel) is one of the most popular architecture designs in modern Android development since Google officially announced Architecture Components, such as ViewModel, LiveData and Data Binding.

Historically it has already been used by WPF developers for more than a decade since The Model-View-ViewModel Pattern was introduced by Microsoft.



## Clean Architecture

The clean architecture has been used widely in modern Android development since dependency injection solutions (like Dagger) and multi-module project environments have been introduced. **Also, this theory can be used with other architectures, such as MVP, MVVM, and MVI.**


This architecture brings the following advantages: isolating modules, increasing reusability, improving scalability, and making it easy to write unit test cases. **But if you’re working on a small project, which doesn’t need complicated business logic, this architecture might be overkill**, so you should investigate if the architecture gives advantages to your project.

Before diving into the clean architecture theory, we will discuss the [SOLID](/General/ComputerScience/0_Fundamentals/0_Essentials/2_SoftwareConstruction/4_DesignPrinciple/SOLIDPrinciple/SOLIDPrinciple.md) design principles, which were introduced in one of Uncle Bob’s clean book series.