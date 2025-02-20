# Bridge pattern

When your project starts to get larger and more complicated, every little change in some of its parts can affect other parts.
This may prevent you from developing new features for your project so as to avoid all the mess that can happen.
One of the few fixes for such a problem is presented in the form of a structural design pattern called Bridge.

**Bridge** is a structural design pattern that works on separation of **abstraction** and **implementation** to make their independent development possible. 

so let's start from the basics. 

- **Abstraction** — A layer that represents the working process to the users and allows them to interact with the system.
This layer isn't doing any real work, as it only delegates it to the implementation.

- **Implementation** — A layer that defines and represents all the actual working processes within your system.
Usually, users don't directly interact with it.

## Bridge applicability

Using separation of abstraction and implementation, you can maintain two independent development directions.
This will allow you to simultaneously work on a UI avoiding interference to your API-related parts and vice versa.

## Bridge in pseudocode

Now let's try to depict our TV with a remote in pseudocode.
First, we will have to describe our TVs.
They will be created through the TV interface:

```
interface TV is
  method isEnabled()
  method enable()
  method disable()
```
This method will be used for each new implementation class.
Now we'll make two implementation classes called SmartTV and SimpleTV:

```
class SmartTV implements TV is
  ...

class SimpleTV implements TV is
  ...
```

This way, abstraction will delegate all the work to implementation referencing that particular field.
It will be a simple remote which can turn on and turn off our TV:

```
class Remote is
  field tv: TV
  
  constructor Remote(tv: TV) is
    this.tv = tv
  
  method power() is
    if (tv.isEnabled()) then
      tv.disable()
    else
      tv.enable()
```

This structure will allow you to create several variations of objects which will be independent of each other.























