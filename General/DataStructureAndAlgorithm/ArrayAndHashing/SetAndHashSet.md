# Set and Hash Set

## Set

- A `Set` is an interface that defines the contract for a collection that stores unique elements. 
It represents the mathematical concept of a set, where no duplicate elements are allowed.
- The `Set` interface specifies methods for adding, removing, and checking for the presence of elements, 
but it does not provide an implementation for how these operations are carried out.
- It is a subtype of the `Collection` interface.

## HashSet

- A `HashSet` is a concrete class that provides a specific implementation of the `Set` interface.
- It uses a hash table for storage, which allows for very efficient (average O(1)) operations for adding, removing, and checking for the presence of elements.
- Elements in a HashSet are not stored in any particular order, and their iteration order is not guaranteed to be consistent.

## Key Differences
The most important difference between them is **mutability**.
but is probably immutable (not implementing the `MutableSet` subinterface), and so can't be changed.







