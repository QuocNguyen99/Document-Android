# Observer Design Pattern

## Problem

There are two objects: a Customer and a Store.
The customer is eager to buy a new product (like the latest iPhone), which will soon be available in the store.

If the customer visits the store daily to check for availability, it would be a waste of time.
On the other hand, if the store sends frequent emails to all customers when new products arrive, it could be considered spam and annoy those who aren't interested.

This creates a conflict: either the customer wastes time, or the store wastes resources.

## Solution

The object with an interesting state is called the **publisher**, while the objects that want to track its changes are called **subscribers**.

The pattern suggests adding a subscription mechanism to the publisher class. This mechanism includes:

- An array to store subscriber references.
- Methods to add and remove subscribers.
When an event occurs, the publisher notifies all subscribers by calling a notification method on their objects.

To avoid tight coupling, all subscribers implement a common interface, and the publisher interacts with them through this interface. This allows flexibility and ensures compatibility, even when new subscriber classes are added or different types of publishers are used.


## Benefits

- Decoupling:
Promotes loose coupling between the subject and observers, allowing them to vary independently.

- Scalability:
Facilitates the addition of new observer types without modifying existing subject code.

## Considerations

- Performance:
With numerous observers, the notification process can become time-consuming, potentially impacting performance.
- Consistency:
Observers might experience inconsistent states if they rely on a specific sequence of notifications.

