# Viết tắt

## Danh sách viết tắt

Có một số cách viết tắt được xác định trước cho các bộ ký tự thường được sử dụng:

- `\d` là chữ số bất kỳ, viết tắt của `[0-9]`;

- `\s` là ký tự khoảng trắng (bao gồm tab và dòng mới), viết tắt của `[ \t\n\x0B\f\r]`;

- `\w` là ký tự chữ và số (chữ cái hoặc chữ số), viết tắt của `[a-zA-Z_0-9]`;

- `\b` là ranh giới từ `\b` trùng với ranh giới giữa:  
  - Một ký tự từ (a-z, A-Z, 0-9, _) và một ký tự không phải từ (như dấu cách hoặc dấu chấm câu).  
  - Bắt đầu hoặc kết thúc một chuỗi.
  
**Ví dụ:** `\ba` khớp với các từ bắt đầu bằng "a", `a\b` khớp với các từ kết thúc bằng "a", `\ba\b` khớp với "a" khi nó đứng một mình.

Ngoài ra còn có những bản sao tiêu cực của những cách viết tắt này

- `\D` là chữ số không chữ số, viết tắt của `[^0-9]`;

- `\S` là ký tự không phải khoảng trắng, viết tắt của `[^ \t\n\x0B\f\r]`;

- `\W` là ký tự không phải chữ và số, viết tắt của `[^a-zA-Z_0-9]`.

- `\B` là ranh giới không từ. Nó khớp với trường hợp ngược lại với trường hợp của tốc ký `\b`: nó tìm thấy kết quả khớp của nó mỗi khi không có `"gap"` giữa các ký tự chữ và số. Ví dụ: `"a\B"` khớp với tất cả các từ bắt đầu bằng `"a"`.

> [!NOTE]
> Mỗi tốc ký có cùng chữ cái đầu tiên như cách biểu thị của nó (chữ số, dấu cách, từ, ranh giới)