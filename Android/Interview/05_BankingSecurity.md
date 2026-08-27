# Bảo mật & hardening cho app ngân hàng

> Nhóm E · 16 câu

Đây là nhóm quyết định. Kho của bạn có OWASP Mobile Top 10 ở mức lý thuyết nhưng không có file nào về hardening thực tế — mà đây chính là chỗ một ngân hàng sẽ đào sâu nhất.

<details>
<summary><b>E1. Bạn lưu access token và refresh token ở đâu trên Android?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Thứ tự ưu tiên: **không lưu** > lưu trong RAM > lưu mã hoá bằng khoá trong Android Keystore.

- Access token đời ngắn: giữ trong bộ nhớ, mất khi process chết là đúng — buộc xác thực lại.
- Refresh token: `EncryptedSharedPreferences` hoặc DataStore mã hoá bằng khoá Keystore, có `setUserAuthenticationRequired(true)` để gắn với sinh trắc học.
- **Không** lưu vào `SharedPreferences` thường, file, log, hay `WebView` local storage.

Điểm quan trọng phải nói: Keystore giữ **khoá** chứ không giữ dữ liệu, và trên thiết bị có phần cứng bảo mật (TEE/StrongBox) thì khoá không bao giờ rời khỏi vùng đó — kể cả app cũng không đọc được, chỉ gửi dữ liệu vào để ký/giải mã.

> **Bẫy** — Thiết bị đã root thì mọi giả định về lưu trữ local đều đổ. Vì vậy phòng thủ thật nằm ở server: token đời ngắn, ràng buộc thiết bị, phát hiện bất thường. Nói được điều này chứng tỏ bạn hiểu mô hình mối đe doạ, không chỉ thuộc API.

</details>

<details>
<summary><b>E2. Certificate pinning: triển khai thế nào và rủi ro lớn nhất là gì?</b> &middot; <i>Chắc chắn hỏi</i></summary>

```kotlin
val pinner = CertificatePinner.Builder()
    .add("api.bank.com", "sha256/AAAA...")   // leaf hoặc intermediate hiện tại
    .add("api.bank.com", "sha256/BBBB...")   // pin dự phòng — bắt buộc
    .build()
```

Hoặc khai báo trong Network Security Config với `<pin-set expiration="...">`.

**Rủi ro lớn nhất là tự khoá mình ra ngoài:** cert hết hạn hoặc bị xoay mà app cũ vẫn pin giá trị cũ → toàn bộ user phiên bản đó mất kết nối, và bạn không thể hotfix vì chính app không gọi được server. Cách phòng:

- Luôn có ít nhất một pin dự phòng cho khoá tương lai.
- Pin ở tầng intermediate CA thay vì leaf để chịu được việc xoay cert.
- Có cơ chế cập nhật pin từ xa (nhưng phải ký) hoặc kênh thoát khẩn cấp.
- Lịch nhắc trước ngày hết hạn, và quy trình phối hợp với đội hạ tầng.

Nói thêm: pinning chống MITM nhưng **không** chống được người đã root máy và hook vào app — chỗ đó cần tới integrity check.

</details>

<details>
<summary><b>E3. R8/ProGuard làm gì, và khác DexGuard/DexProtector ở đâu?</b> &middot; <i>Chắc chắn hỏi</i></summary>

**R8** (thay ProGuard từ AGP 3.4) làm bốn việc: shrink (bỏ code chết), optimize, obfuscate (đổi tên lớp/hàm), desugar. Miễn phí, có sẵn.

**DexGuard / DexProtector** là sản phẩm thương mại, làm thêm những thứ R8 không làm:

| Khả năng | R8 | DexGuard / DexProtector |
| --- | --- | --- |
| Đổi tên định danh | có | có, mạnh hơn |
| Mã hoá chuỗi | không | có |
| Mã hoá class/asset, tải lúc chạy | không | có |
| Làm rối luồng điều khiển | không | có |
| Chống debug / chống hook (Frida) | không | có |
| Kiểm tra toàn vẹn & chống repackage | không | có |
| Bảo vệ native lib | không | có |

Đánh đổi cần nêu: tăng thời gian build, tăng kích thước app, có thể gây lỗi khó chẩn đoán ở runtime, và làm stack trace khó đọc hơn nữa. Ngân hàng thường bắt buộc dùng vì yêu cầu tuân thủ, không phải vì kỹ thuật thuần.

</details>

<details>
<summary><b>E4. Viết keep rule cho R8: những trường hợp nào bắt buộc phải giữ?</b> &middot; <i>Nhiều khả năng</i></summary>

Mọi thứ được truy cập bằng **reflection** hoặc từ bên ngoài bytecode đều phải giữ:

```text
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations

# model được serialize bằng reflection
-keep class com.bank.data.dto.** { *; }

# interface Retrofit (generic signature cần cho suspend)
-keep,allowobfuscation interface com.bank.data.api.*

# native
-keepclasseswithmembernames class * { native <methods>; }

# giữ dòng để đọc được stack trace, nhưng vẫn đổi tên file
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
```

Quan trọng: sau khi bật R8 phải upload `mapping.txt` lên Crashlytics/Play Console, nếu không mọi crash report thành vô dụng. Và phải chạy toàn bộ QA trên bản `release`, vì lỗi do R8 chỉ xuất hiện ở đó.

Mẹo đáng nói: dùng `kotlinx.serialization` hoặc Moshi codegen thay reflection thì gần như không cần keep rule cho model — vừa an toàn hơn vừa gọn hơn.

</details>

<details>
<summary><b>E5. Root detection: bạn làm thế nào và nó thật sự đáng tin đến đâu?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Các tín hiệu thường kiểm: tồn tại binary `su`, package quản lý root (Magisk, SuperSU), thư mục ghi được bất thường (`/system`), `ro.debuggable`/`ro.secure`, test-keys trong build tag, phát hiện Frida/Xposed qua thư viện nạp và cổng lắng nghe.

**Trung thực về giới hạn:** mọi kiểm tra chạy trong app đều bị vô hiệu hoá bởi kẻ đã kiểm soát thiết bị — Magisk có DenyList, Frida hook thẳng vào hàm kiểm tra. Nó chỉ là rào cản, không phải bảo đảm.

Vì vậy câu trả lời đầy đủ là kết hợp **Play Integrity API**: verdict được Google ký và **xác minh ở server**, không phải trong app. Server dựa vào đó quyết định cho phép giao dịch hay chỉ cho xem.

Và phần nghiệp vụ: phát hiện root thì làm gì? Chặn hẳn sẽ mất user thật (nhiều dev, nhiều máy Trung Quốc có ROM lạ). Cách thường dùng là **hạ cấp**: cho đăng nhập xem số dư nhưng chặn chuyển tiền, hoặc hạ hạn mức, kèm cảnh báo. Nói được sự đánh đổi này sẽ rất khác biệt.

</details>

<details>
<summary><b>E6. BiometricPrompt: dùng đúng cách để không bị bypass?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Sai lầm phổ biến: coi callback `onAuthenticationSucceeded` là bằng chứng. Kẻ tấn công hook hàm đó là xong.

Đúng cách là **gắn sinh trắc học với khoá mật mã**: tạo khoá trong Keystore với `setUserAuthenticationRequired(true)`, rồi truyền `CryptoObject` vào prompt. Khi đó chỉ khi xác thực thật thành công thì khoá mới mở được và thao tác giải mã/ký mới chạy được.

```kotlin
val cipher = getCipherFromKeystore()          // khoá yêu cầu user auth
biometricPrompt.authenticate(promptInfo, BiometricPrompt.CryptoObject(cipher))
// onAuthenticationSucceeded -> result.cryptoObject!!.cipher!!.doFinal(...)
```

Thêm: dùng `BIOMETRIC_STRONG` (Class 3) cho thao tác tiền bạc, không dùng `DEVICE_CREDENTIAL` đơn thuần; đặt `setInvalidatedByBiometricEnrollment(true)` để khoá bị vô hiệu khi user thêm vân tay mới — nếu không, người lạ thêm vân tay của họ là dùng được app.

</details>

<details>
<summary><b>E7. Chống screenshot, screen recording, và overlay attack.</b> &middot; <i>Nhiều khả năng</i></summary>

`WindowManager.LayoutParams.FLAG_SECURE` chặn screenshot, screen recording, và cũng làm thumbnail trong recents bị che — quan trọng vì màn hình recents hiển thị số dư.

Overlay (tapjacking): đặt `android:filterTouchesWhenObscured="true"` trên view nhạy cảm, hoặc kiểm `MotionEvent.FLAG_WINDOW_IS_OBSCURED`. Trong Compose thì cần bọc bằng View có thuộc tính này vì Compose chưa có API tương đương trực tiếp.

Ngoài ra: tắt gợi ý bàn phím và autofill cho ô PIN/số thẻ (`importantForAutofill="no"`, `inputType` phù hợp), xoá clipboard sau khi copy số tài khoản, và không đưa dữ liệu nhạy cảm vào notification hiển thị ở màn hình khoá.

</details>

<details>
<summary><b>E8. OWASP Mobile Top 10 (2024) — kể và cho ví dụ Android cụ thể.</b> &middot; <i>Chắc chắn hỏi</i></summary>

Kho của bạn đã có 9 file, chỉ cần gắn ví dụ Android vào cho sống:

| Hạng mục | Ví dụ Android |
| --- | --- |
| M1 Improper Credential Usage | API key hardcode trong `BuildConfig`, token trong SharedPreferences thường |
| M2 Supply Chain | SDK analytics gửi lén dữ liệu; không khoá version |
| M3 Insecure Auth/Authz | tin vào callback biometric; kiểm quyền chỉ ở client |
| M4 Input/Output Validation | WebView bật `javaScriptEnabled` + `addJavascriptInterface` |
| M5 Insecure Communication | cho phép cleartext; không pinning; chấp nhận mọi cert trong debug rồi lỡ ship |
| M6 Inadequate Privacy Controls | log số thẻ; gửi PII sang analytics bên thứ ba |
| M7 Insufficient Binary Protection | không obfuscate, không kiểm toàn vẹn, dễ repackage |
| M8 Security Misconfiguration | component `exported="true"` thừa; backup bật cho dữ liệu nhạy cảm |
| M9 Insecure Data Storage | Room không mã hoá; cache ảnh sao kê nằm ở thư mục ngoài |
| M10 Insufficient Cryptography | ECB mode; IV cố định; tự chế thuật toán |

</details>

<details>
<summary><b>E9. Mã hoá database local: làm thế nào và khoá để đâu?</b> &middot; <i>Nhiều khả năng</i></summary>

SQLCipher tích hợp với Room qua `SupportFactory`. Nhưng vấn đề thật không phải mã hoá mà là **khoá để đâu** — hardcode thì vô nghĩa.

Cách đúng: sinh passphrase ngẫu nhiên lần đầu chạy, mã hoá nó bằng khoá AES trong Android Keystore, lưu bản mã vào EncryptedSharedPreferences. Keystore giữ khoá gốc trong phần cứng.

```kotlin
val passphrase = keystoreVault.decrypt(prefs.getString(DB_KEY)!!)
Room.databaseBuilder(ctx, AppDb::class.java, "bank.db")
    .openHelperFactory(SupportFactory(passphrase))
    .build()
```

Nói thêm phần thực tế: mã hoá DB làm chậm truy vấn đáng kể, nên nhiều đội chỉ mã hoá bảng nhạy cảm, hoặc đơn giản là **không lưu** dữ liệu nhạy cảm xuống đĩa. Câu trả lời tốt nhất thường là giảm thứ cần lưu, không phải mã hoá nhiều hơn.

</details>

<details>
<summary><b>E10. WebView trong app ngân hàng: rủi ro và cách dùng an toàn.</b> &middot; <i>Nhiều khả năng</i></summary>

- Tắt `javaScriptEnabled` nếu không cần; nếu cần thì **không** dùng `addJavascriptInterface` (trước API 17 là RCE, giờ vẫn là bề mặt tấn công) — dùng `WebMessagePort`.
- Tắt `setAllowFileAccess`, `setAllowFileAccessFromFileURLs`, `setAllowUniversalAccessFromFileURLs`.
- Chặn điều hướng ra domain lạ trong `shouldOverrideUrlLoading` bằng allowlist.
- Không bỏ qua lỗi SSL trong `onReceivedSslError` — đây là lỗi bị pentest bắt nhiều nhất.
- Dùng `Custom Tabs` thay WebView khi chỉ cần mở trang web (OAuth chẳng hạn) — nó dùng cookie và bảo mật của Chrome, không nằm trong process của bạn.
- Cập nhật WebView là của hệ thống, nên phải xử lý được trường hợp thiết bị có WebView cũ.

</details>

<details>
<summary><b>E11. Manifest hardening: bạn kiểm những mục nào?</b> &middot; <i>Nhiều khả năng</i></summary>

```kotlin
<application
    android:allowBackup="false"
    android:dataExtractionRules="@xml/data_extraction_rules"
    android:networkSecurityConfig="@xml/network_security_config"
    android:usesCleartextTraffic="false">
```

- `allowBackup="false"` — nếu bật, `adb backup` lấy được dữ liệu app trên máy đã bật debug.
- Mọi component không cần cho bên ngoài phải `exported="false"`; cái nào cần thì phải có permission bảo vệ.
- `debuggable` phải false ở release (kiểm trong CI, không tin tay).
- Network Security Config: cấm cleartext, khai pin, và **giới hạn debug-overrides chỉ cho build debug**.
- Không để `android:testOnly`, không để lộ `ContentProvider` nội bộ.
- Rà lại quyền: xin ít nhất có thể — mỗi quyền thừa là câu hỏi từ đội bảo mật và từ Play Store.

</details>

<details>
<summary><b>E12. Bạn giữ secret (API key, cấu hình) thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Câu trả lời đầu tiên phải là: **không có cách nào giấu secret an toàn trong app client**. Mọi thứ ship xuống máy user đều trích xuất được — obfuscate, NDK, mã hoá chuỗi chỉ làm chậm chứ không ngăn.

Vì vậy thiết kế phải sao cho client **không cần** secret có giá trị:

- Xác thực bằng token đời ngắn lấy sau khi user đăng nhập, không bằng API key tĩnh.
- Việc cần secret thật thì làm ở backend — client gọi qua backend của mình.
- Nếu buộc phải có khoá (ví dụ khoá công khai để pin), dùng khoá **công khai**, không phải khoá bí mật.
- Loại secret khỏi repo: `local.properties`, biến môi trường CI, secret manager — và quét lịch sử git bằng gitleaks.

Đây là câu mà đáp án "tôi để trong NDK cho an toàn" bị đánh trượt, còn đáp án về mô hình mối đe doạ được đánh giá cao.

</details>

<details>
<summary><b>E13. Auto-logout và bảo vệ phiên: thiết kế thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

- Đếm giờ không thao tác (thường 3–5 phút) ở tầng ứng dụng, reset bởi mọi tương tác — cài bằng `Application.ActivityLifecycleCallbacks` hoặc một `ProcessLifecycleOwner` observer.
- Khi app xuống background: che màn hình bằng lớp phủ (cho recents) và bắt đầu đồng hồ ngắn hơn.
- Khi hết giờ: xoá token khỏi RAM, xoá state nhạy cảm, đưa về màn hình đăng nhập, và huỷ phiên ở **server** chứ không chỉ ở client.
- Quay lại app dưới ngưỡng thì cho mở khoá nhanh bằng sinh trắc học thay vì nhập lại mật khẩu — cân bằng bảo mật và trải nghiệm.
- Server vẫn phải có timeout riêng, không tin client.

</details>

<details>
<summary><b>E14. Logging trong app ngân hàng: nguyên tắc?</b> &middot; <i>Nhiều khả năng</i></summary>

`Log` của Android đọc được bởi công cụ dev và một số thiết bị lưu lại. Nguyên tắc:

- Không log PII, số thẻ, số tài khoản đầy đủ, token, mã OTP. Nếu cần thì che (`****1234`).
- Tắt hoàn toàn log ở release — dùng Timber với cây khác nhau theo build type, và thêm luật R8 `-assumenosideeffects` để xoá hẳn lệnh gọi.
- Log mạng: `HttpLoggingInterceptor` ở mức BODY chỉ được có mặt trong debug — kiểm bằng test hoặc bằng cách chỉ khai dependency ở `debugImplementation`.
- Log nghiệp vụ/audit thì gửi lên server có kiểm soát, không để trong logcat.

</details>

<details>
<summary><b>E15. Play Integrity API hoạt động ra sao và khác SafetyNet chỗ nào?</b> &middot; <i>Nhiều khả năng</i></summary>

SafetyNet Attestation đã bị khai tử, Play Integrity là bản thay thế. App yêu cầu một token, Google trả về verdict đã ký, app gửi token lên **server của mình**, server gọi Google API để giải mã và kiểm.

Verdict gồm ba nhóm: thiết bị (`MEETS_DEVICE_INTEGRITY`, `MEETS_STRONG_INTEGRITY`…), app (có phải bản ký bởi bạn và cài từ Play không), và tài khoản (có license hợp lệ không).

Điểm cốt lõi phải nói: **xác minh ở server, không ở client**. Nếu app tự kiểm rồi tự quyết thì kẻ tấn công chỉ cần hook một hàm boolean. Và cần xử lý được trường hợp thiết bị không có Play Services (thị trường Trung Quốc, Huawei) — thường phải có phương án thay thế.

</details>

<details>
<summary><b>E16. Nếu phát hiện một lỗ hổng bảo mật trong app đang chạy production, quy trình của bạn là gì?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Đây là câu hỏi tình huống, họ muốn xem tư duy vận hành chứ không phải kiến thức.

1. **Chặn thiệt hại trước** — dùng kill switch/feature flag để tắt tính năng bị ảnh hưởng, hoặc chặn ở tầng backend/gateway. Nhanh hơn nhiều so với chờ release.
2. **Đánh giá phạm vi** — bao nhiêu user, phiên bản nào, đã bị khai thác chưa (kiểm log), dữ liệu nào có thể đã lộ.
3. **Báo cáo theo quy trình** — với ngân hàng, việc này có nghĩa vụ pháp lý: đội security, compliance, và có thể cả cơ quan quản lý trong khung thời gian quy định.
4. **Sửa và phát hành** — hotfix branch, review có người thứ hai, ưu tiên rollout nhanh; Play có expedited review nhưng vẫn mất thời gian, nên cần cả cơ chế buộc nâng cấp (force update).
5. **Sau sự cố** — postmortem không đổ lỗi, thêm test hồi quy, và tìm xem lỗ hổng cùng loại còn ở đâu.

Nhấn mạnh bước 1 và bước 3 — đó là hai bước ứng viên thường quên, và là hai bước ngân hàng quan tâm nhất.

</details>
