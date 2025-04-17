# SQLite


SQL databases can be handy even in the simplest applications. However, running a database system like PostgreSQL, MySQL and MariaDB, non-relational Elasticsearch, MongoDB, and more. requires installation, configuration,
maintenance, and work in separate processes that accept network connections. Sometimes it can be unsuitable for us or even forbidden. In such cases, SQLite comes to the rescue.

**SQLite** (pronounced either "S. Q. Lite" or "sequelite”) is a **relational database management system (RDBMS)**. 

Contrary to the typical database running as a separate process, SQLite takes a different approach:

- an application embeds the database code within itself, so there's no need for a separate database process.
- Issued SQL statements read and write the files directly on the local disk.
- The database with all the tables and metadata is contained in a single file. The database file format is cross-platform, thus the file can be copied and used on a different machine with a different architecture
- Despite competing with regular files, SQLite can be used as a backend database to a web application.
- It’s also safe to access the same SQLite database at the same time from multiple applications and processes.

> [!NOTE]
> SQLite is one of the most widely deployed databases in the world: it's built-in on each Android and iPhone device.


## Basic Usage

In order to install and use SQLite, you need to add its dependency to a package manager or build system of your choice (Gradle, pip, npm). After that, you will be able to use regular SQL libraries to access the database.

We won't stick with any particular programming language and will explore SQLite using its command line interface: `sqlite3`. Calling it with a database file name as a parameter will start an interactive session with that database. If the database file does not exist, it will be created. Let’s create a new `edu.db` database and populate it:

```bash
hs@laptop:~/sqlite$ ls
hs@laptop:~/sqlite$ sqlite3 edu.db
SQLite version 3.31.1 2020-01-27 19:55:54
Enter ".help" for usage hints.
sqlite> create table pets (pet_id integer, name text);
sqlite> insert into pets (pet_id, name) values (1, 'Harry'), (2, 'Elen');
sqlite> create table pet_weights (pet_id integer, weight integer);
sqlite> insert into pet_weights (pet_id, weight) values (1, 10), (2, 11);
sqlite> select * from pets;
1|Harry
2|Elen
sqlite> select * from pet_weights;
1|10
2|11
```

> [!NOTE]
> Running queries in a terminal can be inconvenient, so you can use such UI tools as sqlitebrowser instead.

## Typelessness

Most SQL databases use static typing: the type of the value inserted into a column should match its column declaration type. You can’t insert a string value into an integer column.

SQLite uses dynamic typing, which means that you can store any kind of value in any column, regardless of the column type. Even declaring column types is optional (however, it's desired since it helps others to understand the structure of your tables).

SQL statements working in statically typed databases work the same way in SQLite, despite its dynamic nature.


