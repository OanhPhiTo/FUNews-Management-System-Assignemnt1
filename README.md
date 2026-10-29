[![CI with GitHub Actions using Ant and JUnit | © 2026 by oanhtp](https://github.com/OanhPhiTo/FUNews-Management-System---Assignemnt1/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/OanhPhiTo/FUNews-Management-System---Assignemnt1/actions/workflows/ci.yml)

# FUNewsManagementSystem — Frontend Quản trị ReactJS

* **Course:** SBA301 – Assignment 01 – Working with ReactJS Application
* **Student Name / Project:** `OanhTP` (`oanhtp`)
* **Technologies:** React 19, Vite, JavaScript, React Router v7, Vanilla CSS, LocalStorage Mock Service.
* **Target Score:** 10.0 / 10.0 (Excellent Level).

---

## 📑 MỤC LỤC
1. [Giới thiệu & Mục tiêu](#1-giới-thiệu--mục-tiêu)
2. [Requirement Traceability Matrix (R01 - R12)](#2-requirement-traceability-matrix)
3. [Kiến trúc Component & State Ownership](#3-kiến-trúc-component--state-ownership)
4. [Data Model & Constraints](#4-data-model--constraints)
5. [Quyết định Thiết kế (Design Decisions)](#5-quyết-định-thiết-kế-design-decisions)
6. [Hướng dẫn Cài đặt & Chạy ứng dụng](#6-hướng-dẫn-cài-đặt--chạy-ứng-dụng)
7. [Tài khoản Thử nghiệm (Test Accounts)](#7-tài-khoản-thử-nghiệm-test-accounts)
8. [Các chức năng chính (CRUD, Search, Modals)](#8-các-chức-năng-chính)
9. [Bảng Kiểm thử Toàn diện (Test Matrix)](#9-bảng-kiểm-thử-toàn-diện-test-matrix)
10. [Nhật ký Xử lý lỗi (Debug Logs)](#10-nhật-ký-xử-lý-lỗi-debug-logs)
11. [Bộ câu hỏi Phỏng vấn & Trả lời mẫu (Interview Prep)](#11-bộ-câu-hỏi-phỏng-vấn--trả-lời-mẫu-interview-prep)
12. [Bài tập Thay đổi Yêu cầu (Transfer / Modification Tasks)](#12-bài-tập-thay-đổi-yêu-cầu-transfer--modification-tasks)
13. [Nhật ký Sử dụng AI (AI Usage Log)](#13-nhật-ký-sử-dụng-ai-ai-usage-log)
14. [Tự đánh giá theo Rubric (10.0 Điểm)](#14-tự-đánh-giá-theo-rubric-100-điểm)

---

## 1. GIỚI THIỆU & MỤC TIÊU

Dự án **FUNewsManagementSystem** là một ứng dụng Đơn trang (Single Page Application - SPA) được xây dựng hoàn toàn bằng **ReactJS** và **Vite**. Ứng dụng cung cấp bảng điều khiển quản trị cho phép quản lý danh mục tin tức (Category), các bài báo (News / Articles) và tài khoản người dùng (User Accounts).

### Mục tiêu kỹ thuật đạt được:
* Không reload toàn bộ trang khi chuyển màn hình (Pure SPA).
* Xác thực người dùng thông qua Mock Authentication (`Admin` / `Admin`) và lưu trữ phiên qua `localStorage`.
* Đầy đủ thao tác **CRUD** (Create, Read, Update, Delete) trên 3 thực thể: Category, News, Users.
* Mọi thao tác Create và Update đều thực hiện thông qua **Popup Dialog (Modal)**.
* Mọi thao tác Delete đều bắt buộc có **Confirmation Dialog** cảnh báo trước khi xóa.
* Tính năng **Search** tức thời (Real-time), không làm mất hoặc ghi đè danh sách gốc (Non-destructive search).
* Thiết kế giao diện bằng Vanilla CSS tinh giản, thanh lịch, **không sử dụng icon bên ngoài**, bố cục chuẩn responsive.

---

## 2. REQUIREMENT TRACEABILITY MATRIX

| ID | Requirement | Component liên quan | Entity / Dữ liệu | Hành vi UI (Expected UI Behavior) | Trạng thái |
|---|---|---|---|---|---|
| **R01** | ReactJS + Vite | `App.jsx`, `main.jsx` | - | Ứng dụng khởi động cực nhanh, chuyển trang không load lại trình duyệt (SPA). | **PASS** |
| **R02** | Login Form & Validation | `LoginPage.jsx` | User | Form nhập username, password; bắt lỗi rỗng và sai thông tin; submit bằng enter/button. | **PASS** |
| **R03** | Admin Authentication | `authService.js`, `ProtectedRoute.jsx` | `currentUser` | Chặn truy cập trái phép vào `/admin/*` nếu chưa đăng nhập; hỗ trợ logout. | **PASS** |
| **R04** | Logo tạo bằng AI | `Header.jsx`, `public/logo.png` | Image Asset | Logo chữ F kết hợp cuốn sách màu xanh navy & cam tại góc trái Header. | **PASS** |
| **R05** | Header + Admin Layout | `AdminLayout.jsx`, `Header.jsx` | - | Header cố định trên cùng, hiển thị tên User, Role và nút Logout; có Sidebar bên trái. | **PASS** |
| **R06** | Menu Navigation | `Sidebar.jsx`, `App.jsx` | `activeMenu` | Chuyển trang mượt mà qua các route: Dashboard, Category, News, Users, Settings. | **PASS** |
| **R07** | Category CRUD + Search | `CategoryManagement.jsx` | `Category` | Bảng danh mục, tìm kiếm theo tên, thêm/sửa bằng popup dialog, xóa có xác nhận. | **PASS** |
| **R08** | News CRUD + Search | `NewsManagement.jsx` | `News`, `Category` | Bảng tin tức hiển thị Category Name, tìm kiếm theo tiêu đề/nội dung, CRUD qua modal. | **PASS** |
| **R09** | User CRUD + Search | `UserManagement.jsx` | `User` | Bảng người dùng, phân quyền Admin/Staff, CRUD qua modal, chặn tự xóa tài khoản đang đăng nhập. | **PASS** |
| **R10** | Create/Update qua Dialog | `Modal.jsx` | Tất cả entity | Form popup nổi lên trên màn hình (overlay), có nút Save/Cancel, tự động validate. | **PASS** |
| **R11** | Delete Confirmation | `ConfirmModal.jsx` | Tất cả entity | Modal hỏi "Are you sure you want to delete...?", Cancel giữ nguyên, Confirm xóa bất biến. | **PASS** |
| **R12** | Mock Data & LocalStorage | `categoryService`, `newsService`, `userService` | LocalStorage | F5 hoặc đóng trình duyệt không mất dữ liệu; có nút Reset Factory Default trong Settings. | **PASS** |

---

## 3. KIẾN TRÚC COMPONENT & STATE OWNERSHIP

### Cây Component (Component Tree)
```text
App
├── LoginPage (Công khai, kiểm tra đăng nhập)
└── ProtectedRoute (Bảo vệ tuyến đường)
    └── AdminLayout (Layout khung quản trị)
        ├── Header (Logo AI, Chào User, Hiển thị Role, Nút Logout)
        ├── Sidebar (Menu dọc: Dashboard, Category, News, Users, Settings)
        └── ContentArea (<Outlet />)
            ├── DashboardPage (Thống kê số lượng, tin tức mới, danh mục)
            ├── CategoryManagement
            │   ├── SearchBar
            │   ├── Table (Danh sách Category, status badge)
            │   ├── Modal (Create / Update Category Form)
            │   └── ConfirmModal (Xác nhận xóa)
            ├── NewsManagement
            │   ├── SearchBar
            │   ├── Table (Hiển thị Category Name thay vì ID, tags)
            │   ├── Modal (Create / Update News Form, Dropdown Category)
            │   └── ConfirmModal (Xác nhận xóa)
            ├── UserManagement
            │   ├── SearchBar
            │   ├── Table (Admin/Staff role badges)
            │   ├── Modal (Create / Update User Form, Username uniqueness)
            │   └── ConfirmModal (Xác nhận xóa & cảnh báo tự xóa)
            └── SettingsPage (Thông tin phiên làm việc & nút Reset Mock Database)
```

### Bản đồ Sở hữu Trạng thái (State Ownership Map)
1. **Auth State (`currentUser`, `isAuthenticated`):**
   * Được quản lý tập trung trong `authService.js` và đồng bộ vào `localStorage` (`key: currentUser`).
   * Mục đích: Giúp phiên đăng nhập tồn tại qua các lần F5 hoặc mở lại tab mới.
2. **Shared Data Layer (`categories`, `news`, `users`):**
   * Được quản lý bởi các Service riêng (`categoryService`, `newsService`, `userService`).
   * Lưu trữ dưới dạng JSON string trong `localStorage` (`funews_categories`, `funews_articles`, `funews_users`).
3. **Local Page State (Trong từng trang Quản lý):**
   * `searchTerm`: Chuỗi từ khóa tìm kiếm (Controlled input).
   * `isModalOpen` & `modalMode`: Trạng thái đóng/mở popup và chế độ `'create'` hoặc `'update'`.
   * `formData` & `formErrors`: Dữ liệu và lỗi của form trong Modal.
   * `isConfirmOpen` & `itemToDelete`: Quản lý popup xác nhận xóa.
   * `displayedItems` (Derived State): Mảng dữ liệu lọc bằng `useMemo()`, không làm thay đổi mảng dữ liệu gốc.

---

## 4. DATA MODEL & CONSTRAINTS

### Thực thể Category (Danh mục)
```typescript
interface Category {
  id: number;       // Khóa chính, tự tăng, duy nhất
  name: string;     // Tên danh mục, bắt buộc không rỗng
  status: number;   // 1 = Active, 0 = Inactive
}
```

### Thực thể News / Article (Bài viết tin tức)
```typescript
interface News {
  id: number;             // Khóa chính, duy nhất
  title: string;          // Tiêu đề, bắt buộc không rỗng
  content: string;        // Nội dung chi tiết, bắt buộc không rỗng
  categoryId: number;     // Khóa ngoại, phải trỏ đến Category hợp lệ
  createdBy: string;      // Tên tài khoản tác giả (mặc định lấy từ currentUser)
  status: number;         // 1 = Active (Published), 0 = Inactive (Draft)
  tags: string[];         // Danh sách thẻ phân loại bài viết
}
```

### Thực thể User (Tài khoản)
```typescript
interface User {
  id: number;             // Khóa chính, duy nhất
  username: string;       // Bắt buộc, duy nhất (không được trùng lặp)
  password: string;       // Mật khẩu xác thực
  role: number;           // 1 = Admin, 2 = Staff
  status: number;         // 1 = Active, 0 = Inactive
}
```

---

## 5. QUYẾT ĐỊNH THIẾT KẾ (DESIGN DECISIONS)

1. **Phân tách Tầng Dịch vụ Dữ liệu (Service Layer Separation):**
   * Toàn bộ thao tác CRUD và `localStorage` được đặt tại thư mục `src/services/`.
   * *Ý nghĩa thực tế:* Khi nâng cấp lên Spring Boot Backend ở các môn học tiếp theo, lập trình viên chỉ cần thay thế các hàm trong service bằng `axios.get()` hoặc `fetch()`, giao diện React Component hoàn toàn không phải viết lại.
2. **Cập nhật Bất biến (Immutable Updates):**
   * Tuyệt đối không dùng `push()`, `splice()` hoặc gán đè trực tiếp thuộc tính của object.
   * Sử dụng Spread Operator `[...list, newItem]`, `.map()` cho Update và `.filter()` cho Delete để kích hoạt cơ chế Virtual DOM Re-render của React một cách chính xác.
3. **Form Kiểm soát (Controlled Components):**
   * Mọi `<input>`, `<select>`, `<textarea>` đều được kiểm soát 100% bằng React State. Giúp thực hiện kiểm tra tính hợp lệ (Validation) tức thì trước khi ghi dữ liệu.
4. **Tìm kiếm Không Phá hủy Dữ liệu (Non-destructive Real-time Search):**
   * Giữ nguyên mảng nguồn `newsList`. Mảng hiển thị `displayedNews` được tính toán tự động qua `useMemo` dựa trên từ khóa tìm kiếm đã được chuẩn hóa (`trim()`, `toLowerCase()`). Khi xóa ô tìm kiếm, danh sách cũ ngay lập tức xuất hiện đầy đủ.
5. **Popup Dialog Tái sử dụng (Reusable Modals):**
   * Tạo 2 component chung `Modal.jsx` (chứa Form) và `ConfirmModal.jsx` (hỏi xác nhận xóa). Có tính năng chặn sự kiện nổi bọt (`e.stopPropagation()`) để click vào vùng nội dung không làm đóng modal ngoài ý muốn.
6. **Bảo vệ Tài khoản Hiện tại (Self-Deletion Safeguard):**
   * Trong màn hình Quản lý Người dùng, nút Delete của chính tài khoản đang đăng nhập sẽ bị vô hiệu hóa (Disabled), ngăn chặn tình trạng người quản trị tự xóa chính mình gây lỗi phiên làm việc.

---

## 6. HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### Bước 1: Mở Terminal tại thư mục dự án
```bash
cd d:\SBA302\assignment1
```

### Bước 2: Cài đặt thư viện phụ thuộc (Dependencies)
```bash
npm install
```

### Bước 3: Khởi động môi trường phát triển (Development Server)
```bash
npm run dev
```

### Bước 4: Mở ứng dụng trên trình duyệt
Truy cập địa chỉ hiển thị trên Terminal:
```text
http://localhost:5173/
```

### Bước 5: Kiểm tra biên dịch Production (Verification Build)
```bash
npm run build
```

---

## 7. TÀI KHOẢN THỬ NGHIỆM (TEST ACCOUNTS)

| Username | Password | Phân quyền (Role) | Trạng thái (Status) | Ghi chú |
|---|---|---|---|---|
| `Admin` | `Admin` | 1 (Administrator) | 1 (Active) | Tài khoản quản trị viên cao cấp nhất theo yêu cầu đề bài. |
| `staff1` | `123` | 2 (Staff) | 1 (Active) | Tài khoản nhân viên thử nghiệm. |
| `staff2` | `123` | 2 (Staff) | 0 (Inactive) | Tài khoản nhân viên đang bị vô hiệu hóa. |

---

## 8. CÁC CHỨC NĂNG CHÍNH

### 1. Quản lý Danh mục (Category Management)
* **Hiển thị (Read):** Danh sách dạng bảng gồm ID, Tên danh mục, Trạng thái (Active/Inactive có huy hiệu màu sắc tương ứng) và Cột Actions.
* **Tìm kiếm (Search):** Tìm kiếm theo tên danh mục, không phân biệt chữ hoa/thường, loại bỏ khoảng trắng thừa.
* **Tạo mới (Create Dialog):** Nhấn nút `+ Add Category`, popup hiển thị form nhập Tên và chọn Trạng thái. Bắt buộc tên không được để trống.
* **Chỉnh sửa (Update Dialog):** Nhấn `Edit`, popup tự động đổ dữ liệu cũ của danh mục đó vào form, cho phép sửa tên và đổi trạng thái.
* **Xóa (Delete Confirmation):** Nhấn `Delete`, popup xác nhận hỏi tên danh mục cần xóa. Bấm `Cancel` không làm thay đổi dữ liệu; bấm `Confirm Delete` sẽ xóa mục đó khỏi danh sách.

### 2. Quản lý Tin tức (News Management)
* **Hiển thị (Read):** Bảng hiển thị Tiêu đề, Tên danh mục (được chuyển đổi từ `categoryId` sang Tên danh mục dễ đọc), Tác giả (`createdBy`), Thẻ phân loại (`tags`), Trạng thái và Cột Actions.
* **Tìm kiếm (Search):** Tìm kiếm theo Tiêu đề hoặc Nội dung bài viết.
* **Tạo mới (Create Dialog):** Nhập Tiêu đề, chọn Danh mục từ Dropdown, nhập Tags (cách nhau bằng dấu phẩy), chọn Trạng thái và nhập Nội dung. Tác giả tự động được gắn là người đang đăng nhập.
* **Chỉnh sửa (Update Dialog):** Cho phép chỉnh sửa lại thông tin bài viết.
* **Xóa (Delete Confirmation):** Popup xác nhận xóa bài viết.

### 3. Quản lý Người dùng (User Management)
* **Hiển thị (Read):** Bảng hiển thị ID, Tên đăng nhập, Quyền hạn (Role 1 - Admin, Role 2 - Staff), Trạng thái và Cột Actions.
* **Tìm kiếm (Search):** Tìm kiếm theo tên tài khoản.
* **Tạo mới (Create Dialog):** Kiểm tra tên đăng nhập bắt buộc và không được trùng với các tài khoản đã có; bắt buộc nhập mật khẩu.
* **Chỉnh sửa (Update Dialog):** Cho phép sửa quyền hạn, trạng thái hoặc đổi mật khẩu mới (nếu để trống mật khẩu sẽ giữ nguyên mật khẩu cũ).
* **Xóa (Delete Confirmation):** Có cơ chế kiểm tra an toàn: nếu tài khoản đó là người đang đăng nhập (`currentUser`), nút Delete sẽ bị mờ và không cho phép xóa.

### 4. Bảng điều khiển (Dashboard) & Cài đặt (Settings)
* **Dashboard:** Thống kê trực tiếp số lượng Categories, News, Users và hiển thị danh sách bài viết mới nhất.
* **Settings:** Hiển thị thông tin phiên làm việc hiện tại và cung cấp nút **Reset Mock Data to Initial Seed** giúp đưa toàn bộ dữ liệu về trạng thái mẫu ban đầu bất cứ lúc nào.

---

## 9. BẢNG KIỂM THỬ TOÀN DIỆN (TEST MATRIX)

| Test ID | Nhóm kiểm thử | Hành động kiểm thử (Input / Action) | Kết quả mong đợi (Expected Result) | Đánh giá |
|---|---|---|---|---|
| **TC-AUTH-01** | Login | Nhấn nút "Login" khi để trống cả username và password | Báo lỗi màu đỏ: "Please enter both username and password." | **PASS** |
| **TC-AUTH-02** | Login | Nhập `admin` (chữ thường) và `123` | Báo lỗi: "Invalid username or password" | **PASS** |
| **TC-AUTH-03** | Login | Nhập đúng `Admin` / `Admin` | Đăng nhập thành công, điều hướng về `/admin/dashboard` | **PASS** |
| **TC-AUTH-04** | Auth Guard | Gõ trực tiếp `http://localhost:5173/admin/news` khi chưa đăng nhập | ProtectedRoute chặn lại và đá về trang `/login` | **PASS** |
| **TC-AUTH-05** | Auth Guard | Bấm nút "Logout" tại thanh Header | Xóa session `currentUser`, đưa người dùng về `/login` | **PASS** |
| **TC-AUTH-06** | Persistence | Đang ở Dashboard, bấm F5 reload trình duyệt | Vẫn ở lại Dashboard, giữ nguyên thông tin đăng nhập | **PASS** |
| **TC-CAT-01** | Category | Mở trang `/admin/categories` | Hiển thị đầy đủ danh sách 4 danh mục ban đầu | **PASS** |
| **TC-CAT-02** | Category | Bấm "+ Add Category", để trống tên và bấm Create | Báo lỗi: "Category name is required and cannot be empty." | **PASS** |
| **TC-CAT-03** | Category | Thêm danh mục mới "Sports & Athletics", status Active | Bảng cập nhật thêm dòng mới, LocalStorage được cập nhật | **PASS** |
| **TC-CAT-04** | Category | Bấm "Edit" danh mục vừa tạo, đổi tên thành "FPT Sports", status Inactive | Bảng cập nhật tên mới và huy hiệu chuyển sang "Inactive" xám | **PASS** |
| **TC-CAT-05** | Category | Bấm "Delete" -> Popup mở ra -> Bấm "Cancel" | Popup đóng lại, danh mục không bị xóa | **PASS** |
| **TC-CAT-06** | Category | Bấm "Delete" -> Bấm "Confirm Delete" | Danh mục bị xóa khỏi bảng và LocalStorage | **PASS** |
| **TC-CAT-07** | Category | Nhập vào ô Search: "tech" | Bảng chỉ hiển thị dòng "Technology & Innovation" | **PASS** |
| **TC-CAT-08** | Category | Nhập từ khóa không tồn tại "xyz123" | Bảng hiển thị thông báo "No categories matching 'xyz123'..." | **PASS** |
| **TC-CAT-09** | Category | Nhấn nút "Clear" trên ô tìm kiếm | Bảng trở lại danh sách đầy đủ ban đầu | **PASS** |
| **TC-NEWS-01** | News | Mở trang `/admin/news` | Hiển thị bảng tin tức kèm Tên Danh mục (không phải ID thô) | **PASS** |
| **TC-NEWS-02** | News | Bấm "+ Add News Article", nhập thiếu tiêu đề hoặc nội dung | Báo lỗi validation đỏ tại từng trường bị thiếu | **PASS** |
| **TC-NEWS-03** | News | Nhập đủ Title, Content, chọn Category, nhập Tags "AI, Web" | Bài viết mới xuất hiện trên đầu bảng, tác giả là `Admin` | **PASS** |
| **TC-NEWS-04** | News | Sửa bài viết vừa tạo, đổi Category sang danh mục khác | Bảng cập nhật đúng tên danh mục mới | **PASS** |
| **TC-NEWS-05** | News | Xóa bài viết có xác nhận qua modal | Bài viết bị xóa khỏi danh sách an toàn | **PASS** |
| **TC-NEWS-06** | News | Tìm kiếm bài viết theo từ khóa trong nội dung bài viết | Bảng lọc chính xác các bài viết chứa từ khóa đó | **PASS** |
| **TC-USER-01** | Users | Mở trang `/admin/users` | Hiển thị danh sách tài khoản kèm phân quyền Role 1/2 | **PASS** |
| **TC-USER-02** | Users | Thêm user mới với username trùng tên `Admin` đã có | Báo lỗi: "Username already exists. Please choose another." | **PASS** |
| **TC-USER-03** | Users | Thêm user mới `staff_test`, role 2 Staff, password `123` | User mới được tạo thành công | **PASS** |
| **TC-USER-04** | Users | Kiểm tra dòng của tài khoản `Admin` đang đăng nhập | Nút Delete bị disabled, có nhãn ghi chú "(Current User)" | **PASS** |
| **TC-USER-05** | Users | Xóa tài khoản `staff_test` | Xóa thành công sau khi xác nhận qua modal | **PASS** |
| **TC-SET-01** | Settings | Bấm nút "Reset Mock Data to Initial Seed" và xác nhận | Dữ liệu toàn hệ thống được khôi phục về trạng thái ban đầu | **PASS** |

---

## 10. NHẬT KÝ XỬ LÝ LỖI (DEBUG LOGS)

### Debug Log 01: Sự kiện Reload trang khi submit form (Default Form Reload)
* **Triệu chứng (Symptom):** Khi nhấn nút "Login" trên trang đăng nhập hoặc nút "Save" trong Modal, trình duyệt bị chớp trắng và tải lại toàn bộ trang, làm mất trạng thái Form.
* **Giả thuyết (Hypothesis):** Thẻ `<form>` trong HTML chuẩn có hành vi mặc định là gửi HTTP POST/GET và reload trang nếu không có JavaScript chặn lại.
* **Cách kiểm tra (How Checked):** Đặt `console.log('submitting')` trong hàm xử lý submit và quan sát tab Console trong DevTools bị xóa sạch ngay sau khi bấm.
* **Nguyên nhân gốc rễ (Root Cause):** Chưa gọi phương thức `e.preventDefault()` của sự kiện Submit.
* **Cách khắc phục (Fix):** Đặt `e.preventDefault();` ngay dòng đầu tiên của tất cả các hàm xử lý submit form (`handleLogin`, `handleSubmit` của Category, News, User).
* **Kiểm tra lại (Retest):** Bấm submit, trang không hề bị load lại, React xử lý logic mượt mà.

### Debug Log 02: Lỗi Event Bubbling làm đóng Modal ngoài ý muốn
* **Triệu chứng (Symptom):** Khi click vào bất kỳ ô input hoặc vùng nội dung nào bên trong Modal, Modal đột ngột bị đóng lại như khi click ra ngoài màn hình nền.
* **Giả thuyết (Hypothesis):** Sự kiện `click` từ các phần tử con bên trong hộp Modal đã lan truyền (Bubble up) lên phần tử cha `.modal-overlay` vốn đang gắn sự kiện `onClick={onClose}`.
* **Cách kiểm tra (How Checked):** Thêm sự kiện click vào `.modal-box` và kiểm tra `event.target`.
* **Nguyên nhân gốc rễ (Root Cause):** Chưa chặn sự kiện nổi bọt (Event Bubbling) trên phần tử hộp thoại (`modal-box`).
* **Cách khắc phục (Fix):** Thêm thuộc tính `onClick={(e) => e.stopPropagation()}` vào thẻ `<div>` của `.modal-box`.
* **Kiểm tra lại (Retest):** Click vào form, gõ phím, chọn dropdown hoàn toàn bình thường; chỉ khi click vào vùng nền mờ bên ngoài thì modal mới đóng lại.

### Debug Log 03: Ngăn chặn tự xóa tài khoản đang đăng nhập (Current User Self-Deletion)
* **Triệu chứng (Symptom):** Người dùng đang đăng nhập bằng tài khoản `Admin` có thể vô tình bấm xóa tài khoản `Admin` trong danh sách Users, dẫn đến dữ liệu người dùng bị mất trong khi phiên đăng nhập vẫn còn tồn tại.
* **Giả thuyết (Hypothesis):** Thiếu điều kiện ràng buộc giữa ID của `currentUser` và dòng user đang được thao tác.
* **Cách kiểm tra (How Checked):** Kiểm tra danh sách người dùng và hàm `handleOpenDelete`.
* **Nguyên nhân gốc rễ (Root Cause):** Nút xóa không kiểm tra quyền hạn đối với phiên làm việc hiện tại.
* **Cách khắc phục (Fix):** Trong `UserManagement.jsx`, so sánh `user.username === currentUser?.username`. Nếu trùng, vô hiệu hóa nút Delete (`disabled`, `opacity: 0.5`) và bổ sung modal cảnh báo bảo vệ an toàn hệ thống.
* **Kiểm tra lại (Retest):** Không thể xóa tài khoản của chính mình; các tài khoản khác vẫn xóa bình thường sau khi xác nhận.

---

## 11. BỘ CÂU HỎI PHỎNG VẤN & TRẢ LỜI MẪU (INTERVIEW PREP)

Dưới đây là 16 câu hỏi thường gặp nhất của giảng viên trong buổi vấn đáp bảo vệ Assignment 01 cùng câu trả lời chuẩn xác:

#### Q1: Component trong ReactJS là gì?
> **Trả lời:** Component là một khối xây dựng giao diện độc lập, có thể tái sử dụng. Trong React hiện đại, Component là một hàm JavaScript (Function Component) nhận đầu vào là `props` và trả về mã JSX mô tả giao diện sẽ được render lên màn hình.

#### Q2: JSX là gì? Trình duyệt có đọc trực tiếp được JSX không?
> **Trả lời:** JSX (JavaScript XML) là cú pháp mở rộng cho phép viết mã giống HTML ngay trong file JavaScript. Trình duyệt không thể đọc trực tiếp JSX; công cụ build (như Vite sử dụng ESBuild/Babel) sẽ biên dịch JSX thành các hàm JavaScript thuần túy (`React.createElement` hoặc JSX runtime `_jsx`).

#### Q3: Props khác State như thế nào?
> **Trả lời:** 
> * **Props (Properties):** Là dữ liệu được truyền từ Component cha xuống Component con (luồng dữ liệu 1 chiều - Top-down), Component con chỉ đọc (`read-only`) và không được tự ý sửa props.
> * **State:** Là dữ liệu nội bộ do chính Component đó quản lý và sở hữu, có thể thay đổi theo thời gian thông qua hàm cập nhật state (như `useState`), và khi state thay đổi thì Component sẽ được kích hoạt re-render.

#### Q4: Khi nào một React Component bị Re-render?
> **Trả lời:** Component sẽ re-render khi: (1) State nội bộ của nó thay đổi qua hàm setter; (2) Props truyền từ component cha bị thay đổi; (3) Component cha của nó bị re-render; (4) Context mà nó đang lắng nghe có sự thay đổi giá trị.

#### Q5: Tại sao tuyệt đối không được mutate state trực tiếp (ví dụ: `list.push(item)`)?
> **Trả lời:** React sử dụng cơ chế so sánh nông (Shallow comparison) theo tham chiếu bộ nhớ để phát hiện thay đổi. Nếu ta mutate trực tiếp mảng cũ (`list.push()`), địa chỉ ô nhớ của mảng không hề đổi, React sẽ nghĩ dữ liệu chưa thay đổi và không kích hoạt re-render giao diện. Luôn phải dùng cập nhật bất biến như `setList([...list, newItem])` để tạo ra một vùng nhớ mới.

#### Q6: Controlled Input là gì?
> **Trả lời:** Controlled Input là một thẻ input mà giá trị hiển thị của nó được kiểm soát hoàn toàn bởi React State thông qua thuộc tính `value={state}` và mọi sự thay đổi khi người dùng gõ phím được lắng nghe qua `onChange={(e) => setState(e.target.value)}`.

#### Q7: Tại sao khi render danh sách bằng hàm `.map()` bắt buộc phải có thuộc tính `key`?
> **Trả lời:** Thuộc tính `key` giúp thuật toán đối soát (Reconciliation / Virtual DOM Diffing) của React xác định chính xác phần tử nào đã được thêm, sửa hoặc xóa trong danh sách. Nếu không có `key` duy nhất (hoặc dùng index mảng khi thứ tự thay đổi), React sẽ phải re-render lại toàn bộ danh sách, gây giảm hiệu năng và lỗi trạng thái form.

#### Q8: Hàm `e.preventDefault()` trong form submit có tác dụng gì?
> **Trả lời:** Mặc định khi một form HTML được submit, trình duyệt sẽ gửi request HTTP và tải lại toàn bộ trang. Trong ứng dụng Single Page Application (SPA), ta gọi `e.preventDefault()` để ngăn chặn hành vi reload này, giữ nguyên trang hiện tại và xử lý logic gửi dữ liệu bằng JavaScript.

#### Q9: Luồng Đăng nhập (Login Flow) của hệ thống hoạt động ra sao?
> **Trả lời:** 
> 1. Người dùng nhập username/password và bấm Login.
> 2. `LoginPage` gọi hàm `authService.login(username, password)`.
> 3. Hàm kiểm tra nếu trùng `Admin`/`Admin` sẽ lưu thông tin user vào `localStorage` dưới key `currentUser` và trả về kết quả thành công.
> 4. `LoginPage` dùng hook `useNavigate()` để chuyển hướng sang `/admin/dashboard`.
> 5. Component `ProtectedRoute` kiểm tra `authService.isAuthenticated()` thấy hợp lệ nên cho phép render `AdminLayout`.

#### Q10: Quy trình Thêm mới (Create Flow) qua Dialog hoạt động thế nào?
> **Trả lời:**
> 1. Bấm "+ Add", set `modalMode = 'create'`, reset form trắng, set `isModalOpen = true`.
> 2. Người dùng nhập dữ liệu vào các ô controlled input.
> 3. Khi bấm Submit, hàm validate kiểm tra tính hợp lệ (không rỗng, tên duy nhất).
> 4. Gọi Service tạo bản ghi mới với ID tự sinh (`Math.max(...ids) + 1`), lưu vào `localStorage`.
> 5. Cập nhật state danh sách ở component cha, đóng Modal, bảng dữ liệu tự động hiển thị dòng mới.

#### Q11: Quy trình Chỉnh sửa (Update Flow) theo ID hoạt động thế nào?
> **Trả lời:**
> 1. Bấm nút "Edit" tại một hàng, truyền object của hàng đó vào handler.
> 2. Set `modalMode = 'update'`, lưu item vào `selectedItem`, đổ dữ liệu cũ vào `formData`.
> 3. Mở Modal hiển thị dữ liệu sẵn có. Người dùng chỉnh sửa các trường mong muốn.
> 4. Khi Submit và validate thành công, gọi `service.update(selectedItem.id, formData)`.
> 5. Service duyệt mảng bằng `.map()`, tìm phần tử có `id === targetId` để ghi đè thuộc tính mới, lưu vào `localStorage`.
> 6. State được cập nhật và Modal đóng lại.

#### Q12: Modal Xác nhận Xóa (Delete Confirmation) hoạt động ra sao?
> **Trả lời:** Khi nhấn Delete, hệ thống không xóa ngay mà mở `ConfirmModal`, truyền vào thông tin đối tượng cần xóa. Nếu người dùng bấm "Cancel", chỉ đơn giản đóng modal mà không đổi dữ liệu. Nếu bấm "Confirm Delete", component gọi `service.delete(id)` sử dụng phương thức bất biến `list.filter(item => item.id !== id)` để loại bỏ phần tử, sau đó cập nhật lại state.

#### Q13: Phân biệt Source List và Displayed List trong chức năng Tìm kiếm (Search)?
> **Trả lời:**
> * `Source List` (`newsList`): Là danh sách nguồn chứa toàn bộ dữ liệu được tải từ localStorage. Danh sách này không bao giờ bị ghi đè bởi ô tìm kiếm.
> * `Displayed List` (`displayedNews`): Là mảng phái sinh (Derived state) được tính toán tức thời bằng `.filter()` từ Source List dựa trên từ khóa người dùng nhập.
> Nhờ phân tách này, khi người dùng xóa ô tìm kiếm (Clear), dữ liệu gốc lập tức hiển thị lại đầy đủ mà không cần phải truy vấn lại cơ sở dữ liệu.

#### Q14: Khi người dùng bấm F5 (Reload) thì dữ liệu nào bị mất, dữ liệu nào còn?
> **Trả lời:** Toàn bộ JavaScript state nằm trong bộ nhớ RAM của các React component (như `searchTerm`, `isModalOpen`, `formData` đang gõ dở) sẽ bị reset về giá trị khởi tạo ban đầu. Tuy nhiên, dữ liệu danh mục, bài viết, người dùng và phiên đăng nhập `currentUser` vẫn còn nguyên vẹn vì đã được đồng bộ vào `localStorage` của trình duyệt.

#### Q15: Tại sao bài assignment này sử dụng `localStorage` thay vì chỉ dùng mảng JavaScript thuần?
> **Trả lời:** Vì mảng JavaScript thuần chỉ tồn tại trong bộ nhớ RAM tạm thời của trang. Nếu chỉ dùng mảng, mỗi lần người dùng bấm F5 hoặc chuyển trang thì mọi dữ liệu thêm/sửa/xóa sẽ biến mất hoàn toàn. Dùng `localStorage` giúp dữ liệu được lưu bền vững (Persistent) trên trình duyệt, tạo trải nghiệm thực tế như đang kết nối với Database thật.

#### Q16: Nếu sau này kết nối với Spring Boot API thì tầng nào trong project sẽ thay đổi?
> **Trả lời:** Chỉ duy nhất tầng **Service Layer** trong thư mục `src/services/` (`categoryService.js`, `newsService.js`, `userService.js`, `authService.js`) cần thay đổi code để chuyển từ việc đọc/ghi `localStorage` sang gọi HTTP request bằng thư viện `axios` hoặc hàm `fetch()`. Toàn bộ giao diện người dùng, các trang Management, Modal Dialog và các bảng Table ở tầng UI giữ nguyên 100%.

---

## 12. BÀI TẬP THAY ĐỔI YÊU CẦU (TRANSFER / MODIFICATION TASKS)

Để sẵn sàng khi giảng viên yêu cầu sửa đổi hoặc bổ sung tính năng trực tiếp trong buổi phỏng vấn:

### 1. Phân quyền Nhân viên (Staff Role Restriction)
* **Yêu cầu:** Nếu tài khoản đăng nhập có `role === 2` (Staff) thì không cho phép nhìn thấy menu "Users" trên Sidebar và chặn truy cập vào `/admin/users`.
* **Cách thực hiện:**
  * Mở [src/components/Sidebar.jsx](file:///d:/SBA302/assignment1/src/components/Sidebar.jsx): Đọc `user = authService.getCurrentUser()`. Nếu `user.role !== 1`, dùng hàm `.filter()` loại bỏ item `{ path: '/admin/users', label: 'Users' }`.
  * Mở [src/pages/UserManagement.jsx](file:///d:/SBA302/assignment1/src/pages/UserManagement.jsx): Thêm điều kiện kiểm tra ở đầu hàm: nếu `currentUser.role !== 1` thì hiển thị thông báo "Access Denied: Staff accounts do not have permission to view User Management."

### 2. Thêm nút Reset Form trong Modal
* **Yêu cầu:** Thêm nút "Reset" bên cạnh nút Save trong popup Dialog để xóa trắng các trường đang nhập.
* **Cách thực hiện:** Thêm một button `<button type="button" onClick={() => setFormData({ name: '', status: 1 })}>Reset</button>` trong phần footer của `Modal`.

### 3. Lọc Tin tức theo Danh mục (Category Filter Dropdown)
* **Yêu cầu:** Trên thanh Toolbar của trang News, thêm một thẻ `<select>` để lọc bài viết theo danh mục được chọn.
* **Cách thực hiện:**
  * Thêm state `const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('')`.
  * Trong `useMemo()`, thêm điều kiện lọc: `if (selectedCategoryFilter) list = list.filter(item => item.categoryId === Number(selectedCategoryFilter))`.

---

## 13. NHẬT KÝ SỬ DỤNG AI (AI USAGE LOG)

Tuân thủ quy định minh bạch về việc sử dụng Trí tuệ Nhân tạo (Evidence E06):

| STT | Prompt đã sử dụng | Mục đích | Đề xuất của AI | Nội dung Sinh viên đã kiểm tra & xác minh | Kết quả cuối cùng |
|---|---|---|---|---|---|
| **01** | *"A minimalist modern vector logo for FUNewsManagementSystem, an educational news portal management system for FPT University..."* | Tạo biểu trưng Logo theo yêu cầu R04 | Tạo ảnh logo tối giản, màu cam & xanh navy, hình trang sách và chữ F | Kiểm tra kích thước, độ nét, lưu vào thư mục `public/logo.png` và import qua thẻ `<img>` | Logo hiển thị chuẩn trên thanh Header |
| **02** | *"Tạo cấu trúc Service Layer lưu trữ Category, News, User bằng LocalStorage đảm bảo tính bất biến"* | Xây dựng tầng lưu trữ Mock Service độc lập | Cung cấp các hàm CRUD sử dụng Spread Operator, `.map()`, `.filter()` | Kiểm tra các hàm đảm bảo không dùng `.push()`, xử lý ngoại lệ JSON.parse | 3 Service hoạt động ổn định, lưu dữ liệu bền vững |
| **03** | *"Tư vấn kiến trúc Popup Dialog tái sử dụng cho Create & Update"* | Tránh lặp lại code giao diện Dialog ở nhiều màn hình | Tạo component `Modal.jsx` và `ConfirmModal.jsx` có overlay | Kiểm tra sự kiện click ngoài, bổ sung `stopPropagation` chống lỗi bubbling | 100% Dialog đóng mở mượt mà |

---

## 14. TỰ ĐÁNH GIÁ THEO RUBRIC (10.0 ĐIỂM)

| Tiêu chí Rubric | Điểm tối đa | Điểm tự đánh giá | Minh chứng đạt được |
|---|---|---|---|
| **1. Problem Understanding** | 1.0 | **1.0** | Hiểu chuẩn xác phạm vi bài toán, bám sát 100% rubric, không vẽ tính năng dư thừa, có RTM rõ ràng. |
| **2. Solution Design & Reasoning** | 1.5 | **1.5** | Kiến trúc Component phân lớp rõ ràng (UI - Layout - Service Layer), State Ownership tường minh, sử dụng React Router lồng nhau. |
| **3. Implementation** | 2.0 | **2.0** | Hoàn thành đủ 100% chức năng: Login, Header Logo AI, Sidebar, Dashboard, CRUD 3 thực thể, Popup Modal, Confirm Delete, Non-destructive Search. |
| **4. Testing & Verification** | 1.5 | **1.5** | Có Test Matrix chi tiết 26 test cases bao quát mọi kịch bản (Success, Validation Fail, Empty State, Search Miss, Auth Guard). |
| **5. Debugging & Problem Solving** | 1.5 | **1.5** | Có 3 Debug Logs ghi chép theo đúng quy trình chuẩn kỹ thuật (Symptom -> Hypothesis -> Root Cause -> Fix -> Retest). |
| **6. Code Explanation** | 1.0 | **1.0** | Code viết bằng JavaScript trong sáng, có chú thích giải thích chi tiết, chuẩn bị sẵn 16 câu hỏi phỏng vấn. |
| **7. Modification / Transfer** | 1.0 | **1.0** | Cấu trúc code mô-đun hóa cao, đã chuẩn bị sẵn kịch bản và hướng dẫn sửa đổi tính năng theo yêu cầu của giảng viên. |
| **8. AI Usage & Engineering** | 0.5 | **0.5** | Nhật ký AI Usage Log minh bạch, thể hiện sinh viên làm chủ hoàn toàn mã nguồn. |
| **TỔNG ĐIỂM** | **10.0** | **10.0 / 10.0** | **Mức Đánh Giá: EXCELLENT** |
