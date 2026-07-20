# Token

Token là một chuỗi ký tự hoặc mã số được sinh ra bởi server, đại diện cho quyền truy cập của một người dùng hoặc một ứng dụng. Khi người dùng đăng nhập thành công vào ứng dụng, server sẽ sinh ra một token và gửi về cho client. Client sẽ lưu trữ token này và gửi nó lại cho server trong mỗi yêu cầu được gửi đến server. Server sẽ kiểm tra token này để đảm bảo rằng yêu cầu đến từ một người dùng hoặc một ứng dụng hợp lệ.

# Refresh Token

Tuy nhiên, token chỉ có thời hạn giới hạn, khi hết hạn thì client sẽ không thể sử dụng nó để truy cập vào server nữa. Để giải quyết vấn đề này, refresh token được sử dụng. Refresh token là một mã số hoặc chuỗi ký tự tương tự như token, nhưng được sử dụng để tạo ra một token mới. Khi token hết hạn, client sẽ sử dụng refresh token để gửi yêu cầu tới server và yêu cầu server sinh ra một token mới. Sau đó, server sẽ trả về một token mới và một refresh token mới, và client sẽ lưu trữ chúng để sử dụng cho các yêu cầu tiếp theo.

Từ cơ chế này, việc sử dụng refresh token giúp đảm bảo rằng người dùng và ứng dụng có thể tiếp tục truy cập vào server mà không cần đăng nhập lại. Tuy nhiên, việc quản lý và bảo mật refresh token cũng là một vấn đề quan trọng trong việc phát triển ứng dụng.



    Nếu refresh token cũng hết hạn thì người dùng sẽ bị đăng xuất khỏi ứng dụng. Khi đó, người dùng sẽ phải đăng nhập lại và yêu cầu một cặp mới của access token và refresh token từ server. Tuy nhiên, để tránh trường hợp này xảy ra, ta nên đảm bảo rằng refresh token sẽ được cập nhật thường xuyên để đảm bảo cho người dùng có thể sử dụng ứng dụng mà không bị gián đoạn. (Tức có nghĩa là người dùng có giao tiếp với server thông qua API)


