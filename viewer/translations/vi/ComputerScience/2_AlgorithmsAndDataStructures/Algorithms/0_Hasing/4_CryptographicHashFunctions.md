#Cryptographic Hash Function

Điều quan trọng là phải bảo vệ tính toàn vẹn và bảo mật của thông tin nhạy cảm. Hàm băm mật mã đóng một vai trò quan trọng trong vấn đề này, đóng vai trò là người bảo vệ tính toàn vẹn dữ liệu và cung cấp lớp bảo vệ mạnh mẽ. Nhưng tại sao hàm băm lại không đủ?

Hàm băm và **hàm băm mật mã** là những khái niệm có liên quan chặt chẽ với nhau trong lĩnh vực khoa học máy tính và mật mã.

Mặc dù cả hai đều phục vụ mục đích chuyển đổi dữ liệu thành các biểu diễn có kích thước cố định, nhưng có những khác biệt quan trọng giữa hai cách này.

## Định nghĩa của cryptographic hash function

Hàm băm mật mã là một tập hợp con cụ thể của hàm băm được thiết kế cho các ứng dụng mật mã an toàn. 

Chúng sở hữu tất cả các đặc tính của hàm băm truyền thống và kết hợp **các tính năng bảo mật bổ sung**. 

Các thuộc tính đặc biệt của hàm băm mật mã bao gồm:

- **Kháng trước hình ảnh**: khó tìm thấy thông báo có giá trị băm nhất định.
- **Khả năng chống tiền ảnh thứ hai hoặc khả năng chống va chạm yếu**: rất khó tìm được thông báo có cùng giá trị băm với thông báo đã cho.
- **Khả năng chống va chạm** hoặc **chống va chạm mạnh**: khó tìm được hai thông điệp khác nhau có cùng giá trị băm.


## Kháng trước ảnh

Hãy tưởng tượng một công ty lưu trữ một bảng gồm các cặp tên người dùng-mật khẩu cho trang web bạn sử dụng.
Nếu bảng đó bị rò rỉ thì bất kỳ ai cũng có thể xem được mật khẩu của bạn.
Vì vậy, những gì họ làm là lưu mã băm của mật khẩu của bạn
Bất cứ khi nào bạn gửi cho họ mật khẩu của mình, họ sẽ tính toán hàm băm và kiểm tra xem nó có giống với mật khẩu đã lưu hay không.
Bây giờ, nếu bảng bị rò rỉ, kẻ tấn công phải tìm mật khẩu băm có cùng giá trị với mật khẩu của bạn để có thể đăng nhập như bạn.

Vì vậy, hash function phải gây khó khăn cho kẻ tấn công trong việc tìm ra mật khẩu như vậy.

Hàm như vậy được gọi là chống tiền ảnh: với giá trị băm `h`, rất khó tìm thấy thông báo `m` `hash(m) = h`


## Khả năng chống ảnh hưởng trước thứ hai

Một trong những cách chúng ta có thể đảm bảo tin nhắn không bị thay đổi là gửi hàm băm của tin nhắn cùng với chính tin nhắn đó.
Giả sử kẻ tấn công muốn thay đổi tin nhắn, nhưng không thể thay đổi giá trị băm. Khi đó, tin nhắn đã thay đổi của chúng sẽ được băm thành cùng giá trị với giá trị ban đầu.

Để ngăn chặn những tình huống như vậy, chúng ta có thể sử dụng **kháng trước hình ảnh thứ hai** hoặc **chống va chạm yếu** hash function.

điều này có nghĩa là, với một tin nhắn `m1`, sẽ khó tìm được một tin nhắn khác `m2` với `hash(m1) = hash(m2)`.
Sự khác biệt giữa điện trở trước ảnh và điện trở trước ảnh thứ hai là trong trường hợp đầu tiên, chúng ta nhận được một giá trị băm, trong khi ở đây, chúng ta nhận được một thông báo.

## Khả năng chống va chạm

Trong một số trường hợp sử dụng rất cụ thể, việc tìm bất kỳ cặp thông báo nào có cùng hàm băm có thể gây ra sự cố.
hash function đảm bảo khó tìm thấy bất kỳ thông báo nào `m1`, `m2` sao cho `hash(m1) = hash(m2)` được gọi là **chống va chạm** hoặc **chống va chạm mạnh**.

Nói một cách đơn giản, khả năng chống va chạm đảm bảo rằng việc tìm thấy hai chìa khóa có thể mở cùng một két hoặc tạo ra cùng một giá trị băm là cực kỳ khó khăn.

Không giống như khả năng kháng tiền hình ảnh thứ hai, trong trường hợp này, chúng tôi không được cung cấp thông tin trước. 
Mục đích là gây khó khăn cho việc tìm thấy hai thông điệp riêng biệt tạo ra cùng một giá trị băm.

Khả năng chống va chạm đảm bảo rằng rất khó tìm thấy hai thông báo khác nhau có cùng hàm băm, bảo vệ các giao thức mật mã, chữ ký số và tính toàn vẹn của dữ liệu.

>[!NOTE]
> Khi chúng tôi nói rằng thật khó để tìm thấy một giá trị nào đó, điều đó có nghĩa là việc tìm ra một giá trị với các đặc tính cần thiết sẽ phải mất nhiều năm, ngay cả với những siêu máy tính đáng gờm nhất. 
> Nếu bạn cho rằng khó có được những tài sản đó thì bạn đã đúng! Không phải ai cũng có thể tạo ra một chức năng như vậy.
> May mắn thay, ngày nay có một số tiêu chuẩn được sử dụng rộng rãi.
> Việc triển khai chúng rất phức tạp nên chúng tôi sẽ không đi sâu vào chi tiết.

## Ví dụ

Cuối cùng, cần đưa ra một vài ví dụ thực tế về hàm băm mật mã và một chút thông tin về lịch sử của chúng.

MD5, được tạo ra vào năm 1992 như một cải tiến so với MD4, ban đầu được coi là có khả năng chống va chạm nhưng đã bị hỏng vào năm 2004.
SHA-256, hash function an toàn hơn, tạo ra đầu ra 256-bit và được sử dụng rộng rãi, bao gồm cả bằng chứng công việc của Bitcoin.


Ngay cả những thay đổi nhỏ cũng tạo ra sự khác biệt lớn!
Đây là hệ quả của lực cản va chạm và lực cản tiền ảnh.

Điều đáng chú ý là do những tiến bộ nhanh chóng về sức mạnh tính toán và các kỹ thuật mã hóa mới, không có gì đáng ngạc nhiên nếu một số chức năng mà chúng ta sử dụng ngày nay sẽ không còn được sử dụng trong tương lai gần.


## Phần kết luận

Tóm lại, hàm băm mật mã rất cần thiết để bảo vệ tính toàn vẹn và bảo mật dữ liệu.
Có một sự khác biệt đơn giản giữa chúng và hàm băm:
trên thực tế, chúng là một tập hợp con của các hàm băm thỏa mãn ba thuộc tính quan trọng:

- **Kháng cự trước hình ảnh**
- **Kháng trước ảnh thứ hai**
- **Chống va chạm.**

Những đặc tính này đảm bảo rằng nó
- khó tìm được đầu vào ban đầu dựa trên giá trị băm của chúng
- tìm các đầu vào khác nhau có cùng giá trị băm











