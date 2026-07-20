# Cryptographic Hash Function

It is crucial to protect the integrity and security of sensitive information. Cryptographic hash functions play a vital role in this regard, serving as the guardians of data integrity and providing a robust layer of protection. But why aren't hash functions enough?

Hash functions and **cryptographic hash functions** are closely related concepts in the realm of computer science and cryptography.

While both serve the purpose of transforming data into fixed-size representations, there are crucial differences between the two

## Definition of cryptographic hash function

Cryptographic hash functions are a specific subset of hash functions designed for secure cryptographic applications. 

They possess all the properties of traditional hash functions and incorporate **additional security features**. 

The distinctive properties of cryptographic hash functions include:

- **Pre-image resistance**: it is hard to find a message with a given hash value.
- **Second pre-image resistance or weak collision resistance**: it is difficult to find a message with the same hash value as a given message.
- **Collision resistance** or **strong collision resistance**: it is hard to find two different messages with the same hash value.


## Pre-image resistance

Imagine a company that stores a table of username-password pairs for a website you use.
If that table gets leaked, then anyone can see your password.
So, what they do is save the hash of your password instead
Whenever you send them your password, they compute the hash and check if it is the same as the one saved.
Now, if the table is leaked, an attacker must find a password that hashes to the same value as your password to be able to log in as you.

So, the hash function must make it very difficult for an attacker to find such a password.

Such a function is called pre-image resistant: given a hash value `h`, it is hard to find a message `m` `hash(m) = h`


## Second pre-image resistance

One of the ways we can make sure a message was not changed is by sending the hash of the message together with the message itself.
Suppose that an attacker wants to change the message, but cannot change the hash.Then their changed message should hash to the same value as the original one.

To prevent such situations, we can use a **second pre-image-resistant** or **weak collision-resistant** hash function.

this means that, given a message `m1`  it will be hard to find a different message `m2` with `hash(m1) = hash(m2)`.
The difference between pre-image and second pre-image resistances is that in the first case we are given a hash value, while here, we are given a message.

## Collision resistance

In some very specific use cases, finding any pair of messages that have the same hash might result in problems.
A hash function that makes sure it is hard to find any messages `m1`, `m2` such that `hash(m1) = hash(m2)` is called **collision-resistant** or **strong collision-resistant**.

In simple words,  collision resistance ensures that it is extremely difficult to find two keys that can open the same safe or produce the same hash value.

Unlike second pre-image resistance, in this case, we are given no prior information. 
The goal is to make it difficult to find two distinct messages that produce the same hash value.

Collision resistance ensures that it's extremely difficult to find two different messages with the same hash, protecting cryptographic protocols, digital signatures, and data integrity.

>[!NOTE]
> When we say it's hard to find some value, that means that finding a value with the needed properties would take years, even with the most formidable supercomputers. 
> If you think that it's hard to get those properties, you're right! Not everyone can create such a function.
> Fortunately, there are a few standard ones that are widely used today.
> Their implementations are complicated, so we will not go into detail.

## Examples

Finally, it is worth bringing up a couple of real examples of cryptographic hash functions and a bit of information on their history

MD5, created in 1992 as an improvement over MD4, was initially considered collision-resistant but was broken in 2004.
SHA-256, a more secure hash function, produces a 256-bit output and is widely used, including in Bitcoin's proof of work.


Even small changes produce huge differences!
This is the consequence of collision resistance and pre-image resistance.

It is worth noting that due to quick advancements in computing power and new cryptographic techniques, it should not be unexpected if some of the functions we utilize nowadays cease to be used in the near future.


## Conclusion

In summary, cryptographic hash functions are essential for protecting data integrity and security.
There is a simple difference between them and hash functions:
they are in fact a subset of hash functions that in addition satisfy three important properties:

- **Pre-image resistance**
- **Second pre-image resistance**
- **Collision resistance.**

These properties ensure that it is
- difficult to find original inputs given their hash values
- find different inputs with the same hash value











