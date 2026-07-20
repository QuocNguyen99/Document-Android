#Authorization

Authorization trong an ninh mạng là process cấp hoặc từ chối các đặc quyền cụ thể hoặc quyền truy cập vào tài nguyên trong mạng hoặc hệ thống máy tính.

![văn bản thay thế](/resources/cybersecurity_authorization.png)

Cốt lõi của Authorization là quản lý quyền truy cập. 
Trong sơ đồ trên, người dùng cố gắng truy cập vào khu vực quản trị, nhắc hệ thống truy xuất các quyền, yêu cầu hoặc vai trò của người dùng. Các quyền này sau đó được so sánh với các quyền cần thiết cho khu vực quản trị. 
Nếu quyền của người dùng khớp với quyền được yêu cầu thì quyền truy cập sẽ được cấp. Mặt khác, người dùng không được ủy quyền và quyền truy cập bị từ chối, tăng cường bảo mật của hệ thống bằng cách đảm bảo chỉ những người có đặc quyền phù hợp mới có thể thực hiện một số hành động nhất định. process này rất quan trọng trong việc bảo vệ các khu vực nhạy cảm của hệ thống khỏi việc sử dụng trái phép và các mối đe dọa bảo mật tiềm ẩn.

## Kiểm soát truy cập dựa trên vai trò (RBAC)

![văn bản thay thế](/resources/iam_role_based_access_control.png)

**Kiểm soát truy cập dựa trên vai trò (RBAC)** là một phương pháp được sử dụng rộng rãi để quản lý quyền truy cập của người dùng vào tài nguyên và dịch vụ trong hệ thống dựa trên vai trò của họ trong tổ chức.

Không giống như các mô hình truyền thống nơi quyền truy cập được cấp riêng lẻ, RBAC chỉ định quyền cho các vai trò và sau đó người dùng được chỉ định cho các vai trò này. Cách tiếp cận này đơn giản hóa và hợp lý hóa việc quản lý quyền.

Trong RBAC, các quyết định truy cập không dựa trên danh tính cá nhân của người dùng mà dựa trên vai trò của họ.
Mỗi vai trò bao gồm một tập hợp các quyền xác định những hành động mà vai trò đó có thể thực hiện. Bằng cách nhóm các quyền thành các vai trò, việc này sẽ giảm bớt sự phức tạp trong việc gán và quản lý các quyền của từng người dùng.

Việc triển khai RBAC một cách hiệu quả đòi hỏi sự hiểu biết rõ ràng về cơ cấu tổ chức và trách nhiệm của từng vai trò. process thường bao gồm:
- **Xác định vai trò**: Xác định các vai trò riêng biệt trong tổ chức và nhu cầu truy cập tương ứng của chúng.
- **Gán quyền**: Xác định các quyền và quyền truy cập cụ thể mà mỗi vai trò yêu cầu.
- **Phân công người dùng**: Phân bổ người dùng vào các vai trò này dựa trên chức năng công việc của họ.
- **Giám sát và kiểm tra**: Thường xuyên xem xét và cập nhật vai trò, quyền và nhiệm vụ của người dùng để đảm bảo chúng phù hợp với nhu cầu hiện tại của tổ chức và chính sách bảo mật.

Ngoài ra, việc tích lũy các vai trò, được gọi là leo thang vai trò, có thể dẫn đến việc người dùng nhận được quá nhiều quyền, gây ra rủi ro bảo mật. Kiểm tra và cập nhật thường xuyên là điều cần thiết để duy trì tính toàn vẹn của hệ thống RBAC.

## Kiểm soát truy cập dựa trên thuộc tính (ABAC)

![văn bản thay thế](/resources/attribute_based_access_control.png)

**Kiểm soát truy cập dựa trên thuộc tính (ABAC)** là một cách tiếp cận linh hoạt và toàn diện để quản lý quyền truy cập trong các hệ thống và môi trường khác nhau.
ABAC sử dụng phương pháp cấp quyền truy cập động dựa trên sự kết hợp của các thuộc tính. Các thuộc tính này có thể được liên kết với người dùng, tài nguyên, hành động được yêu cầu và bối cảnh hoặc môi trường hiện tại.

Việc triển khai ABAC đòi hỏi sự hiểu biết thấu đáo về nhu cầu bảo mật của tổ chức và phân tích chi tiết về các thuộc tính sẽ được sử dụng trong chính sách kiểm soát truy cập. process này liên quan đến:

- **Xác định thuộc tính**: Xác định các thuộc tính có liên quan của người dùng, tài nguyên, hành động và bối cảnh.

- **Xác định chính sách**: Tạo chính sách chỉ định cách các thuộc tính này tương tác để cho phép hoặc từ chối quyền truy cập.

- **Thực thi chính sách**: Thiết lập hệ thống có thể đánh giá các thuộc tính theo các chính sách này trong thời gian thực.

- **Bảo trì**: Thường xuyên cập nhật các thuộc tính và chính sách để phản ánh những thay đổi trong môi trường tổ chức và các yêu cầu bảo mật.


Ví dụ để xem xét kỹ thuật này:

Hãy xem xét một hệ thống chăm sóc sức khỏe nơi nhân viên y tế cần truy cập vào hồ sơ bệnh nhân. 
Trong trường hợp này, ABAC có hiệu quả cao. 
Bác sĩ có thể truy cập vào hồ sơ y tế đầy đủ của bệnh nhân nếu họ hiện đang điều trị cho bệnh nhân đó (thuộc tính người dùng: bác sĩ, thuộc tính tài nguyên: hồ sơ bệnh nhân, bối cảnh: điều trị đang diễn ra). 
Y tá trong cùng một khoa có thể xem thông tin sức khỏe cơ bản của bệnh nhân nhưng không thể xem đánh giá tâm thần của họ (thuộc tính người dùng: y tá, khoa; thuộc tính tài nguyên: thông tin sức khỏe, đánh giá tâm thần). 
Nhân viên hành chính có thể truy cập thông tin thanh toán nhưng không thể truy cập dữ liệu y tế (thuộc tính người dùng: vai trò quản trị; thuộc tính tài nguyên: thông tin thanh toán).

> [!WARNING]
> Sự phức tạp của việc quản lý nhiều thuộc tính và chính sách có thể rất lớn. 
> Việc đảm bảo tính chính xác và nhất quán của các thuộc tính trên các hệ thống là rất quan trọng, cũng như việc duy trì các chính sách để đảm bảo chúng được cập nhật và phù hợp với các mục tiêu cũng như yêu cầu tuân thủ của tổ chức.

## Danh sách kiểm soát truy cập (ACL)

![văn bản thay thế](/resources/cybersecurity_access_control_list.png)

**Danh sách kiểm soát truy cập (ACL)** là danh sách các quyền được đính kèm với một đối tượng, chỉ định người dùng hoặc quy trình hệ thống nào được cấp quyền truy cập vào đối tượng đó và những hoạt động nào họ có thể thực hiện. Những đối tượng này có thể là tập tin, thư mục hoặc thiết bị mạng.

ACL hoạt động bằng cách duy trì một danh sách các mục, mỗi mục xác định một chủ đề (như người dùng hoặc nhóm) và một hành động liên quan (như đọc, viết hoặc thực thi). Khi người dùng cố gắng truy cập tài nguyên, hệ thống sẽ kiểm tra ACL để xác định xem người dùng có các quyền cần thiết hay không. Quyền truy cập được cấp hoặc từ chối dựa trên kiểm tra này.

Có hai loại ACL chính:
- **ACL tùy ý (DACL)**: Các ACL này do chủ sở hữu tài nguyên kiểm soát. Chủ sở hữu quyết định ai có thể truy cập tài nguyên và họ có những quyền gì.

- **ACL hệ thống (SACL)**: Chúng được sử dụng để kiểm tra và ghi nhật ký bảo mật. Chúng ghi lại các nỗ lực truy cập tài nguyên, dù thành công hay không.

ACL cung cấp một cách đơn giản và hiệu quả để quản lý quyền. Chúng đặc biệt hữu ích trong những môi trường có nhu cầu truy cập tương đối tĩnh và rõ ràng. 


## Tài liệu tham khảo
- https://hyperskill.org/learn/step/40451





























