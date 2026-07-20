# Tổng quan

##LayoutParams

Trước khi bắt đầu với bố cục của mình, chúng ta cần hiểu `LayoutParams` là gì.

`LayoutParams` được Chế độ xem sử dụng để cho cha mẹ biết họ muốn bố trí như thế nào.

Lớp `LayoutParams` cơ sở mô tả mức độ lớn của chế độ xem cả về chiều rộng và chiều cao.
Trong trường hợp này, nó có thể là `match_parent`, `wrap_content` hoặc một con số chính xác. `match_parent` lấp đầy hoàn toàn chế độ xem chính, ` ` chiếm nhiều không gian như nội dung cần và một con số chính xác chỉ định kích thước chính xác cho View của bạn.

Ngoài ra còn có các lớp con của `LayoutParams` dành cho các lớp con của ViewGroups như `FrameLayout`, `LinearLayout`, v.v.





