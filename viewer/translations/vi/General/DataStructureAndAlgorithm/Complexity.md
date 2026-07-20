#Giới thiệu
Thuật toán là một chuỗi các bước xác định, mỗi bước mô tả chính xác các thuật toán hoặc hành động được phép cần thực hiện để giải quyết một vấn đề.

## Định nghĩa về Big O
O lớn là ký hiệu phức tạp mô tả phức tạp của một thuật toán, hay nói đơn giản là hiệu suất của mã.

O đại diện cho trường hợp xấu nhất có thể ra. Cùng với O lớn, còn có các ký hiệu Ω(omega) và Θ(teta) đại diện cho trường hợp nhất và trường hợp trung bình.

> [!NOTE]
> Độ phức tạp về thời gian là NOT thước đo Thời gian tính bằng giây / phút / giờ. 
> Đó là số lượng thao tác mà Thuật toán sẽ thực hiện để đạt được đầu ra mong muốn với dữ liệu có kích thước n .


## Tiêu chí đánh giá một thuật toán

Trong chuyên ngành khoa học máy tính hai khái niệm này thường được gọi là "độ phức tạp thời gian" và "độ phức tạp không gian".

Khái niệm O lớn có thể dùng cho cả hai loại phức tạp, nhưng với mức độ gần như vô hạn của phần cứng và mục tiêu chính của chúng ta thường được cải thiện tốc độ, **nên O lớn hơn thường được sử dụng với khái niệm thời gian**.

Hiệu suất thường được hiểu là khái niệm bao gồm hai tiêu chí: tốc độ xử lý và bộ nhớ cần sử dụng

Dưới đây là một bảng tra cứu nhanh về các giá trị O lớn nhất thường gặp

| O lớn | Ý nghĩa |	
| ----------- | ----------- |
| O(1) | Tốc độ không phụ thuộc vào dữ liệu lớn |	
| O(log n) | Nếu dữ liệu tăng gấp 10 lần thì giá gấp đôi thời gian |
|O(n) |Nếu dữ liệu tăng gấp 10 lần thì thời gian giá gấp 10 lần|
|O(n log n) |Nếu dữ liệu tăng gấp 10 lần thì giá gấp 20 lần thời gian|
|O(n^2) |Nếu dữ liệu tăng gấp 10 lần thì thời gian tăng gấp 100 lần|
|O(2^n) |	Dữ liệu tăng gấp đôi là đủ chết rồi|





## Phương pháp đánh giá độ phức tạp của thuật toán

ta sẽ đánh giá mức độ phức tạp của thuật toán bằng phương pháp lý thuyết. Trong phương pháp này, **ta quan tâm tới kích thước đầu vào yêu cầu của dữ liệu**, thông thường là một số n. 

Mối liên hệ giữa yếu tố này và số lượng phép tính toán để tìm ra kết quả của bài toán gọi là **độ phức tạp thuật toán** (chứ không phải thời gian cụ thể như 1,2 hay 10 giây). Ta sử dụng hàm số ()
T(n) để biểu thị thuật toán thực hiện thời gian diễn ra với kích thước đầu dữ liệu là n.

Trong công việc tính toán phức tạp của hằng số thuật toán không thực hiện thay đổi chất của phức tạp, ta sẽ bỏ qua các hằng số và tập trung vào các biến số có thể thay đổi được dựa vào đầu vào tham số.

### Các dạng Big O:

**O(1)** - Hằng số thời gian: Một thuật toán phức tạp O(1) có thời gian thực thi không phụ thuộc vào kích thước đầu vào. Ví dụ: truy cập phần tử đầu tiên của một mảng.

**O(log n)** - Logarit thời gian: Một thuật toán có độ phức tạp O(log n) có thời gian thực thi tăng logarit của kích thước đầu vào. Ví dụ: tìm kiếm nhị phân trong một mảng đã được sắp xếp.

***Ví dụ cụ thể hơn:***

Để chứng minh rằng độ phức tạp của phân tích tìm kiếm thuật toán phức tạp là O(log n), ta có thể sử dụng phương pháp đệ quy phân tích và các phương pháp học toán. Dưới đây là một công cụ phức tạp phân tích:

Giả sử chúng có một mảng được sắp xếp theo kích thước n.

1. Bắt đầu tìm kiếm từ vị trí giữa mảng (ở giữa).
2. So sánh giá trị tại vị trí giữa giá trị cần tìm. If được tìm thấy, kết thúc thuật toán.
3. Nếu giá trị ở vị trí giữa lớn hơn giá trị cần tìm, chúng tôi sẽ tiếp tục tìm kiếm ở nửa đầu của mảng (trái của vị trí giữa).
4. Nếu giá trị ở vị trí giữa nhỏ hơn giá trị cần tìm, chúng tôi tiếp tục tìm kiếm ở mảng cuối cùng (phải ở vị trí giữa).
5. Lặp lại các bước 2-4 cho đến khi tìm thấy giá trị cần tìm hoặc không còn phần tử nào để tìm kiếm.

Phân tích phức tạp:

* Trong mỗi bước, ta chia mảng thành hai nửa, mảng kích thước đó sẽ giảm đi một nửa.
* Số lần chia này tương ứng với số lần lặp lại của thuật toán.
* Với mỗi lần lặp lại, ta sử dụng phép so sánh để xác định xem giá trị cần tìm nằm ở nửa bên trái hay nửa phải của mảng.
* Liên hệ với logarit học Cho hai số dương a, b với(a≠1). Kết quả duy nhất của phương pháp a^x = b được gọi là a log b .
* Đối với bài toán hiện tại, khi mỗi lần chia mảng thành 2 phần để tìm kiếm thì phức tạp sẽ là số lần lập nghĩa là 2^x = n => tìm x = 2 log n
(tức là số α có tính chất là α=b).
* Vì vậy, tối đa số lần lặp lại sẽ là log n, trong đó log là logarit cơ số 2. **nhưng do 2 log n ta có thể loại bỏ cơ số 2 vì nó là một số không ảnh hưởng đến phức tạp**

**O(n)**

   Điều này có nghĩa là quá trình xử lý thời gian của thuộc tính phụ thuộc toán học thuật toán vào số phần tử trong mảng. Việc tìm kiếm trong một mảng với 100 phần tử có thể tốn thời gian gấp 100 lần.
   
   
**O(đăng nhập)**

   Độ phức tạp lớn hơn O(n) gấp logn lần ví dụ như Sắp xếp hợp nhất
   
1. Chia mảng ban đầu thành hai phần bằng nhau.
2. Đệ quy sắp xếp hai nửa mảng.
3. Trộn hai nửa nửa được sắp xếp thành một sắp xếp theo mảng

* Độ phức tạp của quá trình chia: O(log n).
* Độ phức tạp của mỗi lần trộn: O(n).
* Tổng phức tạp: O(log n) * O(n) = O(n log n).

**O(n^2)**

   Các đoạn mã có phức tạp O(n^2) thường là các lồng vòng lặp khác nhau. Điều này rất dễ hiểu và có thể tính toán được: với mỗi vòng lặp có tạp chất phức tạp O(n), do đó, một hai vòng lặp được thực hiện trong mỗi vòng lặp trên ta có tạp chất phức tạp là O(n^2). Vì vậy, nếu ta có 5 vòng lặp lồng nhau, thì ta có phức tạp mức độ là O(n^5).

**O(2^n)**
  
   Trong thuật toán O(2^n), số lần lặp lại hoặc thao tác trong thuật toán tăng cấp theo số nhân với cơ số 2 khi kích thước của đầu vào tăng lên. Cụ thể, khi kích thước đầu tiên tăng lên 1 đơn vị (n + 1), số lần lặp lại của thuật toán sẽ tăng gấp đôi (2^n). Điều này làm cho mức độ phức tạp của thuật toán tăng lên nhanh chóng và dễ dàng trở thành nên không thể đạt được giá trị lớn của n.

Một ví dụ minh họa cho thuật toán O(2^n) là thuật toán tìm kiếm tất cả các tập hợp của một tập hợp.

## Quy tắc đánh giá thời gian thực hiện thuật toán

Để đánh giá giá thực hiện thuật toán thời gian, hãy xuất các lệnh đơn trong chương trình, sau đó tới các câu lệnh có cấu trúc, các lệnh phức tạp hơn, sau đó hợp nhất lại thành thời gian thực hiện cả chương trình. Cụ thể có các quy tắc:

* Các lệnh đơn (khai báo, phân bổ, nhập dữ liệu, phép toán học,...): Thời gian *0*(1).
* Lệnh khối: Giả sử sử dụng một khối lệnh bao gồm các lệnh S1,S2,...,Sm có thời gian thực thi lần lượt như *O*(f1(n)), *O*(f2(n)),...*O*(fm(n)).
* Câu trả lời: Ta có cú pháp chiến đấu nhánh là:
```
	if ({Điều_kiện})
	    {Câu_lệnh_1}
	else 
	    {Câu_lệnh_2}
```
Giả sử thời gian thực hiện lệnh 
1 và lệnh 2 lần như *O*(f1(n)) và *O*(f2(n)) thì thời gian thực hiện Phản ứng là: *O*(max(f1(n),f2(n)))

* Câu lệnh: Giả sử thời gian thực hiện phần thân của vòng lệnh là *O*(f(n)) và tối đa số lần cài đặt của cài đặt vòng là *g*(n) thì thời gian thực hiện của cả cài đặt vòng là *O*(f(n).g(n)). Điều này áp dụng cho tất cả các cài đặt vòng loại.
* Sau khi đánh giá thời gian thực hiện của tất cả các lệnh trong chương trình, **thời gian thực hiện của toàn bộ chương trình sẽ là thời gian thực hiện của lệnh có thời gian thực hiện lớn nhất**.

### Ví dụ

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

Thời gian thực hiện chương trình phụ thuộc vào số n :

Các lệnh (1),(2),(3),(5),(6),(8),(9) đều có thời gian thực hiện là *O*(1).

Vòng cho số 4 có số lần lặp là n và lệnh ở phần thân (là lệnh (5)) có thời gian thực hiện *O*(1). Sau đó, cả hai vòng lặp có thời gian thực hiện là *O*(n). Tương tự với số vòng lặp (7).

Sau đó, thời gian thực hiện thuật toán là:
		Tối đa(*O*(1),*O*(n)) = *O*(n)	
		
## Các bước giảm độ phức tạp của thuật toán

1. Loại bỏ hoặc giảm bớt các bước không cần thiết
2. Sử dụng kết quả cấu trúc dữ liệu: Chọn hợp lý cấu trúc dữ liệu để giảm thời gian tìm kiếm, truy cập hoặc thực hiện các thao tác khác trên dữ liệu. 
3. Sử dụng thông tin trước: Nếu có thông tin trước về đầu vào dữ liệu hoặc giới hạn giới hạn, hãy sử dụng nó để loại bỏ hoặc giới hạn các phép toán không cần thiết. Ví dụ: nếu số dãy đã được sắp xếp, bạn có thể sử dụng phân tích tìm kiếm thuật toán thay vì tính toán tìm kiếm tuyến tính.
4. Phân tích và cải tiến phức tạp: Tìm hiểu cách tính toán phức tạp của thuật toán và xác định các vùng có thể cải tiến. Có thể thay đổi thuật toán hoặc áp dụng các kỹ thuật tối ưu hóa để giảm độ phức tạp.
5. Sử dụng kỹ thuật tiên tiến: Một số thuật toán tiên tiến có thể được sử dụng để giảm độ phức tạp, như thuật toán đệ quy quy hoạch động (lập trình động) hoặc thuật toán chia để trị (chia để trị).