# Android SQLite 


## Câu lệnh DDL (ngôn ngữ định nghĩa dữ liệu)

Hãy tưởng tượng bạn muốn lưu trữ thông tin chi tiết của mọi người. Ví dụ: một lớp Kotlin thích hợp có thể trông như thế này:

```kotlin
class Person(
    val id: Long,
    val name: String,
    val birth: LocalDate,
)
```

`java.time.LocalDate` ở đây để minh họa cách bạn có thể lưu trữ mọi thứ trong cơ sở dữ liệu.

Đầu tiên, chúng ta cần một **bảng** với các cột tương ứng với thuộc tính của Person:

```sql
CREATE TABLE people(
    _id INTEGER PRIMARY KEY
  , name TEXT NOT NULL
  , birth INTEGER NOT NULL
)
```

_id có loại `INTEGER`. SQLite thực tế không có `LONG` hoặc `VARCHAR`, nó chỉ hỗ trợ `INTEGER`, `REAL`, `TEXT` và `BLOB`. Nhưng `INTEGER` có thể chiếm tới 8 byte (64 bit) khi cần thiết, đủ lớn.


##CRUD

Trong Android, có một lớp trừu tượng `calledSQLiteOpenHelper` cho phép chúng ta khởi tạo cơ sở dữ liệu.
Thật tiện lợi khi mở rộng để tạo bảng, thực hiện di chuyển và có quyền truy cập vào các hoạt động CRUD sau đó.

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

Câu lệnh `PRAGMA` trong SQLite được sử dụng để sửa đổi hoặc truy vấn các đặc tính hoạt động của cơ sở dữ liệu. 

Bây giờ lược đồ đã được xác định, đã đến lúc lưu trữ một số dữ liệu và truy xuất nó.

Để khởi tạo Trình trợ giúp của chúng tôi, chúng tôi gọi getWritableDatabase để lấy phiên bản SQLiteDatabase và chúng tôi đã sẵn sàng bắt đầu: `val db = DbHelper(context).writableDatabase`

Việc gọi `getWritableDatabase()` lần đầu tiên sẽ kích hoạt Trình trợ giúp thực hiện quá trình định cấu hình và tạo hoặc nâng cấp lifecycle.
Quá trình này có thể mất nhiều thời gian, vì vậy tốt nhất bạn nên thực hiện cuộc gọi từ nền thread.

Để đóng gói tất cả logic cơ sở dữ liệu, hãy tạo `PersonStore`:


```kotlin
class PersonStore(private val db: SQLiteDatabase) : Closeable {


    override fun close() {
        // TODO
    }
}
```

Việc triển khai tín hiệu giao diện `Closeable` cho người dùng thuộc lớp này rằng các phiên bản của nó phải được xử lý sau khi sử dụng. 
Đó là bởi vì chúng ta sẽ yêu cầu `SQLiteDatabase` xây dựng một số đối tượng `Closeable` và đóng chúng trong phương thức `close()` của riêng chúng ta.
`SQLite` được viết bằng `C` nên chúng ta cần quản lý bộ nhớ theo cách thủ công.

### Tạo nên

Dưới đây, bạn có thể thấy `INSERT` trông như thế nào:

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


`compileStatement` trả về một [câu lệnh đã chuẩn bị sẵn](https://en.wikipedia.org/wiki/Prepared_statement) rất hữu ích khi bạn định thực thi cùng một câu lệnh SQL nhiều lần trong suốt vòng đời của ứng dụng.
Việc thực thi loại câu lệnh này thường nhanh hơn việc thực thi trực tiếp một câu lệnh.

#### Xử lý các thao tác chèn SQLite đồng thời trong Android

Khi làm việc với SQLite trong môi trường đa luồng, hãy đảm bảo rằng các hoạt động của thread an toàn.

Các phương thức như `bindString`, `bindLong` và `executeInsert` được gọi riêng, **vì vậy thao tác chèn không phải là thao tác nguyên tử**. Nếu không có synchronization thích hợp, việc truy cập đồng thời có thể gây ra lỗi hoặc hỏng dữ liệu.

Lớp được cung cấp yêu cầu một số synchronization bên ngoài nếu được sử dụng đồng thời. Ngoài ra còn có một số tùy chọn khác nhau:

- Đánh dấu chức năng `insert()` là `@Synchronized`. Đảm bảo mỗi lần chỉ có một thread có thể thực thi phương thức.

```kotlin
@Synchronized
fun insert() {
    // SQLite insert logic
}
```

- Gói câu lệnh chèn trong `ThreadLocal`. Mỗi thread có bản sao câu lệnh chèn riêng, tránh xung đột.

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

- Gói câu lệnh chèn trong `AtomicReference`,Bạn có thể sử dụng AtomicReference để quản lý câu lệnh chèn theo cách an toàn thread. Đây là cách nó hoạt động:

    - Sử dụng `insertRef.getAndSet(null)` để truy xuất câu lệnh hiện tại và đặt thành null.
    - Nếu câu lệnh truy xuất không null thì sử dụng nó để thực hiện thao tác chèn.
    - Sau khi hoàn thành thao tác, giải phóng lại câu lệnh bằng `insertRef.getAndSet(statement)`.

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

Chấp nhận một phiên bản `Person` là một ý tưởng tồi vì nó không có ID cho đến khi nó được chèn vào. Thay vào đó, hàm `insert()` lấy tên và ngày sinh rồi trả về khóa chính của Người mới được chèn.

### Đọc

Bây giờ chúng ta đã sẵn sàng truy vấn cơ sở dữ liệu để tìm một `Person`:

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
Chúng ta hãy xem chi tiết của mã này:

- Ở đây chúng tôi không có compileStatement. Bạn có thể sử dụng các câu lệnh đã biên dịch với `INSERT`, `UPDATE`, `DELETE` và trường hợp `SELECT` đặc biệt: để đọc một giá trị duy nhất khi vùng chọn có chính xác một cột và một **hàng** (còn được gọi là "ô đơn" hoặc "lưới 1×1"). Không thể sử dụng các câu lệnh đã biên dịch với `SELECT` có mục đích chung.


- Hàm `query()` là một trình tạo truy vấn SQL đơn giản:

```kotlin
public Cursor query(String table, String[] columns, String selection,
        String[] selectionArgs, String groupBy, String having,
        String orderBy)
```

- `Cursor` là cổng truy vấn kết quả. Bạn có thể di chuyển nó dọc theo các hàng đã chọn và đọc các giá trị ô (một cột cụ thể trong một hàng cụ thể) bằng `Cursor.getLong`, `Cursor.getString` và một loạt các phương pháp tương tự. Không giống như các phương thức bind* dựa trên 1, get* dựa trên 0. Nếu bạn quen thuộc với `JDBC`, bạn có thể coi `Cursor` là `ResultSet`. Nếu không, hãy vui mừng vì bạn không cần phải sử dụng API rắc rối như vậy.

- `Cursor` là `Closeable`. Đó là lý do tại sao chúng tôi sử dụng cấu trúc `try…finally`.

- `moveToFirst()` kiểm tra xem chúng ta có thể đọc được hàng đầu tiên hay không. Nếu không, lựa chọn sẽ trống.

- `db.query("people", null, …)` thực chất có nghĩa là `SELECT *`. Tập hợp cột sẽ không được xác định tại thời điểm này, nhưng bạn vẫn có thể sử dụng `cursor.getLong(cursor.getColumnIndexOrThrow("_id"))`, v.v.

Tại thời điểm này, chúng tôi có thể chèn bản ghi `Person` và chọn nó. Nhưng trong hầu hết các trường hợp, chúng ta cần danh sách các thực thể, vì vậy hãy tạo một `Cursor` của tất cả các bản ghi `Person` trong cơ sở dữ liệu và gói nó trong `List`. Danh sách loại này yêu cầu `Cursor` trực tiếp để hoạt động bình thường và chúng tôi phải đóng nó sau khi sử dụng, vì vậy chúng tôi cần một loại bổ sung: giao diện `List<E>`, `RandomAccess`, `Closeable`:

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

Sử dụng phương pháp trên sẽ cung cấp cho chúng ta một danh sách bình thường có thể được chuyển tới `Adapter` hoặc được sử dụng theo bất kỳ cách phổ biến nào khác. Chỉ cần đừng quên đóng nó trong `onDestroy()` hoặc một phương thức lifecycle khác, đối xứng với quá trình tạo.

`check()` được sử dụng để xác nhận rằng `moveToPosition()` trả về đúng. Nếu không, thao tác sẽ thất bại ngay lập tức vì sai ở đây hoàn toàn không được mong đợi.

Cách tiếp cận này sẽ hoạt động như mong đợi nhưng có ít nhất hai sai sót:

- Các lần gọi get(n) tiếp theo sẽ vẫn tua Con trỏ về vị trí n và phân bổ Người khác.

- Khi bảng đủ dài, Con trỏ sẽ tải những khối dữ liệu khá lớn, có thể dẫn đến tình trạng treo bảng định kỳ.

Để giải quyết những vấn đề này, chúng tôi có thể chọn tất cả ID cùng một lúc, truy vấn từng bản ghi Người (chọn theo khóa chính cực nhanh, đặc biệt là trong SQLite) và ghi nhớ mọi Người mà chúng tôi tìm nạp:

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

Như một phần thưởng, chúng tôi không cần phải đóng danh sách riêng biệt. Nó chết cùng lúc với toàn bộ `PersonStore`.

### Cập nhật, Xóa

Thực thi câu lệnh `UPDATE` hoặc `DELETE` cũng dễ dàng như thực thi `INSERT`. Thay vì `SQLiteStatement.executeInsert()`, bạn gọi `executeUpdateDelete()`, trả về số lượng hàng đã thay đổi. Hoặc, bạn có thể chỉ cần sử dụng `execute()` nếu bạn không bận tâm đến số hàng đã thay đổi:

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

Đừng quên đóng cơ sở dữ liệu và tất cả các câu lệnh sau khi sử dụng. Lưu ý rằng `PersonStore.close()` chỉ hủy bỏ các tuyên bố vì họ không phải là chủ sở hữu của `SQLiteDatabase`, vì vậy đây vẫn là trách nhiệm của bạn.

Ngoài ra, việc có một phiên bản cơ sở dữ liệu cần nhiều bộ nhớ, do đó, cách tốt nhất là chỉ có một phiên bản `SQLiteDatabase` duy nhất trong toàn bộ ứng dụng. Các lệnh gọi tiếp theo tới `SQLiteOpenHelper.getWritableDatabase()` sẽ trả về cùng một phiên bản `SQLiteDatabase`, vì vậy bạn chỉ nên khởi tạo Trình trợ giúp của mình một lần.

