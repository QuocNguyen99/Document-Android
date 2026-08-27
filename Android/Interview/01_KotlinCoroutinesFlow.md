# Kotlin, Coroutines & Flow

> Nhóm A · 12 câu

Vòng này thường do một engineer khác phỏng vấn và đào rất sâu vào coroutine. Kho của bạn đã có gần đủ — mục tiêu là nói trôi, không phải học mới.

<details>
<summary><b>A1. StateFlow khác SharedFlow ở đâu, và khi nào bạn chọn Channel thay cho cả hai?</b> &middot; <i>Chắc chắn hỏi</i></summary>

`StateFlow` kế thừa `SharedFlow`, là bản bị khoá cứng ở `replay = 1`, `DROP_OLDEST`, cộng thêm hai đảm bảo: luôn có value và conflate theo `equals()`. `emit` của nó không bao giờ suspend.

`SharedFlow` cho phép cấu hình `replay`, `extraBufferCapacity`, `onBufferOverflow`, giữ nguyên giá trị trùng, và có thể tạo backpressure thật khi để `SUSPEND`.

**Chọn Channel** cho one-shot event (điều hướng, snackbar): `SharedFlow` là broadcast — không có subscriber thì event bay mất, đúng lúc app xuống background và collector bị `repeatOnLifecycle` huỷ. `Channel(BUFFERED).receiveAsFlow()` là hàng đợi, giữ đến khi có người nhận và đảm bảo exactly-once. Đánh đổi: chỉ phục vụ một collector.

> **Bẫy** — StateFlow nuốt giá trị trùng. Nếu state chứa `Array` hoặc một `List` bị sửa tại chỗ rồi `copy()`, `equals()` trả true và UI đứng im. Đây là câu hỏi phụ họ hay thả ra để xem bạn có thật sự gặp production hay chưa.

</details>

<details>
<summary><b>A2. Structured concurrency là gì và nó giải quyết vấn đề gì?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Mọi coroutine phải chạy trong một scope, và scope là cha của coroutine con. Hệ quả: cha không kết thúc trước con, huỷ cha thì huỷ toàn bộ con, lỗi của con lan lên cha.

Nó giải quyết bài toán rò rỉ tác vụ — thứ mà thread thô hay callback không có. Không có cơ chế này, một request mạng vẫn chạy sau khi user rời màn hình, rồi ghi vào ViewModel đã chết.

Trên Android cụ thể: `viewModelScope` huỷ ở `onCleared()`, `lifecycleScope` huỷ theo lifecycle owner. Việc bạn phải làm là **không** dùng `GlobalScope`, và cẩn thận khi dùng `NonCancellable`.

</details>

<details>
<summary><b>A3. Job và SupervisorJob khác nhau thế nào? Cho ví dụ trong ViewModel.</b> &middot; <i>Chắc chắn hỏi</i></summary>

Với `Job`, một con fail thì cha bị huỷ và kéo theo tất cả anh em. Với `SupervisorJob`, lỗi không lan lên trên — anh em vẫn sống.

Ví dụ màn hình dashboard ngân hàng gọi song song: số dư, danh sách giao dịch, banner khuyến mãi. Nếu dùng `Job` mà banner lỗi thì mất luôn số dư. Đó là lý do `viewModelScope` mặc định dùng `SupervisorJob`.

```kotlin
// sai: coroutineScope huỷ cả cụm khi 1 nhánh fail
coroutineScope {
    val balance = async { repo.balance() }
    val banner  = async { repo.banner() }   // fail -> mất cả balance
}

// đúng: cô lập nhánh không quan trọng
supervisorScope {
    val balance = async { repo.balance() }
    val banner  = async { runCatching { repo.banner() }.getOrNull() }
}
```

> **Bẫy** — `SupervisorJob` chỉ có tác dụng khi nó là job trực tiếp của scope. Viết `launch(SupervisorJob())` bên trong một scope khác là vô nghĩa — nó thành con thường và vẫn lan lỗi lên cha thật.

</details>

<details>
<summary><b>A4. Coroutine bị cancel thì chuyện gì xảy ra? Làm sao code của bạn hợp tác với cancel?</b> &middot; <i>Nhiều khả năng</i></summary>

Cancel là **hợp tác**. Scope đánh dấu job là cancelling, còn coroutine chỉ thật sự dừng khi chạm một điểm suspend có kiểm tra — mọi hàm trong `kotlinx.coroutines` đều ném `CancellationException` khi đó.

Vòng lặp tính toán thuần CPU sẽ **không** dừng. Phải tự chèn `ensureActive()` hoặc `yield()`.

Dọn dẹp đặt trong `finally`. Nếu trong `finally` cần gọi hàm suspend (đóng socket, ghi log audit) thì phải bọc `withContext(NonCancellable)`, không thì nó bị cancel ngay.

`CancellationException` là bình thường, đừng nuốt nó trong `catch (e: Exception)` — đó là lỗi hay gặp nhất, làm coroutine không chết được và log bẩn.

</details>

<details>
<summary><b>A5. Cold flow và hot flow khác nhau ra sao? <code>shareIn</code> / <code>stateIn</code> dùng khi nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Cold flow chạy lại toàn bộ producer cho mỗi collector — 5 collector là 5 lần gọi API. Hot flow chạy độc lập, ai đến thì nghe.

`stateIn`/`shareIn` biến cold thành hot để chia sẻ upstream đắt tiền. Tham số quan trọng là `SharingStarted`:

| Giá trị | Hành vi | Dùng khi |
| --- | --- | --- |
| `Eagerly` | chạy ngay, không dừng | cần dữ liệu sẵn trước khi UI mở |
| `Lazily` | chạy từ subscriber đầu, không dừng | hiếm dùng |
| `WhileSubscribed(5_000)` | theo subscriptionCount, trễ 5s mới tắt | mặc định cho UI state |

Con số 5.000ms để sống sót qua config change: Activity recreate mất chưa tới 5 giây nên Room query hay WebSocket không bị restart. Với dữ liệu nhạy cảm, đặt `replayExpiration = 0` để xoá cache ngay khi hết subscriber.

</details>

<details>
<summary><b>A6. Phân biệt <code>flowOn</code>, <code>withContext</code> và <code>launchIn</code>.</b> &middot; <i>Nhiều khả năng</i></summary>

`flowOn` đổi context của **phần upstream** phía trên nó, không ảnh hưởng downstream. Đây là cách duy nhất đúng để đổi dispatcher trong flow, vì `emit` phải giữ context preservation.

`withContext` đổi context cho một block suspend. Gọi `emit` bên trong `withContext` ở giữa `flow { }` sẽ ném `IllegalStateException`.

`launchIn(scope)` chỉ là đường tắt của `scope.launch { flow.collect() }` — nó quyết định flow chạy ở scope nào, thường đi kèm `onEach`.

```kotlin
repo.transactions()          // chạy trên IO
    .flowOn(Dispatchers.IO)
    .onEach { render(it) }   // chạy trên scope của launchIn
    .launchIn(viewModelScope)
```

</details>

<details>
<summary><b>A7. So sánh <code>map</code>, <code>flatMapConcat</code>, <code>flatMapMerge</code>, <code>flatMapLatest</code>.</b> &middot; <i>Nhiều khả năng</i></summary>

- `flatMapConcat` — tuần tự, chờ flow con xong mới sang cái kế. Dùng khi thứ tự quan trọng.
- `flatMapMerge` — chạy song song, thứ tự không đảm bảo, có tham số `concurrency`.
- `flatMapLatest` — có giá trị mới thì huỷ flow con đang chạy. Đây là toán tử của ô tìm kiếm: gõ thêm ký tự là huỷ request cũ.

```kotlin
searchQuery
    .debounce(300)
    .distinctUntilChanged()
    .flatMapLatest { q -> repo.search(q) }   // huỷ request cũ
    .catch { emit(SearchResult.Error) }
```

Cặp `debounce` + `flatMapLatest` là câu trả lời chuẩn cho "làm search box thế nào" — nêu luôn cả hai sẽ ghi điểm.

</details>

<details>
<summary><b>A8. Xử lý exception trong coroutine: <code>try/catch</code>, <code>CoroutineExceptionHandler</code>, <code>catch</code> operator — dùng cái nào lúc nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

`try/catch` quanh `await()` hoặc quanh hàm suspend — dùng cho lỗi có thể xử lý tại chỗ.

`CoroutineExceptionHandler` chỉ hoạt động với `launch`, ở scope gốc, và là lưới an toàn cuối cùng. Không bắt được lỗi của `async` (lỗi ở đó nằm im tới khi gọi `await`).

`.catch { }` trong flow chỉ bắt lỗi **upstream** — đặt sau `onEach` thì không bắt được lỗi của `onEach`. Trong flow, nên trả về state lỗi thay vì ném.

```kotlin
repo.balanceFlow()
    .map { UiState.Success(it) }
    .catch { emit(UiState.Error(it.toMessage())) }  // chỉ bắt phía trên
    .stateIn(viewModelScope, WhileSubscribed(5_000), UiState.Loading)
```

</details>

<details>
<summary><b>A9. <code>inline</code>, <code>noinline</code>, <code>crossinline</code>, <code>reified</code> — giải thích và cho biết khi nào <b>không</b> nên inline.</b> &middot; <i>Nhiều khả năng</i></summary>

`inline` chép thân hàm vào chỗ gọi, xoá được chi phí tạo object lambda và cho phép `return` phi cục bộ. `reified` chỉ dùng được trong hàm inline vì lúc đó type còn tồn tại sau erasure.

`noinline` giữ lại một lambda dưới dạng object (để lưu trữ hoặc truyền đi). `crossinline` cấm return phi cục bộ, cần khi lambda được gọi từ context khác.

**Không nên inline** hàm lớn không nhận lambda: nó phình bytecode, tăng dex size, giảm hiệu quả instruction cache. Compiler cũng sẽ cảnh báo. Inline dành cho hàm nhỏ nhận function type.

</details>

<details>
<summary><b>A10. Sealed class, sealed interface, enum, data class — chọn cái nào cho mô hình UI state?</b> &middot; <i>Nhiều khả năng</i></summary>

Thực tế nên dùng **data class cho state, sealed cho event**. Sealed hierarchy cho state (`Loading | Success | Error`) trông đẹp nhưng gây khó khi cần vừa loading vừa hiển thị dữ liệu cũ — chuyện xảy ra liên tục ở màn hình pull-to-refresh.

```kotlin
data class DashboardState(
    val balance: Money? = null,
    val isRefreshing: Boolean = false,
    val error: UserMessage? = null,
)

sealed interface DashboardEvent {
    data class OpenTransaction(val id: String) : DashboardEvent
    data object SessionExpired : DashboardEvent
}
```

`sealed interface` hơn `sealed class` khi một type cần thuộc nhiều hierarchy. `data object` (Kotlin 1.9+) cho nhánh không có dữ liệu — `toString` đẹp hơn `object` thường.

</details>

<details>
<summary><b>A11. Kotlin xử lý null thế nào ở biên giới với Java và với JSON?</b> &middot; <i>Nhiều khả năng</i></summary>

Type từ Java là **platform type** (`String!`) — compiler không kiểm tra, NPE nổ lúc runtime. Phòng bằng annotation `@Nullable/@NonNull` phía Java, hoặc bọc lại ngay tại biên.

Với JSON, nguy hiểm hơn: Gson dùng reflection, **bỏ qua** non-null của Kotlin và nhét `null` vào field khai báo không-null. Trường `accountNumber: String` nhận null sẽ nổ ở chỗ khác hẳn.

Cách xử lý cho app ngân hàng: dùng `kotlinx.serialization` hoặc Moshi với codegen (không reflection) — cả hai tôn trọng nullability và có `@Required`. Và luôn tách DTO khỏi domain model, map thủ công để validate ở đúng biên.

</details>

<details>
<summary><b>A12. Vì sao dùng <code>Result</code>/<code>Either</code> thay vì ném exception trong tầng domain?</b> &middot; <i>Ghi điểm thêm</i></summary>

Exception không xuất hiện trong signature, nên compiler không ép ai xử lý. Ở app ngân hàng, một lỗi "không đủ số dư" bị nuốt sẽ thành sự cố thật.

Kiểu trả về tường minh biến lỗi nghiệp vụ thành phần của hợp đồng hàm và ép `when` phải phủ hết nhánh:

```kotlin
sealed interface TransferError {
    data object InsufficientFunds : TransferError
    data object DailyLimitExceeded : TransferError
    data class RequiresOtp(val challengeId: String) : TransferError
    data class Unknown(val cause: Throwable) : TransferError
}

suspend fun transfer(req: TransferRequest): Result<Receipt, TransferError>
```

Ranh giới: dùng kiểu trả về cho **lỗi nghiệp vụ dự kiến**, vẫn để exception cho lỗi lập trình (IllegalState, NPE). Nhắc được ranh giới này là điểm cộng — nhiều người dùng `Result` cho tất cả rồi mất luôn stack trace.

</details>
