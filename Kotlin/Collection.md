# Collection

    _Kotlin_ phân biệt rõ ràng giữa collection có thể thay đổi giá trị và collection không thể thay đổi giá trị

_Kotlin_ cung cấp cho chúng ta một tập các _native interface_ để làm việc với collection:

## Iterable

    Lớp cha. Bất kỳ class nào kế thừa từ interface này đại diện cho một chuỗi các phần tử mà chúng ta có thể duyệt qua

# MultableIterable

    Iterable hỗ trợ việc xóa các phần tử trong khi đanh duyệt

## Collection

     Class đại diện cho một tập các phần tử. Chúng ta có thể truy cập đến các hàm mà trả về size của collection, kiểm tra collection có rỗng hay không,... Tất cả các method cho loại này chỉ là lấy dữ liệu, bởi vì collection là immutable.

## MultableCollection

    Collection hỗ trợ việc thêm hoặc xóa các phần tử: các hàm _add, remove, clear..._

## List

     Collection có lẽ là được dùng nhiều nhất. Nó đại diện cho một tập các phần tử có thứ tự. Bởi vì có thứ tự, ta có thể truy cập các phần tử thông qua chỉ số

## MultableList

    List hỗ trợ việc thêm hoặc xóa các phần tử

## Set

    một tập các phần tử không có thứ tự và không hỗ trợ lưu các phần tử trùng

## MultableSet

    Set hỗ trợ việc thêm và xóa các phần tử

## Map

    một tập các cặp key - value với key trong map là duy nhất

## MultableMap

     Map hỗ trợ việc thêm và xóa các phần tử

        **Với 2 kiểu collection này, ta cần phân biệt rõ ràng giữa các khái niệm read only view của mutable collection và một collection thực sự immutable**

     _Kotlin_ cung cấp hàm khởi tạo hoặc chúng ta có thể sử dụng hàm thư viện chuẩn có sẵn _listOf(), setOf() và mapOf(). Với mapOf()_
