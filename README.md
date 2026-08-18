# Document Android

Thư viện kiến thức kỹ thuật về Android, Kotlin, Computer Science và Cybersecurity, đi kèm trình đọc Markdown song ngữ English/Vietnamese.

Project hiện có **365 tài liệu**, mỗi tài liệu có bản English gốc và bản dịch tiếng Việt tương ứng. Trình đọc hỗ trợ chuyển đổi **EN/VI** mà không làm thay đổi tài liệu đang mở.

## Tính năng

- Đọc Markdown trực tiếp trên giao diện web.
- Chuyển đổi EN/VI cho từng tài liệu.
- Tìm kiếm theo tiêu đề, đường dẫn và nội dung.
- Điều hướng tài liệu theo cây thư mục.
- Mục lục tự động theo heading.
- Đánh dấu tài liệu yêu thích và lịch sử đọc gần đây.
- Dark mode và giao diện responsive.
- Hiển thị code block, bảng, ảnh và Markdown theo chuẩn GFM.
- Giữ nguyên code, URL, tên API và thuật ngữ kỹ thuật trong bản dịch.

## Công nghệ

- React 19
- Vite 6
- Marked
- DOMPurify
- Lucide React

## Cấu trúc project

```text
.
├── Android/                    # Tài liệu Android gốc (English)
├── ComputerScience/            # Kotlin, CS, Android và Security (English)
├── General/                    # Kiến thức tổng quát (English)
├── resources/                  # Ảnh và tài nguyên của tài liệu
├── tools/
│   └── translate-markdown.mjs  # Công cụ tạo/cập nhật bản dịch
└── viewer/
    ├── src/                    # Source code React
    ├── translations/vi/        # 365 tài liệu tiếng Việt
    ├── package.json
    └── vite.config.js
```

Các file trong `viewer/translations/vi/` có cùng đường dẫn tương đối với file English gốc. Ví dụ:

```text
ComputerScience/00_Fundamentals/00_Essentials/04_WebTechnologies/00_HTTP.md
viewer/translations/vi/ComputerScience/00_Fundamentals/00_Essentials/04_WebTechnologies/00_HTTP.md
```

## Yêu cầu

- Node.js 18 trở lên
- npm

## Chạy project

```bash
cd viewer
npm install
npm run dev
```

Mở địa chỉ được Vite hiển thị trong terminal, mặc định là:

```text
http://localhost:5173
```

## Production build

```bash
cd viewer
npm run build
npm run preview
```

Build output được tạo tại `viewer/dist/`. Trong quá trình build, các tài nguyên cần thiết từ thư mục `resources/` cũng được sao chép vào output.

## Thêm tài liệu

1. Tạo file `.md` trong một trong các thư mục `Android/`, `ComputerScience/` hoặc `General/`.
2. Đặt ảnh dùng chung trong `resources/`.
3. Dùng đường dẫn ảnh dạng:

   ```md
   ![Mô tả ảnh](/resources/example.png)
   ```

4. Tạo bản dịch tiếng Việt có cùng đường dẫn tương đối trong `viewer/translations/vi/`.

Viewer sử dụng `import.meta.glob`, vì vậy tài liệu mới sẽ tự động xuất hiện sau khi khởi động lại dev server hoặc build lại project.

## Cập nhật bản dịch tiếng Việt

Chạy công cụ dịch từ thư mục root:

```bash
node tools/translate-markdown.mjs
```

Công cụ chỉ tạo những bản dịch còn thiếu. Để tạo lại toàn bộ bản dịch:

```bash
node tools/translate-markdown.mjs --force
```

Chuẩn hóa lại các thuật ngữ English-first trong bản dịch hiện có:

```bash
node tools/normalize-vietnamese-terminology.mjs
```

Công cụ tự động bảo vệ:

- Fenced code block và inline code
- Markdown link và URL
- HTML tag
- Tên class, API, acronym và identifier
- Các thuật ngữ kỹ thuật trong glossary

Sau khi cập nhật bản dịch, nên chạy:

```bash
cd viewer
npm run build
```

## Quy ước nội dung

- English là nội dung nguồn.
- Không dịch code, tên class, function, API hoặc identifier.
- Giữ nguyên các thuật ngữ kỹ thuật khi bản dịch tiếng Việt có thể gây mất nghĩa.
- Mỗi file tiếng Việt phải có cùng đường dẫn với file English tương ứng.
- Kiểm tra link và ảnh sau khi thêm hoặc cập nhật tài liệu.
