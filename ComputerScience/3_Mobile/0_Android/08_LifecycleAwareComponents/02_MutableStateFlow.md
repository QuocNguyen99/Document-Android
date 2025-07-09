# Mutable State Flow

## Understanding `MutableStateFlow.value` vs `MutableStateFlow.update {}`

## 1. value is thread-safe

- You can safely read and write `.value` from multiple coroutines without causing crashes.
- Kotlin uses internal synchronization (like atomic references) to ensure thread-safety.
- However, `value = value + 1` is not atomic — it involves read-modify-write, which can lead to race conditions.

## 2. `update {}` is atomic

- `MutableStateFlow<T>.update {}` ensures atomic and consistent updates based on the current value.

- Internally uses a compare-and-set loop: 
  - Reads the current value.
  - Applies your function.
  - Updates only if the value hasn't changed.
  - Retries if there was a concurrent modification.
- Prevents lost updates when multiple coroutines update the flow at the same time.

## 3. When to use `.value` and `.update {}`

You can use direct assignment when:
- You don’t rely on the previous value.
- You’re in a single-threaded or coroutine-safe context.

Use update when:
- You modify the value based on its current state.
- There are multiple concurrent updaters.






