# Mảng
Một mảng - mảng là một cấu trúc với cố định kích thước, có thể chứa các mục sử dụng dữ liệu loại. Nó có thể là một mảng số nguyên, một mảng số thực, một chuỗi mảng hay kể cả một mảng của các mảng (mảng 2 chiều). Bảng được đánh chỉ mục, được phép truy cập ngẫu nhiên vào mảng.
### phép toán trên mảng
* Truy xuất ngẫu nhiên: Cho phép truy cập tới một phần tử bất kỳ trong mảng bằng chỉ mục (chỉ mục) của nó.
* Tìm kiếm: Tìm kiếm một phần tử trong mảng bằng chỉ mục hoặc giá trị của nó.
* Cập nhật: Cập nhật giá trị của một phần tử đã tồn tại trong mảng thông tin chỉ mục của nó. Việc chèn thêm phần tử hoặc xóa phần tử trên mảng **không thể thực hiện thẳng** bởi mảng có cố định kích thước. Nếu muốn thêm một phần tử vào mảng, trước tiên bạn phải tạo một mảng mới với kích thước được tăng lên để có được mảng cũ, sau đó sao chép các phần tử từ đó và thêm phần tử mới vào mảng mới. Tương tự như việc xóa các phần tự động, ta cần một mảng mới có kích thước nhỏ hơn.