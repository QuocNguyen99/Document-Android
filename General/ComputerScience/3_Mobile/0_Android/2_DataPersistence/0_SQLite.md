# Android SQLite 


## DDL (data definition language) statements

Imagine you want to store people's details. For example, an appropriate Kotlin class can look like this:

```kotlin
class Person(
    val id: Long,
    val name: String,
    val birth: LocalDate,
)
```

`java.time.LocalDate` is here to illustrate how you can store anything in a database.

First, we need a **table** with columns corresponding to Person's properties:

```sql
CREATE TABLE people(
    _id INTEGER PRIMARY KEY
  , name TEXT NOT NULL
  , birth INTEGER NOT NULL
)
```

_id has `INTEGER` type. SQLite doesn't actually have `LONG` or `VARCHAR`, it only supports `INTEGER`, `REAL`, `TEXT`, and `BLOB`. But `INTEGER` can take up to 8 bytes (64 bits) when necessary, which is large enough.


## CRUD

In Android, there's an abstract class `calledSQLiteOpenHelper` which enables us to initialize the database.
It's handy to extend in order to create tables, execute migrations, and get access to CRUD operations afterward.

```kotlin
class DbHelper(
    context: Context,
) : SQLiteOpenHelper(context, "app.db", null, 1) {

    override fun onConfigure(db: SQLiteDatabase) {
        db.execSQL("PRAGMA foreign_keys = 1")
        db.execSQL("PRAGMA trusted_schema = 0")
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("CREATE TABLE …")
    }

    override fun onUpgrade(
        db: SQLiteDatabase, oldVersion: Int, newVersion: Int
    ) {
        throw UnsupportedOperationException()
    }

}
```

The `PRAGMA` statement in SQLite is used to modify or query the database's operational characteristics. 

Now that the schema is defined, it's time to store some data and retrieve it.

To initialize our Helper, we call getWritableDatabase to acquire an SQLiteDatabase instance, and we're ready to go: `val db = DbHelper(context).writableDatabase`

Calling `getWritableDatabase()` for the first time triggers Helper to go through the configure-and-create-or-upgrade lifecycle.
This can take a long time, so it's best to make the call from a background thread.

To encapsulate all the database logic, let's create a `PersonStore`:


```kotlin
class PersonStore(private val db: SQLiteDatabase) : Closeable {


    override fun close() {
        // TODO
    }
}
```

Implementing the `Closeable` interface signals to the user of this class that its instances must be disposed of after use. 
That's because we're going to ask `SQLiteDatabase` to construct several `Closeable` objects and close them within our own `close()` method.
`SQLite` is written in `C`, so we need to manage memory manually.

### Create

Below, you can see how `INSERT` looks:

```kotlin
class PersonStore(private val db: SQLiteDatabase) : Closeable {
    private val insert = db.compileStatement(
        "INSERT INTO people (name, birth) VALUES (?, ?)"
    )

    fun insert(name: String, birth: LocalDate): Long {
        insert.bindString(1, name)
        insert.bindLong(2, birth.toEpochDay())
        return insert.executeInsert()
    }

    override fun close() {
        insert.close()
    }
}
```


`compileStatement` returns a [prepared statement](https://en.wikipedia.org/wiki/Prepared_statement) that's useful when you're going to execute the same SQL statement multiple times during the application lifetime.
Executing this kind of statement is generally faster than executing a statement directly.

#### Handling Concurrent SQLite Insert Operations in Android

When working with SQLite in a multi-threaded environment, ensure that operations are thread-safe.

Methods like `bindString`, `bindLong`, and `executeInsert` are called separately, **so the insert operation is not atomic**. Without proper synchronization, concurrent access may cause data corruption or crashes.

The provided class requires some external synchronization if used concurrently. There are also some different options:

- Marking the `insert()` function as `@Synchronized`. Ensures only one thread can execute the method at a time.

```kotlin
@Synchronized
fun insert() {
    // SQLite insert logic
}
```

- Wrapping the insert statement in `ThreadLocal`. Each thread gets its own copy of the insert statement, avoiding conflicts.

```kotlin
private val threadLocalStatement = ThreadLocal<SQLiteStatement>()

fun getInsertStatement(): SQLiteStatement {
    var statement = threadLocalStatement.get()
    if (statement == null) {
        statement = db.compileStatement("INSERT INTO ...")
        threadLocalStatement.set(statement)
    }
    return statement
}
```

- Wrapping the insert statement in `AtomicReference`,You can use AtomicReference to manage the insert statement in a thread-safe manner. Here's how it works:

    - Use `insertRef.getAndSet(null)` to retrieve the current statement and set it to null.
    - If the retrieved statement is non-null, use it to perform the insert operation.
    - After completing the operation, release the statement back using `insertRef.getAndSet(statement)`.

```kotlin
private val insertRef = AtomicReference<SQLiteStatement>()

fun insert() {
    val statement = insertRef.getAndSet(null) ?: db.compileStatement("INSERT INTO ...")
    
    try {
        // Perform insert using the statement
        statement.executeInsert()
    } finally {
        // Release the statement back
        insertRef.getAndSet(statement)
    }
}
```

Accepting a `Person` instance is a bad idea because it doesn't have an ID until it is inserted. Instead, the `insert()` function takes name and birth and returns the primary key of the newly inserted Person.

### Read

Now we're ready to query the database for a single `Person`:

```kotlin
private val personCols = arrayOf("_id", "name", "birth")
…
class PersonStore(private val db: SQLiteDatabase) : Closeable {
    …
    fun singleOrNull(id: Long): Person? {
        val cursor = db.query(
            "people", personCols, "_id = ?", arrayOf(id.toString()),
            null, null, null
        )
        return try {
            if (cursor.moveToFirst()) Person(cursor)
            else null // not found
        } finally {
            cursor.close()
        }
    }
    private fun Person(cur: Cursor) =
        Person(
            cur.getLong(0),
            cur.getString(1),
            LocalDate.ofEpochDay(cur.getLong(2)),
        )
}
```
Let's peek into the details of this code:

- We don't compileStatement here. Compiled statements can be used with `INSERT`, `UPDATE`, `DELETE`, and a special `SELECT` case: to read a single value when the selection has exactly one column and one **row** (also known as "single cell" or "1×1 grid"). Compiled statements cannot be used with a general-purpose `SELECT`.


- The `query()` function is a simple SQL query builder:

```kotlin
public Cursor query(String table, String[] columns, String selection,
        String[] selectionArgs, String groupBy, String having,
        String orderBy)
```

- `Cursor` is a gateway to query results. You can move it along selected rows and read cell (a particular column in a specific row) values with `Cursor.getLong`, `Cursor.getString`, and a bunch of similar methods. Unlike 1-based bind*, get* methods are 0-based. If you're familiar with `JDBC`, you can think of `Cursor` as a `ResultSet`. If not, just be happy you haven't needed to use such an awkward API.

- `Cursor` is `Closeable`. That's why we use `try…finally` construct.

- `moveToFirst()` checks whether we can read the first row. If not, the selection is empty.

- `db.query("people", null, …)` would effectively mean `SELECT *`. The column set wouldn't be known at this point, but you can still use `cursor.getLong(cursor.getColumnIndexOrThrow("_id"))`, and so on.

At this point, we're able to insert a `Person` record and select it. But in most cases, we need lists of entities, so let's create a `Cursor` of all the `Person` records in the database and wrap it in a `List`. A list of this kind requires a live `Cursor` to work properly, and we must close it after use, so we need an additional type: interface `CloseableList<E>` : `List<E>`, `RandomAccess`, `Closeable`:

```kotlin
fun all(): CloseableList<Person> {
        val cursor = db.query(
            "people", personCols, null, null, null, null, null
        )
        return object : AbstractList<Person>(), CloseableList<Person> {

            override val size: Int
                get() = cursor.count

            override fun get(index: Int): Person {
                check(cursor.moveToPosition(index))
                return Person(cursor)
            }

            override fun close() {
                cursor.close()
            }
        }
    }
```

Using the above approach will give us a normal list that can be passed to `Adapter` or utilized in any other common way. Just don't forget to close it in `onDestroy()` or another lifecycle method, symmetrically to creation.

`check()` is used to assert that `moveToPosition()` returned true. Otherwise, the operation will fail immediately because false is totally unexpected here.

This approach will work as anticipated but has at least two flaws:

- Subsequent calls to get(n) will still rewind the Cursor to position n and allocate another Person.

- When the table is long enough, the Cursor will load fairly large chunks of data, which could lead to periodic freezes.

To address these issues, we can select all IDs at once, query Person records one by one (select by primary key is super fast, especially in SQLite), and memoize every Person we fetch:

```kotlin
private val idCol = arrayOf("_id")

class PersonStore(private val db: SQLiteDatabase) : Closeable {
    …
    fun all(): List<Person> {
        val cursor = db.query(
            "people", idCol, null, null, null, null, null
        )
        val ids = try {
            LongArray(cursor.count) { _ ->
                check(cursor.moveToNext())
                cursor.getLong(0)
            }
        } finally {
            cursor.close()
        }
        return object : AbstractList<Person>() {

            override val size: Int
                get() = ids.size

            private val memo = arrayOfNulls<Person>(size)
            override fun get(index: Int): Person =
                memo[index]
                    ?: singleOrNull(ids[index])!!.also { memo[index] = it }
        }
    }
}
```

As a bonus, we don't need to close the list separately. It dies at the same time as the whole `PersonStore`.

### Update, Delete

Executing an `UPDATE` or `DELETE` statement is as easy as executing `INSERT`. Instead of `SQLiteStatement.executeInsert()` you call `executeUpdateDelete()`, which returns the number of altered rows. Or, you can simply use `execute()` if you don't mind the altered row count:

```kotlin
    …

    private val update = db.compileStatement(
        "UPDATE people SET name = ?, birth = ? WHERE _id = ?"
    )
    
    fun update(person: Person) {
        update.bindString(1, person.name)
        update.bindLong(2, person.birth.toEpochDay())
        update.bindLong(3, person.id)
        check(update.executeUpdateDelete() == 1)
    }

    private val delete = db.compileStatement(
        "DELETE FROM people WHERE _id = ?"
    )
    
    fun delete(person: Person) {
        delete.bindLong(1, person.id)
        check(update.executeUpdateDelete() == 1)
    }

    …

    override fun close() {
        insert.close()
        update.close()
        delete.close()
    }
```

Don't forget to close the database and all the statements after use. Note that `PersonStore.close()` only frees statements because it isn't an owner of an `SQLiteDatabase`, so this is still your responsibility.

Also, having a database instance requires a lot of memory, so it's good practice to have only a single `SQLiteDatabase` instance throughout the application. Subsequent calls to `SQLiteOpenHelper.getWritableDatabase()` return the same `SQLiteDatabase` instance, so you should instantiate your Helper only once.

