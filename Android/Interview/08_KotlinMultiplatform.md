# KMP / KMM & cross-platform

> Nhóm H · 6 câu

JD gọi đây là "big plus" và kho của bạn có 0 file. Không cần thành chuyên gia — cần dựng được một project mẫu và nói được đánh đổi.

<details>
<summary><b>H1. KMP là gì, chia sẻ được đến đâu, và khác Flutter/React Native ra sao?</b> &middot; <i>Chắc chắn hỏi</i></summary>

KMP chia sẻ **logic** chứ không bắt buộc chia sẻ UI. Code chung biên dịch sang JVM bytecode cho Android và sang native binary cho iOS qua Kotlin/Native. UI vẫn có thể giữ Compose và SwiftUI riêng.

Khác biệt cốt lõi với Flutter/RN: KMP không có runtime hay bridge riêng — không có cầu JS, không có engine vẽ riêng. App vẫn là app native thật, chỉ dùng chung thư viện.

Tầng thường chia sẻ: model, usecase, validation, networking (Ktor), database (SQLDelight/Room KMP), DI (Koin). Tầng thường giữ riêng: UI, quyền, sinh trắc học, tích hợp hệ thống.

</details>

<details>
<summary><b>H2. <code>expect</code>/<code>actual</code> dùng thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

```kotlin
// commonMain
expect class SecureStorage {
    fun put(key: String, value: String)
    fun get(key: String): String?
}

// androidMain -> EncryptedSharedPreferences
// iosMain     -> Keychain
```

Dùng cho thứ chỉ nền tảng mới có: lưu trữ an toàn, sinh trắc học, id thiết bị, logging.

Xu hướng hiện nay là **hạn chế** `expect/actual`, thay bằng interface trong `commonMain` và tiêm cài đặt từ mỗi nền tảng qua DI — dễ test hơn nhiều, vì trong test có thể tiêm bản giả mà không cần một target riêng.

</details>

<details>
<summary><b>H3. Concurrency trong KMP có gì khác?</b> &middot; <i>Nhiều khả năng</i></summary>

Từ Kotlin 1.7.20, memory model mới của Kotlin/Native bỏ hẳn ràng buộc "object phải đóng băng khi qua thread" — trước đây đây là nỗi đau lớn nhất của KMM. Giờ coroutine hành xử gần như trên JVM.

Còn lại vài khác biệt cần biết: `Dispatchers.IO` chỉ mới có trên Native gần đây; iOS main dispatcher gắn với main queue; và một số thư viện JVM (Hilt, Retrofit, java.time) không dùng được trong `commonMain` — phải thay bằng Koin, Ktor, kotlinx-datetime.

</details>

<details>
<summary><b>H4. Phía iOS tiêu thụ code KMP thế nào? Có gì khó chịu?</b> &middot; <i>Nhiều khả năng</i></summary>

Module chung được đóng gói thành XCFramework, Swift import như một framework Objective-C. Vì đi qua interop Obj-C nên có vài hạn chế đáng nói:

- Generic của Kotlin bị mất phần lớn, sealed class biến thành class thường — Swift không exhaustive switch được.
- Hàm `suspend` hiện ra dưới dạng completion handler; muốn dùng `async/await` hay Combine thì phải bọc thêm (SKIE giải quyết khá tốt việc này).
- `Flow` không dùng trực tiếp được từ Swift, cần wrapper.
- Tên bị đổi (prefix), và lỗi runtime từ Kotlin không thành Swift error tự nhiên.

Nói được rằng phải **thiết kế API chung sao cho thân thiện với Swift** (tránh generic phức tạp, phơi callback rõ ràng) là điểm cộng lớn — đó là bài học chỉ có khi làm thật.

</details>

<details>
<summary><b>H5. Khi nào bạn <b>không</b> khuyên dùng KMP?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Đây là câu kiểm tra bạn có phải người bán công nghệ hay người ra quyết định.

- Đội iOS không muốn — KMP đặt gánh nặng lên phía iOS (build chậm hơn, debug qua interop khó, phải học Kotlin). Không có sự đồng thuận thì dự án sẽ thất bại vì con người, không vì kỹ thuật.
- App chủ yếu là UI, ít logic — chẳng có gì để chia sẻ.
- Đội quá nhỏ, chưa có CI vững — chi phí thiết lập lớn hơn lợi ích.
- Phụ thuộc nặng vào SDK chỉ có bản native (một số SDK eKYC, thanh toán).

Với ngân hàng thì lập luận ủng hộ mạnh nhất là: **logic nghiệp vụ tiền bạc chỉ viết một lần** nên hai nền tảng không thể lệch nhau — đó là lợi ích về rủi ro, không chỉ về tốc độ.

</details>

<details>
<summary><b>H6. Compose Multiplatform đã dùng được cho production chưa?</b> &middot; <i>Ghi điểm thêm</i></summary>

Compose Multiplatform trên iOS đã ra bản ổn định, nhưng cần trung thực về đánh đổi: cuộn và cử chỉ chưa giống hệt UIKit, accessibility chưa ngang native, text input có khác biệt, và kích thước binary tăng.

Với ngân hàng, khuyến nghị hợp lý là **chia sẻ logic trước, UI sau** — và nếu có dùng UI chung thì bắt đầu ở màn hình nội bộ hoặc màn hình phụ, không phải luồng chuyển tiền. Nói theo hướng này cho thấy khẩu vị rủi ro phù hợp với ngành.

</details>
