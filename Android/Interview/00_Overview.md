# Ôn phỏng vấn Senior Android — Ngân hàng số

Bộ ôn tập cho JD Senior Android tại một ngân hàng số ở châu Á: 110 câu hỏi kèm đáp án, đối chiếu kho tài liệu này với yêu cầu JD, và lộ trình ôn bốn tuần.

Đọc câu hỏi, tự trả lời thành tiếng, rồi mới mở đáp án. Nhãn cuối mỗi câu cho biết mức độ chắc chắn bị hỏi: *Chắc chắn hỏi* / *Nhiều khả năng* / *Ghi điểm thêm*.

## Mục lục

| Nhóm | Chủ đề | Số câu |
| --- | --- | --- |
| A | [Kotlin, Coroutines & Flow](01_KotlinCoroutinesFlow.md) | 12 |
| B | [Android Core & vòng đời](02_AndroidCore.md) | 10 |
| C | [Compose, custom UI & Design System](03_ComposeAndCustomUI.md) | 12 |
| D | [Kiến trúc & quy mô codebase](04_Architecture.md) | 12 |
| E | [Bảo mật & hardening cho app ngân hàng](05_BankingSecurity.md) | 16 |
| F | [Testing & automation](06_Testing.md) | 9 |
| G | [Hiệu năng & bộ nhớ](07_Performance.md) | 10 |
| H | [KMP / KMM & cross-platform](08_KotlinMultiplatform.md) | 6 |
| I | [Gradle, phát hành & Firebase](09_GradleReleaseFirebase.md) | 8 |
| J | [System design cho mobile](10_SystemDesign.md) | 5 |
| K | [Leadership, giao tiếp & tình huống](11_Leadership.md) | 10 |
| — | [Câu hỏi bạn nên hỏi lại](12_QuestionsToAsk.md) | — |

---

# Kho tài liệu của bạn so với JD

> Đối chiếu

Quét `~/Documents/Document-Android`: 353 file trong `ComputerScience/`, phần Android nằm chủ yếu ở `3_Mobile/0_Android`. Nền Kotlin và CS của bạn rất dày — phần thiếu gần như toàn bộ nằm ở nhóm kỹ năng mà JD gọi là "plus", tức đúng chỗ dùng để phân loại ứng viên senior.

### Đã có, chỉ cần ôn

- **Kotlin sâu** — 100+ file: coroutines, structured concurrency, Flow, StateFlow/SharedFlow, Channel, generics & variance, delegate, DSL, contracts
- **CS nền** — SOLID, 12 design pattern, MVC/MVP/MVVM/MVI/Clean, JVM & GC, Big-O
- **Android core** — 4 component, Intent, PendingIntent, Parcel/Bundle, permission, task & back stack
- **Compose** — recomposition scope, donut-hole skipping, stability, side effects, phases, state hoisting, CompositionLocal
- **Kiến trúc** — UI/Domain/Data layer, modularization, Hilt, Navigation (9 file)
- **Dữ liệu** — Room, DataStore, SharedPreferences, SQLite
- **Bảo mật nền** — OWASP Mobile Top 10 đủ 9 file, OAuth, JWT, SAML, hashing

### Thiếu — ưu tiên bù

- **KMM/KMP** — 0 file. JD ghi "big plus"
- **App hardening** — 0 file về R8/Proguard rules, DexGuard, DexProtector, SSL pinning, root detection, Play Integrity
- **Testing hiện đại** — chỉ có Espresso + unit test cơ bản. Thiếu MockK, Turbine, Compose UI test, Robolectric, screenshot test
- **Hiệu năng** — chỉ có CpuProfiling + MemoryEfficient. Thiếu LeakCanary, ANR, StrictMode, Baseline Profile, Macrobenchmark, Perfetto
- **System design mobile** — 0 file. Vòng bắt buộc với senior
- **Leadership / behavioral** — 0 file. JD dành hẳn 7 gạch đầu dòng cho nhóm này
- **Design System**, **feature flag**, **WorkManager & offline-first**, **adaptive UI**, **custom View**, **gradle engineering**, **Firebase ngoài Crashlytics** — đều 0 file

| Lỗ hổng | JD nói gì | Trong kho | Ưu tiên |
| --- | --- | --- | --- |
| App hardening & obfuscation | "Dexguard, Proguard, or Dexprotector is a plus" | Không có | P0 |
| System design mobile | "developing solution architectures", "lead the technical design process" | Không có | P0 |
| Leadership & giao tiếp | 7 gạch đầu dòng soft skill | Không có | P0 |
| Testing & automation | "experience in automation tests and unit tests" | Espresso, unit test cơ bản | P0 |
| Memory & performance | "experience in memory and performance solving" | 2 file rời rạc | P0 |
| Multi screen size & density | "**Must have** experience" | Resources.md, thiếu adaptive | P0 |
| KMM / KMP | "big plus" | Không có | P1 |
| Design System | "is a plus" | Chỉ UI/UX chung | P1 |
| Feature flagging | "Firebase, LaunchDarkly" | Không có | P1 |
| Custom UI native component | "Experience with developing custom UI" | Chỉ View có sẵn | P1 |
| Firebase | "integrating with web services, such as Firebase" | Chỉ Crashlytics | P1 |
| WorkManager & offline-first | ngầm định trong app banking | Không có | P1 |
| Gradle engineering & CI/CD | "tooling, patterns and delivery processes" | 1 file BuildGradle | P1 |
| Biometric, Keystore, StrongBox | ngầm định — app ngân hàng | Encryption chung chung | P1 |
| iOS / Swift cơ bản | "willingness to learn iOS" | Không có | P2 |
| Accessibility, i18n, RTL | "world class User Experience" | Chỉ Plurals | P2 |


---

# Bốn tuần ôn, theo thứ tự

> Lộ trình

Thứ tự có chủ đích: tuần 1 bù đúng thứ bị đào sâu nhất trong ngành ngân hàng, tuần 4 để dành rèn nói vì đó là chỗ mất điểm nhiều nhất ở vòng cuối mà lại lên nhanh nhất.

T1

### Bảo mật & hardening — lỗ hổng lớn nhất

- OWASP MASVS / MASTG: đọc lướt, đối chiếu với 9 file OWASP đã có trong kho
- R8 thực hành: bật `minifyEnabled` + `shrinkResources` trên app thật, đọc `mapping.txt`, viết keep rule cho Retrofit/Gson/Room
- SSL pinning bằng OkHttp `CertificatePinner` + Network Security Config, thử kịch bản xoay cert và pin dự phòng
- Android Keystore, `EncryptedSharedPreferences`, `BiometricPrompt` + `CryptoObject`, StrongBox, key attestation
- Root/emulator/tamper detection, Play Integrity API, `FLAG_SECURE`, chống screenshot & overlay
- Đọc tài liệu DexGuard và DexProtector đủ để nói được chúng khác R8 chỗ nào

T2

### Testing & hiệu năng — hai chữ "experience" trong JD

- Viết test thật: MockK (cả `mockkStatic`, `coEvery`), Turbine cho Flow, `runTest` + `TestDispatcher`
- Compose UI test: `createAndroidComposeRule`, semantics, `onNodeWithTag`, idling resource
- Kim tự tháp test, và vì sao app ngân hàng cần nhiều integration test hơn bình thường
- LeakCanary trên app thật — tự tạo một leak rồi đọc trace
- Macrobenchmark + Baseline Profile: đo cold start trước/sau để có con số mà kể
- Perfetto đọc một trace jank; StrictMode; phân loại ANR

T3

### Kiến trúc quy mô lớn, KMP, Design System

- Modularization: `:core`, `:feature`, `:data` — vẽ được đồ thị phụ thuộc và giải thích lý do cắt
- Version catalog + convention plugin, product flavor cho môi trường bank (dev/uat/prod)
- KMP: dựng project mẫu, chia sẻ domain + networking, `expect/actual`, chạy được trên iOS simulator
- Design System: token → component → pattern; thiết kế API cho một component tái dùng; Compose theming quy mô lớn
- Feature flag: Remote Config, kill switch, rollout theo phần trăm, quy trình dọn flag chết
- Offline-first: WorkManager, hàng đợi giao dịch, idempotency key, xử lý conflict

T4

### System design + kể chuyện

- Luyện nói 4 bài system design ở mục J, mỗi bài 30 phút, có vẽ
- Viết sẵn 8 câu chuyện STAR, mỗi câu 90 giây — nhất là chuyện coach người khác và chuyện bảo vệ quyết định kỹ thuật trước business
- Chuẩn bị demo 5 phút: app của bạn trên Play Store, kiến trúc, và một đánh đổi bạn tự hào
- Tự thu âm rồi nghe lại, riêng phần "dịch kỹ thuật sang ngôn ngữ business"
- Quét lại toàn bộ câu hỏi bên dưới, đánh dấu câu nào còn ngập ngừng
