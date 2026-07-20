# Array
Một Array - mảng là một cấu trúc với kích thước cố định, có thể giữ các item có dùng kiểu dữ liệu. Nó có thể là một mảng các số nguyên, một mảng các số thực, một mảng string hay kể cả một mảng của các mảng (mảng 2 chiều). Mảng được đánh chỉ mục, cho phép ta có thể truy cập ngẫu nhiên vào mảng.
### các phép toán trên mảng
* Truy cập ngẫu nhiên: Cho phép ta truy cập tới một phần tử bất kỳ trong mảng bằng chỉ mục (index) của nó.
* Tìm kiếm: Tìm kiếm một phần tử trong mảng bằng chỉ mục hoặc giá trị của nó.
* Cập nhật: Cập nhật giá trị của một phần tử đã tồn tại trong mảng thông qua chỉ mục của nó. Việc chèn thêm phần tử hay xoá bớt phần tử trên mảng là **không thể thực hiện thẳng** bởi mảng có kích thước cố định. Nếu muốn thêm một phần tử vào mảng, đầu tiên ta phải tạo một mảng mới với kích thước được tăng lên so với mảng cũ, sau đó copy các phần từ và thêm phần tử mới vào mảng mới. Tương tự với việc xoá phần tự, ta cần một mảng mới với kích thước nhỏ hơn.