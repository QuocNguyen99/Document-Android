# LiveData

        `LiveData` is an observable data holder class. Unlike a regular observable, LiveData is lifecycle-aware, meaning it respects the lifecycle of other app components, such as activities, fragments, or services. This awareness ensures LiveData only updates app component observers that are in an active lifecycle state.

    LiveData considers an observer, which is represented by the [`Observer`](https://developer.android.com/reference/androidx/lifecycle/Observer) class, to be in an active state if its lifecycle is in the [`STARTED`](https://developer.android.com/reference/androidx/lifecycle/Lifecycle.State#STARTED) or [`RESUMED`](https://developer.android.com/reference/androidx/lifecycle/Lifecycle.State#RESUMED) state. LiveData only notifies active observers about updates. Inactive observers registered to watch [`LiveData`](https://developer.android.com/reference/androidx/lifecycle/LiveData) objects aren't notified about changes.

You can register an observer paired with an object that implements the [`LifecycleOwner`](https://developer.android.com/reference/androidx/lifecycle/LifecycleOwner) interface. This relationship allows the observer to be removed when the state of the corresponding [`Lifecycle`](https://developer.android.com/reference/androidx/lifecycle/Lifecycle) object changes to [`DESTROYED`](https://developer.android.com/reference/androidx/lifecycle/Lifecycle.State#DESTROYED). This is especially useful for activities and fragments because they can safely observe [`LiveData`](https://developer.android.com/reference/androidx/lifecycle/LiveData) objects and not worry about leaks—activities and fragments are instantly unsubscribed when their lifecycles are destroyed.



VN :

    Bạn có thể đăng ký một người quan sát được ghép nối với một đối tượng thực hiện giao diện LifecycleOwner. Mối quan hệ này cho phép người quan sát bị loại bỏ khi trạng thái của đối tượng Vòng đời tương ứng thay đổi thành DESTROYED. Điều này đặc biệt hữu ích cho các hoạt động và phân đoạn vì chúng có thể quan sát các đối tượng LiveData một cách an toàn và không lo bị leak-activities và Fragment sẽ bị hủy đăng ký ngay lập tức khi vòng đời của chúng bị hủy.

## The advantages of using LiveData

* **Ensures your UI matches your data state**

        LiveData follows the observer pattern. LiveData notifies [`Observer`](https://developer.android.com/reference/androidx/lifecycle/Observer) objects when underlying data changes. You can consolidate your code to update the UI in these `Observer` objects. That way, you don't need to update the UI every time the app data changes because the observer does it for you.

* **No memory leaks**

        Observers are bound to [`Lifecycle`](https://developer.android.com/reference/androidx/lifecycle/Lifecycle) objects and clean up after themselves when their associated lifecycle is destroyed.

* **No crashes due to stopped activities**

        If the observer's lifecycle is inactive, such as in the case of an activity in the back stack, then it doesn’t receive any LiveData events.

* **No more manual lifecycle handling**

        UI components just observe relevant data and don’t stop or resume observation. LiveData automatically manages all of this since it’s aware of the relevant lifecycle status changes while observing.

* **Always up to date data**

        If a lifecycle becomes inactive, it receives the latest data upon becoming active again. For example, an activity that was in the background receives the latest data right after it returns to the foreground.

* **Proper configuration changes**

    If an activity or fragment is recreated due to a configuration change, like device rotation, it immediately receives the latest available data.

* **Sharing resources**

    You can extend a [`LiveData`](https://developer.android.com/reference/androidx/lifecycle/LiveData) object using the singleton pattern to wrap system services so that they can be shared in your app. The `LiveData` object connects to the system service once, and then any observer that needs the resource can just watch the `LiveData` object. For more information, see [Extend LiveData](https://developer.android.com/topic/libraries/architecture/livedata#extend_livedata).



## LiveData in an app's architecture

    `LiveData` is lifecycle-aware, following the lifecycle of entities such as activities and fragments. Use `LiveData` to communicate between these lifecycle owners and other objects with a different lifespan, such as `ViewModel` objects. The main responsibility of the `ViewModel` is to load and manage UI-related data, which makes it a great candidate for holding `LiveData` objects. Create `LiveData` objects in the `ViewModel` and use them to expose state to the UI layer.

    Activities and fragments should not hold `LiveData` instances because their role is to display data, not hold state. Also, keeping activities and fragments free from holding data makes it easier to write unit tests.

    The code below is an example of how holding a `LiveData` in the `Repository` can block the main thread:

    If you need to use streams of data in other layers of your app, consider using [Kotlin Flows](https://developer.android.com/kotlin/flow) and then converting them to `LiveData` in the `ViewModel` using [`asLiveData()`](https://developer.android.com/reference/kotlin/androidx/lifecycle/package-summary#aslivedata). Learn more about using Kotlin `Flow` with `LiveData` in [this codelab](https://developer.android.com/codelabs/advanced-kotlin-coroutines). For codebases built with Java, consider using [Executors](https://developer.android.com/guide/background/threading) in conjuction with callbacks or `RxJava`.
