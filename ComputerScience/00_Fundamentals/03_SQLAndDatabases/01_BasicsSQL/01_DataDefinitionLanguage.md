# Basic SQL

## CREATE statement

Let's store information about university students in a new database. We can use the `CREATE DATABASE` statement for this. Our database will be named `students`:

```sql
CREATE DATABASE students;
```

This simple SQL query will create the database. In addition to that, we will need a few tables to organize the data.


## Creating a new table

To create a table, use the `CREATE TABLE` statement.

Let's keep working with our students database and create a table `students_info` that will
contain four columns: `student_id`, `name`, `surname` and `age`.

The column `student_idwill` hold the unique student identifier of the `INT` type. The columns `name` and `surname` will have `VARCHAR(30)` data.
The age column will hold INT values.

```sql
CREATE TABLE students_info ( 
    student_id INT, 
    name VARCHAR(30), 
    surname VARCHAR(30), 
    age INT
);
```

As a result, we have an empty table `students_info`:



| student_id   |      Arnamee      |  surname |  age |
|----------|:-------------:|------:|------:|

## Drop a database

As we've mentioned above, `DROP DATABASE` will delete all the tables in the database and the database itself. If you want to delete only a specific table, use the `DROP TABLE` statement.

Let's delete our `students_info` table with a simple SQL query:

```sql
DROP TABLE students_info; 
```

## Tuple

In a SELECT statement, you can specify more than one value separated by a comma. For example, the query below selects a string literal, a numeric literal, and an arithmetic expression:

```sql
SELECT 'Alice', 170, 170*0.393701;
```

## Alias

In a query, you may specify a name (**alias**) for each attribute of a tuple. To do so, you should use the keyword `AS` followed by a name for the value.

```sql
SELECT 
  'Alice' AS name, 
  170 AS height_in_centimeters, 
  170*0.393701 AS "height in inches"
;
```
