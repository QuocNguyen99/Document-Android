## Out of memory case:

"Out of Memory" xảy ra khi ứng dụng cố gắng sử dụng quá nhiều bộ nhớ, vượt quá giới hạn được cấp phát cho ứng dụng. Trong trường hợp này, hệ điều hành sẽ cung cấp một ngoại lệ cho ứng dụng và ứng dụng sẽ bị đóng.

"Memory Leak" là hiện tượng khi một đối tượng được tạo trong ứng dụng, nhưng sau đó không được giải phóng khỏi bộ nhớ khi nó không còn được sử dụng nữa. Khi nhiều đối tượng bị rò rỉ như vậy, bộ nhớ của ứng dụng sẽ bị lấn chiếm và dẫn đến sự cố "Out of Memory".



### Các trường hợp out of memory

* Memory leak
* Đang làm việc với bitmap lớn và chất lượng, load kích thước và tùy chỉnh config phù hợp tùy mục đích sử dụng bitmap

→ How to avoid?

* Ko khai báo biến static cho View, Context
* Unregister các listener trong onPause()/onDestroy()
* Cancel các thread, handler khi rời khỏi Activity

## Deadlock case:

    thread hold tài nguyên ko nhả

## Race condition case:

            Nếu 2 thread đang sử dụng cùng một tài nguyên thì có thể xảy ra tình trạng race condition, khi đó hai thread cùng thực hiện các thao tác trên tài nguyên đó đồng thời, có thể dẫn đến kết quả không đúng hoặc lỗi không mong muốn. Việc sử dụng chung tài nguyên giữa các thread yêu cầu quản lý đồng bộ để đảm bảo tính toàn vẹn và đúng đắn của dữ liệu. Nếu không được quản lý đồng bộ, sẽ xảy ra các lỗi như race condition, deadlock, hoặc dữ liệu bị thay đổi không đồng bộ giữa các thread.

 cách xứ lý ->  ví dụ trong java, mình có thể đặt code có nguy cơ bị race condition vào trong synchronized block, còn kotlin thì sử dụng coroutine.
