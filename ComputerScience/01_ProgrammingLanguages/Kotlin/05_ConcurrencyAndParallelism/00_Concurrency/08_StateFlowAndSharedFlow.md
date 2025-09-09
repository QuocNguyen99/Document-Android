# StateFlow and SharedFlow

`StateFlow` and `SharedFlow` are Flow APIs that enable flows to 
optimally emit state updates and emit values to multiple consumers.


## StateFlow
- **Hot stream** that holds a **current state value**.
- Requires an **initial value**.
- Collectors always receive the **latest value immediately**.

## SharedFlow
- Hot stream used to emit events.
- A SharedFlow “broadcasts” data to all active collectors in real time — like an event bus. 
- Everyone who’s collecting at the time of emission sees it, and you can configure how many items to replay to latecomers. Does not store state unless `replay > 0`. You can configure `replay` to buffer emitted values.

## Usage in Android

a `StateFlow` can be exposed from the `ViewModel` 
so that the View can listen for UI state updates and 
inherently make the screen state survive configuration changes.
Example:

```kotlin
class LatestNewsViewModel(
    private val newsRepository: NewsRepository
) : ViewModel() {

    // Backing property to avoid state updates from other classes
    private val _uiState = MutableStateFlow(LatestNewsUiState.Success(emptyList()))
    // The UI collects from this StateFlow to get its state updates
    val uiState: StateFlow<LatestNewsUiState> = _uiState

    init {
        viewModelScope.launch {
            newsRepository.favoriteLatestNews
                // Update View with the latest favorite news
                // Writes to the value property of MutableStateFlow,
                // adding a new element to the flow and updating all
                // of its collectors
                .collect { favoriteNews ->
                    _uiState.value = LatestNewsUiState.Success(favoriteNews)
                }
        }
    }
}

// Represents different states for the LatestNews screen
sealed class LatestNewsUiState {
    data class Success(val news: List<ArticleHeadline>): LatestNewsUiState()
    data class Error(val exception: Throwable): LatestNewsUiState()
}
```

The class responsible for updating a `MutableStateFlow` is the producer, and all classes collecting from the `StateFlow` are the consumers.

Unlike a **cold** flow built using the flow builder, a `StateFlow` is **hot** (collecting from the flow doesn't trigger any producer code)

> [!WARNING]
> A `StateFlow` is always active and in memory, and it becomes eligible for garbage collection only when there are no other references to it from a garbage collection root.

When a new consumer starts collecting from the flow, it receives the last state in the stream and any subsequent states. 
You can find this behavior in other observable classes like `LiveData`.

The `View` listens for `StateFlow` as with any other flow:

```kotlin
class LatestNewsActivity : AppCompatActivity() {
    private val latestNewsViewModel = // getViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        ...
        // Start a coroutine in the lifecycle scope
        lifecycleScope.launch {
            // repeatOnLifecycle launches the block in a new coroutine every time the
            // lifecycle is in the STARTED state (or above) and cancels it when it's STOPPED.
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                // Trigger the flow and start listening for values.
                // Note that this happens when lifecycle is STARTED and stops
                // collecting when the lifecycle is STOPPED
                latestNewsViewModel.uiState.collect { uiState ->
                    // New value received
                    when (uiState) {
                        is LatestNewsUiState.Success -> showFavoriteNews(uiState.news)
                        is LatestNewsUiState.Error -> showError(uiState.exception)
                    }
                }
            }
        }
    }
}
```

> [!CAUTION]
> Never collect a flow from the UI directly from `launch` or the `launchIn` extension function if the UI needs to be updated. 
> These functions process events even when the view is not visible. 
> This behavior can lead to app crashes. 
> To avoid that, use the `repeatOnLifecycle` API as shown above.

> [!TIP]
> To convert any `flow` to a `StateFlow`, use the `stateIn` intermediate operator.


## When to use
- Use `StateFlow` when **managing and sharing UI state**.
- Use `SharedFlow` for **broadcasting events** to multiple listeners.









