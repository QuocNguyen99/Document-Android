# Compose, custom UI & Design System

> Nhóm C · 12 câu

<details>
<summary><b>C1. Ba phase của Compose là gì và vì sao biết chúng lại quan trọng cho hiệu năng?</b> &middot; <i>Chắc chắn hỏi</i></summary>

**Composition** (chạy composable, dựng cây) → **Layout** (đo và đặt vị trí) → **Drawing** (vẽ). Compose có thể bỏ qua phase phía trước nếu chỉ phase sau thay đổi.

Ứng dụng thực tế: đọc state ở phase càng muộn càng rẻ. Animation vị trí viết bằng `Modifier.offset { IntOffset(x, 0) }` (lambda, đọc ở layout phase) chỉ chạy lại layout; viết `Modifier.offset(x.dp)` (giá trị, đọc ở composition) sẽ recompose cả cây con.

Tương tự `Modifier.drawBehind { }` và `graphicsLayer { }` đẩy việc đọc state xuống draw phase. Đây là câu trả lời "làm sao tối ưu animation trong Compose".

</details>

<details>
<summary><b>C2. Stability trong Compose là gì? Vì sao composable của bạn không được skip?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Compose chỉ skip một composable khi mọi tham số đều **stable**: kiểu đó phải có `equals` nhất quán và mọi public property phải immutable, hoặc thông báo được khi đổi.

Thủ phạm phổ biến: `List` (interface, compiler coi là unstable vì implement có thể mutable), lambda bắt biến không stable, class từ module không bật Compose compiler.

| Vấn đề | Cách xử |
| --- | --- |
| `List<T>` trong state | `ImmutableList` của kotlinx.collections.immutable, hoặc `@Immutable` |
| Class ở module thuần Kotlin | khai trong `stability-config.conf` (Compose compiler 1.5.5+) |
| Không biết cái nào fail | bật compiler metrics, đọc file `*-composables.txt` |

```kotlin
kotlinOptions.freeCompilerArgs += listOf(
  "-P","plugin:androidx.compose.compiler.plugins.kotlin:reportsDestination=${layout.buildDirectory.get()}/compose",
)
```

Nói được "tôi đọc compose compiler metrics để biết hàm nào restartable nhưng không skippable" là câu trả lời của người đã tối ưu thật.

</details>

<details>
<summary><b>C3. Kể các side effect API và trường hợp dùng: <code>LaunchedEffect</code>, <code>DisposableEffect</code>, <code>SideEffect</code>, <code>rememberUpdatedState</code>, <code>derivedStateOf</code>, <code>produceState</code>.</b> &middot; <i>Chắc chắn hỏi</i></summary>

- `LaunchedEffect(key)` — chạy coroutine khi vào composition, huỷ và chạy lại khi key đổi.
- `DisposableEffect(key)` — cần dọn dẹp (đăng ký/gỡ listener, observer lifecycle).
- `SideEffect` — publish state của Compose ra object non-Compose sau mỗi composition thành công.
- `rememberUpdatedState` — giữ lambda mới nhất mà không restart `LaunchedEffect` đang chạy dài.
- `derivedStateOf` — chỉ phát khi **kết quả** đổi. Ví dụ `listState.firstVisibleItemIndex > 0`: index đổi liên tục khi cuộn, nhưng boolean chỉ đổi một lần.
- `produceState` — biến nguồn non-Compose thành `State`.

> **Bẫy** — `LaunchedEffect(Unit)` để "chạy một lần" là mùi code. Nếu cần chạy một lần theo vòng đời màn hình thì nên nằm ở `init` của ViewModel; dùng trong Composable thì nó chạy lại sau mỗi lần vào lại màn hình từ back stack.

</details>

<details>
<summary><b>C4. <code>remember</code> và <code>rememberSaveable</code> khác nhau chỗ nào? Giới hạn của <code>rememberSaveable</code>?</b> &middot; <i>Nhiều khả năng</i></summary>

`remember` sống trong composition — mất khi config change. `rememberSaveable` lưu vào `Bundle` của saved instance state nên sống qua cả config change lẫn process death.

Giới hạn: chỉ nhận kiểu bỏ được vào Bundle. Với type tự định nghĩa phải cung cấp `Saver`:

```kotlin
val AmountSaver = listSaver<Amount, Any>(
    save = { listOf(it.value.toString(), it.currency) },
    restore = { Amount(BigDecimal(it[0] as String), it[1] as String) },
)
var amount by rememberSaveable(stateSaver = AmountSaver) { mutableStateOf(Amount.ZERO) }
```

Với app ngân hàng, nhớ nói thêm: **không** `rememberSaveable` cho PIN, OTP, số thẻ — Bundle được ghi ra đĩa bởi hệ thống.

</details>

<details>
<summary><b>C5. Vì sao <code>key</code> trong <code>LazyColumn</code> lại quan trọng?</b> &middot; <i>Nhiều khả năng</i></summary>

Không có key, Compose định danh item theo vị trí. Chèn một giao dịch mới ở đầu danh sách sẽ khiến toàn bộ item bị coi là "đổi" — mất state cục bộ (ô đang mở rộng, animation), recompose toàn bộ, và scroll position nhảy.

```kotlin
LazyColumn {
    items(transactions, key = { it.id }) { tx -> TransactionRow(tx) }
}
```

Key phải ổn định và duy nhất, và phải bỏ được vào Bundle vì Compose dùng nó để khôi phục vị trí cuộn. Kèm theo nên nêu `contentType` khi danh sách có nhiều loại item — giúp tái dùng composition tốt hơn.

</details>

<details>
<summary><b>C6. State hoisting là gì? Composable thế nào là "stateless"?</b> &middot; <i>Nhiều khả năng</i></summary>

Đẩy state lên trên tổ tiên chung, truyền xuống `value` và `onValueChange`. Composable trở thành hàm thuần: dễ test, dễ preview, dễ tái dùng, và luồng dữ liệu một chiều.

Mẫu chuẩn là tách đôi: một overload có state (nối ViewModel), một overload stateless (nhận state + callback). Bản stateless là bản viết test và preview.

```kotlin
@Composable
fun TransferScreen(vm: TransferViewModel = hiltViewModel()) {
    val state by vm.state.collectAsStateWithLifecycle()
    TransferScreen(state, vm::onAmountChange, vm::onSubmit)
}

@Composable
fun TransferScreen(state: TransferState, onAmountChange: (String) -> Unit, onSubmit: () -> Unit) { ... }
```

</details>

<details>
<summary><b>C7. Viết một custom View truyền thống: các bước và cái bẫy trong <code>onMeasure</code>.</b> &middot; <i>Nhiều khả năng</i></summary>

JD ghi "developing custom UI for native components" nên câu này khả năng cao.

- `onMeasure` — đọc `MeasureSpec` (mode `EXACTLY` / `AT_MOST` / `UNSPECIFIED`) rồi **bắt buộc** gọi `setMeasuredDimension()`, không gọi sẽ ném exception.
- `onLayout` — chỉ ViewGroup cần, đặt vị trí con.
- `onDraw` — **không cấp phát** object trong này. Tạo `Paint`, `Path`, `Rect` ở constructor. Cấp phát trong onDraw gây GC churn và jank.
- `onSaveInstanceState`/`onRestoreInstanceState` — nhớ gọi `super` và đặt `android:id`, nếu không state không được lưu.
- Custom attribute qua `attrs.xml` + `obtainStyledAttributes`, nhớ `recycle()`.
- `invalidate()` để vẽ lại, `requestLayout()` khi kích thước đổi — gọi nhầm requestLayout liên tục là nguồn jank.

</details>

<details>
<summary><b>C8. Custom layout trong Compose làm thế nào?</b> &middot; <i>Ghi điểm thêm</i></summary>

```kotlin
@Composable
fun ChipFlowRow(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Layout(content, modifier) { measurables, constraints ->
        val placeables = measurables.map { it.measure(constraints) }
        // tự tính x, y rồi đặt
        layout(constraints.maxWidth, totalHeight) {
            placeables.forEach { it.place(x, y) }
        }
    }
}
```

Nguyên tắc Compose: mỗi child chỉ được đo **một lần** — đó là lý do layout Compose chạy một pass và không có vấn đề đo lồng nhau theo cấp số nhân như `RelativeLayout`. Cần đo nhiều lần thì dùng `SubcomposeLayout`, nhưng nó đắt, chỉ dùng khi thật cần.

</details>

<details>
<summary><b>C9. Design System trên Android gồm những gì? Bạn tổ chức thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

Ba tầng: **token** (màu, khoảng cách, bo góc, typography, elevation, motion) → **component** (Button, TextField, AmountInput, TransactionRow) → **pattern** (form chuyển tiền, màn hình xác thực).

Trên Compose: token đi qua `MaterialTheme` mở rộng hoặc `CompositionLocal` riêng. Nên tạo theme của ngân hàng chứ không dùng thẳng `MaterialTheme.colorScheme`, vì brand ngân hàng thường không map vừa vào slot của Material.

```kotlin
@Immutable
data class BankColors(val positiveAmount: Color, val negativeAmount: Color, ...)
val LocalBankColors = staticCompositionLocalOf { BankColors(...) }
```

Phần quan trọng khi nói với vai trò senior: **quy trình**. Versioning của thư viện component, kênh đồng bộ với designer (Figma token), screenshot test để chống hồi quy thị giác, và cách deprecate một component mà không chặn 5 team feature.

</details>

<details>
<summary><b>C10. Compose và View interop: khi nào dùng, chi phí là gì?</b> &middot; <i>Nhiều khả năng</i></summary>

`AndroidView` để nhúng View vào Compose (MapView, WebView, thư viện chart cũ, SDK eKYC của bên thứ ba). `ComposeView` để nhúng Compose vào layout XML — đây là cách migrate dần từng màn hình.

Chi phí: mất khả năng skip của Compose ở ranh giới, hai hệ thống layout chạy lồng nhau, và `AndroidView` trong `LazyColumn` rất tốn (View không được tái dùng như composition) — cần `onReset` để tái dùng, hoặc tránh hẳn.

Với một ngân hàng đang chuyển đổi, câu trả lời có giá trị là **chiến lược migrate**: bắt đầu từ màn hình lá ít phụ thuộc, dựng design system trước, đặt ranh giới ở cấp màn hình chứ không đan xen trong cùng một màn.

</details>

<details>
<summary><b>C11. Accessibility trong Compose: bạn làm gì?</b> &middot; <i>Ghi điểm thêm</i></summary>

JD nói "world class User Experience", còn ngân hàng ở nhiều nước có ràng buộc pháp lý về tiếp cận.

- `contentDescription` cho icon có nghĩa, `null` cho icon trang trí.
- `Modifier.semantics { }`, `mergeDescendants` để một hàng danh sách đọc thành một khối thay vì 5 mảnh.
- Vùng chạm tối thiểu 48dp, dùng `Modifier.minimumInteractiveComponentSize()`.
- Tương phản 4.5:1 cho text thường — quan trọng với số tiền âm/dương thường bị tô đỏ/xanh nhạt.
- Không truyền đạt thông tin **chỉ** bằng màu (giao dịch thất bại phải có cả icon/nhãn).
- Test bằng TalkBack thật và `Accessibility Scanner`, thêm assertion trong Compose UI test.

</details>

<details>
<summary><b>C12. Hiển thị số tiền và ngày tháng đa quốc gia (JD nói "cross-border") — bạn xử lý ra sao?</b> &middot; <i>Ghi điểm thêm</i></summary>

Không bao giờ dùng `Double`/`Float` cho tiền — sai số nhị phân. Dùng `BigDecimal`, hoặc lưu số nguyên đơn vị nhỏ nhất (minor unit) kèm mã tiền tệ.

Định dạng bằng `NumberFormat.getCurrencyInstance(locale)`, không tự nối chuỗi — vị trí ký hiệu, dấu phân cách, số chữ số thập phân khác nhau theo nước (JPY 0 chữ số, VND 0, USD 2, KWD 3).

Ngày giờ: lưu UTC, hiển thị theo timezone thiết bị, nhưng **ngày giá trị của giao dịch** phải theo timezone của ngân hàng — nhầm chỗ này gây lệch một ngày trong sao kê. Dùng `kotlinx-datetime` hoặc `java.time` với desugaring.

Kèm theo: RTL cho thị trường Trung Đông (`start/end` thay vì `left/right`), và chữ số Ả Rập-Ấn Độ trong một số locale.

</details>
