# Coupling and cohesion

## Coupling

**Coupling** is the degree to which software components depend on each other. There are two basic levels of coupling: **tight** and **loose**.

Loose coupling means less interdependence between classes, whereas in tight coupling it's the opposite. 

The difference is that in tight coupling, one class strongly depends on another and knows too much about its methods. 
But, in loose coupling one class knows little about object creation and methods in another class. This makes these classes less interdependent on each other.


The simplest way to loosen coupling is by implementing an interface in your code. There are also other ways to loosen coupling, like dependency injection.

### Tight coupling example

Let's assume you're building a robot. A central part of this robot is an engine that cannot be easily replaced

```
class Engine is
   method run() is

class Robot is
   Engine eng = new Engine()
   eng.run()
```

Here, the `Robot` class is dependent on `Engine` and needs to create an instance of it. 
Your dependent class knows too much about methods in this case, which tightens this coupling. Any changes in `Engine` will force you to change `Robot` as well. 
So, if the engine doesn't work, the whole robot will stop functioning.


### Loose coupling example

```
// Define an interface for the Engine
interface IEngine is
   method run()

// Concrete implementation of the IEngine interface
class StandardEngine implements IEngine is
   method run() is
     print("Standard Engine is running")

class AdvancedEngine implements IEngine is
   method run() is
     print("Advanced Engine is running")

// Robot class depends on the abstraction, not a concrete class
class Robot is
   IEngine eng

   constructor Robot(IEngine eng) is
      this.eng = eng

   method start() is
      eng.run()

// Instantiate a Robot with a specific engine implementation
class Main is
   method main() is
      IEngine standard = new StandardEngine()
      Robot robot1 = new Robot(standard)
      robot1.start()

      IEngine advanced = new AdvancedEngine()
      Robot robot2 = new Robot(advanced)
      robot2.start()
```

This provides a layer of abstraction and allows the `Robot` class to interact with any implementation of the engine. The specific engine type is injected into the `Robot` class via its constructor. This approach adheres to the Dependency Inversion Principle. If a new engine type is needed, you can create a new class that implements `IEngine` without modifying the `Robot` class.

## Cohesion

**Cohesion** is a representation of class functions. It is a measure of how closely related the responsibilities of a component are.

- **Low cohesion** suggests that a component is trying to perform too many unrelated tasks, making it harder to maintain and understand. 

- **High cohesion** indicates that a component performs a single task or a group of related tasks, leading to more understandable and maintainable code.


## Conclusion

Let's summarize what we know about coupling and cohesion.

- You should try to achieve loose coupling. Loose coupling makes parts of your code less interdependent on each other. The easiest way you can achieve it is with interfaces and dependency injection.

- Parts of your code should have high cohesion, so that they can be more focused. This will make them more reusable and easier to test.