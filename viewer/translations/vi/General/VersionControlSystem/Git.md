# Đã phân phối Version Control System Git

Git là Version Control System (DVCS) được phân phối được tạo ra vào năm 2005 và đã trở thành một trong những hệ thống kiểm soát phiên bản phân tán phổ biến nhất hiện nay. Git cung cấp cho các nhà phát triển một kho lưu trữ riêng chứa toàn bộ lịch sử thay đổi.

## Nền tảng dựa trên Git

### GitHub
GitHub là một nền tảng để quản lý kho Git. Nó cung cấp giao diện dựa trên web cùng với các tính năng chuyên dụng giúp process sử dụng Git dễ dàng và hiệu quả hơn. GitHub đặc biệt được biết đến với các công cụ cộng tác, chẳng hạn như yêu cầu kéo, đánh giá mã và theo dõi vấn đề tích hợp. Nó cũng cung cấp các quy trình tích hợp và triển khai liên tục (CI/CD). Là một dịch vụ được lưu trữ, GitHub xử lý việc bảo trì và bảo mật cơ sở hạ tầng, cho phép người dùng chỉ tập trung vào các dự án của họ.

### Gitlab

GitLab là một công cụ để quản lý kho Git. Nó cung cấp cho người dùng giao diện web và các tính năng chuyên dụng để tạo điều kiện thuận lợi cho việc sử dụng process. Một tính năng khác biệt của GitLab là người dùng có thể tải xuống và cài đặt hệ thống trên máy chủ của riêng họ (tự lưu trữ). Khả năng này làm cho GitLab trở thành lựa chọn phổ biến của các tổ chức cần đảm bảo tốc độ kết nối và thực thi các chính sách bảo mật trong framework của riêng họ. GitLab cũng cung cấp các đường dẫn CI/CD tích hợp, theo dõi vấn đề và nhiều công cụ cộng tác khác nhau.

### Bitbucket

Bitbucket, được phát triển bởi Atlassian, là một dịch vụ quản lý kho lưu trữ dựa trên Git khác. Nó cung cấp cả tùy chọn lưu trữ trên đám mây và tự lưu trữ (Máy chủ Bitbucket). Bitbucket được biết đến với khả năng tích hợp chặt chẽ với các sản phẩm Atlassian khác như Jira, giúp nâng cao khả năng theo dõi và quản lý dự án. Bitbucket cũng cung cấp các tính năng như yêu cầu kéo, nhận xét nội tuyến để đánh giá mã và các công cụ CI/CD mạnh mẽ thông qua Đường ống Bitbucket.

### Gitea

Gitea là một dịch vụ Git tự lưu trữ, mã nguồn mở. Nó nhằm mục đích cung cấp một giải pháp dễ sử dụng, nhẹ và khép kín để quản lý kho Git. Gitea được biết đến nhờ tính đơn giản trong cài đặt và yêu cầu tài nguyên thấp, khiến nó phù hợp với các nhóm nhỏ hoặc nhà phát triển cá nhân muốn lưu trữ kho lưu trữ của riêng họ mà không cần dựa vào các dịch vụ bên ngoài. Gitea cung cấp một loạt tính năng bao gồm giao diện web, theo dõi sự cố và tích hợp CI/CD.


### Chiến lược phân nhánh

Chiến lược phân nhánh trong Git là một bộ quy tắc mà các nhà phát triển phải tuân theo để theo dõi và kiểm soát chặt chẽ các thay đổi, đồng thời giảm thiểu xung đột trong source code khi phát triển đồng thời nhiều tính năng. Cụ thể, các nhánh được sử dụng làm không gian làm việc riêng biệt cho phép nhà phát triển phát triển nhiều tính năng khác nhau (cập nhật, sửa lỗi, nâng cấp) trên cùng một cơ sở mã. Các nhánh này thường được tạo từ một nhánh chính và được sáp nhập lại vào nhánh chính sau khi quá trình phát triển hoàn tất. Các nhánh chính được bảo vệ và phải được trưởng nhóm hoặc quản trị viên source code phê duyệt trước khi thực hiện bất kỳ thay đổi nào.

Hiện nay có rất nhiều Chiến lược phân nhánh phổ biến như GitFlow, GitLab Flow, GitHub Flow và phát triển dựa trên Trunk. Trong số này, GitFlow được coi là phương pháp phổ biến và dễ tiếp cận nhất, cung cấp cho người dùng khả năng tùy biến cao phù hợp với các tổ chức công nghệ quy mô lớn.

### Phiên bản gắn thẻ

Gắn thẻ phiên bản là cách gán số phiên bản cho mỗi lần triển khai phần mềm để ghi lại lịch sử phát triển của phần mềm, bao gồm cả những thay đổi trong một phiên bản cụ thể. Việc gắn thẻ cũng hỗ trợ khôi phục phần mềm về phiên bản trước một cách nhanh chóng và thuận tiện trong trường hợp có vấn đề.

Trong Git, thẻ là một chức năng đặt tên đơn giản cho phép chúng ta xác định rõ ràng các phiên bản của source code. Chúng ta có thể coi thẻ là một nhánh immutable. Sau khi nó được tạo (được liên kết với một cam kết cụ thể), chúng tôi không thể thay đổi lịch sử cam kết nữa.

### Quy trình làm việc

kho lưu trữ cục bộ của bạn bao gồm ba "cây" được duy trì bởi git. cái đầu tiên là `Working Directory` chứa các tệp thực tế. cái thứ hai là `Index` hoạt động như một khu vực tổ chức và cuối cùng là `HEAD` trỏ đến cam kết cuối cùng mà bạn đã thực hiện.

![văn bản thay thế](image.png)

## Quy tắc chung về Git

### Quy tắc tổ chức phân nhánh Source Code
Một ứng dụng source code được tạo trên GitLab sẽ có một nhánh mặc định có tên là Master và các nhánh phát triển có tên là Feature. Dựa trên các Chiến lược phân nhánh khác nhau, các tổ chức sẽ lựa chọn và điều chỉnh các chiến lược này để phù hợp với các hướng dẫn và quy định của riêng họ.

Sacombank triển khai quản lý source code dựa trên phương pháp GitFlow. Cụ thể:

- Các nhánh tồn tại lâu dài: Các nhánh được triển khai và duy trì trên một môi trường cụ thể.

    - master: Đây là nhánh mặc định của source code. Nhánh chính được sử dụng để triển khai và duy trì môi trường sản xuất.
    - uat: Nhánh này chứa source code được triển khai và duy trì trong môi trường UAT (Kiểm tra chấp nhận người dùng), cho phép phát triển đồng thời nhiều tính năng. Môi trường UAT được sử dụng cho các đơn vị kinh doanh và kỹ thuật (QC, Bảo mật thông tin, v.v.) tham gia thử nghiệm và nghiệm thu.
    - phát triển: Tương tự như nhánh UAT, nhưng nhánh phát triển được triển khai và duy trì trong môi trường phát triển (dev) hoặc thử nghiệm tích hợp hệ thống (SIT). Môi trường phát triển được sử dụng để các nhà phát triển thử nghiệm các tính năng, cho phép các cam kết và hợp nhất liên tục.
- Nhánh tồn tại trong thời gian ngắn: Các nhánh này được tạo từ nhánh chính khi phát triển hoặc điều chỉnh tính năng. Các nhánh này thường được khởi chạy trong môi trường cục bộ hoặc hộp cát của nhà phát triển.

    - feature_*: Các nhánh chứa source code để phát triển tính năng mới.
    - hotfix_*: Các nhánh chứa source code để sửa lỗi ứng dụng.
- Nhánh tạm thời: Các nhánh tạm thời được tạo từ các nhánh tồn tại lâu dài để tạo điều kiện thuận lợi cho việc hợp nhất và giải quyết xung đột source code khi nhiều tính năng đang được điều chỉnh trong cùng một source code. Các tổ chức lớn thường khuyến nghị luôn có một nhánh tạm thời cho mỗi yêu cầu hợp nhất đối với các nhánh tồn tại lâu dài.

    - temp_: Được tạo từ các nhánh phát triển hoặc UAT. Các nhà phát triển hợp nhất source code từ nhánh tính năng vào nhánh temp_ để xử lý xung đột. Sau khi giải quyết xung đột, mã sẽ được hợp nhất từ ​​nhánh temp_* sang nhánh tồn tại lâu dài tương ứng (develop hoặc UAT).
    - Release_: Được tạo từ nhánh chính khi cần phát hành vào sản xuất. Các nhánh Release_ có thể được hợp nhất từ ​​nhiều nhánh feature_* và hotfix_*.

### Quy tắc đặt tên chi nhánh

Tên của các nhánh tồn tại trong thời gian ngắn và tạm thời bao gồm ba thành phần: Prefix_ID_Description. Chi tiết như sau:

- Ba thành phần cách nhau bởi dấu gạch dưới “_”. Nội dung trong mỗi thành phần được phân tách bằng dấu gạch ngang "-".
- Tiền tố là tiền tố xác định loại chức năng chi nhánh theo **Source Code Quy tắc tổ chức phân nhánh**.
- ID là số tăng dần (thời gian tạo được định dạng là YYYYMMDDHHMI, số thẻ hoặc mã ID từ hệ thống quản lý vé). Ví dụ: trong Helpdesk, nó sẽ là HEL-123456 và trong Jira, nó sẽ là JIRA-123.
- Description là phần mô tả ngắn gọn về chức năng của chi nhánh.

1. **Cành sống lâu**:
    - Nhánh cho môi trường Production (mặc định): master.
    - Nhánh cho môi trường UAT: uat.
    - Nhánh cho môi trường DEV: phát triển.
2. **Các nhánh ngắn hạn/nhánh đặc trưng**:
    - Các nhánh tính năng: feature_<ID>_<Description>.
    - Nhánh sửa lỗi: hotfix_<ID>_<Description>.
3. **Chi nhánh tạm thời**:
   - Nhánh tạm thời để gộp vào nhánh develop và uat: temp_<ID>_<Description>.
   - Các nhánh tạm thời để sáp nhập vào nhánh chính: Release_<ID>_<Description>.

#### Tóm tắt cách đặt tên chi nhánh:

| Tên chi nhánh| Môi trường |    Loại | Nhánh mẹ|Chi nhánh được phép sáp nhập vào|
|-------------|---------------|-------------|--------------|--------------------------------|
| chủ | Sản xuất | Sống lâu | chủ | phát hành_ |
| ua | UAT | Sống lâu | chủ | tạm thời_ |
| phát triển | Phát triển/SIT | Sống lâu | chủ | tạm thời_ |
| tính năng_ | Ngắn ngủi | chủ | tạm thời_ |                                |
| hotfix_ | Ngắn ngủi | chủ | tạm thời_ |                                |
| phát hành_ | Dàn dựng | Tạm thời | chủ | feature_, hotfix_ |
| tạm thời_ | Tạm thời | phát triển, uat| feature_, hotfix_ |                          |

### Quy tắc tạo và gắn thẻ phiên bản cho Source Code

- **Định dạng phiên bản**:
Một phiên bản bao gồm bốn thành phần chính: Major.Minor.Patch-Postfix. Cụ thể:
    - Major, Minor, Patch là các số nguyên dương tăng dần và bắt đầu từ 0.
    - Postfix bao gồm các hậu tố để phân biệt các phiên bản giữa các môi trường như develop, uat, Release, master.
- **Quy tắc gia tăng cho việc gắn thẻ phiên bản**:
Việc gắn thẻ phiên bản phải tuân theo các quy tắc gia tăng sau:

    - **Major**: Đây là số phiên bản chính. Số Chính tăng lên khi có những thay đổi đáng kể đối với source code (ví dụ: nâng cấp thư viện, thay đổi nền tảng). Đối với các dịch vụ web và API, những thay đổi khiến chức năng của phiên bản mới không tương thích với phiên bản cũ cũng được coi là những thay đổi lớn.
    - **Minor**: Đây là số phiên bản phụ. Số Minor tăng lên khi các tính năng mới được thêm vào hoặc các tính năng hiện có được điều chỉnh, miễn là chúng vẫn tương thích với các phiên bản trước.
    - **Patch**: Đây là số phiên bản của bản vá. Số Patch tăng lên khi có những điều chỉnh liên quan đến sửa lỗi hoặc sửa lỗi bảo mật.
        - Khi số **Minor** tăng thì số Patch sẽ đặt lại về 0.
        - Khi số **Chính** tăng lên thì cả số Phụ và số Bản vá sẽ đặt lại về 0.

- **Quy tắc gắn thẻ phiên bản**:
Gắn thẻ phiên bản khi phát hành phiên bản mới vào môi trường Sản xuất là bắt buộc. Trong DevSecOps tự động hóa process, việc gắn thẻ phiên bản cho source code có thể được thực hiện thủ công hoặc tự động, tùy thuộc vào nhu cầu của nhóm phát triển hoặc dự án.


> [!NOTE]  
> - Các nhánh develop và uat cần được đồng bộ thường xuyên từ nhánh master (trưởng nhóm nên thường xuyên xóa/sao lưu và tạo các nhánh uat và develop mới từ nhánh master).
> - Các nhánh tạm thời phải bị xóa sau khi sáp nhập vào các nhánh tồn tại lâu dài.

### Quy tắc bảo vệ nhánh và phiên bản:

Trưởng nhóm phát triển chịu trách nhiệm thiết lập cấu hình để bảo vệ các nhánh và phiên bản quan trọng. Cụ thể:

- Thiết lập các nhánh được bảo vệ cho các nhánh tồn tại lâu dài. Điều chỉnh chỉ được phép thông qua Yêu cầu Hợp nhất.
- Thiết lập Protected Tag cho các tag có hậu tố “master”. Chỉ Người bảo trì nguồn và công cụ Jenkins mới được phép tạo hoặc xóa các thẻ này.