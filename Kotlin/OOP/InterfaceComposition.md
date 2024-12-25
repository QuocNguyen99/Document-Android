# Interface Composition

## Let's begin with resolving conflicts

When it comes to multiple inheritance, there are a few pitfalls that are to be avoided.
For example:

```kotlin
interface FirstInterface {  
    fun f() { print("First") }  
    fun g()  
}  
  
interface SecondInterface {  
    fun f() { print("Second") }  
    fun g() { print("g") }  
}  
  
class FirstClass : FirstInterface {  
    override fun g() { print("g") }  
}  
  
class SecondClass : FirstInterface, SecondInterface {  
    override fun f() { print("Class")}  
}
```
There is no such problem in the case of `FirstClass`: it only implements one interface.


`SecondClass`, however, implements both interfaces; therefore, the compiler can't choose between the two provided function signatures. Alright, let's fix it:

```kotlin
class SecondClass : FirstInterface, SecondInterface {  
    override fun f() { print("Class")}  
    override fun g() {  
        super.g()  
    }  
}
```

This will work because only one interface actually provides the default implementation – it's `SecondInterface`. 
But what if our interfaces look as follows?

```kotlin
interface FirstInterface {  
    fun f() { print("First") }  
    fun g() { print("not g") }  
}  
  
interface SecondInterface {  
    fun f() { print("Second") }  
    fun g() { print("g") }  
}
```

Then we'll get an error, as the compiler does not know which function to use – the one in the first or the second interface. 
This can be solved by the following syntax:

```kotlin
class ThirdClass : FirstInterface, SecondInterface {  
    override fun f() {  
        super<FirstInterface>.f()  
        super<SecondInterface>.f()  
    }  
  
    override fun g() {  
        super<SecondInterface>.g()  
    }  
}
```
Here, using angle brackets, we show from which of the interfaces we call the function.

## Idea of composition

As you can see, inheritance as a design pattern has its own flaws.
There's an alternative to it, which features same code reuse, and it's called **composition**.
Suppose we'd like to create a game.
For example, the characters in our game have 3 parameters:

- **Level**: how powerful they are
- **Enemy**: whether the character is an enemy or an ally
- **Class**: what the character can do, i.e., fight with a sword or cast spells

Following inheritance principles, we might implement it as follows:

```kotlin

interface Level {  
    fun getLevel(): Int  
}  
  
interface Enemy {  
    fun isEnemy(): Boolean  
}  
  
interface Class {  
    fun getClass(): String  
}
```
And for each character we would need to write quite a lot of code:

```kotlin
class DangerousEnemyWarrior : Level, Enemy, Class  
{  
    override fun getLevel(): Int { return 10 }  
  
    override fun isEnemy(): Boolean { return true }  
  
    override fun getClass(): String { return "Warrior" }  
}
```
Note: we've created a character of the 10th level,
who is an Enemy to the player and belongs to the class Warrior.

For each new character, we'd need to manually set all these parameters.
How about we try to reuse the same parameters to optimize the process?

## Composition in code

The paradigm to implement it in a more efficient fashion is known as composition.

Instead of implementing a lot of interfaces and having to override all of their methods and fields,
we can create their implementations in advance and store them as separate entities (objects in the example below).
Then we can simply compose a needed object out of these "building blocks".

And that's where delegation comes into play,
since it's a very convenient way in Kotlin to reference an existing implementation instead of providing it where it's needed.
Take a look at the example below:


```kotlin
// We only need to create all these objects once

object Dangerous : Level { override fun getLevel(): Int { return 10 } }  
  
object NotDangerous : Level { override fun getLevel(): Int { return 1 } }  
  
object Foe : Enemy { override fun isEnemy(): Boolean { return true } }  
  
object Friend : Enemy { override fun isEnemy(): Boolean { return false } }  
  
object Warrior : Class { override fun getClass(): String { return "Warrior"}}  
  
object Wizard : Class { override fun getClass(): String { return "Wizard"}}

// And then we're free to use them as many times as we'd like!

class DangerousKotlinEnemyWarrior : Level by Dangerous, Enemy by Foe, Class by Warrior  
  
class NotDangerousFriendlyWizard : Level by NotDangerous, Enemy by Friend, Class by Wizard
```
Creating classes in this fashion is way easier and more compact.


