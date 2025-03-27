# Liskov Substitution Principle

The Liskov Substitution Principle states that subclasses should be substitutable for their base classes. That should be able to replace base classes objects without affecting the program's correctness.

## Tips to avoid violating the Liskov Substitution Principle

### 1. Ensure the subclass methods maintain the behavior of the superclass

A subclass must not change the meaning of an inherited method.
If a subclass overrides a method, it should still perform a similar function rather than completely altering the logic.

Inncorrect example:

```java
class Bird {
    void fly() {
        System.out.println("I'm flying");
    }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}
```
Issue: `Penguin` cannot replace `Bird` because it does not support flying.

Instead of inheriting from `Bird`, extract a `Flyable` interface so only birds that can fly implement it.

```java
interface Flyable {
    void fly();
}

class Bird { }

class Sparrow extends Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("I'm flying");
    }
}

class Penguin extends Bird { }
```

### 2. Avoid unexpected state or behavior changes

```java
class Rectangle {
    protected int width, height;

    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int getArea() { return width * height; }
}

class Square extends Rectangle {
    @Override
    void setWidth(int w) {
        super.width = w;
        super.height = w;  // ❌ Height is also changed
    }

    @Override
    void setHeight(int h) {
        super.width = h;  
        super.height = h;  // ❌ Width is also changed
    }
}
```

Issue:

If we use `Rectangle rect = new Square();`, modifying `width` or `height` will not behave as expected, causing errors.

Instead of inheriting from `Rectangle`, create separate classes or use an interface.

### 3. Use Composition instead of Inheritance when necessary



```java
class Engine {
    void start() { System.out.println("Engine started"); }
}

class Car extends Engine { } // ❌ Car is not an Engine
```

If a subclass is not truly substitutable for its superclass, Composition should be used instead of inheritance.
```java
class Car {
    private Engine engine = new Engine();
    
    void startCar() {
        engine.start();
    }
}
```

### 4. Apply Interface Segregation to avoid improper inheritance

If a subclass does not need all the methods of its superclass, split the interfaces.

Incorrect Example:

```java
interface Animal {
    void eat();
    void fly();  // ❌ Not all animals can fly
}

class Dog implements Animal {
    @Override
    public void eat() { System.out.println("Dog eats"); }

    @Override
    public void fly() { throw new UnsupportedOperationException("Dogs can't fly!"); } // ❌
}
```

 Issue: `Dog` cannot fly but is forced to implement `fly()`.

```java
interface Eatable { void eat(); }
interface Flyable { void fly(); }

class Dog implements Eatable {
    @Override
    public void eat() { System.out.println("Dog eats"); }
}

class Bird implements Eatable, Flyable {
    @Override
    public void eat() { System.out.println("Bird eats"); }
    
    @Override
    public void fly() { System.out.println("Bird flies"); }
}
```







