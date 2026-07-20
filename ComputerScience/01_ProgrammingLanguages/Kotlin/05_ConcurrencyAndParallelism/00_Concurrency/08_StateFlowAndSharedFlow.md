# StateFlow and SharedFlow
`StateFlow` and `SharedFlow` are Flow APIs that efficiently emit values to multiple consumers. They serve different purposes in state management and event handling.

## StateFlow

StateFlow is an immutable data holder that represents a single value(state) that can be observed

- Hot stream with a **current state value**
- Requires an **initial value**
- Collectors immediately receive the **latest value**

When a new consumer starts collecting from the flow, it receives the last state in the stream and any subsequent states


> [!WARNING]
> - A `StateFlow` is always active and in memory, and it becomes eligible for garbage collection only when there are no other references to it from a garbage collection root.
> - Never collect a flow from the UI directly from launch or the launchIn extension function if the UI needs to be updated. 
> These functions process events even when the view is not visible. 
> This behavior can lead to app crashes. To avoid that, use the `repeatOnLifecycle` API as shown above.


### Convert `MutableStateFlow` to Read-Only `StateFlow`

- Do not convert cold flow to hot flow
- The purpose is hiding the setter for state from outside

```kotlin
private val _state = MutableStateFlow(...)
val state = _state.asStateFlow() // read-only for view
```

## SharedFlow
- Hot stream for emitting events
- No state storage unless `replay > 0`
- Configurable `replay` buffer for resend a number of previously-emitted values for new subscribers.
- Ideal for **one-time events**, button clicks, or navigation

For example about replay:

```kotlin
val sharedFlow = MutableSharedFlow<Int>(replay = 2)

// Emit 1, 2, 3
sharedFlow.emit(1)
sharedFlow.emit(2)
sharedFlow.emit(3)

//at the other coroutine
sharedFlow.collect { println(it) }

```

### Making cold flows hot using `shareIn`
- convert cold flow to hot flow (Multiple collectors listen to only one data source and do not create a new data stream for each collector)

```kotlin
class NewsRemoteDataSource(...,
    private val externalScope: CoroutineScope,
) {
    val latestNews: SharedFlow<List<ArticleHeadline>> = flow {
        ...
    }.shareIn(
        externalScope,
        replay = 1,
        started = SharingStarted.WhileSubscribed()
    )
}
```


## Usage in Android
`StateFlow` can expose UI state from a `ViewModel`, ensuring state survives configuration changes:

```kotlin
class LatestNewsViewModel(
    private val newsRepository: NewsRepository
) : ViewModel() {

    // Backing property to prevent external state updates
    private val _uiState = MutableStateFlow(LatestNewsUiState.Success(emptyList()))
    // Public immutable StateFlow for UI consumption
    val uiState: StateFlow<LatestNewsUiState> = _uiState

    init {
        viewModelScope.launch {
            newsRepository.favoriteLatestNews
                .collect { favoriteNews ->
                    _uiState.value = LatestNewsUiState.Success(favoriteNews)
                }
        }
    }
}

sealed class LatestNewsUiState {
    data class Success(val news: List<ArticleHeadline>): LatestNewsUiState()
    data class Error(val exception: Throwable): LatestNewsUiState()
}
```

The producer updates `MutableStateFlow`, while consumers collect from the `StateFlow`. Unlike cold flows, `StateFlow` is hot and doesn't trigger producer code when collected.

> [!WARNING] 
> A `StateFlow` remains in memory until there are no references to it from a garbage collection root.

New consumers receive the current state plus subsequent updates, similar to `LiveData`.
Views collect from `StateFlow` using lifecycle-aware coroutines:


```kotlin
class LatestNewsActivity : AppCompatActivity() {
    private val latestNewsViewModel = // getViewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        lifecycleScope.launch {
            // Automatically starts collecting when STARTED, cancels when STOPPED
            repeatOnLifecycle(Lifecycle.State.STARTED) {
                latestNewsViewModel.uiState.collect { uiState ->
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
> Never collect UI-updating flows directly with `launch` or `launchIn` as they process events even when the view is not visible, potentially causing crashes.

> [!TIP] 
> Convert any `Flow` to a `StateFlow` using the stateIn operator.

## When to use
- Use `StateFlow` for **managing and sharing UI state**
- Use `SharedFlow` for **broadcasting events** to multiple listeners















