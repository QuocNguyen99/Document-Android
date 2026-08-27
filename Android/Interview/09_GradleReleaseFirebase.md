# Gradle, phát hành & Firebase

> Nhóm I · 8 câu

<details>
<summary><b>I1. Version catalog và convention plugin giải quyết vấn đề gì?</b> &middot; <i>Nhiều khả năng</i></summary>

Với 20+ module, mỗi file gradle lặp lại cùng cấu hình là nguồn lệch chuẩn. Version catalog (`libs.versions.toml`) tập trung phiên bản; convention plugin tập trung **cấu hình**.

```kotlin
// build-logic/src/main/kotlin/bank.android.feature.gradle.kts
plugins { id("bank.android.library"); id("bank.android.compose") }
dependencies {
    implementation(project(":core:designsystem"))
    implementation(libs.hilt)
    testImplementation(libs.turbine)
}
```

Sau đó mỗi feature chỉ cần `plugins { id("bank.android.feature") }`. Lợi ích: nâng cấp một chỗ, module mới đúng chuẩn ngay, và ép được luật kiến trúc bằng plugin.

</details>

<details>
<summary><b>I2. Product flavor và build type: bạn tổ chức thế nào cho môi trường ngân hàng?</b> &middot; <i>Nhiều khả năng</i></summary>

`buildTypes` quản lý mức tối ưu/gỡ lỗi (debug, release, benchmark). `productFlavors` quản lý môi trường (dev, uat, prod) — khác endpoint, khác pin cert, khác Firebase project, khác `applicationIdSuffix` để cài song song được.

Điểm cần nêu cho ngân hàng: bản non-prod phải khác biệt rõ ràng ở icon và tên app để không ai nhầm; khoá ký khác nhau; và phải có cổng CI chặn việc phát hành flavor dev lên Play.

</details>

<details>
<summary><b>I3. Build chậm: bạn tăng tốc thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

1. Đo bằng `--scan`, xem task nào tốn và cái gì không được cache.
2. Bật configuration cache và build cache; kiểm task nào không cacheable.
3. Giảm annotation processor — chuyển kapt sang KSP (thường nhanh gấp đôi).
4. Modularize và cắt phụ thuộc thừa; dùng `api` tiết kiệm, ưu tiên `implementation` để không lan rebuild.
5. Tách `:api`/`:impl` để sửa cài đặt không kéo theo cả cây.
6. Remote build cache dùng chung cho cả đội và CI.

Số để kể: "giảm build tăng dần từ 4 phút xuống 50 giây" là loại câu trả lời họ nhớ.

</details>

<details>
<summary><b>I4. Bạn dùng Firebase những gì và cẩn trọng ra sao trong ngành ngân hàng?</b> &middot; <i>Chắc chắn hỏi</i></summary>

| Dịch vụ | Dùng cho | Cẩn trọng |
| --- | --- | --- |
| Crashlytics | crash, ANR | không để PII lọt vào custom key/log |
| Remote Config | feature flag, kill switch | mặc định an toàn; không dùng cho quyết định bảo mật |
| Cloud Messaging | thông báo giao dịch | payload không chứa số tiền/tài khoản; chỉ gửi id, app tự lấy chi tiết |
| Analytics | hành vi | rà soát sự kiện với pháp chế; nhiều ngân hàng cấm hẳn |
| App Distribution | phát bản test nội bộ | chỉ bản non-prod |
| Performance Monitoring | startup, network trace | URL có thể chứa id — cần lọc |

Điểm cần nói thêm: nơi lưu dữ liệu. Nhiều nước châu Á có yêu cầu dữ liệu phải nằm trong lãnh thổ, nên việc chọn region của Firebase project — hoặc quyết định không dùng — là quyết định tuân thủ chứ không phải kỹ thuật.

</details>

<details>
<summary><b>I5. Force update: thiết kế thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

Ngân hàng bắt buộc phải có, vì lỗ hổng bảo mật cần loại bỏ hẳn phiên bản cũ.

- **Server quyết định**, không phải client: mỗi response API mang thông tin phiên bản tối thiểu, hoặc có endpoint riêng gọi lúc khởi động.
- Hai mức: **khuyến nghị** (có nút bỏ qua) và **bắt buộc** (chặn hẳn, chỉ còn nút mở Play Store).
- In-App Update API của Play cho luồng mượt (immediate flow cho trường hợp bắt buộc), nhưng vẫn cần phương án dự phòng khi không có Play Services.
- Kiểm thử kỹ: app cũ nhất còn ngoài thị trường phải hiện được màn hình chặn — nghĩa là logic đó không được phụ thuộc vào API mới.

</details>

<details>
<summary><b>I6. Staged rollout và quy trình rollback trên Play.</b> &middot; <i>Nhiều khả năng</i></summary>

Play cho phát hành theo phần trăm (1% → 5% → 20% → 50% → 100%), theo dõi crash-free rate và ANR rate giữa các bước.

**Không có rollback thật** trên Play — bản đã cài không tự lùi. Chỉ có: halt rollout (dừng phát tán tiếp) và phát hành bản vá mới với versionCode cao hơn. Đây là điều nhiều ứng viên trả lời sai.

Vì vậy phòng tuyến thật là **kill switch phía server**: tắt tính năng lỗi cho cả những máy đã cài. Nói được điều này ghép luôn với câu hỏi feature flag ở nhóm D.

</details>

<details>
<summary><b>I7. Bạn giám sát app sau khi phát hành bằng gì?</b> &middot; <i>Nhiều khả năng</i></summary>

- **Ổn định** — crash-free users/sessions, ANR rate (ngưỡng Play: ANR < 0,47%, crash < 1,09% mới không bị hạ hiển thị).
- **Hiệu năng** — cold start p90, jank rate, thời gian phản hồi API theo phân vị.
- **Nghiệp vụ** — tỉ lệ hoàn tất luồng chuyển tiền, tỉ lệ đăng nhập thất bại, tỉ lệ OTP hết hạn. Chỉ số này quan trọng ngang chỉ số kỹ thuật: crash-free 99,9% mà tỉ lệ chuyển tiền thành công giảm 5% thì vẫn là sự cố.
- **Cảnh báo** — ngưỡng gắn với on-call, so sánh theo phiên bản để phát hiện hồi quy do bản mới.

</details>

<details>
<summary><b>I8. Quản lý phụ thuộc: bạn phòng rủi ro chuỗi cung ứng thế nào?</b> &middot; <i>Ghi điểm thêm</i></summary>

- Khoá phiên bản chính xác, không dùng dynamic version (`1.2.+`).
- Bật dependency verification của Gradle (checksum + chữ ký) cho phụ thuộc quan trọng.
- Dùng repository nội bộ (Artifactory/Nexus) làm proxy, không kéo thẳng từ internet — vừa kiểm soát vừa còn bản sao khi upstream biến mất.
- Quét lỗ hổng trong CI (OWASP Dependency-Check, Snyk) và sinh SBOM.
- Cảnh giác plugin Gradle — chúng chạy code tuỳ ý lúc build, là đường tấn công vào máy dev và CI.

M2 trong OWASP Mobile Top 10 2024 chính là mục này, nên nhắc liên hệ để cho thấy bạn nắm hệ thống.

</details>
