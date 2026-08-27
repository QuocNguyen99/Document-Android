# Hiệu năng & bộ nhớ

> Nhóm G · 10 câu

JD ghi thẳng "experience in memory and performance solving". Câu trả lời phải có **quy trình đo** và **con số**, không phải danh sách mẹo.

<details>
<summary><b>G1. App khởi động chậm. Quy trình chẩn đoán của bạn?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Trước hết phân loại: **cold start** (process chưa có), **warm** (process còn, Activity mất), **hot** (chỉ đưa lên foreground). Chỉ cold start mới đáng tối ưu, và Play Console báo riêng chỉ số này.

1. **Đo** — `adb shell am start -W` cho số thô; Macrobenchmark `StartupTimingMetric` cho số ổn định lặp lại được; Play Console vitals cho số thật của user.
2. **Truy vết** — Perfetto/System trace để thấy main thread làm gì trong khoảng đó. Thường thấy: khởi tạo SDK trong `Application.onCreate`, đọc SharedPreferences đồng bộ, dựng Dagger graph quá lớn, inflate layout nặng.
3. **Sửa** — hoãn khởi tạo bằng App Startup hoặc lazy; đưa I/O ra khỏi main; giảm số SDK chạy sớm; bỏ splash tự chế, dùng `SplashScreen` API.
4. **Baseline Profile** — thường giảm 20–30% cold start vì AOT-compile sẵn đường code khởi động. Đây là thứ dễ làm mà hiệu quả lớn nhất hiện nay.
5. **Chốt lại** — thêm benchmark vào CI để không bị hồi quy.

Chuẩn bị sẵn một con số thật từ dự án cũ: "giảm từ 2,4s xuống 1,3s p90" mạnh hơn mọi lý thuyết.

</details>

<details>
<summary><b>G2. Baseline Profile là gì, hoạt động thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

Là danh sách các hàm nóng, đóng gói cùng app. Lúc cài đặt, ART dùng nó để biên dịch trước (AOT) những hàm đó thay vì chờ JIT làm nóng dần. Kết quả: lần chạy đầu đã nhanh như lần thứ mười.

Sinh bằng module `:baseline-profile` với Macrobenchmark, chạy một kịch bản tiêu biểu (mở app → đăng nhập → cuộn danh sách giao dịch), rồi commit file sinh ra.

Cần nhớ: phải **sinh lại** khi luồng chính đổi nhiều, nếu không nó lệch và hết tác dụng. Và nên đo trước/sau, đừng tin mặc định.

</details>

<details>
<summary><b>G3. Jank là gì? Bạn tìm và sửa thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Jank là frame vượt quá ngân sách (16,6ms ở 60Hz, 8,3ms ở 120Hz). Chỉ số cần nói: **p90/p99 frame duration**, không phải trung bình — trung bình luôn đẹp trong khi user vẫn thấy giật.

Công cụ: `FrameMetrics`/JankStats trong app thật, Macrobenchmark `FrameTimingMetric` trong lab, Perfetto để nhìn frame nào chậm ở phase nào.

Nguyên nhân hay gặp trong Compose: recomposition thừa do state không stable, đọc state ở composition thay vì layout/draw, `LazyColumn` thiếu key, cấp phát object trong khối vẽ, ảnh chưa được resize trước khi hiển thị.

</details>

<details>
<summary><b>G4. Tìm memory leak: quy trình và công cụ.</b> &middot; <i>Chắc chắn hỏi</i></summary>

LeakCanary trong debug: nó tự chụp heap khi phát hiện object đáng lẽ phải chết mà còn sống, rồi in ra **chuỗi tham chiếu** — đọc chuỗi đó là biết ai giữ.

Khi cần sâu hơn: Memory Profiler của Android Studio, chụp heap dump, so sánh hai lần chụp trước/sau khi lặp một thao tác 10 lần. Nếu số instance của một Activity tăng đều theo số lần lặp thì đó là leak.

Sửa: cắt tham chiếu (dùng `applicationContext`, gỡ listener trong `onDestroy`, huỷ coroutine đúng scope, `WeakReference` khi thật cần).

Ở quy mô đội, thêm: chạy LeakCanary trong instrumentation test để leak bị bắt ở CI chứ không phải khi user báo OOM.

</details>

<details>
<summary><b>G5. OOM crash trên máy cấu hình thấp: nguyên nhân và cách xử lý.</b> &middot; <i>Nhiều khả năng</i></summary>

Thủ phạm số một là **bitmap**: một ảnh 4000×3000 ARGB_8888 chiếm 48MB, trong khi heap của app có thể chỉ 128–256MB. Ảnh chụp giấy tờ trong luồng eKYC là nơi hay nổ nhất.

- Dùng Coil/Glide và luôn chỉ định kích thước đích, để nó tự downsample (`inSampleSize`).
- Nén và resize ảnh eKYC trước khi giữ trong bộ nhớ, xử lý theo luồng chứ không nạp cả file.
- Coi chừng cache tự viết không có giới hạn — dùng `LruCache` tính theo byte.
- Không bật `largeHeap` để né vấn đề; nó chỉ trì hoãn và làm GC lâu hơn.
- Theo dõi bằng `onTrimMemory` và giải phóng cache khi hệ thống báo thiếu.

</details>

<details>
<summary><b>G6. Giảm kích thước APK/AAB: bạn làm những gì?</b> &middot; <i>Nhiều khả năng</i></summary>

- Phát hành AAB — Play tự tạo bản tách theo ABI, mật độ, ngôn ngữ.
- Bật `minifyEnabled` + `shrinkResources`; kiểm bằng APK Analyzer xem cái gì to.
- Vector drawable thay PNG nhiều mật độ; WebP cho ảnh thật.
- Cắt SDK không dùng — thường vài SDK marketing chiếm phần lớn.
- Dynamic Feature Module cho phần ít dùng (ví dụ mở tài khoản mới, đầu tư).
- `resConfigs` giới hạn ngôn ngữ nếu chỉ phát hành vài thị trường.

Nói được lý do quan tâm: ở nhiều thị trường châu Á, kích thước app ảnh hưởng trực tiếp tới tỉ lệ cài đặt thành công trên mạng 3G và máy sắp đầy bộ nhớ. Gắn kỹ thuật với kinh doanh luôn ghi điểm.

</details>

<details>
<summary><b>G7. StrictMode dùng để làm gì?</b> &middot; <i>Nhiều khả năng</i></summary>

```kotlin
if (BuildConfig.DEBUG) {
    StrictMode.setThreadPolicy(ThreadPolicy.Builder()
        .detectDiskReads().detectDiskWrites().detectNetwork()
        .penaltyLog().build())
    StrictMode.setVmPolicy(VmPolicy.Builder()
        .detectLeakedClosableObjects()
        .detectActivityLeaks()
        .detectLeakedSqlLiteObjects()
        .penaltyLog().build())
}
```

Nó bắt I/O trên main thread, Cursor/Closeable chưa đóng, leak Activity — tức là bắt ANR và leak **trước khi** chúng thành sự cố. Chỉ bật ở debug, và nên bật `penaltyDeath()` trong CI để lỗi không bị bỏ qua.

</details>

<details>
<summary><b>G8. Macrobenchmark và Microbenchmark khác nhau ở đâu?</b> &middot; <i>Ghi điểm thêm</i></summary>

**Microbenchmark** đo một hàm, chạy trong process của app, hợp cho thuật toán hoặc parser. **Macrobenchmark** đo trải nghiệm ở cấp app từ một process riêng — startup, scroll, chuyển màn hình — và cho các chỉ số như `StartupTimingMetric`, `FrameTimingMetric`.

Quan trọng: benchmark phải chạy trên **bản release** (hoặc `benchmark` build type), trên **thiết bị thật**, đã tắt animation và khoá tần số CPU nếu có thể — nếu không thì số vô nghĩa.

</details>

<details>
<summary><b>G9. Tiêu thụ pin và dữ liệu mạng: bạn tối ưu thế nào?</b> &middot; <i>Ghi điểm thêm</i></summary>

- Gom request thay vì gọi rải rác; dùng WorkManager để hệ thống gom vào cửa sổ chung.
- Bật nén (gzip/brotli) và cache HTTP đúng chuẩn; dùng `ETag` để tránh tải lại sao kê không đổi.
- Tránh polling — dùng FCM đẩy khi có giao dịch mới.
- Giảm wakelock, không dùng alarm exact khi không cần.
- Đo bằng Battery Historian và Network Profiler; Play Console có báo cáo excessive wakeups.

</details>

<details>
<summary><b>G10. Một màn hình danh sách giao dịch bị giật khi cuộn. Bạn đi từ đâu?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Đây là câu tình huống, họ muốn nghe **trình tự**:

1. Tái hiện trên máy yếu, bản release, có dữ liệu thật (1000+ item) — không debug trên flagship.
2. Đo trước: JankStats hoặc Macrobenchmark scroll, ghi lại p99.
3. Perfetto trace một lần cuộn, xem frame chậm nằm ở composition, layout hay draw.
4. Giả thuyết theo thứ tự xác suất: thiếu `key` → state không stable gây recompose cả danh sách → format tiền/ngày làm trong composable (nên nhớ sẵn hoặc tính ở ViewModel) → ảnh avatar chưa resize → truy vấn DB chạy trên main.
5. Sửa từng cái một, đo lại sau mỗi lần — không sửa gộp rồi đoán cái nào có tác dụng.
6. Chốt bằng benchmark trong CI.

Nhấn mạnh "đo trước, đo sau, mỗi lần một thay đổi" — đó chính là thứ họ muốn nghe từ một senior.

</details>
