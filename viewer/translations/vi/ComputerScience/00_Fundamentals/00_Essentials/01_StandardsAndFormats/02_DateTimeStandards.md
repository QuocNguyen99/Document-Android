# Tiêu chuẩn ngày giờ

## Tiêu chuẩn UTC và UTC-SLS

Giờ phối hợp quốc tế (UTC) là tiêu chuẩn thời gian chính của thế giới để điều chỉnh đồng hồ và thời gian.
Nó đã thay thế một cách hiệu quả Giờ chuẩn Greenwich (GMT), là giờ trung bình hàng năm tại Đài thiên văn Hoàng gia Greenwich.


UTC sử dụng Giờ nguyên tử quốc tế (IAT) để giữ thời gian chính xác, là thời gian trung bình của 400 đồng hồ nguyên tử trên toàn cầu.

Mặc dù chúng ta có thể đo thời gian với độ chính xác cao nhưng tốc độ quay của Trái đất lại không ổn định.
Do động đất, thủy triều, v.v., thời gian chúng tôi đo không đồng bộ với thời gian thiên văn.

nghĩa là thời gian sẽ là bao nhiêu tùy theo vị trí của Trái đất so với Mặt trời.
Tiêu chuẩn Giờ phối hợp quốc tế với giây nhuận được làm mịn (UTC-SLS) về thực tế giống với tiêu chuẩn UTC, điểm khác biệt là nó tính đến hiệu chỉnh giây nhuận.

## Múi giờ

UTC cung cấp thời gian chính xác cho kinh độ bằng 0 độ, nhưng phần còn lại của thế giới có giờ địa phương riêng. 

Do đó, các quốc gia được chia thành các Múi giờ khác nhau, có giờ địa phương nằm trong khoảng từ UTC trừ 12 giờ đến UTC cộng thêm 14 giờ. 

Giờ địa phương của múi giờ được biểu thị dưới dạng `UTC+<hours:minutes>` hoặc `UTC-<hours:minutes>`. Ví dụ:


```kotlin
UTC-05:00
UTC+00:00
UTC+02:00
UTC+05:45
```

Múi giờ cũng có thể được biểu thị bằng các chữ viết tắt theo bảng chữ cái, ví dụ: "MUT" là viết tắt của "Giờ Mauritius", nghĩa là UTC+04:00.

Sau đây là một số ví dụ về múi giờ. Lưu ý rằng thông thường các quốc gia có một múi giờ duy nhất nhưng một số quốc gia lớn có thể được chia thành nhiều múi giờ.

| Quốc gia | Múi giờ | Viết tắt | Tên múi giờ |
|----------|-------------|------|----------------------------------------------|
| Nhật Bản | UTC+09:00 | JST | Giờ chuẩn Nhật Bản |
| Ý | UTC+01:00 | CET | Giờ Trung Âu |
| Sri Lanka| UTC+05:30 | SLST| Giờ chuẩn Sri Lanka |
| Peru | UTC-05:00 | PET | Giờ Peru |
| Hy Lạp | UTC+02:00 | EET | Giờ Đông Âu |
| Trung Quốc | UTC+08:00 | CST | Giờ chuẩn Trung Quốc |
| Brazil | UTC-02:00 | FNT | Giờ Fernando de Noronha |
| Brazil | UTC-03:00 | BRT | Giờ Brasilia |
| Brazil | UTC-04:00 | AMT | Giờ Amazon |
| Brazil | UTC-05:00 | ACT | Giờ mẫu Anh |
| Mexico | UTC-05:00 | EST | Giờ Chuẩn Miền Đông |
| Mexico | UTC-06:00 | CST | Giờ Chuẩn Miền Trung |
| Mexico | UTC-07:00 | MST | Giờ Chuẩn miền núi |


Nhiều quốc gia điều chỉnh đồng hồ theo mùa bằng cách triển khai Giờ tiết kiệm ánh sáng ban ngày (DST). Thực hành này liên quan đến việc chuyển đồng hồ về phía trước vào mùa xuân và quay lại thời gian tiêu chuẩn vào mùa thu. Thời gian điều chỉnh trong những tháng mùa hè được gọi là thời gian mùa hè. Mục tiêu chính của DST là tối đa hóa số giờ ban ngày vào buổi tối, điều này có khả năng giúp tiết kiệm năng lượng.
## Tiêu chuẩn ISO 8601

ISO là tên viết tắt của Tổ chức Tiêu chuẩn hóa Quốc tế, một tổ chức phi chính phủ quốc tế chuyên ban hành các tiêu chuẩn khác nhau. ISO 8601 là tiêu chuẩn quốc tế để thể hiện văn bản ngày và giờ. Nó được sử dụng để liên lạc dữ liệu ngày và giờ chính xác và độc lập với quốc gia.

**Tiêu chuẩn này xác định ký hiệu cho ngày, giờ, múi giờ và khoảng thời gian.**

Có 2 loại ký hiệu:
1. ký hiệu cơ bản, trong đó sử dụng số lượng ký tự tối thiểu được yêu cầu
2. ký hiệu mở rộng, thân thiện với con người hơn.

## Biểu diễn ngày và giờ của ISO 8601

Ngày được định dạng là `YYYY-MM-DD` (**mở rộng**) hoặc `YYYYMMDD` (**cơ bản**), trong đó `Y` biểu thị các chữ số năm, `M` biểu thị các chữ số tháng và `D` biểu thị các chữ số ngày. Ví dụ:

```kotlin
2000-01-01
2001-12-31
20100207
20121120
```

Thời gian được định dạng là `Thh:mm:ss.fff` (**mở rộng**), `Thh:mm:ss` (**cơ bản**), `Thhmmss`(**cơ bản**) hoặc `Thhmmss.fff` (**mở rộng**)

ở đâu 
- `T` được dùng làm chỉ báo cho biết chuỗi theo sau biểu thị thời gian.
- `h` biểu thị chữ số giờ
- `m` chữ số phút
- `s` giây
- `f` chữ số thập phân của giây (tùy theo độ chính xác)

> [!NOTE]
> Ngoài ra, xin lưu ý rằng nửa đêm chỉ có thể được gọi là 00:00:00 chứ không phải 24:00:00

```bash
T12:00:15
T120015
T14:01:34.55
14:01:34.55
T170517.3432
T00:00:00
00:00:00
```

Chỉ báo múi giờ được định dạng là `Z` (dành cho giờ chuẩn UTC), `±hh:mm`, `±hhmm` hoặc `±hh`

> [!NOTE]
> Dữ liệu mọi lúc đều có một số chữ số cố định và nếu các số thực tế có ít chữ số hơn thì chúng phải được đệm bằng các số 0 đứng đầu. Ví dụ: định dạng ngày đúng là 2022-02-02 chứ không phải 2-2022-2.

Ngày và giờ cùng nhau được thể hiện ở định dạng `<date>T<time><time zone indicator>`. Không thể bỏ qua chỉ báo thời gian `T` ở đây, trong khi chỉ báo múi giờ là tùy chọn.

Sau đây là một số ví dụ về cách biểu diễn ngày giờ ISO 8601:

```bash
2022-02-16T16:31:03+02:00
2022-02-16T16:31:03Z
20220216T163103Z
```

## Biểu diễn thời lượng ISO 8601

Khoảng thời gian được biểu thị dưới dạng `P<n>Y<n>M<n>DT<n>H<n>M<n>S`

Ở đâu 

- `P` biểu thị chuỗi này biểu thị khoảng thời gian
- `Y` biểu thị năm
- `M` tháng
- `D` ngày
- `T` là bộ chia ngày
- `H` biểu thị giờ
- `M` sau `T` biểu thị số phút
- `S` – giây.
- `<n>` biểu thị giá trị của phần tử thời gian theo sau nó.

```bash
P2Y11M5DT4H10M3S
```
Chuỗi biểu thị khoảng thời gian 2 năm, 11 tháng, 5 ngày, 4 giờ, 10 phút và 3 giây.

Nếu giá trị của một mục thời gian bằng 0 thì nó có thể bị bỏ qua. Ví dụ:

```bash
P4Y      Duration of 4 years
PT3H5M   Duration of 3 hours and 5 minutes
P7DT6H   Duration of 7 days and 6 hours
```
Mục cuối cùng cũng có thể có chữ số thập phân. Ví dụ:

```kotlin
P12.5Y         Duration of 12.5 years
PT2H3M10.23S   Duration of 2 hours, 3 minutes and 10.23 seconds
P2M7.3D        Duration of 2 months and 7.3 days
```

## Biểu diễn khoảng thời gian ISO 8601

Khoảng thời gian có thể được thể hiện theo các định dạng sau:
1. `<Starting date-time>/<Ending date-time>`

Ví dụ:
```bash
2022-12-01T00:00:00Z/2022-12-31T23:59:59Z
2000-01-01T00:00:00+03:00/2011-01-01T00:00:00+03:00
2022-02-01T14:00:00-05:00/2022-02-01T14:15:59-05:00
```
2. `<Starting date-time>/<Duration>`

Ví dụ:

```bash
2000-01-01T00:00:00Z/P3Y10M4DT2H11M13S
2012-07-19T17:12:00Z/PT35M
111
```

3. `<Duration>/<Ending date-time>`

Ví dụ:

```bash
P1Y1M2DT21H9M7S/2000-01-01T00:00:00Z
P3Y/2021-01-01T01:00:00Z
```