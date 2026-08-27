# Android Core & vòng đời

> Nhóm B · 10 câu

<details>
<summary><b>B1. Process death là gì, khác config change ở đâu, và bạn khôi phục state thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Config change (xoay màn hình) huỷ Activity nhưng process còn sống — ViewModel sống sót. Process death là hệ thống giết cả process khi app ở background và thiếu RAM; ViewModel mất sạch, nhưng khi user quay lại, Android **tái tạo đúng back stack** nên user tưởng app vẫn ở đó.

| Cơ chế | Sống qua config change | Sống qua process death | Giới hạn |
| --- | --- | --- | --- |
| Biến trong Activity | không | không | — |
| ViewModel | có | không | RAM |
| `SavedStateHandle` | có | **có** | ~1MB, Bundle |
| DataStore / Room | có | có | disk, bất đồng bộ |

Quy tắc: `SavedStateHandle` cho thứ nhỏ và cần thiết để dựng lại màn hình (id giao dịch, bước đang ở trong luồng chuyển tiền, text đã gõ). Không nhét cả danh sách vào — `TransactionTooLargeException` sẽ nổ.

> **Riêng cho ngân hàng** — Sau process death, phiên đăng nhập **không** được khôi phục. Phải bắt user xác thực lại. Nói được điều này là tách bạn khỏi ứng viên chỉ học lý thuyết.

</details>

<details>
<summary><b>B2. Cách test process death khi phát triển?</b> &middot; <i>Nhiều khả năng</i></summary>

Không phải xoay màn hình. Ba cách:

- Developer options → **Don't keep activities** — chỉ mô phỏng huỷ Activity, không phải process death thật.
- Đưa app xuống background rồi `adb shell am kill <package>` — đây mới đúng là process death.
- Android Studio → nút **Terminate Application** trong Logcat, rồi mở lại app từ recents.

Trả lời được cả ba, đặc biệt phân biệt "don't keep activities" không phải process death, là dấu hiệu đã thật sự đi qua bug loại này.

</details>

<details>
<summary><b>B3. Launch mode và task affinity: giải thích và nêu rủi ro bảo mật.</b> &middot; <i>Nhiều khả năng</i></summary>

Bốn mode: `standard` (mặc định, tạo mới mỗi lần), `singleTop` (tái dùng nếu đang ở đỉnh), `singleTask` (một instance trong task, clear phần trên nó), `singleInstance` (một mình một task).

**Rủi ro:** StrandHogg — app độc hại khai `taskAffinity` trùng với app ngân hàng, chèn Activity giả vào task và lừa nhập mật khẩu. Phòng bằng đặt `android:taskAffinity=""` cho Activity nhạy cảm, kết hợp `launchMode="singleTask"` hoặc `FLAG_ACTIVITY_NEW_TASK` có kiểm soát.

Trong ngữ cảnh app banking, nêu StrandHogg là ghi điểm rất mạnh.

</details>

<details>
<summary><b>B4. ANR xảy ra khi nào, có mấy loại, chẩn đoán ra sao?</b> &middot; <i>Chắc chắn hỏi</i></summary>

ANR khi main thread bị chặn quá ngưỡng: ~5s cho input, ~10s cho BroadcastReceiver foreground, ~20s cho Service.

Nguyên nhân thật sự thường gặp: I/O trên main thread, `SharedPreferences.commit()`, khoá bị giữ bởi background thread, binder call chậm, khởi tạo nặng trong `Application.onCreate`, deadlock.

Chẩn đoán: `/data/anr/traces.txt` qua `adb bugreport`, Play Console → Android vitals (ANR rate, phải dưới 0,47%), Firebase Crashlytics báo ANR, và Perfetto để nhìn main thread bị chặn ở đâu. Trong dev thì bật `StrictMode` với `penaltyDeath()` để bắt sớm.

</details>

<details>
<summary><b>B5. WorkManager khác gì Service, AlarmManager, và coroutine thường?</b> &middot; <i>Nhiều khả năng</i></summary>

`WorkManager` dành cho việc **phải hoàn thành** dù app bị đóng hay máy khởi động lại — nó ghi vào DB nội bộ và tự retry theo backoff. Không dùng cho việc cần chạy đúng thời điểm.

- **Foreground Service** — việc user thấy được và đang diễn ra (ghi âm, dẫn đường). Android 14 bắt buộc khai `foregroundServiceType`.
- **AlarmManager** — cần đúng thời điểm (báo thức). `setExactAndAllowWhileIdle` cần quyền từ Android 12.
- **coroutine trong viewModelScope** — chỉ sống trong màn hình.

Trong app banking: đồng bộ lại danh sách giao dịch, upload tài liệu eKYC, gửi log audit khi có mạng trở lại — đều là WorkManager với constraint `NetworkType.CONNECTED`.

</details>

<details>
<summary><b>B6. Doze mode và App Standby ảnh hưởng gì đến app ngân hàng?</b> &middot; <i>Ghi điểm thêm</i></summary>

Doze gom network và alarm vào các cửa sổ bảo trì khi máy đứng yên và tắt màn hình; App Standby bucket hoá app theo mức độ dùng, càng ít dùng càng bị siết. Với app ngân hàng, hệ quả thực tế là **thông báo giao dịch bị trễ**.

Cách xử: dùng FCM **high-priority message** — nó xuyên qua Doze. Nhưng phải dùng đúng mục đích (thông báo user thấy ngay), lạm dụng sẽ bị Google hạ ưu tiên. Không đi xin `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` cho việc thường, Play sẽ từ chối.

</details>

<details>
<summary><b>B7. Deep link, App Link, và rủi ro với luồng thanh toán.</b> &middot; <i>Nhiều khả năng</i></summary>

Deep link thường (custom scheme `myapp://`) **bất kỳ app nào cũng đăng ký được** — dễ bị chiếm. Android App Link dùng `https://` + file `assetlinks.json` trên domain để chứng minh sở hữu, hệ điều hành xác minh nên không giả được.

Với app ngân hàng: chỉ dùng App Link đã verify, và **không bao giờ** đặt tham số nhạy cảm (số tiền, tài khoản đích, token) trong link. Link chỉ mang một id tham chiếu, app tự gọi backend lấy chi tiết rồi bắt user xác nhận lại trên màn hình app.

</details>

<details>
<summary><b>B8. Vì sao cần tránh giữ Context sai chỗ? Kể các kiểu leak hay gặp.</b> &middot; <i>Chắc chắn hỏi</i></summary>

Giữ `Activity` context trong object sống lâu (singleton, companion object, static, Handler chờ lâu, listener chưa gỡ) là giữ luôn toàn bộ View tree — leak vài MB mỗi lần xoay màn hình.

- Inner class không static giữ tham chiếu ngầm tới outer Activity.
- `Handler.postDelayed` với delay dài, message còn trong queue.
- Listener/callback đăng ký mà quên gỡ ở `onDestroy`.
- Singleton nhận Activity context qua constructor thay vì `applicationContext`.
- Trong Compose: bắt `LocalContext.current` vào một lambda được nhớ qua `remember` mà không cần thiết.

Công cụ: LeakCanary trong debug build, Memory Profiler với heap dump và "Leaks" tab của Android Studio.

</details>

<details>
<summary><b>B9. Vòng đời Fragment khác Activity ra sao? <code>viewLifecycleOwner</code> để làm gì?</b> &middot; <i>Nhiều khả năng</i></summary>

Fragment có **hai vòng đời**: của chính fragment và của view bên trong nó. Khi fragment vào back stack, view bị huỷ (`onDestroyView`) nhưng object fragment vẫn sống.

Vì vậy khi observe LiveData/Flow để cập nhật view, phải dùng `viewLifecycleOwner` chứ không phải `this`. Dùng sai sẽ có nhiều observer chồng nhau và crash "view is null" khi fragment quay lại.

Kèm theo là leak binding kinh điển: giữ `_binding` mà không gán null trong `onDestroyView`.

</details>

<details>
<summary><b>B10. Multi-screen & density: <code>dp</code>, <code>sp</code>, qualifier, WindowSizeClass — bạn xử lý thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

JD ghi rõ "**Must have**", nên câu này sẽ được đào.

`dp` quy đổi theo density (160dpi = 1dp = 1px). `sp` giống dp nhưng nhân thêm cỡ chữ hệ thống — **mọi text phải dùng sp**, nếu không sẽ hỏng accessibility. Android 14 có non-linear font scaling tới 200%, cần test ở mức đó.

Cách tiếp cận hiện đại: không dùng qualifier `sw600dp` làm nền tảng nữa mà dùng `WindowSizeClass` (Compact / Medium / Expanded) vì nó đúng cả với foldable và multi-window — nơi kích thước cửa sổ khác kích thước màn hình.

```kotlin
when (windowSizeClass.widthSizeClass) {
    Compact  -> SinglePane(...)         // điện thoại dọc
    Medium   -> ListDetailPane(...)     // tablet dọc, foldable mở
    Expanded -> ListDetailPane(showRail = true)
}
```

Kèm theo: ảnh dùng vector drawable để không cần 5 bộ mật độ; test với `adb shell wm density` và `adb shell wm size`; đừng khoá xoay màn hình chỉ để tránh xử lý config change.

</details>
