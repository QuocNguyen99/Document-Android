# Data structures

Algorithms are not the only thing you need: besides the question of processing, there's also the question of data storage,
including how much space your program takes. Here data structures come in handy.


the term **data structure** refers to a collection of elements containing data, as well as relationships between them and data operations.

As a rule, data structures have two types of operations: 

- **internal**, supporting data organization
- **external**, available to users for storing, retrieving, or modifying data.

## The role of data structures

Different data structures have different time complexities for performing the same external operations in a set of data. This is why it is essential to consider all the possible structures and choose the most efficient among them. Let's illustrate what we've said above in an example.

Dijkstra's algorithm. It has two main implementations: using an array or a heap as a data structure. In the first case, Dijkstra's algorithm time complexity will be 
O(n^2 + m). whereas if we use the second type of data structure, our algorithm will work on O((n+m)logn).

So using different data structures can lead to different time complexities of the same algorithm.

## Common principles


1. Provide a systematic way to organize and structure data, ensuring efficient storage and retrieval.
2. Are designed to optimize operations such as searching, insertion, deletion, and so on, ensuring efficient algorithmic performance.
3. Provide scalability and flexibility, allowing systems to handle growing or changing datasets without sacrificing performance.
4. optimize memory usage and manage memory allocation and deallocation efficiently.
5. promote code reusability by encapsulating data and operations into reusable modules, enhancing software development productivity and maintainability.

## Abstract and concrete data structures


