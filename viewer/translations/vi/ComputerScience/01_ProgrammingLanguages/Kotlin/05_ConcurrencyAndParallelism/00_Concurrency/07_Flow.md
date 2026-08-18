# Flow không đồng bộ
Trong khi các hàm tạm dừng trả về một giá trị không đồng bộ, Luồng Kotlin cho phép trả về nhiều giá trị được tính toán không đồng bộ.

## Tính năng và thông tin cơ bản của Flow

`Sequence<Int>` xử lý các giá trị được tính toán đồng bộ:

```kotlin
fun simple(): Sequence<Int> = sequence { // sequence builder
    for (i in 1..3) {
        Thread.sleep(100) // pretend we are computing it
        yield(i) // yield next value
    }
}

fun main() {
    simple().forEach { value -> println(value) } 
}
```

Đối với các luồng không đồng bộ, hãy sử dụng `Flow<Int>`:

```kotlin
fun simple(): Flow<Int> = flow { // flow builder
    for (i in 1..3) {
        delay(100) // pretend we are doing something useful here
        emit(i) // emit next value
    }
}

fun main() = runBlocking<Unit> {
    // Launch a concurrent coroutine to check if the main thread is blocked
    launch {
        for (k in 1..3) {
            println("I'm not blocked $k")
            delay(100)
        }
    }
    // Collect the flow
    simple().collect { value -> println(value) } 
}
```

Những điểm chính:

- Sử dụng trình tạo `flow { }` để tạo luồng
- Mã bên trong trình tạo luồng có thể tạm dừng
- Không có công cụ sửa đổi `suspend` trên chính chức năng này
- Các giá trị được **phát ra** với hàm `emit()`
- Các giá trị được **thu thập** bằng hàm `collect()`

### Dòng chảy lạnh
Luồng là luồng lạnh - mã bên trong trình tạo luồng chỉ chạy khi được thu thập:

```kotlin
fun simple(): Flow<Int> = flow { 
    println("Flow started")
    for (i in 1..3) {
        delay(100)
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    println("Calling simple function...")
    val flow = simple()
    println("Calling collect...")
    flow.collect { value -> println(value) } 
    println("Calling collect again...")
    flow.collect { value -> println(value) } 
}
```

Đầu ra:

```kotlin
Calling simple function...
Calling collect...
Flow started
1
2
3
Calling collect again...
Flow started
1
2
3
```
Hàm `simple()` trả về nhanh chóng mà không cần chờ đợi. Việc thực thi Flow bắt đầu mới mỗi lần nó được thu thập.

### Thu thập từ một luồng

Vì `collect` là một hàm tạm dừng nên nó cần được thực thi trong một coroutine.
Nó lấy lambda làm tham số được gọi trên mọi giá trị mới.

> [!CAUTION]
> Vì đây là chức năng tạm dừng nên coroutine gọi bộ sưu tập có thể tạm dừng cho đến khi luồng được đóng lại.

Nếu muốn thu thập nhiều giá trị từ một số luồng, bạn cần tạo coroutine mới từ luồng hiện tại.

```kotlin
fun main() = runBlocking {
    val flowA = flow {
        repeat(3) {
            emit("A$it")
            delay(400)
        }
    }
    val flowB = flow {
        repeat(3) {
            emit("B$it")
            delay(700)
        }
    }

    val jobA = launch {
        flowA.collect { println("From A: $it") }
    }
    val jobB = launch {
        flowB.collect { println("From B: $it") }
    }

    joinAll(jobA, jobB)
}
```

### Flow cancellation cơ bản
Các luồng tôn vinh coroutine cancellation khi bị treo trong các hàm có thể hủy như `delay`:

```kotlin
fun simple(): Flow<Int> = flow { 
    for (i in 1..3) {
        delay(100)          
        println("Emitting $i")
        emit(i)
    }
}

fun main() = runBlocking<Unit> {
    withTimeoutOrNull(250) { // Timeout after 250ms 
        simple().collect { value -> println(value) } 
    }
    println("Done")
}
```

Đầu ra:

```bash
Emitting 1
1
Emitting 2
2
Done
```

Đối với các vòng lặp bận, hãy sử dụng toán tử `cancellable()`:

```kotlin
fun main() = runBlocking<Unit> {
    (1..5).asFlow().cancellable().collect { value -> 
        if (value == 3) cancel()  
        println(value)
    } 
}
```

> [!NOTE] 
> Hầu hết các toán tử luồng không thực hiện kiểm tra cancellation bổ sung vì lý do hiệu suất.

## Trình xây dựng Flow

Ngoài `flow { }`, bạn có thể sử dụng:

- Trình tạo `flowOf` để phát ra các giá trị cố định
- Chức năng mở rộng `.asFlow()` để chuyển đổi **collection và trình tự** thành luồng

### callbackFlow

`callbackFlow` là trình tạo luồng **cho phép bạn chuyển đổi các API dựa trên callback thành các luồng**.

Khi bạn muốn bao bọc một listener bên ngoài, broadcast receiver hoặc bất kỳ API không đồng bộ nào sử dụng callback, không tạm dừng chức năng.

```kotlin
interface MyListener {
    fun onEvent(value: Int)
}

fun myListenerFlow(): Flow<Int> = callbackFlow {
    val listener = object : MyListener {
        override fun onEvent(value: Int) {
            trySend(value) // emit to flow
        }
    }
    // Simulate registering the listener
    registerListener(listener)
    // Remove listener when the flow is cancelled
    awaitClose { unregisterListener(listener) }
}

// --- Mock implementation for demo purposes ---
fun registerListener(listener: MyListener) {
    // Simulate callback events from another thread
    GlobalScope.launch {
        delay(100)
        listener.onEvent(1)
        delay(100)
        listener.onEvent(2)
    }
}
fun unregisterListener(listener: MyListener) { /* cleanup if needed */ }

// --- Usage ---
fun main() = runBlocking {
    myListenerFlow().collect { println("Flow received: $it") }
}
```

> [!NOTE]
> Không giống như trình tạo `flow`, `callbackFlow` cho phép các giá trị được phát ra từ một `CoroutineContext` khác với hàm `send` hoặc bên ngoài một coroutine với hàm `trySend`. Bởi vì trong nội bộ, callbackFlow sử dụng một kênh

## Toán tử luồng trung gian

Các bên trung gian có thể sử dụng các toán tử trung gian để sửa đổi luồng dữ liệu mà không tiêu tốn các giá trị. 

### Toán tử bản đồ

Toán tử Flow chuyển đổi luồng này sang luồng khác:

```kotlin
suspend fun performRequest(request: Int): String {
    delay(1000) // imitate long-running asynchronous work
    return "response $request"
}

fun main() = runBlocking<Unit> {
    (1..3).asFlow() // a flow of requests
        .map { request -> performRequest(request) }
        .collect { response -> println(response) }
}
```


Sự khác biệt quan trọng: khối toán tử có thể gọi các hàm tạm dừng.

### Toán tử biến đổi
`transform` cho phép phát ra nhiều giá trị response cho mỗi giá trị đầu vào:

```kotlin
(1..3).asFlow() // a flow of requests
    .transform { request ->
        emit("Making request $request") 
        emit(performRequest(request)) 
    }
    .collect { response -> println(response) }
```

### Toán tử giới hạn kích thước
Các toán tử như `take` hủy thực thi luồng khi đạt đến giới hạn:

```kotlin
fun numbers(): Flow<Int> = flow {
    try {                          
        emit(1)
        emit(2) 
        println("This line will not execute")
        emit(3)    
    } finally {
        println("Finally in numbers")
    }
}

fun main() = runBlocking<Unit> {
    numbers() 
        .take(2) // take only the first two
        .collect { value -> println(value) }
}
```
Đầu ra:
```bash
1
2
Finally in numbers
```
## Toán tử luồng đầu cuối
Người vận hành thiết bị đầu cuối đang tạm dừng các chức năng bắt đầu luồng collection:

- `collect` - collection cơ bản
- `toList`, `toSet` - chuyển đổi thành collection
- `first`, `single` - nhận các giá trị cụ thể
- `reduce`, `fold` - giảm xuống một giá trị duy nhất

## Luồng là tuần tự
Quá trình xử lý Flow diễn ra tuần tự từ ngược dòng đến xuôi dòng:

> [!NOTE]
> - **luồng ngược dòng**, là ý nghĩa mà nhà sản xuất và bất kỳ toán tử trung gian nào được áp dụng trước hoặc ở trên toán tử
> - **dòng hạ lưu**, toán tử trung gian sau toán tử xem xét hiện tại cùng với người tiêu dùng

```kotlin
(1..5).asFlow()
    .filter {
        println("Filter $it")
        it % 2 == 0              
    }              
    .map { 
        println("Map $it")
        "string $it"
    }.collect { 
        println("Collect $it")
    }
```
Đầu ra:
```bash
Filter 1
Filter 2
Map 2
Collect string 2
Filter 3
Filter 4
Map 4
Collect string 4
Filter 5
```

## Bối cảnh Flow
Các luồng luôn chạy trong bối cảnh coroutine đang thu thập:

```kotlin
withContext(context) {
    simple().collect { value ->
        println(value) // This runs in 'context'
    }
}
```
Điều này được gọi là **bảo toàn ngữ cảnh**.


> [!CAUTION] 
> Bạn không thể phát ra từ một ngữ cảnh khác trong trình tạo luồng:

```kotlin
// WRONG - emitting from different context
flow {
    withContext(Dispatchers.Default) {
        emit(value) // Will throw IllegalStateException
    }
}
```
### Toán tử flowOn
Để thay đổi `CoroutineContext` của một luồng, flowOn thay đổi `CoroutineContext` của luồng ngược dòng

Luồng xuôi dòng không bị ảnh hưởng và thực thi trên `CoroutineContext` được sử dụng cho `collect` từ luồng.

```kotlin
class NewsRepository(
    private val newsRemoteDataSource: NewsRemoteDataSource,
    private val userData: UserData,
    private val defaultDispatcher: CoroutineDispatcher
) {
    val favoriteLatestNews: Flow<List<ArticleHeadline>> =
        newsRemoteDataSource.latestNews
            .map { news -> // Executes on the default dispatcher
                news.filter { userData.isFavoriteTopic(it) }
            }
            .onEach { news -> // Executes on the default dispatcher
                saveInCache(news)
            }
            // flowOn affects the upstream flow ↑
            .flowOn(defaultDispatcher)
            // the downstream flow ↓ is not affected
            .catch { exception -> // Executes in the consumer's context
                emit(lastCachedNews())
            }
}
```

Với mã này, toán tử `onEach` và `map` sử dụng `defaultDispatcher`, trong khi toán tử `catch` và người tiêu dùng được thực thi trên `Dispatchers.Main` được `viewModelScope` sử dụng.


> [!NOTE]
> Nếu có nhiều toán tử `flowOn`, mỗi toán tử sẽ thay đổi ngược dòng từ vị trí hiện tại của nó.


Vì lớp nguồn dữ liệu đang thực hiện công việc I/O, bạn nên sử dụng bộ điều phối được tối ưu hóa cho các hoạt động I/O:

```kotlin
class NewsRemoteDataSource(
    ...,
    private val ioDispatcher: CoroutineDispatcher
) {
    val latestNews: Flow<List<ArticleHeadline>> = flow {
        // Executes on the IO dispatcher
        ...
    }
        .flowOn(ioDispatcher)
}
```

### `buffer()`

Bộ phát không phải đợi bộ thu hoàn thành trước khi phát ra giá trị tiếp theo.


```kotlin
fun main() = runBlocking {
    println("=== buffer() ===")
    val time = measureTimeMillis {
        slowFlowEmit100ms()
            .onEach { log("Emitted $it") }
            .buffer() // do not blocked by collector
            .collect { value ->
                log("Collecting $value ...")
                delay(300)
                log("Done   $value")
            }
    }
    println("Total time ~ ${time}ms\n")
}
fun slowFlowEmit100ms(): Flow<Int> = flow {
    repeat(3) { i ->
        delay(100) // slow-ish emitter
        emit(i + 1)
    }
}
```

### `conflate()`

Bỏ qua các giá trị trung gian, giữ giá trị mới nhất

```kotlin
fun main() = runBlocking {
    println("=== conflate() ===")
    val time = measureTimeMillis {
        fastFlow()
            .onEach { log("Emitted $it") }
            .conflate()
            .collect { value ->
                log("Collecting $value ...")
                delay(300)
                log("Done   $value")
            }
    }
    println("Total time ~ ${time}ms\n")
}

fun fastFlow(): Flow<Int> = flow {
    // Emit quickly (no delay here to exaggerate the effect)
    emit(1)
    emit(2)
    emit(3)
}
```

Đầu ra:

```bash
Emitted 1
Emitted 2
Emitted 3
Collecting 1 ... (300ms)
Done 1
Collecting 3 ... (300ms)
Done 3
```

### collectLatest

Hủy công việc trước đó khi có giá trị mới

```kotlin
fun main() = runBlocking {
    println("=== collectLatest ===")
    val time = measureTimeMillis {
        fastFlow()
            .onEach { log("Emitted $it") }
            .collectLatest { value ->
                log("Start   $value")
                try {
                    delay(300) // long work
                    log("Finish  $value")
                } finally {
                    // This runs when the block is cancelled by a newer value
                    log("Cancel  $value (if not finished)")
                }
            }
    }
    println("Total time ~ ${time}ms\n")
}
```

```bash
Emitted 1
Start 1
Emitted 2
Cancel 1 (if not finished)
Start 2
Emitted 3
Cancel 2 (if not finished)
Start 3
Finish 3
```

## Composition và làm phẳng 

### mã zip


Kết hợp hai luồng thành một bằng cách ghép các giá trị theo thứ tự: 
(A1 với B1), (A2 với B2), v.v.
Nếu một trong hai luồng chậm hơn, zip sẽ đợi cả hai sẵn sàng.

```kotlin

fun main() = runBlocking {
    println("=== zip ===")
    val numbers = flowOf(1, 2, 3).onEach { delay(100) }  // emit every 100ms
    val words = flowOf("one", "two", "three").onEach { delay(200) } // emit every 200ms

    numbers.zip(words) { number, word -> "$number:$word" }
        .collect { println(it) }
}
```

Đầu ra:

```bash
1:one
2:two
3:three
```

### kết hợp

Sự kết hợp mới nhất

Bất cứ khi nào một trong hai luồng phát ra, hãy kết hợp với giá trị mới nhất từ ​​luồng kia.
Phát ra ngay khi có bất kỳ nguồn cập nhật nào.

```kotlin
fun main() = runBlocking {
    println("=== combine ===")
    val a = flowOf(1, 2, 3).onEach { delay(300) }
    val b = flowOf("one", "two", "three").onEach { delay(400) }

    a.combine(b) { num, word -> "$num + $word" }
        .collect { println(it) }
}
```

### flatMapConcat

Làm phẳng tuần tự, Mỗi request đợi yêu cầu trước đó kết thúc.

```kotlin
fun main() = runBlocking {
    println("=== flatMapConcat ===")
    flowOf("A", "B", "C")
        .flatMapConcat { item ->
            flow {
                println("Start job $item")
                delay(500)
                emit("Done $item")
            }
        }
        .collect { println(it) }
}
```

Đầu ra:

```bash
Start job A
Done A
Start job B
Done B
Start job C
Done C
```

### flatMapMerge

Làm phẳng song song, Tất cả các request được bắt đầu cùng một lúc và kết quả sẽ xuất hiện ngay sau khi mỗi yêu cầu kết thúc.

```kotlin
fun main() = runBlocking {
    println("=== flatMapMerge ===")
    flowOf("A", "B", "C")
        .flatMapMerge { item ->
            flow {
                println("Start job $item")
                delay(500)
                emit("Done $item")
            }
        }
        .collect { println(it) }
}
```

Đầu ra:

```bash
Start job A
Start job B
Start job C
Done A
Done B
Done C
```

## Ngoại lệ Flow

Kết thúc cuộc gọi thu thập của bạn trong khối thử/bắt. Nếu có bất kỳ lỗi nào xảy ra trong quá trình phát hoặc collection, lỗi đó sẽ bị phát hiện và Flow sẽ bị hủy ngay lập tức.

```kotlin
val flow = flow {
    emit("A")
    emit("B")
    emit("Error") // Giả sử giá trị này gây lỗi
    emit("C")
}

try {
    flow.collect { value ->
        println("Collecting $value")
        if (value == "Error") throw IllegalStateException("Unexpected value: $value")
    }
} catch (e: Throwable) {
    println("Caught error: ${e.message}")
}
```
Đầu ra:
```bash
Collecting A
Collecting B
Collecting Error
Caught error: Unexpected value: Error
```

### Tính minh bạch của ngoại lệ
Các luồng phải trong suốt đối với các ngoại lệ. Không phát ra các giá trị từ các khối `try/catch` trong trình tạo luồng.

Sử dụng toán tử `catch` để duy trì tính minh bạch của ngoại lệ (tiếp tục phát ra giá trị khác thay vì hủy):

```kotlin
simple()
    .catch { e -> emit("Caught $e") } // emit on exception
    .collect { value -> println(value) }
```

> [!CAUTION] 
> Toán tử `catch` chỉ nắm bắt các ngoại lệ ngược dòng (từ các toán tử ở trên nó). Các ngoại lệ từ `collect` hoặc các toán tử dưới `catch` vẫn sẽ thoát.


### Toán tử onCompletion

Sử dụng `.onCompletion { }` để chạy logic khi luồng hoàn thành—thành công hoặc có ngoại lệ. 
Bạn có thể kiểm tra xem nguyên nhân có phải là rỗng hay không để phân biệt sự hoàn thành đặc biệt.

## Ra mắt Flow

### launchIn

toán tử bắt đầu thu thập Flow trong một coroutine mới mà không chặn coroutine hiện tại

```kotlin
fun main() = runBlocking {
    val eventsFlow = flow {
        repeat(3) {
            emit("Event #$it")
            delay(500)
        }
    }

    eventsFlow
        .onEach { println(it) }
        .launchIn(this) // collect at current coroutine, non-blocking

    println("Done!")

    delay(2000) // wait for event
}
```