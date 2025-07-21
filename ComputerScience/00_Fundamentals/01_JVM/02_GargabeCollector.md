# GargabeCollector

the Garbage Collector (GC) is invoked when the system determines memory needs to be freed.

## Key Points

- **Periodic Collection**: Both Android Runtime (ART) and Dalvik virtual machine perform garbage collection periodically.
- **Heap Generations**: Android's heap is divided into "generations," each with its own memory limits for objects.
- **Triggering Events**: When a heap generation starts to fill up, the system triggers a garbage collection event to free memory.
- **No Manual Control**: Developers cannot directly control when garbage collection occurs. The system uses its own criteria to decide when to collect, pausing process execution to do so.
- **Collection Time**: The duration of garbage collection depends on the generation being collected and the number of active objects within it.
- **Memory Churn Impact**: Your code can increase the frequency or duration of GC events. For example, allocating many temporary objects in a loop or in a view's `onDraw()` method can trigger frequent collections. High "memory churn" (the rate of temporary object allocation) leads to more GC events.

## Best Practices and Optimization Strategies

The Garbage Collector (GC) in Dalvik VM is invoked periodically by the system to free up memory. 
The Android heap is divided into generations, and whenever a generation fills up, the system attempts to reclaim memory through a GC event. 
Developers cannot directly control when GC runs; instead, the system uses its own criteria.

While individual GC events generally have little impact on performance, frequent GC events within a short period can drain battery quickly and slightly increase frame setup times, as the GC interacts with app threads. 
The more time spent on GC, the faster the battery drains. 
This can even push your code execution beyond the recommended 16ms threshold for smooth frame rendering.

To optimize for GC, focus on reducing unnecessary memory allocations and proactively releasing resources. Here are key strategies:

### 1. Avoid Memory Churn

- **Memory churn** refers to the number of temporary objects allocated within a given time. High memory churn often causes frequent GC events.
- For example, allocating many temporary objects in a `for` loop or creating new `Paint` or `Bitmap` objects inside a view's `onDraw()` method can quickly fill the young generation, forcing GC to run.
- Reduce object allocations in performance-critical areas. Move allocations out of inner loops, or use factory-based allocation patterns.
- Use the **Memory Profiler** in Android Studio to locate hotspots with high memory churn.


## 2. Use Object Pools Carefully

- With an **object pool**, instead of discarding an object, you return it to the pool for reuse, reducing the need for new allocations and GC.
- Evaluate performance carefully: object pools may introduce synchronization overhead, and retaining too many objects in the pool can actually increase GC workload.
- Only use object pools where profiling shows clear benefits.

## 3. Release Memory in Response to System Events

- Android may reclaim memory from your app or kill it to free memory for critical tasks.
- Implement the `ComponentCallbacks2` interface in your `Activity` classes and handle the `onTrimMemory()` callback. This notifies your app about lifecycle or memory events, providing an opportunity to voluntarily reduce memory usage.
- Freeing up memory here can reduce the chance your app is killed by the "low-memory killer" (LMK). Different `onTrimMemory()` levels (e.g., `TRIM_MEMORY_UI_HIDDEN`, `TRIM_MEMORY_BACKGROUND`) let you release memory tied to UI or background processing.

## 4. Use Memory-Efficient Code Structures

- **Limit services usage:** Avoid long-running, unnecessary services. Service processes are expensive as their RAM is not available for other processes. Prefer `WorkManager` for background tasks.
- **Use optimized data containers:** Android provides memory-efficient containers like `SparseArray`, `SparseBooleanArray`, and `LongSparseArray`. These avoid autoboxing keys/values, reducing object creation. Use raw arrays where possible for the lightest structure.
- **Be cautious with abstractions:** While abstractions enhance flexibility and maintainability, they often require more code, increasing memory and time for mapping code into memory. Avoid them if the benefits are minimal.
- **Use lite protobufs for serialization:** When using protocol buffers, always use "lite protobufs" on the client side. Regular protobufs generate verbose code, increase RAM and APK size, and can slow execution.

## 5. Remove Memory-Hungry Resources and Libraries

- **Reduce APK size:** The overall app size, including bitmaps, resources, animation frames, and third-party libraries, affects memory consumption. Use tools like R8 to shrink resources and dependencies.
- **Use Hilt or Dagger 2 for dependency injection:** These frameworks avoid runtime reflection, reducing unnecessary memory usage, especially during app startup.
- **Be careful with third-party libraries:** External libraries may not be optimized for mobile, could be inefficient, or even conflict (e.g., multiple protobuf implementations). Avoid including large libraries for minor features, and always analyze library size and RAM footprint before usage.

## 6. Avoid Memory Leaks

- Although ART and Dalvik periodically perform GC, you must still avoid memory leaks, often caused by holding references in static member variables. Release any referenced objects at appropriate lifecycle callbacks.

## Summary and Analogy

To optimize for garbage collection, you cannot explicitly invoke it—effective memory management is key. Think of the Garbage Collector as an automatic house cleaner: you cannot decide when they come, but keeping your house tidy, not hoarding unused items (unreferenced objects), and avoiding constant clutter (temporary object creation) means the cleaner works less, visits less often, and has an easier job. This keeps your "house" (app) clean, efficient, and smooth-running.

## reference

- https://developer.android.com/topic/performance/memory-overview
- https://developer.android.com/topic/performance/memory-management
- https://developer.android.com/topic/performance/memory