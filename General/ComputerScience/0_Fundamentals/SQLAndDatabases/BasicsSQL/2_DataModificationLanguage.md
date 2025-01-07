# Data Modification Language

## Basic INSERT statement


You can insert a new record into a table with a simple query using `INSERT INTO`statement.

For example


| Name     | Surname  | Zip Code | City       |
|----------|----------|----------|------------|
| Tom      | Black    | 11643    | New York   |
| Hermione | Smith    | 20599    | Washington |

```sql
INSERT INTO customers (name, surname, zip_code, city) 
VALUES ('Bobby', 'Ray', 60601, 'Chicago');
```

| Name     | Surname  | Zip Code | City       |
|----------|----------|----------|------------|
| Tom      | Black    | 11643    | New York   |
| Hermione | Smith    | 20599    | Washington |
| Bobby    | Ray      | 60601    | Chicago    |


## Insert multiple rows

```sql
INSERT INTO customers (name, surname, zip_code, city) 
VALUES ('Mary', 'West', 75201, 'Dallas'), 
       ('Steve', 'Palmer', 33107, 'Miami');

```

## Insert into specified columns

Sometimes you have to insert a record with some missing values. 

| Name | Age | Owner |
|------|-----|-------|


We want to add information about a three-year-old homeless cat Felix. Since Felix doesn't have an owner, we can skip this column in our `INSERT INTO` query.

```sql
INSERT INTO cats (name, age) 
VALUES ('Felix', 3);
```

As a result, the table cats will have one row:

| Name  | Age | Owner |
|-------|-----|-------|
| Felix | 3   | NULL  |


## Basic DELETE statement

To delete all the data from the table but not the table itself, use a query with a `DELETE FROM` statement.

```sql
DELETE FROM books; 
```

As a result of the query execution we still have the table books, but it is empty now.

### Delete selected rows

You can also use `DELETE FROM` statement to delete only selected rows from a table.

```sql
DELETE FROM books 
WHERE quantity = 0;
```


