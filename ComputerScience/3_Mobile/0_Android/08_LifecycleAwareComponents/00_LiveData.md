# LiveData

`LiveData` is an observable data holder class. Unlike a regular observable, `LiveData` is lifecycle-aware, meaning it respects the lifecycle of other app components, such as activities, fragments, or services. 

## The advantages of using LiveData
- Ensures your UI matches your data state
- No memory leaks
- No crashes due to stopped activities
- No more manual lifecycle handling

> [!NOTE]
> `StateFlow` is a part of Kotlin Coroutines, making it seamlessly compatible with coroutine features like suspend functions, viewModelScope, and other flow-based APIs.
> In contrast, `LiveData` does not natively support coroutines and often requires adapters such as `liveData {}` or `.asLiveData()` to bridge between coroutine code and `LiveData` observers.



