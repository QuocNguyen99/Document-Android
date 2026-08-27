# System design cho mobile

> Nhóm J · 5 bài

Vòng này gần như chắc chắn có với vị trí senior, và kho của bạn hiện không có gì. Cấu trúc trả lời chung: **làm rõ yêu cầu → xác định ràng buộc → vẽ kiến trúc → đi sâu 2 chỗ → nêu đánh đổi → nói cách đo**. Đừng vẽ ngay khi chưa hỏi.

<details>
<summary><b>J1. Thiết kế luồng chuyển tiền trong app ngân hàng, từ lúc bấm nút đến khi có biên lai.</b> &middot; <i>Chắc chắn hỏi</i></summary>

**Hỏi trước:** chuyển nội bộ hay liên ngân hàng? Có xuyên biên giới không (ảnh hưởng tỉ giá, thời gian xử lý)? Hạn mức và yêu cầu xác thực mạnh là gì? Có cần đặt lịch không?

**Luồng đề xuất:**

1. **Nhập & xác nhận** — validate ở client cho phản hồi nhanh (định dạng số tài khoản, hạn mức đã biết) nhưng mọi quy tắc đều phải kiểm lại ở server.
2. **Kiểm tra người nhận** — gọi API tra tên chủ tài khoản, bắt user xác nhận đúng tên. Bước này chống nhầm và chống lừa đảo.
3. **Tạo ý định** — client sinh `idempotencyKey`, gọi `POST /transfers`, server trả về trạng thái `PENDING_AUTH` kèm loại thử thách.
4. **Xác thực mạnh** — OTP, sinh trắc học gắn CryptoObject, hoặc chữ ký số. Thử thách do **server** quyết định, không phải client.
5. **Xác nhận** — gửi kèm challenge response; server thực hiện và trả biên lai.
6. **Trạng thái cuối** — nếu là chuyển liên ngân hàng bất đồng bộ thì hiển thị "đang xử lý" và cập nhật qua FCM + polling dự phòng.

**Xử lý trường hợp xấu (đây là chỗ ghi điểm):** mất mạng sau khi gửi xác nhận → dùng cùng `idempotencyKey` để truy vấn lại trạng thái, tuyệt đối không gửi lại như một giao dịch mới. App bị kill giữa chừng → khi mở lại, kiểm tra giao dịch đang treo và hiển thị. Người dùng bấm hai lần → khoá nút bằng state chứ không bằng debounce thời gian.

**Đo:** tỉ lệ hoàn tất theo từng bước để biết bước nào rơi rụng nhiều nhất, thời gian p90 mỗi bước, tỉ lệ OTP hết hạn.

</details>

<details>
<summary><b>J2. Thiết kế màn hình danh sách giao dịch cho tài khoản có 10 năm lịch sử.</b> &middot; <i>Chắc chắn hỏi</i></summary>

**Hỏi trước:** cần tìm kiếm và lọc không? Có phải xem offline không? Dữ liệu quá khứ có thay đổi không (giao dịch có thể bị điều chỉnh)?

**Kiến trúc:** Paging 3 + `RemoteMediator`, Room làm single source of truth.

```kotlin
@OptIn(ExperimentalPagingApi::class)
class TxRemoteMediator(...) : RemoteMediator<Int, TxEntity>() {
    override suspend fun load(type: LoadType, state: PagingState<...>): MediatorResult {
        val cursor = when (type) {
            REFRESH -> null
            PREPEND -> return MediatorResult.Success(endOfPaginationReached = true)
            APPEND  -> state.lastItemOrNull()?.cursor ?: return Success(true)
        }
        ...
    }
}
```

**Quyết định cần giải thích:**

- **Cursor pagination**, không dùng offset — offset sai khi có giao dịch mới chèn vào đầu trong lúc đang cuộn.
- **Chỉ giữ cục bộ 3–6 tháng gần nhất**, cũ hơn thì tải theo yêu cầu. Giữ 10 năm trên máy vừa tốn dung lượng vừa tăng rủi ro dữ liệu.
- **Tìm kiếm và lọc chạy ở server** cho dải thời gian dài, ở client cho phần đã cache — và nói rõ cho user biết phạm vi tìm.
- Xoá cache khi đăng xuất; mã hoá bảng nếu lưu chi tiết.

**Hiệu năng:** key ổn định trong LazyColumn, `contentType` cho header ngày, định dạng tiền tệ tính sẵn ở tầng map chứ không trong composable.

</details>

<details>
<summary><b>J3. Thiết kế cơ chế xác thực và quản lý phiên cho app ngân hàng đa quốc gia.</b> &middot; <i>Chắc chắn hỏi</i></summary>

**Hỏi trước:** một app cho nhiều nước hay mỗi nước một app? Yêu cầu pháp lý về xác thực mạnh khác nhau thế nào? Có dùng chung tài khoản xuyên biên giới không?

**Thiết kế:**

- **Đăng nhập lần đầu** — user/mật khẩu + OTP, sau đó **đăng ký thiết bị**: sinh cặp khoá trong Keystore (StrongBox nếu có), gửi khoá công khai lên server. Từ đó thiết bị có danh tính riêng.
- **Đăng nhập lại** — sinh trắc học mở khoá private key, ký một challenge từ server. Không lưu mật khẩu, không lưu "token đăng nhập vĩnh viễn".
- **Token** — access token 5–15 phút, refresh token xoay mỗi lần dùng và gắn với thiết bị. Refresh bị dùng lại lần hai ⇒ coi là bị đánh cắp, huỷ toàn bộ phiên.
- **Step-up authentication** — thao tác rủi ro cao yêu cầu xác thực thêm ngay tại thời điểm đó, do server quyết định dựa trên số tiền, người nhận mới, thiết bị lạ.
- **Đa quốc gia** — cấu hình theo thị trường (loại xác thực, thời gian phiên, dữ liệu lưu ở đâu) tải từ server theo hồ sơ user, không hardcode theo flavor.
- **Đăng xuất** — huỷ ở server, xoá token, xoá cache dữ liệu, huỷ đăng ký FCM topic riêng.

**Đánh đổi cần nêu:** phiên càng ngắn càng an toàn nhưng càng phiền; giải pháp là phiên ngắn cộng mở khoá nhanh bằng sinh trắc học, chứ không phải kéo dài phiên.

</details>

<details>
<summary><b>J4. Đề xuất lộ trình kiến trúc để migrate một app ngân hàng cũ (Java, XML, MVP, một module) sang hiện đại.</b> &middot; <i>Chắc chắn hỏi</i></summary>

Đây gần như chính là công việc mô tả trong JD ("evolving mobile architecture framework and road-map"), nên chuẩn bị kỹ.

1. **Giai đoạn 0 — nhìn thấy được** (2–4 tuần): dựng chỉ số nền (crash-free, startup, thời gian build, coverage), thêm Crashlytics đầy đủ, vẽ đồ thị phụ thuộc hiện tại. Không sửa gì. Không có số nền thì sau này không chứng minh được giá trị.
2. **Giai đoạn 1 — dựng nền**: version catalog, convention plugin, tách `:core:designsystem`, `:core:network`. Code cũ chưa động tới.
3. **Giai đoạn 2 — luật cho code mới**: mọi màn hình mới viết Kotlin + Compose + MVVM/MVI trong module feature riêng. Ranh giới ở cấp màn hình, dùng `ComposeView` để nhúng.
4. **Giai đoạn 3 — chuyển theo giá trị**: chọn màn hình theo công thức "sửa nhiều × crash nhiều", không chuyển theo thứ tự alphabet. Mỗi màn hình chuyển xong phải kèm test.
5. **Giai đoạn 4 — rút chân**: xoá code chết, gỡ thư viện cũ, hạ minSdk nếu được.

**Cách bán ý tưởng cho business** — phần quan trọng nhất: không nói "code cũ xấu". Nói "thời gian đưa một tính năng ra thị trường đang là 6 tuần, phần lớn nằm ở hồi quy thủ công vì không có test; lộ trình này đưa xuống 3 tuần trong 2 quý, và giảm rủi ro sự cố bảo mật vì thư viện cũ không còn được vá."

**Rủi ro cần chủ động nêu:** tồn tại hai hệ song song trong thời gian dài, đội phải giỏi cả hai; nguy cơ dự án bị bỏ dở giữa chừng nên phải chia mốc sao cho dừng lúc nào cũng vẫn có giá trị.

</details>

<details>
<summary><b>J5. Thiết kế hệ thống thông báo giao dịch theo thời gian thực.</b> &middot; <i>Nhiều khả năng</i></summary>

**Hỏi trước:** độ trễ chấp nhận được là bao nhiêu? Có cần hoạt động khi app đóng không? Có yêu cầu đảm bảo nhận được không?

**Thiết kế:** FCM là kênh chính (xuyên Doze với high-priority), WebSocket chỉ khi app đang mở và cần cập nhật liên tục (ví dụ màn hình theo dõi giao dịch đang xử lý).

- **Payload rỗng** — chỉ gửi id và loại sự kiện. App tự gọi API lấy chi tiết. Không bao giờ đặt số tiền hay tên người gửi trong payload, vì nó hiện ở màn hình khoá và đi qua hạ tầng bên thứ ba.
- **Không đảm bảo nhận** — FCM là best-effort. Nên phải có đồng bộ khi mở app và pull-to-refresh; không được coi thông báo là nguồn sự thật.
- **Quản lý token** — gửi lên server khi đổi, gỡ khi đăng xuất (nếu quên, người dùng tiếp theo trên cùng máy sẽ nhận thông báo của người trước — sự cố rò rỉ thật).
- **Kênh thông báo** — tách channel cho giao dịch, bảo mật, marketing để user tắt riêng; channel bảo mật không cho tắt.
- **Dự phòng** — thị trường không có Play Services cần kênh khác (HMS, hoặc polling khi mở app).

</details>
