# mũi tiêm SQL

SQL tiêm (SQLi) là một lỗ hổng bảo mật web cho phép kẻ tấn công thực hiện các truy vấn SQL tùy ý trên cơ sở dữ liệu. 

## Ngăn chặn các cuộc tấn công tiêm SQL

Hãy xem cách bạn có thể bảo vệ ứng dụng web của mình khỏi kiểu tấn công này:

1. Xác thực đầu vào của người dùng. Kiểm tra xem nó có hợp lệ không và định dạng nó cho phù hợp. 
Thoát khỏi đầu vào do người dùng cung cấp để DBMS không coi dữ liệu đầu vào của người dùng là câu lệnh SQL.

2. Sử dụng các phiên bản mới nhất của môi trường và ngôn ngữ phát triển, theo quy định, chúng sẽ bảo vệ khỏi SQLi.

3. Đảm bảo rằng người dùng không nhìn thấy thông báo lỗi rò rỉ thông tin nhạy cảm về hoạt động bên trong của ứng dụng.

4. Không sử dụng các tài khoản có đầy đủ quyền để kết nối với cơ sở dữ liệu, tốt hơn hết bạn nên hạn chế quyền. 
Cố gắng sử dụng những người dùng được tạo đặc biệt với các đặc quyền hạn chế. Điều này có thể giảm thiểu tác động của cuộc tấn công tiêm nhiễm SQL.














