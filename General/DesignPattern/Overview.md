# Design Pattern

In application development, the design of code has to match the problem and be general enough in order to fit all the requirements that may arise in the future. Everyone tries to find more elegant, suitable and flexible solutions that can also be reused.


The structure of design patterns is strict: describe the problem, the solution, when to apply the solution, and its consequences. Theoretically, you can combine a few patterns and create your own monster pattern that contains, for example, Builder, Abstract Factory and Decorator simultaneously. 

However, as you will see from the following topics, it's better to avoid such monsters because patterns have already been well-grouped for you. In other words, don't get too excited, **it's really better to use them one at a time.**


Here is a list of quite convincing reasons to get familiar with design patterns:

- Patterns provide **tested and commonly used solution templates** for design problems; you don't have to invent anything!
- Patterns **improve flexibility and maintainability** of object-oriented systems, which makes it easier to react to changing requirements.
- Patterns can **speed up the development process**.
- Patterns are a **universal vocabulary** that allows developers to describe a program design using a set of well-known identifiable concepts.
- Patterns are **often used in standard libraries and frameworks**.
- You can find patterns in the source codes of many applications and **quickly understand how they work**, instead of reading thousands of lines of code.


even though patterns are supposed to make things easier for you, they may also become an unnecessary complication if applied unwisely.

## Creational design patterns

Creational design patterns are design patterns that focus on making objects through a mechanism for a required application. This pattern separates your system's main functions from the process of object creation. **The concept of creational design patterns allows us to develop more flexible systems in terms of object creation.**

### Using creational patterns
**Creational patterns are one of the ways to get rid of hard coding**. It allows us to make a system that does not depend on the way its objects are created. 
Here are a few situations when you should apply creational patterns:

- Designing a set of related objects that are to be used together.
- Hiding the implementation of a class library, revealing only its interfaces.
- Constructing different representations of independent complex objects.
- A class delegates its subclass to implement the object it creates.
- There must be a single instance and the client can access this instance at all times.


**So you should keep in mind the situations described above to get the most benefits out of creational design patterns.**

## Types of creational patterns

There are five most common types of creational patterns.

- **Factory method** is a pattern that creates an interface or abstract class for object creation that also allows for a modification of object creation in subclasses. You could use this pattern when you don't know beforehand the exact types and dependencies of the objects your code should work with.

- **Singleton** is a pattern that creates only one instance of an object while providing a point of global access to this instance. This pattern should be implemented when the class in your program should have just a single instance available to all clients.

- **Prototype** is a pattern based on the concept of copying an existing class for the creation of a new one. Use this to reduce the number of subclasses that only differ in the way they initialize their objects.

- **Builder** is a pattern that lets you design complex objects using simple objects using a step-by-step approach. This allows you to create different modified variations of the same object.

- **Abstract factory** is a pattern that works with a method that creates other factories. Its factories could further be used for a factory method.