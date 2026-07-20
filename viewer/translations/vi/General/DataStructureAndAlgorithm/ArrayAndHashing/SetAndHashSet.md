# Bộ và Bộ băm

## Bộ

- `Set` là giao diện xác định hợp đồng cho collection lưu trữ các phần tử duy nhất. 
Nó đại diện cho khái niệm toán học của một tập hợp, trong đó không cho phép có phần tử trùng lặp nào.
- Giao diện `Set` chỉ định các phương thức thêm, xóa và kiểm tra sự hiện diện của các phần tử, 
nhưng nó không cung cấp cách triển khai các hoạt động này.
- Nó là một kiểu con của giao diện `Collection`.

##HashSet

- `HashSet` là một lớp cụ thể cung cấp cách triển khai cụ thể của giao diện `Set`.
- Nó sử dụng hash table để lưu trữ, cho phép thực hiện các hoạt động rất hiệu quả (trung bình O(1)) để thêm, xóa và kiểm tra sự hiện diện của các phần tử.
- Các phần tử trong HashSet không được lưu trữ theo bất kỳ thứ tự cụ thể nào và thứ tự lặp của chúng không được đảm bảo nhất quán.

## Điểm khác biệt chính
Sự khác biệt quan trọng nhất giữa chúng là **khả năng thay đổi**.
nhưng có lẽ là immutable (không triển khai giao diện con `MutableSet`) và do đó không thể thay đổi được.







