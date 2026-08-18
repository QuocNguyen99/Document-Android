#Channel
Vì coroutine có thể chạy trên nhiều thread khác nhau và hoạt động độc lập,
việc thiết lập các kênh liên lạc đáng tin cậy giữa chúng đòi hỏi một cách tiếp cận chu đáo.

## Giải pháp: Kênh

Kênh Kotlin cung cấp một cách an toàn về loại để các coroutine giao tiếp bằng cách truyền các luồng dữ liệu giữa chúng.

Họ triển khai mô hình nhà sản xuất-người tiêu dùng để đảm bảo mỗi phần dữ liệu được phân phối chính xác một lần

Hãy coi Kênh như một dịch vụ bưu chính giữa các coroutine:

- **Sender coroutine** giống như ai đó đến bưu điện để gửi thư đến một hộp thư (kênh) cụ thể.
- **Bản thân Channel** là hộp thư.
- **Coroutine receiver** giống như người sở hữu hộp thư đó và kiểm tra thư.
- **Mỗi thư** (phát dữ liệu) được gửi đúng một lần. Nếu cả hai coroutine đều kiểm tra cùng một hộp thư (kênh), thì cái đầu tiên nhận được thư (phát dữ liệu) sẽ lấy nó, trong khi cái còn lại sẽ không tìm thấy gì.
- **Nếu hộp thư đầy**, thư mới sẽ chờ ở bưu điện (back Pressure).


Kênh được tạo ra chỉ vì lý do đó, để cho phép liên lạc giữa các coroutine không đồng bộ khác nhau.

## Hành vi đình chỉ:

- **Nếu bộ đệm kênh đầy**, người gửi sẽ tạm dừng cho đến khi còn chỗ trống.
- **Nếu kênh trống**, người nhận sẽ tạm dừng cho đến khi có mặt hàng đến

Đến trước, phục vụ trước: Các mục dữ liệu được xếp hàng theo thứ tự cho mỗi người gửi

## Lợi ích chính

- **Thread Safety**: Các kênh xử lý synchronization nội bộ, loại bỏ các điều kiện cạnh tranh
- **Quản lý áp suất ngược**: Kiểm soát luồng tích hợp giúp ngăn ngừa tình trạng quá tải của máy thu
- **Giao tiếp có cấu trúc**: Tuân theo nguyên tắc structured concurrency của Kotlin
- **Hỗ trợ Cancellation**: Tích hợp với hệ thống cancellation của Kotlin

## Các loại kênh

Kotlin giải quyết các yêu cầu khác nhau này bằng cách cung cấp bốn loại kênh, mỗi loại được tối ưu hóa cho các trường hợp sử dụng cụ thể.

1. Điểm hẹn (mặc định: `Channel()`)
    - Người gửi tạm dừng cho đến khi receiver sẵn sàng và ngược lại.
    - Ca sử dụng: Chuyển giao nghiêm ngặt, chi phí tối thiểu.
2. Được lưu vào bộ đệm (`Channel(capacity)`)
    - Tách một phần: Cho phép vượt quá tốc độ tạm thời của receiver nếu bộ đệm không đầy. Nếu nó đầy, gói tiếp theo phải đợi.
    - Ca sử dụng: Dữ liệu bùng nổ hoặc quy trình được hưởng lợi từ hàng đợi nhỏ.
3. Hợp nhất (`Channel(Channel.CONFLATED)`)
    - Chỉ giữ lại mục mới nhất nếu bộ đệm không được sử dụng nhanh chóng. Các mục cũ hơn sẽ bị loại bỏ.
    - Ca sử dụng: Luồng dữ liệu thời gian thực trong đó chỉ có bản cập nhật gần đây nhất mới quan trọng (ví dụ: dữ liệu cảm biến).
4. Không giới hạn (`Channel(Channel.UNLIMITED)`)
    - Có thể phát triển vô thời hạn, có nguy cơ sử dụng bộ nhớ cao nếu không tiêu thụ kịp thời
    - Ca sử dụng: Các tình huống hiếm hoi mà nhà sản xuất không bao giờ phải chặn; theo dõi việc sử dụng bộ nhớ.

## Sự khác biệt chính giữa kênh và luồng 

### Tiêu thụ một lần so với Phát sóng

- **Kênh**: Một mục sẽ chuyển tới chính xác một receiver. Sau khi nhận được, nó biến mất.
- **SharedFlow**: Mỗi lần phát thải được phát đến tất cả người thu thập. Không tiêu thụ một lần.

### Concurrency 'Bắt tay' so với Luồng dữ liệu
- **Kênh** rất phù hợp để quản lý concurrency trong đó hai phần cần phối hợp trực tiếp — giống như một cái bắt tay. Chúng hữu ích trong quá trình xử lý quy trình và khi bạn cần kiểm soát luồng dữ liệu
- **Dòng** tập trung vào chuyển đổi luồng, thu thập dữ liệu “theo yêu cầu” hoặc phát sóng tới nhiều người quan sát.

## Cách sử dụng nâng cao: Fan-In / Fan-Out & Giao tiếp hai chiều

- **Fan-In**: Nhiều người gửi, một receiver. 
Tất cả các coroutine đều gọi `channel.send()` trên cùng một kênh và receiver duy nhất đó sẽ xử lý tất cả tin nhắn. 
Điều này rất tốt cho việc tổng hợp dữ liệu từ nhiều nhà sản xuất vào một người tiêu dùng.

```kotlin
val channel = Channel<String>()

// Multiple Producers
repeat(3) { index ->
    launch {
        val producerName = "Producer-$index"
        repeat(5) { i ->
            channel.send("$producerName sent item $i")
        }
    }
}

// Single Consumer
launch {
    repeat(15) {
        val item = channel.receive()
        println("Consumer received: $item")
    }
    channel.close()
}
```

- **Fan-Out**: Một người gửi duy nhất gửi dữ liệu đến nhiều người tiêu dùng tiềm năng. 
Tuy nhiên, trong các kênh Kotlin, khi một người tiêu dùng đọc một mục thì mục đó sẽ biến mất. 
Nếu bạn muốn mỗi người tiêu dùng nhận được cùng một dữ liệu, hãy sử dụng cơ chế giống như phát sóng, chẳng hạn như `SharedFlow`.

```kotlin
val channel = Channel<Int>()

// Single Producer
launch {
    repeat(10) { i ->
        channel.send(i)
    }
    channel.close()
}

// Multiple Consumers
repeat(2) { index ->
    launch {
        for (msg in channel) {
            println("Consumer $index got $msg")
        }
    }
}
```
Ở đây, mỗi mặt hàng sẽ được tiêu thụ bởi chính xác một trong hai người tiêu dùng chứ không phải cả hai.

### Giao tiếp hai chiều (Hai chiều)

Vì các kênh là một chiều nên bạn có hai cách chính để đạt được giao tiếp hai chiều:

#### 1. Sử dụng hai kênh riêng biệt (cách tiếp cận đơn giản nhất)

- Một kênh cho A → B.
- Một kênh khác cho B → A.
```kotlin
val channelAtoB = Channel<String>()
val channelBtoA = Channel<String>()

// Coroutine A
launch {
    channelAtoB.send("Hello from A!")
    val response = channelBtoA.receive()
    println("A received: $response")
}

// Coroutine B
launch {
    val msg = channelAtoB.receive()
    println("B received: $msg")
    channelBtoA.send("Hi A, this is B!")
}
```

#### 2. Sử dụng một Channel duy nhất với các tin nhắn có cấu trúc

- Xác định sealed class (hoặc cấu trúc khác) cho biết ai đã gửi nó hoặc loại tin nhắn đó.
- Cả hai coroutine đều đọc từ cùng một kênh nhưng chỉ phản hồi những tin nhắn liên quan đến chúng.

```kotlin
sealed class ChatMessage {
    data class FromA(val content: String) : ChatMessage()
    data class FromB(val content: String) : ChatMessage()
}

val chatChannel = Channel<ChatMessage>()

// Coroutine A
launch {
    // Send an initial message
    chatChannel.send(ChatMessage.FromA("Hello from A"))
    
    // Wait for B’s response in the same channel
    for (msg in chatChannel) {
        when (msg) {
            is ChatMessage.FromB -> {
                println("A got B’s message: ${msg.content}")
                break
            }
            else -> { /* ignore messages from A itself */ }
        }
    }
}

// Coroutine B
launch {
    for (msg in chatChannel) {
        when (msg) {
            is ChatMessage.FromA -> {
                println("B got A’s message: ${msg.content}")
                // Respond in the same channel
                chatChannel.send(ChatMessage.FromB("Hi A, this is B!"))
                break
            }
            else -> { /* ignore messages from B */ }
        }
    }
    chatChannel.close()
}
```

> [!WARNING]
> Cảnh báo bế tắc tiềm ẩn, cả hai coroutine đều bị treo, chờ coroutine kia đọc. 
> Thông thường, việc gửi tin nhắn trước hoặc sắp xếp các bước liên lạc một cách cẩn thận sẽ tránh được điều này. 
> Hai kênh riêng biệt thường giảm thiểu những rủi ro này vì mỗi bên có thể gửi mà không cần đợi bên kia sử dụng từ cùng một kênh.

## Usecase tốt nhất trong các ví dụ thực tế

### Sự kiện UI một lần trong Jetpack Compose

Các kênh hoàn hảo cho các sự kiện diễn ra một lần như nâng ly chúc mừng hoặc điều hướng một lần:

```kotlin
class MyViewModel : ViewModel() {
    private val _snackbarChannel = Channel<String>(Channel.BUFFERED)
    val snackbarChannel: ReceiveChannel<String> get() = _snackbarChannel

    fun triggerSnackbar(message: String) {
        viewModelScope.launch {
            _snackbarChannel.send(message)
        }
    }
}
```

```kotlin
@Composable
fun MyScreen(viewModel: MyViewModel) {
    val snackbarHostState = remember { SnackbarHostState() }

    // Launch once with a stable key to avoid recomposition side effects
    LaunchedEffect(viewModel.snackbarChannel) {
        for (msg in viewModel.snackbarChannel) {
            snackbarHostState.showSnackbar(msg)
        }
    }

    Scaffold(snackbarHost = { SnackbarHost(hostState = snackbarHostState) }) {
        // UI content here
    }
}
```

Mỗi tin nhắn được sử dụng đúng một lần - không trùng lặp, không phát lại.

### Giao tiếp Coroutine trong Lớp logic nghiệp vụ

Các kênh vượt trội trong việc cho phép liên lạc an toàn giữa các coroutine khác nhau trong logic kinh doanh của bạn. 
Dưới đây là ví dụ thực tế về quản lý đơn đặt hàng và hàng tồn kho:

```kotlin
// Channel for order processing communication
val orderChannel = Channel<OrderRequest>()

// Coroutine 1: Inventory Manager
launch {
    while (true) {
        val inventory = checkInventory()
        if (inventory.hasAvailableStock) {
            // Process any pending orders
            val order = orderChannel.receive() // suspends until order arrives
            processOrder(order, inventory)
        }
        delay(1000)
    }
}

// Coroutine 2: Order Processor
launch {
    while (true) { 
        val newOrder = receiveNewOrder()
        orderChannel.send(newOrder) // suspends if inventory isn't ready
        delay(500)
    }
}
```

Ví dụ này thể hiện một số khái niệm kênh chính:

- Giao tiếp an toàn giữa các coroutine khác nhau
- synchronization tự động thông qua cơ chế tạm dừng/tiếp tục của kênh
- Ứng dụng áp suất ngược trong thế giới thực (tạm dừng quá trình xử lý đơn hàng nếu hàng tồn kho chưa sẵn sàng)

## Đường ống nhiều giai đoạn

Giả sử bạn có ba giai đoạn:

- **Đọc dòng** từ CSV.
- **Làm sạch** hoặc chuyển đổi từng dòng.
- **Ghi** chúng vào cơ sở dữ liệu cục bộ.

Bạn có thể xâu chuỗi chúng bằng các kênh:

```kotlin
val rawDataChannel = Channel<String>(capacity = 50)
val processedDataChannel = Channel<String>(capacity = 50)

// Producer
launch {
    val lines = readCsvFromAssets() // hypothetical
    for (line in lines) {
        rawDataChannel.send(line)
    }
    rawDataChannel.close()
}

// Transformer
launch {
    for (line in rawDataChannel) {
        val cleanedLine = transform(line)
        processedDataChannel.send(cleanedLine)
    }
    processedDataChannel.close()
}

// Consumer
launch {
    for (cleaned in processedDataChannel) {
        saveToDatabase(cleaned)
    }
}
```

## Xử lý lỗi trong Coroutine dựa trên Channel

### 1. Các khối thử bắt xung quanh việc gửi/nhận
```kotlin
launch {
    try {
        channel.send("Important message")
    } catch (e: CancellationException) {
        // The coroutine was cancelled, handle or log as needed
    } catch (e: ClosedSendChannelException) {
        // The channel was closed while suspended
        // Decide how to handle or log this scenario
    } catch (e: Exception) {
        // Other errors while sending
    }
}
```
Ý tưởng tương tự cũng áp dụng cho các cuộc gọi `receive()`

### 2. Công việc giám sát và phạm vi Coroutine

```kotlin
val supervisor = SupervisorJob()
val scope = CoroutineScope(Dispatchers.IO + supervisor + CoroutineExceptionHandler { _, throwable ->
    // Log or handle uncaught exceptions
})
```

### Đóng kênh do lỗi

Khi xảy ra lỗi ở một giai đoạn của đường ống, việc đóng kênh để báo hiệu rằng sẽ không có thêm dữ liệu nào đến sẽ có ích. 

```kotlin
launch {
    try {
        for (line in rawDataChannel) {
            val cleanedLine = transform(line)
            processedDataChannel.send(cleanedLine)
        }
    } catch (e: Exception) {
        // Log error
        processedDataChannel.close(e) // Let downstream know about the failure
    } finally {
        processedDataChannel.close()
    }
}
```

## thẩm quyền giải quyết

- https://proandroiddev.com/mastering-kotlin-coroutine-channels-in-android-from-basics-to-advanced-patterns-b6fdd7754cca

