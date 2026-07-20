# Chủ đề và phong cách



## Hiểu chủ đề và phong cách

Chủ đề và phong cách có chung cấu trúc XML `<style>` nhưng chúng phục vụ các mục đích riêng biệt

Một cách tương tự đơn giản là coi chúng như **Bản đồ** (cặp khóa/giá trị) trong đó khóa là **tên thuộc tính** và giá trị là **tài nguyên** được liên kết với các thuộc tính đó.
Mặc dù việc triển khai kỹ thuật của chúng là tương tự nhau nhưng vai trò của chúng khá khác nhau.

- **kiểu** là collection của các giá trị thuộc tính chế độ xem chỉ định giao diện của một `View` duy nhất. Ví dụ: kiểu `TextView` có thể chỉ định màu phông chữ, cỡ chữ, màu nền, v.v.


Bằng cách trích xuất các thuộc tính này thành một kiểu, bạn có thể đảm bảo giao diện nhất quán cho các kiểu tương tự.
các thành phần hoặc phần tử UI trên ứng dụng của bạn sử dụng cùng kiểu đó. 

Hơn nữa, nó giúp giảm trùng lặp mã vì bạn không phải đặt các thuộc tính giống nhau cho từng chế độ xem riêng lẻ.

- **chủ đề** tương tự như một kiểu nhưng áp dụng cho toàn bộ hệ thống phân cấp ứng dụng, hoạt động hoặc chế độ xem — không chỉ một `View` riêng lẻ. Khi áp dụng một chủ đề, mọi chế độ xem trong ứng dụng hoặc hoạt động sẽ áp dụng từng thuộc tính kiểu mà nó hỗ trợ. Chủ đề cũng có thể áp dụng kiểu cho các thành phần không xem được, chẳng hạn như thanh trạng thái và nền cửa sổ.

Kiểu và **chủ đề** trong Android được thiết kế để hoạt động cùng nhau. Ví dụ: hãy xem xét một ứng dụng mà bạn muốn tất cả các chế độ xem `Button` có màu nền và màu văn bản cụ thể. Thay vì áp dụng một kiểu cho từng `Button` riêng lẻ, bạn có thể xác định kiểu `Button` mặc định trong chủ đề của mình:

```xml
<!-- This is a style -->
<style name="MyButtonStyle">
    <item name="android:background">#FFA07A</item>
    <item name="android:textColor">#FFFFFF</item>
</style>

<!-- This is a theme -->
<style name="MyTheme">
    <item name="android:buttonStyle">@style/MyButtonStyle</item>
</style>
```


Trong ví dụ này, `MyButtonStyle` xác định giao diện cụ thể cho các nút và MyTheme đặt `MyButtonStyle` làm kiểu mặc định cho tất cả các chế độ xem `Button` trong ứng dụng.
Giờ đây, mọi `Button` trong ứng dụng của bạn sẽ tự động sử dụng `MyButtonStyle` trừ khi một kiểu khác được áp dụng rõ ràng cho nó.

Các thuộc tính phổ biến trong chủ đề Android đến từ `Material`, `AppCompat` hoặc nền tảng. Dưới đây là một số thuộc tính chủ đề được sử dụng phổ biến nhất:

| Thuộc tính | Mô tả |
|--------------|-----------------------------------------------------------------------------------|
| `colorPrimary` | Màu chủ đạo nhất được sử dụng trên UI của ứng dụng của bạn.                       |
| `colorPrimaryDark` | Một biến thể tối hơn của colorPrimary, thường được sử dụng cho thanh trạng thái.             |
| `colorAccent` | Màu được sử dụng cho bộ điều khiển UI để cung cấp độ tương phản với các màu chính.        |
| `windowBackground` | Dùng để đặt màu nền cho tất cả các cửa sổ trong ứng dụng.             |
| `statusBarColor` | Được sử dụng để đặt màu nền của thanh trạng thái.                              |
| `navigationBarColor` | Được sử dụng để đặt màu nền của thanh điều hướng.                          |
| `textColorPrimary` | Được sử dụng cho màu văn bản mặc định trong ứng dụng của bạn.                                     |
| `textColorSecondary` | Được sử dụng cho màu văn bản phụ trong ứng dụng của bạn, thường được sử dụng cho tiêu đề phụ và chú thích. |
| `fontFamily` | Được sử dụng để đặt họ phông chữ mặc định cho tất cả các chế độ xem văn bản trong ứng dụng.       |
| `windowNoTitle` | Được sử dụng để xóa thanh tiêu đề khỏi tất cả các hoạt động trong ứng dụng của bạn.            |
| `windowActionBar` | Được sử dụng để xác định xem ActionBar có được đưa vào cửa sổ hay không.                |

Bạn có thể sử dụng các thuộc tính chủ đề phổ biến theo kiểu tùy chỉnh của mình (hoặc thậm chí trực tiếp trong chế độ xem của bạn). Để làm như vậy, bạn có thể tham chiếu thuộc tính bằng `?attr/ syntax`. Ví dụ: để sử dụng thuộc tính `colorPrimary` từ chủ đề theo kiểu tùy chỉnh của bạn, bạn có thể thực hiện một số việc như sau:

```xml
<style name="MyCustomStyle">
    <item name="android:textColor">?attr/colorPrimary</item>
</style>
```

> [!NOTE]
> Tên thuộc tính có nguồn gốc từ AppCompat hoặc các Thư viện nền tảng hoặc androidx khác không sử dụng tiền tố android:. Điều đó chỉ được sử dụng cho các thuộc tính là một phần của Android framework.
> Nói cách khác, tiền tố android: phân biệt các thuộc tính framework với các thuộc tính do thư viện hoặc ứng dụng của riêng bạn cung cấp.

## Inheritance về kiểu dáng và chủ đề

Cả phong cách và chủ đề đều hỗ trợ khái niệm inheritance.
Điều này có thể giúp giảm sự trùng lặp, làm cho kiểu và chủ đề của bạn dễ quản lý hơn cũng như tạo giao diện nhất quán trên ứng dụng của bạn.

- **Phong cách**. Inheritance trong kiểu cho phép một kiểu kế thừa các thuộc tính của kiểu khác. Điều này có nghĩa là nếu bạn có kiểu cơ sở với một số thuộc tính nhất định, bạn có thể tạo kiểu mới kế thừa tất cả các thuộc tính này và có thể tùy ý ghi đè một số thuộc tính đó

- **Chủ đề**. Bây giờ, hãy xem xét một ví dụ về inheritance với các chủ đề:

```xml
<style name="BaseTheme" parent="Theme.AppCompat.Light">
   <!-- Base theme inherits from AppCompat Light -->
</style>  

<style name="AppTheme" parent="BaseTheme">
   <item name="colorPrimary">@color/green</item>
   <!-- AppTheme inherits everything from BaseTheme -->
   <!-- But customizes the primary color -->
</style>
```

Trong ví dụ này, `BaseTheme` là chủ đề kế thừa từ `Theme.AppCompat.Light` và `AppTheme` là chủ đề phái sinh kế thừa từ `BaseTheme` và ghi đè các thuộc tính colorPrimary thành màu xanh lá cây. Điều này có nghĩa là `AppTheme` có tất cả các thuộc tính từ `BaseTheme` và có màu cơ bản là xanh lục.

Chủ đề cũng có thể kế thừa từ các chủ đề Thư viện framework hoặc AndroidX như `Theme.MaterialComponents`, cho phép chủ đề tùy chỉnh kế thừa các thuộc tính mặc định và ghi đè nếu cần.

- **"Ký hiệu dấu chấm"** inheritance. Có một cách khác để chỉ định inheritance theo kiểu, đó là sử dụng ký hiệu dấu chấm, còn được gọi là **inheritance ngầm**.
Đây là một phương pháp viết tắt để mở rộng kiểu gốc và nó đặc biệt hữu ích khi bạn muốn tạo một hệ thống phân cấp các kiểu.

Khi bạn tạo một kiểu và muốn nó kế thừa từ một kiểu khác, bạn có thể chỉ cần đặt tên cho kiểu mới bằng cách sử dụng tên của kiểu gốc,
theo sau là dấu chấm và sau đó là tên của kiểu mới. Điều này ngầm đặt kiểu gốc là kiểu gốc của kiểu mới.

```xml
<style name="ParentStyle">
    <item name="android:textColor">#FF0000</item>
</style>

<style name="ParentStyle.ChildStyle">
    <item name="android:textSize">20sp</item>
</style>
```

Trong ví dụ này, chúng tôi đã xác định một kiểu có tên `ParentStyle` để đặt màu văn bản thành màu đỏ (`#FF0000`).
Sau đó, chúng tôi xác định một kiểu mới có tên `ParentStyle.ChildStyle` để đặt kích thước văn bản thành `20sp`.
Vì kiểu mới được đặt tên bằng tên của kiểu gốc (`ParentStyle`), theo sau là dấu chấm,
và sau đó là tên của kiểu mới (`ChildStyle`), nó ngầm đặt `ParentStyle` làm kiểu gốc của `ChildStyle`.
Điều này có nghĩa là bất kỳ chế độ xem nào sử dụng kiểu `ChildStyle` sẽ kế thừa thuộc tính màu văn bản từ `ParentStyle` (màu đỏ) và cũng có kích thước văn bản được đặt thành `20sp`.

> [!CAUTION]
> Điều quan trọng cần lưu ý là ký hiệu dấu chấm chỉ có thể được sử dụng cho con cháu trực tiếp.
> Nếu bạn muốn tạo một kiểu kế thừa từ kiểu ông bà hoặc từ một kiểu trong nhánh khác của hệ thống phân cấp, bạn sẽ cần sử dụng thuộc tính cha.

## Thứ tự ưu tiên tạo kiểu

Khi tạo kiểu cho ứng dụng Android của bạn, điều quan trọng là phải hiểu thứ tự áp dụng kiểu và chủ đề

Đây được gọi là **thứ tự ưu tiên kiểu dáng** hoặc **phân cấp kiểu dáng**
Dưới đây là các cấp độ tạo kiểu khác nhau, được sắp xếp từ mức độ ưu tiên cao nhất (áp dụng đầu tiên) đến mức độ ưu tiên thấp nhất (áp dụng cuối cùng):

1. **Áp dụng kiểu dáng cấp độ ký tự hoặc đoạn văn bằng cách sử dụng các khoảng văn bản cho các lớp có nguồn gốc từ TextView**. 

2. **Áp dụng trực tiếp các thuộc tính riêng lẻ cho View**. Nếu bạn áp dụng một thuộc tính trực tiếp cho một chế độ xem trong tệp bố cục XML của mình, nó sẽ ghi đè bất kỳ thuộc tính tương tự nào được đặt trong một kiểu hoặc chủ đề.

3. **Áp dụng kiểu cho View**. Bạn có thể áp dụng kiểu cho chế độ xem trong tệp bố cục XML của mình. Kiểu này sẽ ghi đè mọi thuộc tính tương tự được đặt trong một chủ đề, nhưng không ghi đè các thuộc tính được áp dụng trực tiếp cho chế độ xem.

4. **Tạo kiểu mặc định**. Android có một tập hợp các kiểu mặc định được áp dụng cho các chế độ xem nếu không có kiểu hoặc thuộc tính nào khác được đặt. Các kiểu mặc định này có mức độ ưu tiên thấp nhất và sẽ bị ghi đè bởi bất kỳ kiểu hoặc thuộc tính nào được áp dụng ở cấp cao hơn.

5. **Áp dụng chủ đề cho collection trong số lượt xem, Activity hoặc toàn bộ Ứng dụng của bạn**. Chủ đề là một kiểu collection có thể áp dụng cho nhiều chế độ xem, một hoạt động hoặc toàn bộ ứng dụng của bạn. Chủ đề được áp dụng trước các kiểu xem riêng lẻ nhưng sau kiểu dáng mặc định.

6. **Áp dụng một số kiểu dáng dành riêng cho chế độ xem**, chẳng hạn như đặt `TextAppearance` trên `TextView`. Một số chế độ xem có các tùy chọn kiểu dáng cụ thể, chẳng hạn như thuộc tính `TextAppearance` cho các lớp `TextView`. Điều này có mức độ ưu tiên thấp nhất.

## Các phương pháp hay nhất

Mã có thể duy trì và ghi đè kiểu đơn giản phải là mục tiêu chính khi làm việc với kiểu và chủ đề.

Để đạt được điều đó, đây là danh sách các phương pháp hay nhất cần tuân theo khi xây dựng ứng dụng Android tiếp theo của bạn:
- **Xác định các thuộc tính chung trong kiểu**

Tránh lặp lại các thuộc tính trên nhiều phần tử UI. Thay vào đó, hãy xác định các thuộc tính chung này trong style.

- **Sử dụng thuộc tính chủ đề thay vì giá trị được mã hóa cứng**

Thay vì các giá trị mã hóa cứng như màu sắc, kích thước hoặc đối tượng có thể vẽ trong kiểu của bạn, hãy sử dụng thuộc tính chủ đề. Cách thực hành này giúp việc thay đổi các giá trị này trong các chủ đề khác nhau trở nên dễ dàng hơn.

```xml
<style name="MyButtonStyle" parent="android:Widget.Button">
    <item name="android:background">?attr/colorPrimary</item>
</style>
```

- **Mở rộng các kiểu hiện có để tương thích**

Khi tạo kiểu của riêng bạn, hãy luôn mở rộng kiểu hiện có từ thư viện framework hoặc `androidx`. Điều này giúp duy trì khả năng tương thích với các kiểu UI của nền tảng. Để mở rộng một kiểu, hãy chỉ định kiểu bạn muốn mở rộng bằng thuộc tính cha. Sau đó, bạn có thể ghi đè các thuộc tính kiểu kế thừa và thêm thuộc tính kiểu mới.

```xml
<style name="MyButtonStyle" parent="Widget.AppCompat.Button">
    <item name="android:textSize">20sp</item>
</style>
```
- **Sử dụng chủ đề ứng dụng cơ bản để đảm bảo tính nhất quán**

Xác định chủ đề cơ bản cho ứng dụng của bạn bao gồm các thuộc tính chung. 
Đối với các phần khác nhau của ứng dụng, nếu bạn cần thay đổi một số thuộc tính, hãy tạo một chủ đề mới kế thừa từ chủ đề cơ sở.

```xml
<!-- Base application theme. -->
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <!-- Customize your theme here. -->
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
</style>

<!-- Special theme for a specific activity. -->
<style name="SpecialActivityTheme" parent="AppTheme">
    <item name="colorPrimary">@color/specialColorPrimary</item>
</style>
```

- **Ghi đè kiểu cho các biến thể**

Trong khi sử dụng các kiểu phổ biến, bạn có thể cần các biến thể cho các màn hình hoặc thành phần khác nhau.
Tránh trùng lặp phong cách. Thay vào đó, hãy ghi đè các thuộc tính theo kiểu mới:

```xml
<!-- Base style for text, defined inside values directory -->
<style name="BaseTextStyle" ...>

<!-- Base style for text, defined inside values-xhdpi directory -->
<style name="BigTextStyle" parent="BaseTextStyle">
  <item name="android:textSize">24sp</item> 
</style>
```

- **Sử dụng chế độ ban đêm**

Android 10 (API cấp 29) trở lên hỗ trợ chủ đề tối trên toàn hệ thống. Bạn có thể sử dụng chủ đề `DayNight` trong ứng dụng của mình để tự động chuyển đổi giữa chủ đề sáng và tối. Điều này cải thiện trải nghiệm người dùng và tiết kiệm pin trên màn hình OLED.

- **Giảm thiểu độ phức tạp của phong cách**

Tránh sử dụng quá nhiều cấp độ lồng nhau của kiểu inheritance. Cố gắng hạn chế ở mức 2-3 để có khả năng bảo trì tốt hơn. Ngoài ra, hãy giảm thiểu việc ghi đè kiểu ở mức cần thiết.








