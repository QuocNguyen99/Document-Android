# Retriveving Data

## Projection


Assume you have a table `weather` that stores information about the weather in London for the past 5 days.


| Day | Hour | Temperature | Feels_Like | Pressure | W_Speed | W_Dir | W_Gusts | Humidity | Phenomena       |
|-----|------|-------------|------------|----------|---------|-------|---------|----------|-----------------|
| 1   | 1    | 14          | 14         | 754      | 2       | W     | 8       | 88       | Rain Shower     |
| 1   | 7    | 11          | 11         | 754      | 1       | N     | 1       | 92       | Continuous Rain |
| ... | ...  | ...         | ...        | ...      | ...     | ...   | ...     | ...      | ...             |
| 5   | 19   | 16          | 13         | 759      | 5       | S     | 11      | 93       | Rain Shower     |

As you can see, there are a lot of attributes for every hour. Do we need all of them? Let's write a query that selects only the basic info to be displayed on a mobile phone screen, for example, day, hour, weather phenomena, temperature, feels like, and wind speed.

```sql
SELECT
    day, 
    hour,
    phenomena,
    temperature AS "temperature in Celsius",
    feels_like AS "feels like in Celsius",
    w_speed AS "wind speed in m/s"
FROM
    weather
;
```

After the `SELECT` keyword, we list the columns that we want to select and specify aliases where needed. The query evaluation results in the following table:


| Day | Hour | Phenomena       | Temperature (°C) | Feels Like (°C) | Wind Speed (m/s) |
|-----|------|-----------------|------------------|-----------------|------------------|
| 1   | 1    | Rain Shower     | 14               | 14              | 2                |
| 1   | 7    | Continuous Rain | 11               | 11              | 1                |
| ... | ...  | ...             | ...              | ...             | ...              |
| 5   | 19   | Rain Shower     | 16               | 13              | 5                |

> [!NOTE]
> The type of data extraction when you select a subset of table columns is called projection.


## Expressions

Now, let's imagine that for some reason we need to have different results based on the same data, for example, add columns that state the place, show the temperature in Fahrenheit, and estimate whether it feels colder than that.

| Place  | Day | Hour | Phenomena       | Temperature (°F) | Feels Colder | Wind Speed (m/s) |
|--------|-----|------|-----------------|------------------|--------------|------------------|
| London | 1   | 1    | Rain Shower     | 57               | FALSE        | 2                |
| London | 1   | 7    | Continuous Rain | 52               | FALSE        | 1                |
| ...    | ... | ...  | ...             | ...              | ...          | ...              |
| London | 5   | 19   | Rain Shower     | 61               | TRUE         | 5                |



The query below does this easily:

```sql
SELECT
    'London' AS place,
    day, 
    hour,
    phenomena,
    temperature*9/5+32 AS "temperature in Fahrenheit",
    feels_like < temperature AS "feels colder",
    wind_speed AS "wind speed in m/s"
FROM
    weather
;
```

## Logical table

A data management system hides the way your data is physically stored behind an abstract concept of a **logical table**.
All you need to know to be able to run a query is the **database schema—table names, column names and types—and appropriate access permissions**.
Internally, the query processor maps table and column references from queries to physical data such as files, network connections, and even the results of executing other queries.


## Logic and comparison expressions

Imagine that you are responsible for a book store database. 
There are so many rows in each selection, and you need to filter them according to certain criteria, 
for example, by author, language, some attribute or even expression requested by the client.
The selection of a subset of rows from a table is called **filtering**.

### Filtering by a criteria

In most cases when we proceed with a query, we want to extract only those records that comply with certain criteria. 
In order to filter the selection, there is a special operator `WHERE` in SQL.

The syntax for this operator is as follows:

```sql
SELECT *
FROM table
WHERE conditions
```

In the `conditions` field we can insert any parameters we want our extracted data to be consistent with.
However, in order to define those specific selection conditions, we need to apply them to expressions.

Let's imagine that your first client wants to buy a book by `Charles Dickens`.
Let's write a query that selects books that meet the criteria:

```sql
SELECT id, title, rating
FROM books
WHERE author = 'Charles Dickens';
```

The `SELECT` clause doesn't have to contain the columns or expressions listed in the `WHERE` clause.
For example, we didn't have to output author in the query above even though there is a corresponding condition in `WHERE`.

### Filtering with Comparisons

This is a full list of comparisons operations that can be used in the `WHERE` operator.


| Symbol    | Description                     |
|-----------|---------------------------------|
| =         | Equality check                  |
| <, >      | Less, Greater                   |
| <=, >=    | Less or Equal, Greater or Equal |
| !<, !>    | Not less than, Not greater than |
| <>, !=    | Not equal                       |

Usually, we apply comparisons to numerical values. 
In case we want to make a selection by string literals or dates, we should put those in quotation marks (`" "`).

### Logical expressions

Next, we are going to deal with logical expressions that help us form more complex SQL queries. 
Here are the three operators from boolean algebra that you are already familiar with:

- `NOT` returns `True` if argument equals to `False` and vice versa.

- `AND` compares operands and returns `True` only if all of them are `True`. Alternatively, returns `False`.

- `OR` returns `True` if at least one of the operands is `True`. Otherwise, returns `False`.

> [!TIP]
> Please note the order of operators given above,
> as they are sorted according to their priority (meaning that if we have all three operands in the expression, first we proceed with `NOT`, then comes `AND`, and finally `OR`).

In order to hire the right person for the project, we need a candidate to meet two requirements: be a Middle or a Senior and know SQL.

```sql
SELECT *
FROM staff
WHERE (status="Middle" OR status="Senior") AND skills="SQL"
```

> [!WARNING]
> Please note the parentheses that we use with the `OR` operand.
> It's an important tool for prioritizing the `OR` condition over `AND`.
> If we do not use it, `SQL` would first process the `AND` operand and only then `OR`, making the query request irrelevant.

