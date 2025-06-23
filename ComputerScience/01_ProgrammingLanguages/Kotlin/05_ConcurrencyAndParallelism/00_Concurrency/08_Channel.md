# Channel
Since coroutines can run on different threads and operate independently, 
establishing reliable communication channels between them requires a thoughtful approach.

## The Solution: Channels

Kotlin Channels provide a type-safe way for coroutines to communicate by passing data streams between them.

They implement a producer-consumer pattern that ensures each piece of data is delivered exactly once

Think of Channels as a postal service between coroutines:

- **A sender coroutine** is like someone going to the post office to send mail to a specific mailbox (channel).
- **The Channel itself** is the mailbox.
- **A receiver coroutine** is like someone who owns that mailbox and checks for mail.
- **Each piece of mail** (data emission) gets delivered exactly once. If two coroutines both check the same mailbox (channel), the first one to receive the letter (data emission) will take it, while the other one will not find anything.
- **If the mailbox is full**, new mail waits at the post office (backpressure).


The channel is made just for that reason, to allow communication between different asynchronous coroutines.

## Suspending Behavior:

- **If the channel buffer is full**, senders suspend until there’s space.
- **If the channel is empty**, receivers suspend until an item arrives

First-come, first-served: Data items are queued in order per sender

## Key Benefits

- **Thread Safety**: Channels handle synchronization internally, eliminating race conditions
- **Backpressure Management**: Built-in flow control prevents overwhelming receivers
- **Structured Communication**: Follows Kotlin’s structured concurrency principles
- **Cancellation Support**: Integrates with Kotlin’s cancellation system

## Types of Channels

Kotlin addresses these varying requirements by providing four types of channels, each optimized for specific use cases.

1. Rendezvous (default: `Channel()`)
    - The sender suspend until the receiver is ready, and vice versa.
    - Use case: Strict handoff, minimal overhead.
2. Buffered (`Channel(capacity)`)
    - Partial Decoupling: Allows temporary outpacing of the receiver if the buffer isn’t full. If it’s full, the next package must wait.
    - Use case: Bursty data or pipelines that benefit from a small queue.
3. Conflated (`Channel(Channel.CONFLATED)`)
    - Only keeps the latest item if the buffer is not consumed quickly. Older items are dropped.
    - Use case: Real-time data streams where only the most recent update matters (e.g., sensor data).
4. Unlimited (`Channel(Channel.UNLIMITED)`)
    - Can grow indefinitely, risking high memory usage if not consumed in time
    - Use case: Rare scenarios where producers must never block; watch for memory usage.

## Channels vs Flows Key Differences 

### Single-Consumption vs. Broadcast

- **Channels**: A single item goes to exactly one receiver. Once received, it’s gone.
- **SharedFlow**: Each emission is broadcast to all collectors. No single-consumption.

### Concurrency ‘Handshake’ vs. Data Stream
- **Channels** are great for managing concurrency where two parts need to coordinate directly — like a handshake. They’re useful in pipeline processing and when you need to control the flow of data
- **Flows** focus on stream transformations, collecting data “on demand,” or broadcasting to multiple observers.

## Advanced Usage: Fan-In / Fan-Out & Two-Way Communication

- **Fan-In**: Multiple senders, a single receiver. 
All coroutines call `channel.send()` on the same channel, and that single receiver processes all messages. 
This is great for aggregating data from multiple producers into one consumer.

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

- **Fan-Out**: A single sender that sends data to multiple potential consumers. 
However, in Kotlin channels, once an item is read by one consumer, it’s gone. 
If you want each consumer to receive the same data, use a broadcast-like mechanism, such as `SharedFlow`.

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
Here, each item will be consumed by exactly one of the two consumers, not both.

### Two-Way (Bidirectional) Communication

Because channels are unidirectional, you have two main ways to achieve two-way communication:

#### 1. Use Two Separate Channels (simplest approach)

- One channel for A → B.
- Another channel for B → A.
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

#### 2. Use a Single Channel with Structured Messages

- Define a sealed class (or other structure) that indicates who sent it or what type of message it is.
- Both coroutines read from the same channel but respond only to messages that concern them.

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
> Potential Deadlock Warning, both coroutines suspended, waiting for the other to read. 
> Usually, sending a message first or structuring the communication steps carefully avoids this. 
> Two separate channels often reduce these risks because each side can send without waiting for the other to consume from the same channel.

## Best Usecase in the practical examples

### One-Time UI Events in Jetpack Compose

Channels are perfect for one-time events like showing a toast or navigating once:

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

Each message is consumed exactly once — no duplicates, no replay.

### Coroutine Communication in a Business Logic Layer

Channels excel at enabling safe communication between different coroutines in your business logic. 
Here’s a real-world example of managing orders and inventory:

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

This example demonstrates several key channel concepts:

- Safe communication between different coroutines
- Automatic synchronization through channel’s suspend/resume mechanism
- Real-world application of backpressure (order processing pauses if inventory isn’t ready)

## Multi-Stage Pipeline

Suppose you have three stages:

- **Read lines** from a CSV.
- **Clean** or transform each line.
- **Write** them into a local database.

You can chain them with channels:

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

## Error Handling in Channel-Based Coroutines

### 1. Try-Catch Blocks Around Send/Receive
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
The same idea applies for `receive()` calls

### 2. Supervisory Job and Coroutine Scopes

```kotlin
val supervisor = SupervisorJob()
val scope = CoroutineScope(Dispatchers.IO + supervisor + CoroutineExceptionHandler { _, throwable ->
    // Log or handle uncaught exceptions
})
```

### Closing Channels on Error

When an error occurs in one stage of a pipeline, it can be beneficial to close the channel to signal no further data will arrive. 

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

## reference

- https://proandroiddev.com/mastering-kotlin-coroutine-channels-in-android-from-basics-to-advanced-patterns-b6fdd7754cca

