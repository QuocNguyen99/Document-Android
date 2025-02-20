# Facade pattern

The **facade design pattern** is a structural design pattern that provides the client with an **interface**
for accessing parts of the system which could be hidden to avoid showing the complexity of the code

Usually, this pattern is used when you need to provide
a simple way to access a library or a framework.

## Facade pattern goal

A facade works through an interface with the same name. If you have worked with a library or a framework with lots of different classes, you could have worked with them using special objects. These objects were probably created as a facade.

The facade interface provides simplified access to methods of classes that are hidden from the client.


It could be constricted access, compared to direct access to these classes.
But this approach will relieve clients from functions in which users are not interested. 

But, as you can guess, a facade object could become a god object, meaning that it could do or know too much.
So, if it becomes too big, consider diverting some of its functions by creating other facade objects.




























