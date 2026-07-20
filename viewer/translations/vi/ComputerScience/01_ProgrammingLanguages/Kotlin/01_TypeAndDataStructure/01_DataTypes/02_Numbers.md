## số

Kotlin cung cấp một số loại cho số **số nguyên** và **phân số**.

Nếu một giá trị số nguyên chứa nhiều chữ số, chúng ta có thể thêm dấu gạch dưới để chia các chữ số thành các khối nhằm làm cho số này dễ đọc hơn: ví dụ: `1_000_000` dễ đọc hơn nhiều so với `1000000`.

**Số nguyên** (0, 1, 2, ...) được biểu thị bằng bốn loại sau: `Long`, `Int`, `Short`, `Byte` (từ lớn nhất đến nhỏ nhất). Phạm vi loại số nguyên có thể được tính từ −(2n−1) đến (2n−1)−1, trong đó n là số bit. Phạm vi bao gồm 0, đó là lý do tại sao chúng tôi trừ 1 từ giới hạn trên.

- **Byte**: 8 bit (1 byte), phạm vi thay đổi từ -128 đến 127;
- **Ngắn**: 16 bit (2 byte), phạm vi thay đổi từ -32768 đến 32767;
- **Int**: 32 bit (4 byte), phạm vi thay đổi từ -(2^31) đến (2^31) - 1;
- **Dài**: 64 bit (8 byte), phạm vi thay đổi từ -(2^63) đến (2^63) - 1.

Kích thước không thể thay đổi. Nó không phụ thuộc vào hệ điều hành hoặc phần cứng.

**Loại dấu phẩy động** biểu thị số có phần phân số. Kotlin có hai loại như vậy: `Double` (64 bit) và `Float` (32 bit). Những loại này chỉ có thể lưu trữ một số chữ số thập phân giới hạn (~6-7 đối với `Float` và ~14-16 đối với `Double`).