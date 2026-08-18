# An ninh chuỗi cung ứng không đầy đủ


## Nó là gì

Rủi ro này liên quan đến việc **ứng dụng của bạn bị xâm phạm thông qua chuỗi cung ứng phần mềm**, không chỉ mã của riêng bạn. 


## Các kịch bản tấn công thường gặp:

- Đưa mã độc vào cơ sở mã của bạn hoặc trong quá trình xây dựng/phát hành process (CI/CD).
- Lạm dụng **thư viện/SDK/nhà cung cấp của bên thứ ba** có lỗ hổng đã biết hoặc ẩn.
- Ăn cắp hoặc sử dụng sai **ký khóa/chứng chỉ** để phân phối phiên bản ứng dụng độc hại "đáng tin cậy".


## Cách phòng ngừa (hành động quan trọng nhất)

- Thực thi **thực hành phát triển an toàn**: đánh giá mã, kiểm tra bảo mật và kiểm soát thay đổi.
- Bảo vệ **khóa ký/chứng chỉ**: lưu trữ an toàn, truy cập hạn chế, nhật ký luân chuyển và kiểm tra.
- Chỉ sử dụng **các dependency đáng tin cậy và được xác thực**; giữ cho chúng được cập nhật và theo dõi.
- Bảo mật **cập nhật/bản vá/bản phát hành** bằng các biện pháp kiểm soát mạnh mẽ (phê duyệt, kiểm tra tính toàn vẹn).
- Liên tục **giám sát và phát hiện** các vấn đề về chuỗi cung ứng: quét phụ thuộc, quét bản dựng, cảnh báo, sẵn sàng ứng phó sự cố.