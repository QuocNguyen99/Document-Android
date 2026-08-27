# Kiến trúc & quy mô codebase

> Nhóm D · 12 câu

JD dùng chữ "architecture framework and road-map", "solution architectures". Vòng này quyết định bạn được xếp senior hay mid.

<details>
<summary><b>D1. MVVM và MVI khác nhau thế nào? Bạn chọn cái nào cho app ngân hàng và vì sao?</b> &middot; <i>Chắc chắn hỏi</i></summary>

MVVM: ViewModel phơi nhiều state riêng lẻ, View gọi thẳng các hàm public. MVI: **một** state bất biến duy nhất, mọi tương tác đi qua một kênh Intent/Action, state chỉ đổi qua một hàm reducer thuần.

|  | MVVM | MVI |
| --- | --- | --- |
| State | nhiều nguồn | một nguồn duy nhất |
| Boilerplate | ít | nhiều |
| Truy vết lỗi | khó tái hiện | replay được chuỗi action |
| Hợp với | màn hình đơn giản | luồng nhiều bước, nhiều điều kiện |

**Câu trả lời cho ngân hàng:** MVI cho luồng giao dịch (chuyển tiền, eKYC, mở thẻ) vì reducer thuần cho phép unit test toàn bộ máy trạng thái và log lại được chuỗi action khi có khiếu nại. MVVM cho màn hình đọc thuần (danh sách ưu đãi, cài đặt) vì MVI ở đó chỉ là chi phí thừa. Nói được rằng bạn **không** áp một mẫu cho toàn bộ app là dấu hiệu senior.

</details>

<details>
<summary><b>D2. Tầng domain có luôn cần thiết không? UseCase khi nào là thừa?</b> &middot; <i>Nhiều khả năng</i></summary>

Không. UseCase chỉ gọi thẳng một hàm repository là tầng thừa — thêm file, thêm chi phí đọc, không thêm giá trị.

UseCase xứng đáng khi: kết hợp nhiều repository, chứa quy tắc nghiệp vụ thật (kiểm tra hạn mức, tính phí, quy tắc ngày làm việc), hoặc được dùng lại ở nhiều ViewModel.

Với app ngân hàng, tầng domain đáng giá hơn bình thường vì logic nghiệp vụ nhiều và cần test độc lập với Android framework — nhưng vẫn không phải cứ một repository là một usecase.

</details>

<details>
<summary><b>D3. Bạn chia module thế nào cho một app 40 màn hình, 6 team?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Cắt theo **feature** làm trục chính, theo **layer** làm trục phụ:

```kotlin
:app                       // lắp ráp, navigation graph gốc
:core:designsystem         // token + component
:core:network :core:database :core:common
:core:security             // pinning, keystore, integrity
:feature:transfer:api      // interface + navigation contract
:feature:transfer:impl     // implement, không ai depend vào
:feature:accounts:api / :impl
:test:fixtures
```

Điểm mấu chốt là tách `:api` / `:impl`: feature phụ thuộc lẫn nhau chỉ qua `:api` nên sửa `:impl` không gây rebuild toàn bộ. `:app` là nơi duy nhất thấy `:impl`.

Lợi ích thật: thời gian biên dịch song song, ranh giới quyền sở hữu rõ (mỗi team một feature), và ép được kiến trúc bằng cấu hình Gradle chứ không bằng nhắc nhở trong code review.

Đo lường: `./gradlew :app:dependencies`, plugin `module-graph`, và Gradle build scan để tìm module là nút cổ chai.

</details>

<details>
<summary><b>D4. Hilt hoạt động thế nào? Khi nào bạn không dùng DI framework?</b> &middot; <i>Nhiều khả năng</i></summary>

Hilt sinh code lúc biên dịch trên nền Dagger, gắn sẵn component theo vòng đời Android (`SingletonComponent`, `ViewModelComponent`, `ActivityRetainedComponent`…). Lỗi thiếu binding lộ ra **lúc compile**, khác hẳn service locator.

Không dùng DI framework khi: module thư viện dùng chung (không nên ép người dùng theo Hilt — hãy phơi factory function), hoặc project nhỏ, hoặc code chia sẻ KMP (Hilt là JVM-only, KMP thường dùng Koin hoặc DI thủ công qua constructor).

> **Bẫy hay hỏi** — "Vì sao không dùng `@Singleton` cho mọi thứ?" — vì object sống mãi giữ RAM và giữ state qua các phiên đăng nhập. Trong app ngân hàng, một cache scope singleton sẽ rò dữ liệu tài khoản sang user tiếp theo sau khi logout. Cần scope riêng theo phiên và xoá khi logout.

</details>

<details>
<summary><b>D5. Repository pattern: single source of truth và chiến lược cache.</b> &middot; <i>Chắc chắn hỏi</i></summary>

Repository quyết định nguồn dữ liệu, UI không biết dữ liệu từ mạng hay đĩa. SSOT nên là **database**, mạng chỉ là thứ cập nhật database.

```kotlin
fun transactions(): Flow<List<Transaction>> = dao.observeAll()   // UI chỉ nghe DB

suspend fun refresh() {
    val remote = api.transactions()
    dao.upsert(remote.map { it.toEntity() })   // DB đổi -> Flow tự phát
}
```

Ưu điểm: offline hoạt động tự nhiên, chỉ một đường dữ liệu vào UI, không có tình trạng hai nguồn lệch nhau.

Riêng ngân hàng cần nói thêm: **không cache số dư như dữ liệu thường**. Hiển thị số dư đã cache phải kèm thời điểm cập nhật, và các thao tác tiền bạc luôn xác thực lại với server trước khi thực hiện.

</details>

<details>
<summary><b>D6. Thiết kế luồng offline-first cho giao dịch: đảm bảo không trừ tiền hai lần thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Cốt lõi là **idempotency key**: client sinh UUID cho mỗi ý định giao dịch, gửi trong header. Server lưu key và trả lại kết quả cũ nếu thấy trùng. Retry bao nhiêu lần cũng chỉ trừ tiền một lần.

- Ghi giao dịch vào bảng local với trạng thái `PENDING` + `idempotencyKey`.
- WorkManager với `NetworkType.CONNECTED` và backoff luỹ thừa để gửi đi.
- Server trả `ACCEPTED` → cập nhật local; lỗi mạng → giữ `PENDING` và thử lại; lỗi nghiệp vụ (4xx) → chuyển `FAILED`, không retry.
- UI hiển thị rõ trạng thái đang chờ, không giả vờ là đã thành công.

> **Ranh giới cần nói** — Chuyển tiền thật thường **không** nên cho tạo offline — rủi ro pháp lý và trải nghiệm. Offline-first nên áp cho đọc (lịch sử, số dư gần nhất) và cho các thao tác không tiền bạc. Nêu ranh giới này cho thấy bạn hiểu ngành, không chỉ hiểu kỹ thuật.

</details>

<details>
<summary><b>D7. Quản lý phiên và token: refresh token race condition xử lý ra sao?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Vấn đề: 5 request song song cùng nhận 401, cả 5 cùng gọi refresh, 4 cái sau nhận refresh token đã bị xoay và đăng xuất user.

Cách xử: dùng OkHttp `Authenticator` (không phải Interceptor) và **đồng bộ hoá** việc refresh — chỉ một coroutine được refresh, các request khác chờ kết quả đó.

```kotlin
class TokenAuthenticator(...) : Authenticator {
    private val mutex = Mutex()
    override fun authenticate(route: Route?, response: Response): Request? {
        if (response.responseCount >= 2) return null       // chống lặp vô hạn
        return runBlocking {
            mutex.withLock {
                val current = store.accessToken()
                if (current != response.request.token()) return@withLock current  // đã có người refresh
                store.refresh()
            }
        }?.let { response.request.newBuilder().bearer(it).build() }
    }
}
```

Nói thêm cho ngân hàng: thời hạn access token ngắn (5–15 phút), refresh token xoay mỗi lần dùng, có auto-logout khi không thao tác, và xoá token khỏi bộ nhớ khi app xuống background.

</details>

<details>
<summary><b>D8. Feature flag: bạn triển khai và dọn dẹp thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

Ba loại và vòng đời khác nhau: **release flag** (sống vài tuần rồi xoá), **ops/kill switch** (sống mãi, để tắt nhanh tính năng khi backend sự cố), **experiment flag** (A/B, sống theo thí nghiệm).

Kỹ thuật: bọc sau một interface của riêng mình chứ không gọi thẳng SDK Firebase/LaunchDarkly — để thay nhà cung cấp và để test dễ.

```kotlin
interface FeatureFlags { fun isEnabled(flag: Flag): Boolean }
enum class Flag(val key: String, val default: Boolean) {
    NEW_TRANSFER_FLOW("new_transfer_flow", false),
    DISABLE_QR_PAY("kill_qr_pay", false),   // kill switch, mặc định an toàn
}
```

Điểm senior: **mặc định phải an toàn** khi không lấy được cấu hình; flag phải có chủ sở hữu và ngày hết hạn; có job CI cảnh báo flag quá 90 ngày; và với ngân hàng, mọi thay đổi flag phải vào log audit vì nó là thay đổi hành vi sản phẩm mà không qua release.

</details>

<details>
<summary><b>D9. Navigation: bạn thiết kế điều hướng liên module thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

Module feature không được biết nhau. Hai cách phổ biến:

- **Route contract trong `:api`** — mỗi feature phơi route/direction của mình, `:app` lắp graph. Đơn giản, type-safe với Navigation Compose 2.8+ (route là `@Serializable` data class).
- **Navigator trung gian** — feature phát một `NavigationCommand` lên bus, `:app` dịch sang route thật. Linh hoạt hơn nhưng mất type safety và khó lần theo.

Với ngân hàng cần nói thêm phần **gác cổng**: điều hướng tới màn hình nhạy cảm phải đi qua một chốt kiểm tra phiên/xác thực lại, đặt ở tầng navigation chứ không rải rác trong từng màn hình — nếu không sẽ có màn hình bị bỏ sót.

</details>

<details>
<summary><b>D10. Bạn xử lý lỗi và hiển thị cho user thế nào trên toàn app?</b> &middot; <i>Nhiều khả năng</i></summary>

Ba tầng dịch: `Throwable` → lỗi domain có kiểu → thông điệp cho user. Không để `e.message` của Retrofit lọt ra UI.

Phân loại xử lý khác nhau: lỗi mạng (cho retry), lỗi nghiệp vụ (hiện lý do cụ thể, không retry), lỗi xác thực (đưa về đăng nhập), lỗi không rõ (thông điệp chung + mã tham chiếu để user đọc cho tổng đài).

Mã tham chiếu là chi tiết rất "ngân hàng": mỗi lỗi hiển thị kèm một id đã được log lên Crashlytics, để nhân viên hỗ trợ tra được đúng sự cố. Nêu chi tiết này thường gây ấn tượng.

</details>

<details>
<summary><b>D11. Bạn đánh giá và chọn thư viện bên thứ ba theo tiêu chí gì?</b> &middot; <i>Nhiều khả năng</i></summary>

JD ghi hẳn "good at finding and using third-party open-source libraries", nhưng ở ngân hàng câu trả lời phải nghiêng về **rủi ro**:

- Giấy phép — GPL/AGPL thường bị pháp chế từ chối; kiểm tra cả transitive.
- Sức khoẻ dự án: tần suất commit, thời gian phản hồi issue, số maintainer (một người là rủi ro).
- Kích thước và số phụ thuộc kéo theo — ảnh hưởng APK và bề mặt tấn công.
- Nó có yêu cầu quyền gì, có gửi dữ liệu ra đâu không (SDK analytics là điểm rò dữ liệu kinh điển).
- Có bọc được sau interface của mình để thay thế sau không.
- Quét chuỗi cung ứng: dependency verification của Gradle, khoá version, Dependabot, SBOM.

Kết luận nên nói: với chức năng lõi hoặc chạm dữ liệu nhạy cảm thì ưu tiên tự viết hoặc dùng thư viện của Google/Square; với thứ ngoại vi thì chấp nhận thư viện cộng đồng nhưng luôn bọc lại.

</details>

<details>
<summary><b>D12. Bạn xử lý nợ kỹ thuật và migrate kiến trúc trên codebase đang chạy production thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Không viết lại toàn bộ. Nguyên tắc: **strangler fig** — dựng cấu trúc mới bên cạnh, chuyển dần từng màn hình, xoá cái cũ khi hết người dùng.

- Đo trước: module nào sửa nhiều nhất × crash nhiều nhất = nơi trả nợ có lãi cao nhất.
- Đặt luật ở CI cho code mới (module mới bắt buộc theo cấu trúc mới), không ép sửa code cũ.
- Mỗi sprint dành một tỉ lệ cố định cho nợ kỹ thuật, thoả thuận với PM bằng ngôn ngữ rủi ro và tốc độ chứ không bằng "code xấu".
- Có số để chứng minh: thời gian build, crash-free rate, thời gian từ commit tới production.

Đây là câu họ dùng để đo mức senior. Đáp án tệ là "tôi refactor cho sạch"; đáp án tốt là gắn nợ kỹ thuật với chỉ số kinh doanh và mô tả cách thương lượng.

</details>
