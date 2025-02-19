# Structural design patterns

While working with a large application, you will usually encounter problems related to the complexity of a code.

This may disorient and complicate your work. So, to minimize these problems, you should define the proper class structure and their connections to each other.

One useful way to maintain a good object structure is by using a structural design pattern.


## Definition

**Structural design patterns** simplify the structure by defining the relationships between objects.
Using these patterns, you will have a better understanding of whether we need to inherit, compose, or make and maintain any other relationships between system components.

Various design patterns help build a larger structure by defining how each component should be organized.
They ensure that the modules connect flexibly and work smoothly together within a bigger system.


## Types of structural patterns
There are 7 types of structural design patterns:

![alt text](/resources/type_of_structural_patterns.png)

### Adapter
As the name suggests, this pattern focuses on connecting objects with incompatible interfaces.
use this when you want to use some existing class with an incompatible interface.

### Bridge

This pattern separates abstraction and implementation of a class, allowing for their independent development.
use this pattern when you want to split larger classes and form structures that have several variants of some functionality.


### Composite

A pattern that structures objects in a hierarchical fashion so that a client can work with each one of them.
apply this pattern when you want your client to work with different elements of a structure uniformly.

### Decorator

This pattern uses special wrapper objects for enhancement of object behavior without original object modification.
use this pattern to add modifications to objects' behavior without interference with their code.


### Facade
A pattern that provides an interface for a complex set of objects.
use this pattern to provide a simple and straightforward interface to a complex system.

### Flyweight
A pattern that increases the number of objects you can fit into memory by sharing and reusing their common parts.
apply this pattern to a project with a large number of objects to fit them all into your memory.

### Proxy
This pattern provides a substitute or placeholder for another complex object.
this pattern has various implementation variants, from controlling user access to maintaining heavy resources in the background.

> [!CAUTION]
> So you should keep in mind their limitations and goals to avoid overdoing it.

































