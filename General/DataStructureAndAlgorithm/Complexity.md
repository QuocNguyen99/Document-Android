# Introduction
Thuật toán là một dãy hữu hạn các bước, mỗi bước mô tả chính xác các phép toán hoặc hành động cần thực hiện để giải quyết một vấn đề.

## Definition about Big O
O lớn là ký hiệu mô tả độ phức tạp của một thuật toán, hay nói đơn giản là performace của code.

O lớn đại diện cho trường hợp xấu nhất có thể sảy ra. Cùng với O lớn, còn có các ký hiệu Ω(omega) và Θ(teta) đại diện cho trường hợp tốt nhất và trường hợp trung bình.

> [!NOTE]
> Time Complexity is NOT a measure of Time in seconds / minutes / hours. 
> It is the number of operations an Algorithm will perform to achieve its desired output given a data of size n .


## Criteria for evaluating an algorithm

Trong ngành khoa học máy tính hai khái niệm này thường được gọi là "độ phức tạp thời gian" và "độ phức tạp không gian".

Khái niệm O lớn có thể dùng cho cả hai loại độ phức tạp trên, nhưng với độ lớn gần như vô hạn của phần cứng bộ nhớ và mục tiêu chính của chúng ta thường là cải thiện tốc độ, **nên O lớn thường được dùng với khái niệm thời gian.**

Performance thường được hiểu là khái niệm bao gồm hai tiêu chí: tốc độ xử lý và bộ nhớ cần sử dụng

Dưới đây là một bảng tra cứu nhanh về các giá trị O lớn thường gặp

| O lớn   | Ý nghĩa |	
| ----------- | ----------- |
| O(1)      | Tốc độ không phụ thuộc vào độ lớn dữ liệu       |	
| O(log n)   | Nếu dữ liệu tăng gấp 10 lần thì tốn gấp đôi thời gian        |
|O(n)			|Nếu dữ liệu tăng gấp 10 lần thì thời gian tốn gấp 10 lần|
|O(n log n)	|Nếu dữ liệu tăng gấp 10 lần thì tốn gấp 20 lần thời gian|
|O(n^2)		|Nếu dữ liệu tăng gấp 10 lần thì thời gian tăng gấp 100 lần|
|O(2^n)		|	Dữ liệu tăng gấp đôi là đủ chết rồi|





## Method to evaluate algorithm complexity

ta sẽ đánh giá độ phức tạp thuật toán bằng phương pháp lý thuyết. Trong phương pháp này, **ta quan tâm tới yêu tố kích thước của dữ liệu đầu vào**, thông thường là một con số n. 

Mối liên hệ giữa yếu tố này và số lượng các phép tính toán để tìm ra được kết quả của bài toán gọi là **độ phức tạp thuật toán** (chứ không phải thời gian cụ thể như 1,2 hay 10 giây). Ta sử dụng hàm số ()
T(n) để biểu diễn thời gian thực hiện của thuật toán với dữ liệu đầu vào kích thước là n.

Trong việc tính toán độ phức tạp của thuật toán hằng số không làm thay đổi tính chất của độ phức tạp nên ta sẽ bỏ qua những hằng số và tập trung vào các biến số có thể thay đổi được dựa vào tham số đầu vào.

### Các dạng Big O:

**O(1)** - Thời gian hằng số: Một thuật toán có độ phức tạp O(1) có thời gian thực thi không phụ thuộc vào kích thước đầu vào. Ví dụ: truy cập phần tử đầu tiên của một mảng.

**O(log n)** - Thời gian logarit: Một thuật toán có độ phức tạp O(log n) có thời gian thực thi tăng theo logarit của kích thước đầu vào. Ví dụ: tìm kiếm nhị phân trong một mảng đã được sắp xếp.

***Ví dụ Cụ thể hơn:***

Để chứng minh rằng độ phức tạp của thuật toán tìm kiếm nhị phân là O(log n), ta có thể sử dụng phương pháp phân tích đệ quy và các phương trình toán học. Dưới đây là một phân tích độ phức tạp cụ thể:

Giả sử chúng ta có một mảng đã được sắp xếp với kích thước n.

1.  Ta bắt đầu tìm kiếm từ vị trí giữa mảng (middle).
2.  So sánh giá trị tại vị trí giữa với giá trị cần tìm. Nếu tìm thấy, thuật toán kết thúc.
3. Nếu giá trị tại vị trí giữa lớn hơn giá trị cần tìm, ta tiếp tục tìm kiếm trong nửa đầu tiên của mảng (trái của vị trí giữa).
4. Nếu giá trị tại vị trí giữa nhỏ hơn giá trị cần tìm, ta tiếp tục tìm kiếm trong nửa cuối của mảng (phải của vị trí giữa).
5. Lặp lại các bước 2-4 cho đến khi tìm thấy giá trị cần tìm hoặc không còn phần tử nào để tìm kiếm.

Phân tích độ phức tạp:

* Trong mỗi bước, ta chia mảng thành hai nửa, do đó kích thước mảng bị giảm đi một nửa.
* Số lần phân chia này tương ứng với số lần lặp lại của thuật toán.
* Với mỗi lần lặp lại, ta sử dụng phép so sánh để xác định xem giá trị cần tìm có nằm ở nửa trái hay nửa phải của mảng.
* Liên hệ với toán học logarit Cho hai số dương a, b với(a≠1). Nghiệm duy nhất của phương trình a^x = b được gọi là a log b .
* Đối với bài toán hiện tại, khi mỗi lần chia mảng thành 2 phần để tìm kiếm thì độ phức tạp sẽ là số lần lập nghĩa là 2^x = n => tìm x = 2 log n
(tức là số α có tính chất là α=b).
* Vì vậy, số lần lặp lại tối đa sẽ là log n, trong đó log là logarit cơ số 2. **nhưng do 2 log n ta có thể loại bỏ cơ số 2 vì nó là một cơ số không ảnh hưởng đến độ phức tạp**

**O(n)**

   Điều này có nghĩa là thời gian xử lý của thuật toán phụ thuộc tuyến tính vào số phần tử trong array. Việc tìm kiếm trong một array với 100 phần tử có thể tốn thời gian gấp 100 lần.
   
   
**O(n logn)**

   Độ phức tạp lớn hơn O(n) gấp logn lần ví dụ như Merge sort
   
1. Chia mảng ban đầu thành hai phần bằng nhau.
2. Đệ quy sắp xếp hai nửa của mảng.
3. Trộn hai nửa đã sắp xếp thành một mảng đã sắp xếp

* Độ phức tạp của quá trình chia: O(log n).
* Độ phức tạp của mỗi lần trộn: O(n).
* Tổng độ phức tạp: O(log n) * O(n) = O(n log n).

**O(n^2)**

   Các đoạn code có độ phức tạp O(n^2) thường là các vòng lặp lồng nhau. Điều này rất dễ hiểu và có thể tính toán được: với mỗi vòng lặp có độ phức tạp O(n), vậy với một vòng lặp thứ hai được thực hiện trong mỗi vòng lặp trên ta có độ phức tạp là O(n^2). Vậy nên, nếu ta có 5 vòng lặp lồng nhau, độ phức tạp ta có là O(n^5).

**O(2^n)**
  
   Trong thuật toán O(2^n), số lần lặp lại hoặc thao tác trong thuật toán tăng theo cấp số nhân với cơ số 2 khi kích thước của đầu vào tăng lên. Cụ thể, khi kích thước đầu vào tăng 1 đơn vị (n + 1), số lần lặp lại của thuật toán sẽ tăng gấp đôi (2^n). Điều này làm cho độ phức tạp của thuật toán tăng nhanh và dễ dàng trở nên không khả thi với các giá trị lớn của n.

Một ví dụ minh họa cho thuật toán O(2^n) là thuật toán tìm kiếm tất cả các tập con của một tập hợp.

## Rules for evaluating algorithm execution time

Để đánh giá thời gian thực hiện thuật toán, ta xuất phát từ các lệnh đơn trong chương trình, rồi tới các câu lệnh có cấu trúc, các khối lệnh phức tạp hơn, sau đó hợp lại thành thời gian thực hiện cả chương trình. Cụ thể ta có các quy tắc:

* Các lệnh đơn (lệnh khai báo, gán, nhập xuất dữ liệu, phép toán số học,...): Thời gian *0*(1).
* Các khối lệnh: Giả sử một khối lệnh gồm các câu lệnh S1,S2,...,Sm có thời gian thực hiện lần lượt là *O*(f1(n)), *O*(f2(n)),...*O*(fm(n)).
* Câu lệnh rẽ nhánh: Ta có cú pháp lệnh rẽ nhánh là:
```
	if ({Điều_kiện})
	    {Câu_lệnh_1}
	else 
	    {Câu_lệnh_2}
```
Giả sử thời gian thực hiện của câu lệnh 
1 và câu lệnh 2 lần lượt là *O*(f1(n)) và *O*(f2(n)) thì thời gian thực hiện rẽ nhánh là: *O*(max(f1(n),f2(n)))

* Câu lệnh lặp: Giả sử thời gian thực hiện phần thân của lệnh lặp là *O*(f(n)) và số lần lập tối đa của vòng lập là *g*(n) thì thời gian thực hiện của cả vòng lập là *O*(f(n).g(n)). Điều này áp dụng cho tất cả các loại vòng lập.
* Sau khi đánh giá được thời gian thực hiện của tất cả các câu lệnh trong chương trình, **thời gian thực hiện của toàn bộ chương trình sẽ là thời gian thực hiện của câu lệnh có thời gian thực hiện lớn nhất.**

### Example

Phân tích thời gian thực hiện của đoạn chương trình sau:

```c++
#include <iostream>
using namespace std;

int main()
{
    int n;  // (1)
    cin >> n; // (2)

    int s1 = 0; // (3)
    for (int i = 1; i <= n; ++i)  // (4)
	s1 += i;  // (5)

    int s2 = 0; // (6)
    for (int i = 1; i <= n; ++i) // (7)
	s2 += i * i; // (8)

    cout << s1 << endl << s2; // (9)
}
```

Thời gian thực hiện chương trình trên phụ thuộc vào số n :

Các lệnh (1),(2),(3),(5),(6),(8),(9) đều có thời gian thực hiện là *O*(1).

Vòng for số 4 có số lần lặp là n và câu lệnh ở phần thân (là câu lệnh (5)) có thời gian thực hiện *O*(1). Vậy cả vòng lặp có thời gian thực hiện là *O*(n). Tương tự với vòng lặp số (7).

Vậy thời gian thực hiện của cả thuật toán là:
		Max(*O*(1),*O*(n)) = *O*(n)	
		
## Steps to reduce algorithm complexity

1. Loại bỏ hoặc giảm bớt các bước không cần thiết
2. Sử dụng cấu trúc dữ liệu hiệu quả: Chọn cấu trúc dữ liệu phù hợp để giảm thời gian tìm kiếm, truy cập, hoặc thực hiện các thao tác khác trên dữ liệu. 
3. Tận dụng thông tin trước: Nếu có thông tin trước về dữ liệu đầu vào hoặc các giới hạn ràng buộc, hãy sử dụng nó để loại bỏ hoặc giới hạn các phép toán không cần thiết. Ví dụ, nếu dãy số đã được sắp xếp, có thể sử dụng thuật toán tìm kiếm nhị phân thay vì tìm kiếm tuyến tính.
4. Phân tích và cải tiến độ phức tạp: Tìm hiểu cách tính toán độ phức tạp của thuật toán và xác định các vùng có thể cải tiến. Có thể thay đổi thuật toán hoặc áp dụng các kỹ thuật tối ưu hóa để giảm độ phức tạp.
5. Sử dụng kỹ thuật tiên tiến: Một số thuật toán tiên tiến có thể được sử dụng để giảm độ phức tạp, như thuật toán đệ quy quy hoạch động (dynamic programming) hoặc thuật toán chia để trị (divide and conquer).