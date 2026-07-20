# Android KTX

    Android KTX là một bộ tiện ích Kotlin đi kèm với Android [Jetpack](https://developer.android.com/jetpack) và các thư viện Android khác. Tiện ích mở rộng KTX cung cấp Kotlin ngắn gọn, đơn giản cho Jetpack, nền tảng Android và các API khác. Để làm như vậy, các tiện ích mở rộng này tận dụng một số tính năng ngôn ngữ Kotlin, bao gồm các tính năng sau:

* Chức năng mở rộng
* Thuộc tính mở rộng
* Lambda
* Tham số được đặt tên
* Giá trị mặc định của tham số
* Coroutine 

## Lõi KTX

    Mô-đun Core KTX cung cấp các tiện ích mở rộng cho các thư viện phổ biến là một phần của Android framework. Các thư viện này không có phần phụ thuộc dựa trên Java mà bạn cần thêm vào `build.gradle`.

## Collection KTX

    Tiện ích mở rộng Collection chứa các chức năng tiện ích để làm việc với các thư viện collection tiết kiệm bộ nhớ của Android, bao gồm `ArrayMap`, `LongSparseArray`, `LruCache` và các thư viện khác.

    Các tiện ích mở rộng Collection tận dụng operator overloading của Kotlin để đơn giản hóa những thứ như nối collection, như trong ví dụ sau:

```kotlin
// Combine 2 ArraySets into 1.
val combinedArraySet = arraySetOf(1, 2, 3) + arraySetOf(4, 5, 6)

// Combine with numbers to create a new sets.
val newArraySet = combinedArraySet + 7 + 8
```

## Fragment KTX

Mô-đun [Fragment KTX](https://developer.android.com/reference/kotlin/androidx/fragment/app/package-summary#extension-functions-summary) cung cấp một số tiện ích để đơn giản hóa phân đoạn API.

Với mô-đun Fragment KTX, bạn có thể đơn giản hóa các giao dịch phân đoạn bằng lambda, ví dụ:

```kotlin
fragmentManager().commit {
   addToBackStack("...")
   setCustomAnimations(
           R.anim.enter_anim,
           R.anim.exit_anim)
   add(fragment, "...")
}
```

Bạn cũng có thể liên kết với `ViewModel` trong một dòng bằng cách sử dụng các đại biểu thuộc tính `viewModels` và `activityViewModels` :

```kotlin
// Get a reference to the ViewModel scoped to this Fragment
val viewModel by viewModels<MyViewModel>()

// Get a reference to the ViewModel scoped to its Activity
val viewModel by activityViewModels<MyViewModel>()
```

## Lifecycle KTX

    Lifecycle KTX xác định một `LifecycleScope` cho mỗi đối tượng [`Lifecycle`](https://developer.android.com/topic/libraries/architecture/lifecycle). **Mọi coroutine được khởi chạy trong phạm vi này đều bị hủy khi `Lifecycle` bị hủy.** Bạn có thể truy cập vào `CoroutineScope` của `Lifecycle` bằng cách sử dụng thuộc tính `lifecycle.coroutineScope` hoặc `lifecycleOwner.lifecycleScope` .

### Phạm vi coroutine nhận biết Lifecycle

    Các thành phần nhận biết Lifecycle xác định các phạm vi tích hợp sau mà bạn có thể sử dụng trong ứng dụng của mình.

####ViewModelScope

    Một `ViewModelScope` được xác định cho mỗi [`ViewModel`](https://developer.android.com/topic/libraries/architecture/viewmodel) trong ứng dụng của bạn. Mọi coroutine được khởi chạy trong phạm vi này sẽ tự động bị hủy nếu `ViewModel` bị xóa. Ở đây, coroutine rất hữu ích khi bạn có công việc chỉ cần hoàn thành nếu `ViewModel` đang hoạt động.

Bạn có thể truy cập vào `CoroutineScope` của `ViewModel` thông qua thuộc tính `viewModelScope` của ViewModel, như trong ví dụ sau:

```kotlin
class MyViewModel: ViewModel() {
    init {
        viewModelScope.launch {
            // Coroutine that will be canceled when the ViewModel is cleared.
        }
    }
}
```

####LifecycleScope

        Một `LifecycleScope` được xác định cho từng đối tượng [`Lifecycle`](https://developer.android.com/topic/libraries/architecture/lifecycle). Mọi coroutine được khởi chạy trong phạm vi này đều bị hủy khi `Lifecycle` bị hủy. Bạn có thể truy cập vào `CoroutineScope` của `Lifecycle` thông qua thuộc tính `lifecycle.coroutineScope` hoặc `lifecycleOwner.lifecycleScope` .

#### Các coroutine nhận biết Lifecycle có thể khởi động lại

        Mặc dù việc sử dụng `lifecycleScope` trong Android để tự động hủy kích hoạt các hoạt động dài khi `Lifecycle` của một `Activity` hoặc một `Fragment` được chuyển sang trạng thái `DESTROYED`. Tuy nhiên, nếu bạn muốn bắt đầu thực thi một mã khối khi `Lifecycle` ở trạng thái công cụ và hủy bỏ khi nó ở trạng thái khác, thì bạn có thể sử dụng cách tiếp cận này. Ví dụ: bạn có thể muốn thu thập một `Flow` khi `Lifecycle` ở trạng thái `STARTED` và hủy bỏ việc thu thập khi nó ở trạng thái `STOPPED`. Việc tiếp cận này chỉ xử lý các giá trị được phát hiện của `Flow` khi giao diện người dùng hiển thị trên màn hình, tiết kiệm tài nguyên và có thể tránh các lỗi ứng dụng.

    Đối với những trường hợp này, `Lifecycle` và `LifecycleOwner` cung cấp hệ thống tạm ngưng `repeatOnLifecycle` API thực hiện chính xác điều đó. Ví dụ sau chứa code block chạy mỗi khi `Lifecycle` được liên kết ít nhất ở trạng thái `STARTED` và hủy khi `Lifecycle` là `STOPPED`:

```kotlin
class MyFragment : Fragment() {

    val viewModel: MyViewModel by viewModel()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Create a new coroutine in the lifecycleScope
        viewLifecycleOwner.lifecycleScope.launch {
            // repeatOnLifecycle launches the block in a new coroutine every time the
            // lifecycle is in the STARTED state (or above) and cancels it when it's STOPPED.
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                // Trigger the flow and start listening for values.
                // This happens when lifecycle is STARTED and stops
                // collecting when the lifecycle is STOPPED
                viewModel.someDataFlow.collect {
                    // Process item
                }
            }
        }
    }
}
```

### Luồng nhận biết Lifecycle collection

    Nếu chỉ cần thực hiện lifecycle nhận biết collection trên một luồng duy nhất, bạn có thể sử dụng phương thức [`Flow.flowWithLifecycle()`](https://developer.android.com/reference/kotlin/androidx/lifecycle/package-summary#flowwithlifecycle) để đơn giản hóa mã của mình:

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    exampleProvider.exampleFlow()
        .flowWithLifecycle(viewLifecycleOwner.lifecycle, Lifecycle.State.STARTED)
        .collect {
            // Process the value.
        }
}
```

    Tuy nhiên, nếu cần thực hiện song song lifecycle collection trên nhiều luồng thì bạn phải thu thập từng luồng trong các coroutine khác nhau. Trong trường hợp đó, sẽ hiệu quả hơn khi sử dụng `repeatOnLifecycle()` trực tiếp:

```kotlin
viewLifecycleOwner.lifecycleScope.launch {
    viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
        // Because collect is a suspend function, if you want to
        // collect multiple flows in parallel, you need to do so in
        // different coroutines.
        launch {
            flow1.collect { /* Process the value. */ }
        }

        launch {
            flow2.collect { /* Process the value. */ }
        }
    }
}
```

### Tạm dừng các coroutine nhận biết Lifecycle

        Mặc dù CoroutineScope cung cấp một cách hợp lý để hủy kích hoạt các hoạt động tự động chạy lâu, bạn có thể có những trường hợp khác khi bạn muốn tạm dừng việc thực thi một mã khối trừ khi Lifecycle đang ở trạng thái cao nhất. Ví dụ: để chạy FragmentTransaction, bạn phải đợi ít nhất Lifecycle là STARTED. Đối với những trường hợp này, Lifecycle cung cấp các phương thức bổ sung: lifecycle.whenCreated, lifecycle.whenStarted và lifecycle.whenResumed. Bất kỳ coroutine nào chạy bên trong các khối này sẽ bị tạm dừng nếu Lifecycle không đạt được trạng thái mong muốn tối thiểu.

```kotlin
class MyFragment: Fragment {
    init { // Notice that we can safely launch in the constructor of the Fragment.
        lifecycleScope.launch {
            whenStarted {
                // The block inside will run only when Lifecycle is at least STARTED.
                // It will start executing when fragment is started and
                // can call other suspend methods.
                loadingView.visibility = View.VISIBLE
                val canAccess = withContext(Dispatchers.IO) {
                    checkUserAccess()
                }

                // When checkUserAccess returns, the next line is automatically
                // suspended if the Lifecycle is not *at least* STARTED.
                // We could safely run fragment transactions because we know the
                // code won't run unless the lifecycle is at least STARTED.
                loadingView.visibility = View.GONE
                if (canAccess == false) {
                    findNavController().popBackStack()
                } else {
                    showContent()
                }
            }

            // This line runs only after the whenStarted block above has completed.

        }
    }
}
```



Nếu `Lifecycle` bị hủy trong khi coroutine đang hoạt động thông qua một trong các phương thức `when`, thì coroutine sẽ tự động bị hủy. Trong ví dụ bên dưới, khối `finally` chạy khi trạng thái `Lifecycle` là `DESTROYED`:

```kotlin
class MyFragment: Fragment {
    init {
        lifecycleScope.launchWhenStarted {
            try {
                // Call some suspend functions.
            } finally {
                // This line might execute after Lifecycle is DESTROYED.
                if (lifecycle.state >= STARTED) {
                    // Here, since we've checked, it is safe to run any
                    // Fragment transactions.
                }
            }
        }
    }
}
```



**Lưu ý:**  Mặc dù các phương pháp này mang lại sự thuận tiện khi làm việc với Lifecycle, nhưng bạn chỉ nên sử dụng khi hợp lệ thông tin trong phạm vi của Lifecycle (ví dụ: văn bản được tính toán trước). Hãy nhớ rằng nếu khởi động lại,  **Coroutine sẽ không khởi động lại được.**

!! **Cảnh báo:** Ưu tiên sử dụng API repeatOnLifecycle để thu thập các luồng thay vì sử dụng API launchWhenX. Vì API cuối cùng đã tạm dừng coroutine thay vì hủy bỏ nó khi Lifecycle thiết bị STOPPED, các luồng ngược dòng vẫn hoạt động ở nền, ẩn dưới dạng tối ưu hóa tài nguyên lãng phí và tạo ra mới các phần tử. Do đó, hãy sử dụng API repeatOnLifecycle giúp tắt hoàn toàn luồng ngược dòng khi Lifecycle ở trạng thái STOPPED, tránh lãng phí tài nguyên.

### Sử dụng coroutine với LiveData

Trong ví dụ bên dưới, `loadUser()` là hàm tạm ngưng được khai báo ở nơi khác. Sử dụng hàm tạo `liveData` để gọi `loadUser()` không đồng bộ, sau đó sử dụng `emit()` để đưa ra kết quả:

```kotlin
val user: LiveData<User> = liveData {
    val data = database.loadUser() // loadUser is a suspend function.
    emit(data)
}
```

Bạn cũng có thể phát ra nhiều giá trị từ khối. Mỗi lệnh gọi `emit()` sẽ tạm dừng quá trình thực thi khối cho đến khi giá trị `LiveData` được đặt trên thread chính.

```kotlin
val user: LiveData<Result> = liveData {
    emit(Result.loading())
    try {
        emit(Result.success(fetchUser()))
    } catch(ioException: Exception) {
        emit(Result.error(ioException))
    }
}
```

Bạn cũng có thể kết hợp `liveData` với [`Transformations`](https://developer.android.com/reference/androidx/lifecycle/Transformations), như trong ví dụ sau:

```kotlin
class MyViewModel: ViewModel() {
    private val userId: LiveData<String> = MutableLiveData()
    val user = userId.switchMap { id ->
        liveData(context = viewModelScope.coroutineContext + Dispatchers.IO) {
            emit(database.loadUserById(id))
        }
    }
}
```

Bạn có thể phát ra nhiều giá trị từ `LiveData` bằng cách gọi hàm `emitSource()` bất cứ khi nào bạn muốn phát ra một giá trị mới. Xin lưu ý rằng mỗi lệnh gọi đến `emit()` hoặc `emitSource()` sẽ xóa nguồn đã thêm trước đó.

## LiveData KTX

    Khi sử dụng LiveData, bạn có thể cần tính toán các giá trị không đồng bộ. Ví dụ: bạn có thể muốn truy xuất tùy chọn của người dùng và cung cấp chúng cho UI của bạn. Đối với những trường hợp này, LiveData KTX cung cấp hàm tạo `liveData` gọi hàm `suspend` và phân phát kết quả dưới dạng đối tượng `LiveData`.

    Trong ví dụ sau, `loadUser()` là hàm tạm ngưng được khai báo ở nơi khác. Bạn có thể sử dụng hàm tạo `liveData` để gọi `loadUser()` không đồng bộ, sau đó sử dụng `emit()` để đưa ra kết quả:

```kotlin
val user: LiveData<User> = liveData {
    val data = database.loadUser() // loadUser is a suspend function.
    emit(data)
}
```

## Navigation KTX

Mỗi thành phần của thư viện Navigation có phiên bản KTX riêng giúp điều chỉnh API ngắn gọn hơn và Kotlin mang tính thành ngữ hơn.

Sử dụng các hàm mở rộng và ủy quyền thuộc tính để truy cập các đối số đích và điều hướng đến đích, như trong ví dụ sau:

```kotlin
class MyDestination : Fragment() {

    // Type-safe arguments are accessed from the bundle.
    val args by navArgs<MyDestinationArgs>()

    ...
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        view.findViewById<Button>(R.id.next)
            .setOnClickListener {
                // Fragment extension added to retrieve a NavController from
                // any destination.
                findNavController().navigate(R.id.action_to_next_destination)
            }
     }
     ...

}
```

## Room KTX

Tiện ích mở rộng Room bổ sung hỗ trợ coroutine cho các giao dịch cơ sở dữ liệu.

```kotlin
@Query("SELECT * FROM Users")
suspend fun getUsers(): List<User>

@Query("SELECT * FROM Users")
fun getUsers(): Flow<List<User>>
```



## SQLite KTX

Tiện ích mở rộng SQLite bọc mã liên quan đến SQL- trong các giao dịch, loại bỏ rất nhiều mã boilerplate.

Dưới đây là ví dụ về cách sử dụng tiện ích mở rộng `transaction` để thực hiện giao dịch cơ sở dữ liệu:

```kotlin
db.transaction {
    // insert data
}
```

## ViewModel KTX

Thư viện ViewModel KTX cung cấp chức năng `viewModelScope()` giúp khởi chạy [coroutines](https://developer.android.com/kotlin/coroutines) từ `ViewModel` của bạn dễ dàng hơn. [`CoroutineScope`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/) được liên kết với `Dispatchers.Main` và tự động bị hủy khi `ViewModel` bị xóa. Bạn có thể sử dụng `viewModelScope()` thay vì tạo phạm vi mới cho mỗi `ViewModel`.

## WorkManager KTX

WorkManager KTX cung cấp hỗ trợ hạng nhất cho coroutine.


