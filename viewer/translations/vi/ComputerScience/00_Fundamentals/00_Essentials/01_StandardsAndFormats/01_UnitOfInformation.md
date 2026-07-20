# Đơn vị thông tin

## Bit: đơn vị thông tin nhỏ nhất

Để thuận tiện cho việc phân biệt, tín hiệu hai mức được sử dụng trong máy tính điện tử cổ điển. Một trong số chúng tương ứng với số `1` và số còn lại tương ứng với `0`. Bất kỳ chữ cái, âm thanh hoặc hình ảnh nào trên máy tính đều được biểu thị bằng một tập hợp số. Các số `1` và `0` được gọi là **nhị phân**. Đây là những ký hiệu tạo nên ngôn ngữ được máy tính hiểu và sử dụng. Mọi thông tin trên máy tính đều được biểu thị bằng các chữ số nhị phân: 1, nghĩa là "**có tín hiệu**" hoặc "**có tín hiệu cao**" và `0`, nghĩa là "**không có tín hiệu**" hoặc "**có tín hiệu thấp**".

Đơn vị thông tin nhỏ nhất là **bit (b)**.

Mỗi chữ số của mã nhị phân máy mang một lượng thông tin bằng một bit. Nó chỉ có thể nhận một trong hai giá trị: `1` hoặc `0`. Sẽ rất bất tiện khi đo thông tin theo bit vì số lượng quá lớn.

## Byte: một chuỗi 8 bit

Giống như mọi người không coi khối lượng của tàu bằng gam, các đơn vị lớn hơn và do đó thuận tiện hơn cũng được phát minh để đo lường thông tin.

Việc xử lý thông tin diễn ra trong bộ xử lý. Đây là thiết bị có thể hoạt động với nhiều bit cùng một lúc (8, 16, 32, 64, ...). Hầu hết các máy tính hiện nay process đều có 8 bit thông tin đồng thời, vì vậy chúng tôi cần một đơn vị đo lường mới được gọi là **byte (B)**, nghĩa là **8 bit**.

> [!CAUTION]
> Điều quan trọng là không nhầm lẫn giữa chữ viết tắt bit và byte. Chữ thường 'b' được sử dụng cho bit, trong khi chữ hoa 'B' biểu thị byte. Sự khác biệt này rất quan trọng vì việc trộn lẫn chúng có thể dẫn đến những hiểu lầm đáng kể, đặc biệt là khi đo tốc độ truyền dữ liệu hoặc dung lượng lưu trữ.

## Đơn vị thông tin lớn

Ngành công nghiệp máy tính trước đây đã sử dụng các đơn vị **kilobyte**, **megabyte** và **gigabyte** trong ít nhất hai hệ thống đo lường hơi khác nhau và hơi mâu thuẫn với nhau.

- Hệ thống đầu tiên là **hệ thống dựa trên thập phân**, sử dụng byte có lũy thừa 10: **kilobyte** (10^3 byte), **megabyte** (10^6 byte), **gigabyte** (10^9 byte), v.v. Các đơn vị này được sử dụng bởi Hệ thống đơn vị quốc tế (SI).

- Hệ thống thứ hai là **hệ thống dựa trên nhị phân sử dụng byte có lũy thừa bằng hai**: **kibibyte** (2^10 byte), **mebibyte** (2^20 byte), **gibibyte** (2^30 byte), v.v. Hệ thống này đã được sử dụng tích cực để mô tả bộ nhớ máy tính.

Để giảm sự nhầm lẫn, `International Electrotechnical Commission (IEC)` đã đề xuất chỉ sử dụng tiền tố kilo, mega và giga cho hệ thống dựa trên số thập phân. Đối với hệ thống dựa trên nhị phân, họ đã giới thiệu các tiền tố mới: **kibi**, **mebi** và **gibi**. Ở đây, 'bi' là viết tắt của nhị phân. Vì vậy, một kibibyte (KiB) bằng 1.024 byte, phân biệt với kilobyte (kB), bằng 1.000 byte.

Dưới đây là bảng các đơn vị thông tin được sử dụng phổ biến theo tiêu chuẩn quốc tế hiện đại:

| Số liệu SI | Biểu tượng | Quyền hạn của Mười | Số liệu IEC | Biểu tượng | Quyền hạn của hai |
|---|---|---|---|---|---|
| Kilobyte | kB | 10^3 B (1000 B) | Kibibyte | KiB | 2^10 B (1024 B) |
| Megabyte | MB | 10^6 B (1000 kB) | Mebibyte | MiB | 2^20 B (1024 KiB) |
| Gigabyte | GB | 10^9 B (1000 MB) | Gibibyte | GiB | 2^30 B (1024 MiB) |
| Terabyte | TB | 10^12 B (1000 GB) | Tebibyte | TiB | 2^40 B (1024 GiB) |
| Petabyte | PB | 10^15 B (1000 TB) | Pebibyte | PiB | 2^50 B (1024 TiB) |


## Tại sao điều này lại quan trọng?



Sự khác biệt này có vẻ nhỏ nhưng nó trở nên quan trọng trong một số bối cảnh nhất định.

Ví dụ: khi mua ổ cứng, bạn có thể nhận thấy rằng ổ được quảng cáo là 1 TB chỉ hiển thị khoảng 931 GiB khi được kết nối với máy tính của bạn. Điều này là do nhà sản xuất sử dụng hệ thập phân (1 TB = 1.000 GB), trong khi hệ điều hành của bạn sử dụng hệ nhị phân (1 TiB = 1.024 GiB).

Trong lập trình, việc biết sự khác biệt giữa các đơn vị này cũng có thể ngăn ngừa lỗi. Ví dụ: việc phân bổ bộ nhớ trong MiB thay vì MB có thể dẫn đến việc chỉ định dung lượng bộ nhớ không chính xác, có khả năng dẫn đến lỗi hoặc sự cố về hiệu suất.

Hiểu các đơn vị này có thể giúp ngăn ngừa sự hiểu lầm.

