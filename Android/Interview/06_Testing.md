# Testing & automation

> Nhóm F · 9 câu

<details>
<summary><b>F1. Chiến lược test của bạn cho một app ngân hàng?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Kim tự tháp, nhưng lệch so với app thường: nhiều unit test cho logic tiền bạc, và **nhiều integration test hơn bình thường** vì rủi ro nằm ở chỗ ghép nối (token refresh, retry, mapping DTO, xử lý lỗi backend).

- **Unit** — usecase, reducer, mapper, formatter tiền tệ. Chạy trên JVM, nhanh, chiếm phần lớn.
- **Integration** — repository + Room in-memory + MockWebServer. Bắt được lỗi thật mà unit test bỏ lọt.
- **UI** — Compose test cho component design system; E2E chỉ cho vài luồng sống còn (đăng nhập, chuyển tiền) vì chậm và dễ flaky.
- **Screenshot test** — chống hồi quy thị giác của design system, rất đáng với đội nhiều người.

Nói thêm: chỉ tiêu coverage máy móc (80%) gây hại — nó khuyến khích test getter. Thay vào đó đặt yêu cầu coverage cao cho module domain và để module UI tự do.

</details>

<details>
<summary><b>F2. Test coroutine và Flow: <code>runTest</code>, TestDispatcher, Turbine.</b> &middot; <i>Chắc chắn hỏi</i></summary>

`runTest` cho phép tua thời gian ảo — `delay(10_000)` chạy tức thì. Cần tiêm dispatcher chứ không dùng `Dispatchers.IO` trực tiếp, để test thay được.

```kotlin
class TransferViewModelTest {
    @get:Rule val dispatcherRule = MainDispatcherRule()   // Dispatchers.setMain

    @Test fun `hien loi khi khong du so du`() = runTest {
        val vm = TransferViewModel(FakeRepo(balance = 0))
        vm.state.test {                       // Turbine
            assertEquals(TransferState(), awaitItem())
            vm.submit(amount = 100)
            assertEquals(InsufficientFunds, awaitItem().error)
            cancelAndIgnoreRemainingEvents()
        }
    }
}
```

Phân biệt `StandardTestDispatcher` (phải `advanceUntilIdle()`, mô phỏng đúng thứ tự thật) và `UnconfinedTestDispatcher` (chạy ngay, tiện nhưng che giấu lỗi thứ tự). Mặc định nên dùng Standard.

> **Bẫy** — `flow.toList()` trên StateFlow/SharedFlow treo vĩnh viễn vì chúng không bao giờ complete. Đó là lý do phải dùng Turbine hoặc `take(n)`.

</details>

<details>
<summary><b>F3. Mock, fake, stub, spy — khác nhau ra sao? Bạn ưu tiên cái nào?</b> &middot; <i>Nhiều khả năng</i></summary>

- **Stub** — trả về giá trị cố định.
- **Mock** — verify tương tác (được gọi mấy lần, với tham số gì).
- **Fake** — bản cài đặt đơn giản nhưng chạy thật (repository in-memory).
- **Spy** — bọc object thật, ghi lại lời gọi.

Ưu tiên **fake** cho repository và data source: test đọc dễ hơn, không vỡ mỗi lần đổi chi tiết cài đặt, và bản thân fake tái dùng được ở nhiều test. Dùng mock khi thật sự cần khẳng định về tương tác (ví dụ: "đã gửi đúng một sự kiện analytics").

Test verify quá nhiều lời gọi là test giòn — nó khoá cứng cài đặt chứ không khoá hành vi. Đây là điểm phân biệt người viết test nhiều hay ít.

</details>

<details>
<summary><b>F4. MockWebServer dùng thế nào và test được gì mà unit test không test được?</b> &middot; <i>Nhiều khả năng</i></summary>

Nó dựng một HTTP server thật trên localhost, nên test được toàn bộ chuỗi OkHttp → interceptor → Retrofit → serializer → repository.

Những thứ chỉ MockWebServer bắt được: logic retry, hành vi của `Authenticator` khi 401, timeout, phản hồi lỗi 500 kèm body HTML, JSON thiếu field, header lạ, và thứ tự request.

```kotlin
server.enqueue(MockResponse().setResponseCode(401))
server.enqueue(MockResponse().setBody(refreshTokenJson))
server.enqueue(MockResponse().setBody(balanceJson))
// khẳng định: 3 request, request cuối mang token mới
```

Với app ngân hàng, đây là nơi test luồng refresh token — thứ gần như không thể test bằng mock thuần.

</details>

<details>
<summary><b>F5. Compose UI test: viết thế nào, xử lý bất đồng bộ ra sao?</b> &middot; <i>Nhiều khả năng</i></summary>

```kotlin
@get:Rule val rule = createAndroidComposeRule<MainActivity>()

@Test fun hien_thi_loi_khi_vuot_han_muc() {
    rule.onNodeWithTag("amount").performTextInput("999999999")
    rule.onNodeWithText("Chuyển tiền").performClick()
    rule.onNodeWithText("Vượt hạn mức ngày").assertIsDisplayed()
}
```

Compose tự đồng bộ qua cơ chế idling gắn với clock của nó, nên phần lớn trường hợp không cần chờ tay. Khi cần: `rule.waitUntil { }`, hoặc `mainClock.autoAdvance = false` để kiểm soát animation trong test.

Dùng `testTag` cho phần tử không có text ổn định, nhưng ưu tiên tìm theo **semantics thật** (text, contentDescription, role) — vì như vậy test đồng thời kiểm luôn accessibility.

</details>

<details>
<summary><b>F6. Test flaky: nguyên nhân và cách bạn xử lý?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Nguyên nhân hay gặp: phụ thuộc thời gian thật (`Thread.sleep`, `Date.now()`), thứ tự test phụ thuộc nhau qua state tĩnh, animation chưa xong, mạng thật, emulator chậm, và race trong chính code sản phẩm.

Cách xử lý, theo thứ tự:

1. Đo trước — gắn nhãn và thống kê tỉ lệ fail, đừng đoán.
2. Cách ly ngay: đánh dấu `@Ignore` hoặc chuyển sang job riêng để không chặn pipeline, kèm ticket có hạn.
3. Sửa gốc: tiêm `Clock`, tiêm dispatcher, tắt animation (`animator duration scale 0`), dùng MockWebServer thay mạng thật.
4. **Không** bật auto-retry như giải pháp lâu dài — nó giấu race thật trong code sản phẩm, thứ sẽ nổ ở production.

Ý cuối là điểm ghi cho vai trò senior: flaky test đôi khi là **bug thật** đang báo hiệu.

</details>

<details>
<summary><b>F7. Screenshot test: dùng công cụ gì, đưa vào CI thế nào?</b> &middot; <i>Ghi điểm thêm</i></summary>

Lựa chọn: Paparazzi (render trên JVM, không cần emulator — nhanh, hợp CI), Roborazzi (trên nền Robolectric), hoặc Compose Preview Screenshot Testing của Google.

Quy trình: sinh ảnh chuẩn, commit vào repo, CI so sánh và đăng ảnh diff vào pull request khi lệch. Cập nhật ảnh chuẩn phải là hành động cố ý và được review.

Giá trị lớn nhất là ở **design system**: một thay đổi token màu sẽ hiện ra ngay ảnh hưởng tới 40 component, thứ mà không ai review nổi bằng mắt trên code.

Cảnh báo cần nêu: render khác nhau giữa các phiên bản Android và các font khác nhau gây nhiễu — cần cố định môi trường render, nếu không nó thành nguồn flaky mới.

</details>

<details>
<summary><b>F8. CI/CD cho app Android trong môi trường ngân hàng có gì khác?</b> &middot; <i>Nhiều khả năng</i></summary>

- **Ký ứng dụng** — khoá không nằm trên máy dev; dùng HSM hoặc Play App Signing, chỉ CI có quyền ký release.
- **Phân tách môi trường** — flavor dev/uat/prod với endpoint và pin khác nhau; bản non-prod không được cài lên máy thật của khách.
- **Cổng chất lượng** — lint, detekt, unit test, dependency vulnerability scan, kiểm secret; fail là chặn merge.
- **Truy vết** — mỗi artifact gắn commit hash; lưu `mapping.txt` theo từng bản; audit ai đã phát hành gì.
- **Phát hành từng phần** — staged rollout trên Play, theo dõi crash-free rate rồi mới tăng phần trăm; có halt rollout.
- **Phê duyệt** — release cần chữ ký của security/compliance, nên pipeline phải có bước chờ phê duyệt thủ công, không tự động tới production.

</details>

<details>
<summary><b>F9. Bạn test code có phụ thuộc thời gian và hạn mức theo ngày làm việc thế nào?</b> &middot; <i>Ghi điểm thêm</i></summary>

Không bao giờ gọi `System.currentTimeMillis()` hay `LocalDate.now()` trực tiếp trong logic. Tiêm một `Clock`:

```kotlin
class DailyLimitChecker(private val clock: Clock) {
    fun remaining(txs: List<Transaction>): Money {
        val today = LocalDate.now(clock)      // test đặt Clock.fixed(...)
        ...
    }
}
```

Nhờ vậy test được: đúng nửa đêm, đổi ngày theo timezone của ngân hàng khác timezone thiết bị, ngày lễ, và năm nhuận — toàn những chỗ sinh bug thật trong sản phẩm tài chính.

</details>
