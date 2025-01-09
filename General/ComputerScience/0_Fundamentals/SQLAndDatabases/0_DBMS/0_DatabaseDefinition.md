# Database

A **database** is a collection of data that is specifically organized for rapid search and retrieval processed by a computer.

The difference between a database and a usual file is that a file may be structured or not, but a database must have a specific structure.


Obviously, we'd say that this file has some kind of structure, but from a computer's perspective, it's still a plain file, until you write a program that manages data in it. Usually, the information in databases is compressed and stored as binaries rather than plain text, so it's clear that this kind of structure is meant for computers, not humans.


Unlike us, computers can easily understand the binary format of data, but what allows them to read and write it correctly? **It is a program called Database Management System**, which controls the data in a database.

## Database Management System

A Database Management System (DBMS) is a type of software that allows users to define, create, and control data.

A DBMS can optimize queries and retrieve data from а database in an optimal way. It is a mediator between the user and the database, which means that users can work with it through the interface of a DBMS. In addition, it can also help isolate data from the users.

Another goal of this software is to help people work with different types of databases without exposing their actual differences.

Most database management systems have pretty good descriptions and tutorials on their websites. There are also specific languages like SQL that you need to learn to start working with them, but if you know some programming languages, you can work with a database with their tools instead. For example, there are many libraries in Python and Java that can work with DBMS.

## Access to data

Of course, you can store the files locally, but as they grow in number, you won't be able to find information quickly. Databases provide **schemas** and **metadata** that allow for a quick search of the data needed.

## Data consistency

One of the best features of databases is their ability to keep and restore data correctly. It doesn't mean that a DBMS knows how to be correct, but once you define the rules with the configuration or schema, you can be sure that nothing will break these rules.

If several people have simultaneous access to the same data, there may be a problem. Updates in files usually follow the "last save wins" rule,  which leads to a conflict of updates. 

Meanwhile, databases isolate different users and can be configured to resolve conflicts between their updates.

There's another good thing about databases. When some file becomes corrupted and cannot be opened, you've lost your data forever. Using a DBMS instead, you can make backups and then restore the data and continue your work.

## Conclusion

With databases you can:

- Store, retrieve and update data;

- Get metadata;

- Access a database remotely;

- Restrict access to data;

- Make concurrent updates;

- Recover to some point in time;

- Check the rules for data consistency automatically.


