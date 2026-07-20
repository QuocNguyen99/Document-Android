#Graph

Một graph - sơ đồ là một tập hợp hữu hạn các giá trị (nút) và đường đi giữa các giá trị này. Kích thước của một sơ đồ được tính bằng số lượng, cấp của đồ thị được tính bằng số lượng của nó. Hai dịch vụ được gọi là liền kề nếu chúng được kết nối với nhau bởi cùng một đường.

## Đạo diễn graph

Một sơ đồ được gọi là sơ đồ có hướng dẫn nếu tất cả các đường đi trên đó đều được đánh dấu giữa điểm đầu và điểm cuối. Ký hiệu (u,v) là đường đi từ đỉnh u tới đỉnh v. Sefl-loop: việc làm một đỉnh có đường đi tới chính nó.

## graph vô hướng

Một sơ đồ được gọi là sơ đồ vô hướng nếu tất cả các đường đi trên đó đều không được xác định chiều. Nếu một phẩm chất trong sơ đồ không thể kết nối tới bất kỳ phẩm chất nào, ta nói nó đã được thiết lập.

![](../../resources/graph.webp)

## Hoạt động Graph
Các hoạt động graph phổ biến nhất là:

* Kiểm tra xem phần tử có trong biểu đồ không
* Duyệt sơ đồ
* Add element (đỉnh, edge) vào sơ đồ
* Tìm đường đi từ chất lượng này đến chất lượng khác


### Độ phức tạp

* Kiểm tra sự tồn tại của phần tử tử trong sơ đồ: Độ phức tạp O(n), với n là số lượng chất lượng trong sơ đồ. Công việc kiểm tra có thể yêu cầu trình duyệt xem tất cả các hạng cao cấp trong sơ đồ để kiểm tra xem phần tử có tồn tại hay không.

* Duyệt sơ đồ (Graph Traversal):
1. Duyệt theo chiều rộng (BFS - Tìm kiếm theo chiều rộng): Độ phức tạp O(n + E), với n là số lượng và E là số lượng cạnh trong sơ đồ. Đi ngang qua tất cả các đỉnh và cạnh của đồ thị.

2. Duyệt theo chiều sâu (DFS - Tìm kiếm theo chiều sâu): Độ phức tạp O(n + E), với n là số lượng và E là số lượng cạnh trong sơ đồ. Đi ngang qua tất cả các đỉnh và cạnh của đồ thị.

* Thêm phần tử (đỉnh, cạnh) vào sơ đồ: Độ phức tạp O(1). Thêm một giá trị vào sơ đồ Yêu cầu chỉ một thao tác cơ bản để cập nhật danh sách giá trị. Thêm một cạnh giữa hai đỉnh cao cũng chỉ yêu cầu một thao tác cơ bản để cập nhật danh sách cạnh.

* Tìm đường đi từ một đỉnh cao đến một đỉnh cao khác: Độ phức tạp phụ thuộc vào công cụ thuật toán có thể được sử dụng để tìm đường đi trong đồ thị. Một số thuật toán phổ biến như thuật toán Dijkstra (sử dụng trong sơ đồ thị không âm), thuật toán Bellman-Ford, thuật toán A* có phức tạp trung bình là O(n + E log n), trong đó n là số lượng và E là số lượng cạnh trong đồ thị.