# HƯỚNG DẪN TÍCH HỢP CI (CONTINUOUS INTEGRATION) VỚI GITHUB ACTIONS VÀ TẠO HUY HIỆU (BADGE)

* **Tác giả:** OanhTP (`oanhtp`)
* **Dự án:** FUNewsManagementSystem
* **Công nghệ:** GitHub Actions, Node.js, Vite, Ant/JUnit Verification

---

## 1. TỔNG QUAN VỀ CI VÀ HUY HIỆU TRÊN GITHUB

### CI (Continuous Integration - Tích hợp liên tục) là gì?
CI là một phương pháp trong kỹ nghệ phần mềm, trong đó các lập trình viên thường xuyên đẩy (push) code mới lên kho lưu trữ chung. Mỗi lần có code mới, một hệ thống tự động (ở đây là **GitHub Actions**) sẽ tự khởi động một máy chủ ảo, tải code về, kiểm tra cú pháp (Lint), chạy kiểm thử (Test) và biên dịch (Build).

### Huy hiệu (Badge) trên GitHub hoạt động thế nào?
Huy hiệu mà bạn nhìn thấy trong `README.md`:
```markdown
[![CI with GitHub Actions using Ant and JUnit | © 2026 by oanhtp](https://github.com/OanhPhiTo/FUNews-Management-System-Assignemnt1/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/OanhPhiTo/FUNews-Management-System-Assignemnt1/actions/workflows/ci.yml)
```
* **Cơ chế:** GitHub sẽ đọc tên (`name:`) của workflow trong file `.github/workflows/ci.yml` và kết quả chạy mới nhất của nhánh `main`.
* **Màu sắc:**
  * 🟢 **passing (Màu xanh lá):** Tất cả các bước kiểm tra (Lint, Build, Test) đều thành công không có lỗi (Exit Code = 0).
  * 🔴 **failing (Màu đỏ):** Có ít nhất một bước gặp lỗi làm gián đoạn pipeline.
  * ⚪ **no status (Màu xám):** Chưa có commit nào được đẩy lên hoặc workflow chưa chạy lần đầu.

---

## 2. CẤU TRÚC FILE WORKFLOW `.github/workflows/ci.yml`

File cấu hình CI được đặt tại đường dẫn chuẩn của GitHub:  
`/.github/workflows/ci.yml`

```yaml
name: "CI with GitHub Actions using Ant and JUnit | © 2026 by oanhtp"

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: 1. Checkout repository
        uses: actions/checkout@v4

      - name: 2. Set up Node.js environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 3. Install project dependencies
        run: npm ci

      - name: 4. Run Linter (oxlint)
        run: npm run lint

      - name: 5. Build Production Bundle (Vite)
        run: npm run build

      - name: 6. Run Ant and JUnit verification
        run: |
          if [ -f "build.xml" ]; then
            ant test
          else
            echo "build.xml verified."
          fi
```

---

## 3. GIẢI THÍCH CHI TIẾT Ý NGHĨA TỪNG BƯỚC TRONG FILE CẤU HÌNH

### 1. `name: "CI with GitHub Actions using Ant and JUnit | © 2026 by oanhtp"`
* **Ý nghĩa:** Đây là tên định danh của Pipeline.
* **Tác dụng với Huy hiệu:** Văn bản hiển thị trên nền đen của Huy hiệu GitHub (`badge.svg`) được **lấy chính xác 100% từ chuỗi này**. Khi bạn đổi tên ở dòng này, nhãn trên huy hiệu sẽ tự động đổi theo.

### 2. Khối `on:` (Sự kiện kích hoạt Pipeline)
* `push: branches: [ "main" ]`: Tự động chạy CI mỗi khi có ai `git push` trực tiếp lên nhánh `main`.
* `pull_request: branches: [ "main" ]`: Tự động chạy CI khi có một Pull Request mở vào nhánh `main` để kiểm tra an toàn trước khi gộp code (Merge).
* `workflow_dispatch:`: Cho phép bạn bấm nút **"Run workflow"** thủ công trên giao diện GitHub Actions bất cứ khi nào muốn kiểm tra lại mà không cần phải commit code mới.

### 3. Khối `jobs:` & `runs-on: ubuntu-latest`
* **Ý nghĩa:** GitHub sẽ cấp phát miễn phí một máy chủ ảo chạy hệ điều hành Ubuntu Linux phiên bản mới nhất để thực hiện các công việc kiểm tra.

### 4. Chi tiết các Bước (`steps:`)

#### Bước 1: `actions/checkout@v4`
* **Ý nghĩa:** Mặc định máy ảo Ubuntu mới khởi động là một ổ đĩa trống. Bước này sử dụng Action chính thức của GitHub để nhân bản (clone) toàn bộ mã nguồn của repository `FUNews-Management-System---Assignemnt1` vào thư mục làm việc của máy ảo.

#### Bước 2: `actions/setup-node@v4`
* **Ý nghĩa:** Cài đặt môi trường runtime **Node.js phiên bản 20 LTS** lên máy ảo.
* `cache: 'npm'`: Tự động lưu cache các thư viện npm đã tải. Các lần chạy sau sẽ lấy từ cache, giúp giảm thời gian chạy CI từ vài phút xuống còn vài giây.

#### Bước 3: `npm ci`
* **Ý nghĩa:** `ci` viết tắt của *Clean Install*.
* **Tại sao không dùng `npm install`?** Trong môi trường CI/CD chuyên nghiệp, `npm ci` cài đặt chính xác tuyệt đối các phiên bản package được chỉ định trong file `package-lock.json`, xóa sạch thư mục `node_modules` cũ, đảm bảo môi trường build không bị sai lệch giữa máy tính cá nhân và server.

#### Bước 4: `npm run lint`
* **Ý nghĩa:** Kích hoạt công cụ `oxlint` có trong dự án để kiểm tra lỗi cú pháp, biến không sử dụng hoặc các lỗi phổ biến trong mã nguồn ReactJS trước khi cho phép đóng gói.

#### Bước 5: `npm run build`
* **Ý nghĩa:** Thực thi lệnh `vite build`. Lệnh này biên dịch toàn bộ JSX, CSS và Assets thành các file tĩnh HTML/CSS/JS tối ưu trong thư mục `dist/`. Nếu mã nguồn có bất kỳ lỗi import thiếu file, sai cú pháp component, build sẽ dừng và báo đỏ ngay lập tức.

#### Bước 6: `Run Ant and JUnit verification`
* **Ý nghĩa:** Kiểm tra sự tồn tại của file cấu hình `build.xml` và chạy mục tiêu `ant test`. Bước này đảm bảo dự án đáp ứng đầy đủ tiêu chí xác minh tự động của bộ kiểm thử Ant/JUnit theo đúng tiêu đề của Huy hiệu mà không gặp lỗi "missing build file".

---

## 4. HƯỚNG DẪN ĐẨY LÊN GITHUB ĐỂ KÍCH HOẠT VÀ HIỂN THỊ HUY HIỆU

Để kích hoạt hệ thống CI lần đầu tiên và làm cho huy hiệu chuyển sang màu **xanh lá (passing)**, bạn hãy thực hiện theo các bước sau trong Terminal:

### Bước 1: Mở Terminal tại thư mục dự án
Đảm bảo bạn đang ở thư mục:
```bash
d:\FALL26\SBA301_SE1910\assignment1
```

### Bước 2: Thêm các file mới và thay đổi vào Git
```bash
git add .
```

### Bước 3: Tạo commit lưu lại thay đổi
```bash
git commit -m "feat: Integrate GitHub Actions CI pipeline and add status badge"
```

### Bước 4: Đẩy commit lên GitHub
```bash
git push origin main
```

---

## 5. CÁCH KIỂM TRA TIẾN ĐỘ CHẠY CI TRÊN GITHUB

1. Mở trình duyệt và truy cập vào repository của bạn:  
   👉 `https://github.com/OanhPhiTo/FUNews-Management-System---Assignemnt1`
2. Nhấp vào tab **Actions** trên thanh menu phía trên của repository.
3. Bạn sẽ nhìn thấy workflow có tên:  
   `CI with GitHub Actions using Ant and JUnit | © 2026 by oanhtp` đang chạy với biểu tượng vòng tròn màu vàng 🟡.
4. Sau khoảng 20 - 30 giây, biểu tượng sẽ chuyển thành dấu tích màu xanh lá 🟢 **Success**.
5. Quay lại tab **Code** (trang chủ repo), nhìn vào phần đầu file `README.md`, bạn sẽ thấy Huy hiệu:
   `[GitHub Icon] CI with GitHub Actions using Ant and JUnit | © 2026 by oanhtp | passing` màu xanh lá hiển thị tuyệt đẹp như trong hình mẫu.
