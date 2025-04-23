# ArrayDeque

we will learn to work with collections like Stacks and Queues with the help of `ArrayDeque`.

> [!NOTE]
> In the JVM, the Stack class models and implements the Stack data structure using the LIFO strategy
> It is a Java Class; it does not belong to pure Kotlin collections, so you must import it to be able to use it (import java.
> util.stack).  If you want an alternative, a collection based on Kotlin, you can use ArrayDeque.

if you need the FIFO and LIFO behavior, whether both or just one of them, it is better to use `ArrayDeque` because it's much more efficient than Java `Stack` or `List` and it is a 100% pure Kotlin collection. Java Stack inherits from the `Vector` class. `Vector` implements a growable array of objects; it is very similar to `ArrayList`, but `Vector` **is synchronized**, which means that in a multithreading environment, it holds other threads in a runnable or non-runnable state until the current thread releases the lock of the object to perform an operation. On the other hand, the `Vector` class and some of its methods are now obsolete and have been replaced by `ArrayDeque`, which is better adapted to FIFO/LIFO strategies and **is more optimized for concurrent and multithreaded environments**.

## Stack and queue

An `ArrayDeque` is a collection that implements both the `Queue` (First-In-First-Out) principle and the `Deque` (double-ended queue, First-In-First-Out, Last-In-First-Out) principles; It allows you to add and remove elements from both sides or ends of the collection.

It also implements the `MutableList` interface and supports efficient get/set operations by index. So, with it, you can also use all the familiar `MutableList` methods.

Now, why do we need `ArrayDeque` if we can perform similar tasks using `MutableList`? You should use `ArrayDeque` **whenever you need the functionality of a “double-ended queue”, queue, or stack**: its methods have been semantically adapted to functionally comply with such tasks.


```kotlin
fun main() {
    val deque = ArrayDeque<Int>()

    // as a queue, FIFO on both sides
    deque.addLast(1)
    deque.addLast(2)
    deque.addLast(3)
    println(deque) // [1, 2, 3]
    deque.removeFirst()
    deque.removeFirst()
    println(deque) // [3]

    // as a stack, LIFO on one side, i.e., the end
    deque.addLast(1)
    deque.addLast(2)
    println(deque) // [3, 1, 2]
    deque.removeLast()
    deque.removeLast()
    println(deque) // [3]
    // or LIFO on the other side, i.e., the start
    deque.addFirst(1)
    deque.addFirst(2)
    println(deque) // [2, 1, 3]
    deque.removeFirst()
    deque.removeFirst()
    println(deque) // [3]

}
```

## adding element

Imagine that you want to add elements to a collection. You can do it at the beginning or at the end. Remember, if you want a queue, you must add elements at the end ; if you want a stack, you can add them at the beginning . Here are some methods to perform these tasks:

- `add()`: adds the specified element at the end of the list and returns true. You can pass the index as a parameter to add the element at a certain position.

- `addAll()`: adds all elements (collection) at the end or, if you pass an index, at this index position. It returns true because the list is always modified as the result of this operation.

- `addFirst()`: prepends the specified element to the collection. It means, adds it at the beginning. It returns Unit.

- `addLast()`: appends the specified element to the deque. It means, adds it at the end. It returns Unit.

## Removing elements

The next step is removing elements of the collection: you can process the first item – or clean the top item. Here are some methods to perform these tasks:

- `remove()`: removes a single instance of the specified element from the collection if it is present. It will returns true if the element has been successfully removed and false if it is not present in the collection.

- `removeAll()`: removes all of the collection elements that are also contained in the specified collection. It will return true if any of the specified elements was removed from the collection and false if the collection was not modified.

- `removeAt()`: removes the element at the specified index from the list. It will return the element that has been removed or throws `IndexOutOfBoundsException` if the index from the element is out of bounds.

- `removeFirst()`: removes the first element from the deque and returns that removed element or throws `NoSuchElementException` if the deque is empty.

- `removeFirstOrNull()`: removes the first element from the deque and returns that removed element or returns null if the deque is empty.

- `removeLast()`: removes the last element from the deque and returns that removed element or throws `NoSuchElementException` if the deque is empty.

- `removeLastOrNull()`: removes the last element from the deque and returns that removed element or returns null if the deque is empty.

## Getting elements

Imagine that you want to know who is queuing at the supermarket or what the first or last dirty plate in the pile is without processing it. You can get elements of a collection with:

- `get()`: returns the element at the specified index in the list (and also you can use []) or throws `IndexOutOfBoundsException` if the index from the element is out of bounds.

- `first()`: returns the first element or throws `NoSuchElementException` if the deque is empty.

- `firstOrNull()`: returns the first element or `null` if the deque is empty.

- `last()`: returns the last element or throws `NoSuchElementException` if the deque is empty.

- `lastOrNull()`: returns the last element or `null` if the deque is empty.


## ArrayDeque vs MutableList, which should you choose?

`ArrayDeque` and `MutableList` have different performance characteristics for various operations

### 1. **Adding/removing elements at the beginning**:

- **ArrayDeque**: Adding or removing an element from the start of the queue typically occurs in constant time `O(1)`. This is due to the bidirectional structure of `ArrayDeque`.

- **MutableList**: Adding or removing an element from the start of the list requires shifting all subsequent elements, making these operations proportional to the size of the list — `O(n)`.
### 2. **Adding/removing elements at the end**:
- **ArrayDeque**: Just like at the beginning, adding or removing an element from the end of the queue usually happens in constant time `O(1)`.
- **MutableList**: Adding an element to the end of the list typically happens in constant time `O(1)`, except when array resizing is required. Removing from the end of the list also happens in `O(1)`.
### 3. **Accessing elements**:
- **ArrayDeque**: Accessing an arbitrary element by index might take longer than in `MutableList` because the internal representation of `ArrayDeque` is a circular buffer.

- **MutableList**: Access to elements by index occurs in constant time `O(1)`.

> [!TIP]
> In practice, the choice between ArrayDeque and MutableList depends on which operations are most frequent and critical for your application.