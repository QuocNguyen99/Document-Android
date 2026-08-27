# Leadership, giao tiếp & tình huống

> Nhóm K · 10 câu

JD dành 7 gạch đầu dòng cho nhóm này — nhiều hơn bất kỳ nhóm kỹ thuật nào. Trả lời theo STAR: Tình huống → Nhiệm vụ → Hành động → Kết quả, mỗi câu 90 giây, và **luôn có con số ở phần kết quả**.

<details>
<summary><b>K1. Kể về một quyết định kiến trúc bạn đưa ra và sau đó thấy là sai.</b> &middot; <i>Chắc chắn hỏi</i></summary>

Câu này kiểm tra sự trung thực và khả năng tự sửa. Đừng chọn một "sai lầm" giả vờ (kiểu "tôi quá cầu toàn").

**Khung trả lời:** nêu quyết định và **lý do lúc đó hợp lý** (cho thấy bạn không tuỳ tiện) → dấu hiệu nào cho thấy nó sai → bạn phát hiện bằng cách nào và mất bao lâu → bạn sửa thế nào mà không dừng sản phẩm → thay đổi gì trong cách ra quyết định sau đó.

**Ví dụ dùng được:** chọn MVI cho toàn bộ app, kể cả màn hình cài đặt. Sáu tháng sau, đội mới vào mất trung bình 2 ngày để thêm một màn hình đơn giản, và số dòng boilerplate gấp ba. Sửa bằng cách giữ MVI cho luồng giao dịch, cho phép MVVM cho màn hình đọc, viết một tài liệu ADR nêu tiêu chí chọn. Bài học rút ra: đừng áp một mẫu đồng nhất khi chi phí không đồng nhất.

</details>

<details>
<summary><b>K2. Bạn coach một engineer yếu hơn thế nào? Kể một trường hợp cụ thể.</b> &middot; <i>Chắc chắn hỏi</i></summary>

JD viết "willing to mentor/coach others" và "enhance our talent pool", nên đây là câu trọng tâm.

**Điều họ muốn nghe:** bạn nâng người khác lên chứ không tự làm hộ. Các chi tiết cụ thể có sức thuyết phục:

- Trong code review, hỏi thay vì ra lệnh: "chuyện gì xảy ra nếu response trả về null ở đây?" thay vì "thêm null check".
- Ghép cặp có mục tiêu: bạn cầm bàn phím lần đầu, họ cầm lần thứ hai cho một task tương tự.
- Giao việc **hơi quá sức** kèm lưới an toàn, không giao việc dễ mãi.
- Tách phản hồi về code khỏi phản hồi về con người, và đưa phản hồi khó riêng tư.
- Có thước đo: sau 3 tháng, người đó tự dẫn được một tính năng và review được PR của người khác.

</details>

<details>
<summary><b>K3. Bạn thuyết phục business hoãn một tính năng để xử lý nợ kỹ thuật thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Nguyên tắc: **không dùng từ ngữ kỹ thuật**. Business không mua "kiến trúc sạch", họ mua giảm rủi ro và tăng tốc độ.

Cấu trúc lập luận:

1. Nêu chi phí hiện tại bằng con số họ quan tâm: "mỗi tính năng mới mất thêm 1 tuần hồi quy thủ công; quý vừa rồi là 6 tuần công."
2. Nêu rủi ro bằng ngôn ngữ của họ: "phiên bản thư viện này không còn được vá bảo mật; nếu có CVE, chúng ta không thể phát hành nhanh."
3. Đưa lựa chọn chứ không đưa tối hậu thư: làm ngay 3 tuần, làm dần trong 2 quý, hoặc không làm và chấp nhận rủi ro X. Nêu rõ đề xuất của bạn.
4. Cam kết đo lường: "sau đó tôi sẽ báo cáo lại thời gian phát hành và tỉ lệ lỗi để chúng ta biết có đáng không."

Và nói thêm điều quan trọng: quyết định cuối cùng là của họ. Vai trò của bạn là làm rõ đánh đổi, không phải ép.

</details>

<details>
<summary><b>K4. Bạn xử lý bất đồng kỹ thuật với một đồng nghiệp ngang cấp thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

Khung nên nói: tách **sự thật** khỏi **sở thích**. Phần lớn tranh cãi kiến trúc là sở thích được nguỵ trang thành nguyên tắc.

- Viết ra tiêu chí quyết định **trước** khi bàn giải pháp (thời gian build, độ khó cho người mới, khả năng test, rủi ro).
- Nếu bất đồng vẫn còn: làm spike nhỏ, có số liệu, hết một khung thời gian định trước.
- Nếu vẫn không xong: đưa lên người quyết định, trình bày **cả hai** phương án một cách công bằng.
- Sau khi có quyết định: "disagree and commit" — thực hiện tử tế, không phá ngầm.
- Ghi lại vào ADR để 6 tháng sau không tranh cãi lại từ đầu.

</details>

<details>
<summary><b>K5. Kể về một sự cố production bạn xử lý.</b> &middot; <i>Chắc chắn hỏi</i></summary>

Cấu trúc: phát hiện thế nào (ai báo, sau bao lâu) → giảm thiểu trước hay tìm nguyên nhân trước (đáp án đúng: giảm thiểu trước) → bạn làm gì cụ thể → thời gian khôi phục → phân tích sau sự cố và thay đổi lâu dài.

Chi tiết làm câu trả lời đáng tin: bạn **đã liên lạc với ai** trong lúc đó. Sự cố ở ngân hàng cần thông báo cho tổng đài (họ sẽ nhận cuộc gọi), cho vận hành, cho lãnh đạo. Ứng viên chỉ kể phần kỹ thuật thường bị đánh giá là chưa từng chịu trách nhiệm thật.

Kết bằng một thay đổi hệ thống, không phải "chúng tôi cẩn thận hơn": thêm kill switch, thêm cảnh báo, thêm test hồi quy, đổi quy trình phát hành.

</details>

<details>
<summary><b>K6. Bạn giải thích một vấn đề kỹ thuật phức tạp cho người không kỹ thuật thế nào?</b> &middot; <i>Chắc chắn hỏi</i></summary>

JD ghi "ability to translate technical talk to the business". Nhiều khả năng họ sẽ **bắt bạn làm luôn tại chỗ** chứ không chỉ hỏi lý thuyết. Chuẩn bị sẵn một chủ đề.

Công thức: bắt đầu bằng **ảnh hưởng**, không bằng cơ chế → dùng một phép so sánh từ đời sống của họ → chỉ đưa chi tiết khi được hỏi → kết bằng quyết định cần ra.

**Ví dụ — certificate pinning:** "App của chúng ta ghi nhớ sẵn 'chữ ký' của máy chủ ngân hàng, giống như bạn nhận ra giọng người thân qua điện thoại. Nếu ai đó chen vào giữa để nghe lén, app nhận ra ngay và ngắt kết nối. Đánh đổi: khi ngân hàng đổi chữ ký mà app chưa biết trước, app sẽ từ chối kết nối — nên chúng ta cần một quy trình phối hợp trước mỗi lần đổi. Việc cần anh chị quyết là ai chịu trách nhiệm báo trước 30 ngày."

</details>

<details>
<summary><b>K7. Bạn thiết lập tiêu chuẩn kỹ thuật cho một đội mà bạn không phải quản lý trực tiếp thế nào?</b> &middot; <i>Nhiều khả năng</i></summary>

JD gọi vai trò này là "custodian of design and engineering best practices" — tức ảnh hưởng không quyền hạn.

- **Tự động hoá thay vì nhắc nhở** — lint, detekt, danger, convention plugin. Luật nằm trong CI thì không phải tranh cãi mỗi PR.
- **Làm mẫu trước** — viết module tham chiếu để người ta sao chép, thay vì viết tài liệu bảo người ta làm.
- **Lôi kéo người có ảnh hưởng** trong từng đội tham gia soạn tiêu chuẩn, để nó là của chung.
- **Giải thích lý do** — mỗi luật kèm một dòng vì sao; luật không có lý do sẽ bị bỏ qua.
- **Cho phép ngoại lệ có ghi chép** — cấm tuyệt đối sẽ tạo ra việc lách ngầm.

</details>

<details>
<summary><b>K8. Bạn ước lượng thời gian cho một tính năng lớn thế nào? Làm gì khi trễ?</b> &middot; <i>Nhiều khả năng</i></summary>

Ước lượng: chia nhỏ tới mức 1–3 ngày; ước lượng theo khoảng chứ không một con số; tách riêng phần **chưa biết** và đề xuất spike để giảm bất định trước khi cam kết; cộng thêm phần thường bị quên (test, review, hồi quy, phát hành, phê duyệt bảo mật ở ngân hàng thường mất cả tuần).

Khi trễ: báo **sớm**, ngay khi biết chứ không đợi tới hạn. Kèm theo ba thứ: nguyên nhân, ngày dự kiến mới, và các lựa chọn (cắt phạm vi, thêm người — nói rõ thêm người thường làm chậm hơn, hoặc dời hạn).

Ý ghi điểm: theo dõi độ chính xác ước lượng của chính mình theo thời gian để lần sau ước lượng tốt hơn — rất ít người làm việc này.

</details>

<details>
<summary><b>K9. Vì sao bạn rời công ty hiện tại, và vì sao là chỗ này?</b> &middot; <i>Chắc chắn hỏi</i></summary>

Không nói xấu công ty cũ — dù có lý. Người nghe sẽ tự hỏi sau này bạn nói gì về họ.

Khung: nói về thứ bạn **muốn tiến tới**, không phải thứ bạn chạy khỏi. Gắn với JD một cách cụ thể chứ không chung chung:

*"Ở chỗ hiện tại tôi đã đưa app từ X đến Y, nhưng phần kiến trúc đã ổn định và phần dẫn dắt kỹ thuật chỉ giới hạn trong đội của tôi. JD này có hai thứ tôi đang tìm: một là quy mô ràng buộc thật — ngân hàng, xuyên biên giới, yêu cầu bảo mật và tuân thủ cao, đây là loại bài toán khó theo cách tôi thích; hai là vai trò định hướng kiến trúc cho nhiều đội chứ không chỉ viết code cho một đội. Tôi cũng muốn học KMP một cách nghiêm túc trong môi trường có cả Android và iOS."*

Chuẩn bị sẵn **một câu hỏi lại** để biến nó thành đối thoại.

</details>

<details>
<summary><b>K10. Bạn cập nhật kiến thức bằng cách nào?</b> &middot; <i>Nhiều khả năng</i></summary>

Câu này dễ trả lời nhạt. Cách làm nó có sức nặng là nói về **hệ thống**, không phải danh sách nguồn.

Có thể nói thật về kho tài liệu của bạn: "tôi duy trì một kho ghi chú kỹ thuật cá nhân, hiện khoảng 350 bài, tổ chức theo chủ đề từ nền tảng CS tới Android — mỗi khi học gì tôi viết lại bằng lời của mình, vì viết được mới là hiểu." Đây là bằng chứng cụ thể, hiếm ứng viên có.

Kèm theo: nguồn ưu tiên (Android Developers Blog, release note của AndroidX, Now in Android, KotlinConf), cách chọn lọc (không chạy theo mọi thư viện mới, chờ nó ổn định), và cách lan toả (chia sẻ nội bộ, viết ADR).

</details>
