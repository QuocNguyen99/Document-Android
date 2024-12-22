# Thread management

we will consider two commonly used methods in multithreading programming: `sleep()` and `join()`. Both methods may throw an `InterruptedException`.

## Sleeping

The method `Thread.sleep()` causes the currently executing thread to suspend execution for the specified number of milliseconds.

Another way to make the current thread sleep is to use the special class `TimeUnit` from the package `java.util.concurrent`, example:

`TimeUnit.MILLISECONDS.sleep(2000)` performs `Thread.sleep` for 2000 milliseconds;

There are more existing periods: `NANOSECONDS`, `MICROSECONDS`, `MILLISECONDS`, `SECONDS`, `MINUTES`, `HOURS`, and `DAYS`. 

## Joining

The `join` method forces the current thread to wait for the completion of another thread on which the method was called.

The overloaded version of the `join` method takes the waiting time in milliseconds:

```kotlin
thread.join(2000)
```