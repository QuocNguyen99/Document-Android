#Token

Token là một ký tự hoặc mã số chuỗi được sinh ra bởi máy chủ, đại diện cho quyền truy cập của người dùng hoặc một ứng dụng. Khi người dùng đăng nhập thành công vào ứng dụng, máy chủ sẽ tạo ra một token và gửi về cho khách hàng. Client sẽ lưu trữ token này và gửi lại cho máy chủ trong mỗi yêu cầu được gửi đến máy chủ. Máy chủ sẽ kiểm tra token này để đảm bảo rằng yêu cầu từ một người dùng hoặc một ứng dụng hợp lệ.

# Làm mới Token

Tuy nhiên, token chỉ có giới hạn thời gian, khi hết hạn thì khách hàng sẽ không thể sử dụng nó để truy cập vào máy chủ nữa. Để giải quyết vấn đề này, hãy làm mới token được sử dụng. Làm mới token là một số hoặc ký tự chuỗi tương tự như token, nhưng được sử dụng để tạo ra một token mới. Khi token hết hạn, client sẽ sử dụng làm mới token để gửi yêu cầu tới máy chủ và yêu cầu máy chủ sinh ra một token mới. Sau đó, máy chủ sẽ trả về một token mới và một token mới làm mới, và máy khách sẽ lưu trữ chúng để sử dụng cho các yêu cầu tiếp theo.

Từ cơ chế này, use Refresh token giúp đảm bảo rằng người dùng và ứng dụng có thể tiếp tục truy cập vào máy chủ mà không cần đăng nhập lại. Tuy nhiên, việc quản lý và bảo mật làm mới token cũng là một vấn đề quan trọng trong việc phát triển ứng dụng.



    Nếu làm mới token cũng hết hạn thì người dùng sẽ đăng nhập khỏi ứng dụng. Khi đó, người dùng sẽ phải đăng nhập lại và yêu cầu một cặp mới của access token và làm mới token từ máy chủ. Tuy nhiên, để tránh trường hợp này xảy ra, ta nên chắc chắn rằng token sẽ được cập nhật thường xuyên để đảm bảo người dùng có thể sử dụng ứng dụng mà không bị gián đoạn. (Có nghĩa là người dùng có giao tiếp với máy chủ thông tin qua API)


