| Feature               | MVC (Model-View-Controller) | MVP (Model-View-Presenter) | MVVM (Model-View-ViewModel) | Clean Architecture | MVI (Model-View-Intent) |
|-----------------------|---------------------------|---------------------------|---------------------------|-------------------|-------------------------|
| **Data Flow**        | Bidirectional             | Bidirectional             | Unidirectional           | Strictly layered, follows Dependency Rule | Unidirectional |
| **UI Dependency on Business Logic** | High       | Medium                     | Low                        | Very Low          | Very Low |
| **Testability**       | Low                        | Medium                     | High                      | Very High        | Very High |
| **Complexity**        | Low                        | Medium                     | Medium                     | High             | High |
| **Separation of Concerns** | Weak                   | Moderate                    | Strong                    | Very Strong      | Very Strong |
| **Best Use Case**     | Simple applications       | Medium-sized apps          | Large-scale apps          | Enterprise apps  | Apps with complex state management |
| **UI Change Flexibility** | Low                   | Medium                      | High                       | Very High        | Very High |
| **State Management**  | Weak                       | Moderate                    | Moderate                   | Strong           | Strong (Immutable State) |
| **Dependency on Frameworks** | High               | Medium                      | Medium                     | Low              | Low |
