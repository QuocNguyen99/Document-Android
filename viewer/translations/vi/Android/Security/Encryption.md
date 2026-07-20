#Encryption

## Khái niệm cơ bản về định nghĩa mật mã

Cách hiệu quả nhất để đạt được bảo mật dữ liệu.

Để đọc dữ liệu được mã hóa, bạn phải có quyền truy cập vào khóa bí mật hoặc mật khẩu cho phép bạn giải mã dữ liệu đó.
Dữ liệu không được mã hóa được gọi là dữ liệu thuần túy (văn bản thuần túy), dữ liệu được mã hóa được gọi là dữ liệu mật mã (văn bản mật mã).


![](../../resources/encrypt1.webp)


Nhìn chung encryption hoạt động như sau:

Bạn có dữ liệu đơn giản, đó có thể là một số thông tin nhạy cảm (chẳng hạn như thông tin cuộc sống cá nhân,
chi tiết về sức khỏe thể chất hoặc tinh thần, tội phạm hình sự hoặc dân sự, 
ảnh riêng tư, tài liệu người dùng riêng tư, v.v.),
thông tin tài chính (như tài khoản, giao dịch, báo cáo, thông tin thẻ tín dụng, v.v.)
và tất nhiên thông tin đăng nhập (tên người dùng, mật khẩu, mã pin cảm ứng, dữ liệu vân tay,
và tất cả những thứ khác có thể cung cấp quyền truy cập vào dữ liệu ở trên).

Sau đó, **dựa vào một số thuật toán**, bạn sẽ tạo một khóa đặc biệt và sử dụng nó để tạo **dữ liệu mật mã** (văn bản mật mã).


Ví dụ: một thuật toán đơn giản - thay đổi mọi ký hiệu trong từ bằng một thứ gì đó. Và một chìa khóa - thứ gì đó tương đương với ký hiệu tiếp theo trong bảng chữ cái:

Thuật toán: thay đổi mọi ký hiệu trong word bằng một cái gì đó
Chìa khóa: cái gì đó bằng với ký hiệu tiếp theo trong bảng chữ cái
Dữ liệu thuần túy (Đầu vào): "Xin chào thế giới"
Dữ liệu mật mã (Đầu ra): "ifmmp xpsme"
Mặt nạ biểu tượng:
```
    h -> i
    e -> f
    l -> m
    o -> p
    w -> x
    r -> s
    d -> e
```

Tất nhiên mọi thứ hoạt động ngược lại, nếu bạn có dữ liệu mật mã, 
bạn biết thuật toán và có khóa, bạn sẽ có được dữ liệu gốc một cách dễ dàng.

## Các loại thuật toán

Ở trên, chúng ta đã thấy một ví dụ rất cơ bản về encryption. 
Ngày nay các thuật toán phức tạp hơn và được phân tách theo đối xứng và bất đối xứng 
(còn có Hàm băm không yêu cầu khóa và sẽ không được xem xét trong bài viết này).

**Đối xứng** — kỹ thuật lâu đời nhất và nổi tiếng nhất. Khóa encryption và khóa giải mã giống nhau. 
Ngoài ra, nó thường được phân loại là Mật mã luồng hoặc Mật mã khối.

AES đối xứng phổ biến nhất - Tiêu chuẩn Encryption nâng cao (AES)
là thuật toán được Chính phủ Hoa Kỳ và nhiều tổ chức tin cậy làm tiêu chuẩn.

Bất đối xứng - một nhánh hiện đại của mật mã. Còn được gọi là mật mã khóa công khai, trong đó các thuật toán 
sử dụng một cặp khóa (khóa chung và khóa riêng) và sử dụng thành phần khác của cặp 
cho các bước khác nhau của thuật toán.

Thuật toán bất đối xứng phổ biến nhất là RSA - thuật toán encryption khóa công khai và 
tiêu chuẩn để mã hóa dữ liệu được gửi qua internet.


Mật mã luồng:

Mật mã luồng là một giải pháp mã hóa hóa thuật thuật được xử lý dữ liệu theo từng bit hoặc từng byte theo cách tuần tự,
sử dụng một khóa để tạo ngẫu nhiên mã hóa dữ liệu hoặc thông tin văn bản dữ liệu thông thường.
Nói một cách đơn giản, truyền mã hóa hóa dữ liệu theo từng phần nhỏ (bit hoặc byte) theo cách tự động.
Mỗi phần nhỏ này được xử lý bằng cách kết hợp với từ khóa thông tin để tạo ngẫu nhiên mã hóa dữ liệu hoặc thông tin văn bản dữ liệu thông thường.

Mật mã khối:

Block cipher là một hoạt động xác định thuật toán thuật toán trên các bit cố định độ dài của nhóm, được gọi là các khối.
Block cipher là một thành phần cơ bản quan trọng trong thiết kế của nhiều giao thức mã hóa học và được sử dụng rộng rãi để phát triển mã hóa dữ liệu lớn.
Đơn giản thôi, block cipher là một hoạt động mã hóa hóa thuật toán thuật toán trên các bit cố định của nhóm, được gọi là các khối.
Mỗi khối này được xử lý bằng cách sử dụng một phần của khóa để tạo ra mã hóa dữ liệu.
Tóm lại, cả hai loại mật mã đều là các phương pháp mã hóa thông tin, nhưng chúng có cách thức hoạt động và ứng dụng khác nhau,
phù hợp với các ứng dụng và mục đích sử dụng khác nhau trong lĩnh vực mã hóa học.


## Chế độ & Phần đệm

Mật mã khối có các Chế độ và Phần đệm khác nhau giúp tăng mức độ bảo vệ.

### Các chế độ:

Trong lĩnh vực mật mã học, "chế độ" (chế độ) thường xuyên chỉ cách thức mà một thuật toán 
mã hóa được áp dụng vào đầu vào dữ liệu để tạo đầu ra mã hóa dữ liệu

Dưới đây là một số biến phổ chế độ:

- ECB (Sách mã điện tử)
- CBC (Chuỗi khối mật mã)
- CFB (Phản hồi mật mã)
- OFB (Phản hồi đầu ra)
- CTR (Bộ đếm)

Chế độ này thường được kết hợp với khối mã hóa thuật toán như AES hoặc DES để tạo ra kết quả hiệu ứng mã hóa hệ thống và toàn bộ.

### Đệm:
là cách thức mà dữ liệu được bổ sung (đệm) hoặc điều chỉnh trước khi mã hóa để đảm bảo rằng
độ dài của đầu dữ liệu phù hợp với khối kích thước của mã hóa thuật toán. 

Mã khối hoạt động trên các đơn vị có kích thước cố định (được gọi là kích thước khối), nhưng thông điệp có nhiều độ dài khác nhau.
Vì vậy, một số chế độ (cụ thể là ECB và CBC) yêu cầu khối cuối cùng phải được đệm trước encryption.

## Các loại khóa:

Có ba loại khóa: Khóa bí mật, Khóa riêng và Khóa chung.

Khóa bí mật - một khóa bí mật duy nhất được sử dụng trong encryption đối xứng thông thường để mã hóa và giải mã tin nhắn.

Khóa riêng - thành phần bí mật của một cặp khóa mật mã được sử dụng để giải mã trong mật mã bất đối xứng.

Khóa công khai - Thành phần công khai của một cặp khóa mật mã được sử dụng cho encryption trong mật mã bất đối xứng.
