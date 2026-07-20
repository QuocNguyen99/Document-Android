#CSRF

**Giả mạo yêu cầu trên nhiều trang web (CSRF)** là một lỗ hổng bảo mật nghiêm trọng cho phép kẻ tấn công lừa người dùng thực hiện các hành động ngoài ý muốn trên ứng dụng web. 

Các cuộc tấn công này khai thác sự tin cậy mà một trang web đặt vào trình duyệt của người dùng, cho phép thực thi các yêu cầu độc hại thay mặt cho người dùng đã được xác thực.

## Tìm hiểu các cuộc tấn công CSRF

Các cuộc tấn công CSRF xảy ra khi kẻ tấn công tạo một trang web hoặc email độc hại nhằm đánh lừa trình duyệt của nạn nhân gửi yêu cầu trái phép đến một ứng dụng web được nhắm mục tiêu nơi người dùng đã được xác thực. 
Trình duyệt tự động bao gồm cookie phiên cho trang web mục tiêu, làm cho yêu cầu có vẻ hợp pháp đối với phần phụ trợ của ứng dụng.

Ví dụ: hãy xem xét một ứng dụng web ngân hàng cho phép người dùng chuyển tiền giữa các tài khoản. Một yêu cầu hợp pháp có thể trông như thế này:

```bash
POST /transfer HTTP/1.1
Host: example.com
Cookie: session=abc123

amount=1000&from=checking&to=savings
```

Kẻ tấn công có thể tạo một trang web độc hại chứa biểu mẫu ẩn hoặc tập lệnh tự động gửi cùng một yêu cầu mà người dùng không hề hay biết:

```html
<form action="https://example.com/transfer" method="POST">
  <input type="hidden" name="amount" value="1000">
  <input type="hidden" name="from" value="checking">
  <input type="hidden" name="to" value="attacker_account">
</form>
<script>
  document.forms[0].submit();
</script>
```

Nếu nạn nhân truy cập trang này khi đăng nhập vào ứng dụng ngân hàng, trình duyệt sẽ bao gồm cookie phiên, thực hiện chuyển khoản trái phép mà không có sự đồng ý của người dùng.

##Tác động và rủi ro của CSRF

Rủi ro tiềm ẩn của CSRF bao gồm:

- Giao dịch tài chính trái phép, chẳng hạn như chuyển tiền vào tài khoản của kẻ tấn công.
- Mua hàng hoặc đặt hàng ngoài ý muốn trên các website thương mại điện tử.
- Thay đổi cài đặt tài khoản người dùng, chẳng hạn như mật khẩu hoặc địa chỉ email.
- Đăng hoặc xóa trái phép nội dung trên các nền tảng hoặc diễn đàn truyền thông xã hội.
- Nếu nạn nhân là quản trị viên của một dịch vụ, kẻ tấn công có thể giành quyền kiểm soát toàn bộ ứng dụng.


## Ngăn chặn các cuộc tấn công CSRF

Để ngăn chặn các cuộc tấn công CSRF, các ứng dụng web cần có cơ chế xác minh rằng các yêu cầu bắt nguồn từ các nguồn hợp pháp và được người dùng cố ý thực hiện. 

### 1. Token CSRF:

Mã thông báo CSRF là các giá trị duy nhất, không thể đoán trước được tạo bởi máy chủ và được bao gồm trong mỗi yêu cầu. Máy chủ xác thực cả token và cookie phiên để đảm bảo yêu cầu là hợp pháp. Dưới đây là ví dụ về việc sử dụng mã thông báo CSRF trong biểu mẫu:

```html
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="{{csrf_token}}">
  <input type="text" name="amount">
  <input type="text" name="to">
  <input type="submit" value="Transfer">
</form>
```

Máy chủ tạo một CSRF token duy nhất cho mỗi phiên người dùng và đưa nó vào biểu mẫu. Sau khi gửi biểu mẫu, máy chủ xác minh rằng token khớp với giá trị mong đợi.

Ví dụ:

```js
const express = require('express');
const csrf = require('csurf');
const bodyParser = require('body-parser');

const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Example route
app.get('/form', (req, res) => {
  // Pass the CSRF token to your view (e.g., using a templating engine)
  res.render('send', { csrfToken: req.csrfToken() });
});

app.post('/transfer', csrfProtection, (req, res) => {
  // Process the request if the CSRF token is valid
  res.send('Transfer completed successfully');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

Nếu các mã thông báo khớp nhau, yêu cầu được coi là hợp lệ và được xử lý; nếu không, nó bị từ chối.

### 2. Cookie SameSite:

Thuộc tính cookie `SameSite` hạn chế cách gửi cookie với các yêu cầu trên nhiều trang web. 
Đặt thuộc tính thành `Strict` hoặc `Lax` giúp ngăn chặn việc gửi cookie cùng với các yêu cầu được bắt đầu từ các miền khác.

```js
document.cookie = "session=abc123; SameSite=Strict; Secure;";
```
### 3. Mẫu Cookie gửi hai lần:

Mẫu Cookie gửi đôi liên quan đến việc lưu trữ token ngẫu nhiên trong cookie và bao gồm cùng token dưới dạng trường ẩn trong biểu mẫu. Máy chủ xác thực rằng token trong cookie khớp với token trong dữ liệu biểu mẫu. Đây là một ví dụ:


```html
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="{{csrf_token}}">
  <input type="text" name="amount">
  <input type="text" name="to">
  <input type="submit" value="Transfer">
</form>
<script>
  document.cookie = "csrf_token={{csrf_token}}; SameSite=Strict; Secure;";
</script>
```

Máy chủ tạo CSRF token ngẫu nhiên, lưu trữ nó trong cookie và đưa nó vào dưới dạng trường ẩn trong biểu mẫu. 
Khi biểu mẫu được gửi, máy chủ xác minh rằng token trong cookie khớp với token trong dữ liệu biểu mẫu. 
Nếu các mã thông báo khớp nhau, yêu cầu được coi là hợp lệ; nếu không, nó bị từ chối.


## tài liệu tham khảo:

- https://hyperskill.org/learn/step/48102