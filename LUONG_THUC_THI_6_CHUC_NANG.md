# TÀI LIỆU KIẾN TRÚC & LUỒNG THỰC THI TOÀN BỘ 6 TÍNH NĂNG DỰ ÁN FUNEWS MANAGEMENT SYSTEM

* **Môn học:** SBA301 – Working with ReactJS Application
* **Tác giả:** OanhTP (`oanhtp`)
* **Dự án:** FUNewsManagementSystem
* **Công nghệ cốt lõi:** React 19, React Router DOM v7, Vite, Vanilla CSS, Browser LocalStorage API

---

## 📑 MỤC LỤC
1. [Kiến trúc Tổng thể & Phân tầng Dữ liệu](#1-kiến-trúc-tổng-thể--phân-tầng-dữ-liệu)
2. [Tính năng 1: Xác thực & Bảo vệ Tuyến đường (Authentication & Route Guard)](#2-tính-năng-1-xác-thực--bảo-vệ-tuyến-đường)
3. [Tính năng 2: Tổng quan Bảng điều khiển (Dashboard Overview & Real-time Metrics)](#3-tính-năng-2-tổng-quan-bảng-điều-khiển)
4. [Tính năng 3: Quản lý Danh mục Tin tức (Category Management - CRUD & Realtime Search)](#4-tính-năng-3-quản-lý-danh-mục-tin-tức)
5. [Tính năng 4: Quản lý Bài báo Tin tức (News Articles Management - Relational Mapping & Tags)](#5-tính-năng-4-quản-lý-bài-báo-tin-tức)
6. [Tính năng 5: Quản lý Tài khoản & Cơ chế Bảo vệ Phiên (User Management & Safeguards)](#6-tính-năng-5-quản-lý-tài-khoản--bảo-vệ-phiên)
7. [Tính năng 6: Cài đặt Hệ thống & Khôi phục Dữ liệu Gốc (Settings & Mock DB Reset)](#7-tính-năng-6-cài-đặt-hệ-thống--khôi-phục-dữ-liệu)
8. [Bảng Tổng hợp State Lifecycle & Các Hooks quan trọng](#8-bảng-tổng-hợp-state-lifecycle--hooks)

---

## 1. KIẾN TRÚC TỔNG THỂ & PHÂN TẦNG DỮ LIỆU

Ứng dụng được thiết kế theo mô hình **Layered Architecture (Kiến trúc phân tầng)** tách biệt rõ ràng giữa Giao diện (Presentation Layer) và Dữ liệu (Data Service Layer):

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  Pages: LoginPage, DashboardPage, CategoryManagement, News, Users,...  │
│  Components: Modal, ConfirmModal, SearchBar, Header, Sidebar           │
│  Routing & Guards: App.jsx, AdminLayout.jsx, ProtectedRoute.jsx        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Gọi hàm CRUD (getAll, create, update, delete)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          SERVICE / BUSINESS LAYER                      │
│  authService.js  |  categoryService.js  |  newsService.js  |  user... │
│  - Kiểm tra logic nghiệp vụ (Uniqueness, ID Generation, Data Mapping)  │
│  - Xử lý bất biến (Immutable Updates: Spread, .map(), .filter())       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Đọc/Ghi dữ liệu JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          PERSISTENCE LAYER (Storage)                   │
│  Browser LocalStorage:                                                 │
│  - 'currentUser'        : Phiên đăng nhập hiện tại                     │
│  - 'funews_categories'  : Mảng các danh mục tin tức                    │
│  - 'funews_articles'    : Mảng các bài báo                             │
│  - 'funews_users'       : Mảng tài khoản người dùng                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. TÍNH NĂNG 1: XÁC THỰC & BẢO VỆ TUYẾN ĐƯỜNG (AUTHENTICATION & ROUTE GUARD)

### 2.1. Mục tiêu & Các file liên quan
* **Mục tiêu:** Kiểm soát quyền truy cập toàn bộ hệ thống quản trị, duy trì phiên khi F5 hoặc mở tab mới, và đăng xuất an toàn.
* **File liên quan:**
  * `src/services/authService.js`
  * `src/components/ProtectedRoute.jsx`
  * `src/pages/LoginPage.jsx`
  * `src/components/Header.jsx`
  * `src/App.jsx`

### 2.2. Sơ đồ Luồng Thực thi (Sequence Flow)

```text
[Người dùng] ──────── Truy cập /admin/dashboard ────────► [ProtectedRoute]
                                                               │
                                                               ▼ Kiểm tra authService.isAuthenticated()
                                                               │
                           ┌───────────────────────────────────┴───────────────────────────────────┐
                           │ (Chưa đăng nhập)                                                      │ (Đã đăng nhập)
                           ▼                                                                       ▼
                  Redirect sang /login                                                   Render <AdminLayout />
                           │                                                                       │
           [Người dùng nhập credentials]                                                           ▼
                           │                                                             Render <DashboardPage />
                           ▼
                  Bấm nút "Sign In"
                           │
                           ▼
                 handleLogin(e)
                 ├── e.preventDefault() (Chặn reload)
                 ├── Validate không để trống ô
                 └── authService.login(username, password)
                           │
             ┌─────────────┴─────────────┐
             │ (Sai thông tin)           │ (Đúng: Admin / Admin)
             ▼                           ▼
        Set error state            1. localStorage.setItem('currentUser', JSON)
     (Hiển thị chữ đỏ)             2. navigate('/admin/dashboard')
```

### 2.3. Chi tiết từng bước thực thi trong Code
1. **Kiểm tra quyền truy cập (`ProtectedRoute.jsx`):**
   * Khi router khớp đường dẫn `/admin/*`, `ProtectedRoute` gọi `authService.getCurrentUser()`.
   * Nếu giá trị trả về là `null`, trả về thẻ `<Navigate to="/login" replace />`. Cờ `replace` xóa route hiện tại khỏi browser history stack để người dùng không bấm "Back" vào lại trang admin được.
2. **Xử lý đăng nhập (`LoginPage.jsx` & `authService.js`):**
   * Người dùng gõ username và password vào hai thẻ input có liên kết 2 chiều (Controlled Input) với `useState`.
   * Khi submit form, `handleLogin` gọi `e.preventDefault()`.
   * `authService.login()` kiểm tra thông tin `username === 'Admin' && password === 'Admin'`.
   * Khi thành công: Tạo object `{ username: 'Admin', role: 1, status: 1 }`, dùng `JSON.stringify()` lưu vào khóa `'currentUser'` trong `localStorage`, trả về `{ success: true }`.
   * Giao diện nhận `success: true` sẽ kích hoạt hàm `navigate('/admin/dashboard')`.
3. **Đăng xuất (`Header.jsx`):**
   * Khi bấm nút "Logout", hàm `handleLogout` gọi `authService.logout()`.
   * Lệnh `localStorage.removeItem('currentUser')` được thực thi, xóa sạch phiên làm việc.
   * `navigate('/login')` đưa người dùng về lại màn hình đăng nhập.

---

## 3. TÍNH NĂNG 2: TỔNG QUAN BẢNG ĐIỀU KHIỂN (DASHBOARD OVERVIEW & METRICS)

### 3.1. Mục tiêu & Các file liên quan
* **Mục tiêu:** Hiển thị tổng quan các chỉ số KPI thời gian thực của hệ thống (Số danh mục, Số bài viết, Số người dùng, Quyền hạn phiên hiện tại) và hiển thị tóm tắt các bài viết mới nhất.
* **File liên quan:**
  * `src/pages/DashboardPage.jsx`
  * `src/services/categoryService.js`
  * `src/services/newsService.js`
  * `src/services/userService.js`
  * `src/services/authService.js`

### 3.2. Sơ đồ Luồng Thực thi (Sequence Flow)

```text
[DashboardPage Mount] 
         │
         ▼ useEffect(..., [])
         ├── authService.getCurrentUser() ────────► Lấy username & role hiện tại
         ├── categoryService.getAll()    ────────► Lấy mảng danh mục
         ├── newsService.getAll()        ────────► Lấy mảng bài viết
         └── userService.getAll()        ────────► Lấy mảng người dùng
         │
         ▼ Xử lý dữ liệu tại Client
         ├── setStats({ categoriesCount, newsCount, usersCount })
         ├── news.slice(-3).reverse() ────────► Lấy 3 bài mới nhất (Không mutate mảng gốc)
         └── setCategories(cats)
         │
         ▼
[Render Dashboard UI]
 ├── 4 Thẻ KPI Card (Số lượng + Quick Link sang trang con)
 ├── Bảng "Recent News Articles" (Tiêu đề, Tác giả, Badge Trạng thái)
 └── Bảng "Category Status" (Tên danh mục, Badge Active/Inactive)
```

### 3.3. Chi tiết kỹ thuật Senior trong Code
* **Tránh Mutate mảng với `news.slice(-3).reverse()`:**
  * Nếu dùng trực tiếp `news.reverse()`, mảng `news` trong bộ nhớ sẽ bị đảo lộn vĩnh viễn (In-place Mutation).
  * Hàm `.slice(-3)` tạo ra một bản sao nông (Shallow Copy) chứa 3 phần tử cuối cùng, sau đó `.reverse()` chỉ đảo chiều trên bản sao này để bài viết mới nhất đứng đầu.
* **Liên kết nhanh (Quick Links):**
  * Mỗi thẻ Metric Card đều bọc thẻ `<Link to="/admin/...">` của `react-router-dom`, cho phép quản trị viên nhấp chuột chuyển nhanh sang trang quản lý mà không tải lại trang.

---

## 4. TÍNH NĂNG 3: QUẢN LÝ DANH MỤC TIN TỨC (CATEGORY MANAGEMENT)

### 4.1. Mục tiêu & Các file liên quan
* **Mục tiêu:** Cung cấp đầy đủ thao tác CRUD (Create, Read, Update, Delete) danh mục tin tức và tìm kiếm tức thời (Real-time Search) không phá hủy dữ liệu gốc.
* **File liên quan:**
  * `src/pages/CategoryManagement.jsx`
  * `src/services/categoryService.js`
  * `src/components/Modal.jsx`
  * `src/components/ConfirmModal.jsx`
  * `src/components/SearchBar.jsx`

### 4.2. Sơ đồ Luồng Hoạt động CRUD & Tìm kiếm

```text
                          [CategoryManagement Mount]
                                      │
                                      ▼ loadCategories()
                           categoryService.getAll()
                                      │
                    ┌─────────────────┴─────────────────┐
                    ▼                                   ▼
          State 'categories'                  State 'searchTerm'
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼ useMemo() (Derived State)
                            'displayedCategories'
                                      │
                                      ▼ Render Table
```

#### A. Luồng Tìm kiếm Tức thời (Non-destructive Real-time Search)
1. Người dùng nhập chữ vào ô `<SearchBar />`.
2. Hàm `onChange` cập nhật `searchTerm` trong state.
3. Hook `useMemo` tự động tính toán lại `displayedCategories`:
   ```javascript
   const displayedCategories = useMemo(() => {
     const trimmed = searchTerm.trim().toLowerCase();
     if (!trimmed) return categories;
     return categories.filter((cat) => cat.name.toLowerCase().includes(trimmed));
   }, [categories, searchTerm]);
   ```
4. **Điểm tối ưu:** Mảng nguồn `categories` không bị đụng tới. Khi người dùng bấm nút "Clear" hoặc xóa hết ký tự, danh sách gốc lập tức hiển thị lại đầy đủ mà không cần gọi lại service hay `localStorage`.

#### B. Luồng Thêm mới (Create Flow)
1. Quản trị viên bấm nút `+ Add Category`.
2. Kích hoạt `handleOpenCreate()`: Thiết lập `modalMode = 'create'`, reset form `name: '', status: 1`, mở `isModalOpen = true`.
3. Nhập dữ liệu và submit form -> Kích hoạt `handleSubmit(e)`:
   * Chặn reload trang `e.preventDefault()`.
   * Kiểm tra điều kiện bắt buộc: `!formData.name.trim()` -> Báo lỗi nếu rỗng.
   * Gọi `categoryService.create({ name, status })`.
4. Bên trong `categoryService.js`:
   * Tính ID tự tăng an toàn: `newId = Math.max(...list.map(i => i.id)) + 1`.
   * Tạo object danh mục mới.
   * Dùng Spread Operator tạo mảng mới bất biến: `updatedList = [...list, newCategory]`.
   * Lưu mảng mới vào `localStorage.setItem('funews_categories', ...)`.
5. Đóng Modal (`setIsModalOpen(false)`) và gọi `loadCategories()` để đồng bộ lại dữ liệu UI.

#### C. Luồng Chỉnh sửa (Update Flow)
1. Bấm nút `Edit` trên dòng danh mục cần sửa.
2. Hàm `handleOpenEdit(category)` lưu object vào `selectedCategory`, đổ dữ liệu cũ vào `formData`, đặt `modalMode = 'update'` và mở Modal.
3. Chỉnh sửa thông tin và bấm "Save Changes" -> Submit form:
   * Gọi `categoryService.update(selectedCategory.id, formData)`.
4. Bên trong `categoryService.update()`:
   * Dùng hàm `.map()` để duyệt danh sách: phần tử nào có `id === targetId` thì tạo object mới mang dữ liệu cập nhật, các phần tử khác giữ nguyên tham chiếu.
   * Lưu mảng mới vào `localStorage`.
5. Đóng Modal và gọi `loadCategories()` để làm mới bảng.

#### D. Luồng Xóa Danh mục (Delete Confirmation Flow)
1. Bấm nút `Delete` trên một dòng.
2. Hàm `handleOpenDelete(category)` lưu danh mục muốn xóa vào `categoryToDelete` và mở `isConfirmOpen = true`.
3. Modal `ConfirmModal` hiện lên với câu hỏi xác nhận rõ ràng: *"Are you sure you want to delete category "[Tên danh mục]" (ID: #...)?*
4. **Nếu bấm Cancel:** Đóng modal, đặt `categoryToDelete = null`, dữ liệu giữ nguyên.
5. **Nếu bấm Confirm Delete:**
   * Gọi `categoryService.delete(categoryToDelete.id)`.
   * Service dùng `.filter(item => item.id !== targetId)` để loại bỏ phần tử và ghi vào `localStorage`.
   * Gọi `loadCategories()` cập nhật bảng và đóng modal.

---

## 5. TÍNH NĂNG 4: QUẢN LÝ BÀI BÁO TIN TỨC (NEWS ARTICLES MANAGEMENT)

### 5.1. Mục tiêu & Các file liên quan
* **Mục tiêu:** Quản lý bài viết với cấu trúc dữ liệu quan hệ (Foreign Key `categoryId`), chuyển đổi mảng thẻ phân loại (`tags`), tự động gắn tác giả theo phiên làm việc và tìm kiếm kép.
* **File liên quan:**
  * `src/pages/NewsManagement.jsx`
  * `src/services/newsService.js`
  * `src/services/categoryService.js`
  * `src/services/authService.js`

### 5.2. Sơ đồ Luồng Xử lý Dữ liệu Quan hệ (Relational Mapping)

```text
[newsService.getAll()] ────────► [ { id: 1, title: '...', categoryId: 3, ... } ]
                                                            │
                                                            ▼ Khóa ngoại trỏ đến Category
[categoryService.getAll()] ────► [ { id: 3, name: 'Technology & Innovation' } ]
                                                            │
                                                            ▼ useMemo() tạo Dictionary Map
                                       categoryMap = { 3: 'Technology & Innovation' }
                                                            │
                                                            ▼ Tra cứu O(1) khi render
                                        <td>{categoryMap[article.categoryId]}</td>
```

### 5.3. Chi tiết các bước thực thi nổi bật trong Code
1. **Tra cứu danh mục tức thời ($O(1)$ thay vì $O(N \times M)$):**
   * Thay vì dùng `.find()` lặp đi lặp lại trong mỗi dòng của bảng (gây suy giảm hiệu năng khi có hàng nghìn bài viết), component tính toán trước một `categoryMap`:
     ```javascript
     const categoryMap = useMemo(() => {
       const map = {};
       categories.forEach((cat) => { map[cat.id] = cat.name; });
       return map;
     }, [categories]);
     ```
2. **Kỹ thuật Chuyển đổi Tags hai chiều (Data Normalization):**
   * **Khi hiển thị Form Edit:** Chuyển mảng string thành chuỗi ngăn cách bằng dấu phẩy:  
     `tagsString: article.tags.join(', ')` (Ví dụ: `['AI', 'Tech']` $\rightarrow$ `"AI, Tech"`).
   * **Khi Lưu vào Service:** Tách chuỗi ngược lại thành mảng, loại bỏ khoảng trắng dư thừa và phần tử rỗng:
     ```javascript
     tags: tagsString.split(',').map((t) => t.trim()).filter(Boolean)
     ```
3. **Tự động gắn tác giả bài viết (`createdBy`):**
   * Khi tạo bài mới, `NewsManagement.jsx` lấy username từ phiên đăng nhập hiện tại:
     ```javascript
     const currentUser = authService.getCurrentUser();
     const createdBy = currentUser?.username || 'Admin';
     ```
   * Quản trị viên không cần tự gõ tên mình, hệ thống tự động gán nhãn tác giả.

---

## 6. TÍNH NĂNG 5: QUẢN LÝ TÀI KHOẢN & BẢO VỆ PHIÊN (USER MANAGEMENT & SAFEGUARDS)

### 6.1. Mục tiêu & Các file liên quan
* **Mục tiêu:** Quản trị danh sách tài khoản, phân quyền Role (1 - Admin, 2 - Staff), trạng thái hoạt động (Active/Inactive), xác thực tính duy nhất của Username và bảo vệ an toàn cho tài khoản đang đăng nhập.
* **File liên quan:**
  * `src/pages/UserManagement.jsx`
  * `src/services/userService.js`
  * `src/services/authService.js`

### 6.2. Sơ đồ Luồng Bảo vệ An toàn Phiên (Self-Deletion Safeguard)

```text
[Render Bảng Tài khoản Users]
          │
          ▼ Kiểm tra từng dòng: user.username === currentUser?.username
          │
          ├───────────────────────────────────────────┬───────────────────────────────────────────┐
          │ (Nếu là tài khoản người khác)             │ (Nếu là chính tài khoản đang đăng nhập)
          ▼                                           ▼
   Nút Delete bình thường                     1. Nút Delete bị DISABLED (Mờ 50%, cấm click)
          │                                   2. Hiển thị nhãn "(Current User)"
   Bấm Delete                                         │
          │                                   Cố tình bấm (phòng thủ đa tầng)
          ▼                                           │
  Mở ConfirmModal                                     ▼
 "Are you sure you want to delete...?"        Mở Modal Cảnh báo An ninh:
          │                                   "Security restriction: You cannot delete your
  Confirm -> userService.delete()              own active session account!"
```

### 6.3. Chi tiết các quy tắc nghiệp vụ (Business Rules)
1. **Kiểm tra tính duy nhất của Username (Uniqueness Check):**
   * Trước khi lưu, hàm `validateForm` kiểm tra trùng lặp không phân biệt hoa thường:
     ```javascript
     const existingUser = users.find(
       (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase() &&
              (modalMode === 'create' || u.id !== selectedUser?.id)
     );
     if (existingUser) {
       errors.username = 'Username already exists. Please choose another.';
     }
     ```
   * Nếu đang ở chế độ `update`, hệ thống cho phép giữ nguyên username của chính tài khoản đó (`u.id !== selectedUser.id`).
2. **Cơ chế cập nhật Mật khẩu an toàn:**
   * Khi Edit một tài khoản, ô mật khẩu được để trống (`password: ''`).
   * Nếu quản trị viên không nhập mật khẩu mới, `userService.update` sẽ giữ nguyên mật khẩu cũ trong database:
     ```javascript
     password: userData.password ? userData.password : item.password
     ```
   * Chỉ khi người dùng gõ mật khẩu mới thì hệ thống mới tiến hành thay đổi.

---

## 7. TÍNH NĂNG 6: CÀI ĐẶT HỆ THỐNG & KHÔI PHỤC DỮ LIỆU GỐC (SETTINGS & RESET)

### 7.1. Mục tiêu & Các file liên quan
* **Mục tiêu:** Hiển thị thông tin môi trường, phiên làm việc hiện tại và cung cấp cơ chế khôi phục toàn bộ Mock Database về dữ liệu hạt giống ban đầu (Initial Seed) phục vụ việc chấm thi và kiểm thử.
* **File liên quan:**
  * `src/pages/SettingsPage.jsx`
  * `src/mock/initialData.js`
  * `src/services/authService.js`

### 7.2. Sơ đồ Luồng Thực thi Khôi phục Dữ liệu (Database Reset)

```text
[Người dùng tại trang Settings] ───── Bấm nút "Reset Mock Data to Initial Seed"
                                                        │
                                                        ▼
                                             Mở ConfirmModal Cảnh báo
                                  "Are you sure you want to restore initial seed data?"
                                                        │
                           ┌────────────────────────────┴────────────────────────────┐
                           │ Bấm Cancel                                              │ Bấm Confirm Reset
                           ▼                                                         ▼
                      Đóng Modal                                            handleResetDatabase()
                  (Dữ liệu giữ nguyên)                                               │
                                                                                     ▼ Ghi đè 3 khóa trong LocalStorage:
                                                                    1. localStorage.setItem('funews_categories', INITIAL_CATEGORIES)
                                                                    2. localStorage.setItem('funews_articles', INITIAL_NEWS)
                                                                    3. localStorage.setItem('funews_users', INITIAL_USERS)
                                                                                     │
                                                                                     ▼
                                                                    1. Đóng ConfirmModal
                                                                    2. Hiển thị thông báo màu xanh:
                                                                       "Mock database has been successfully reset!"
```

### 7.3. Ý nghĩa thực tế
* Trong quá trình chấm điểm Assignment, Giảng viên thường thêm/sửa/xóa rất nhiều bản ghi thử nghiệm. Nút Reset này giúp người dùng ngay lập tức đưa hệ thống về đúng 4 danh mục, 4 bài viết và 3 tài khoản chuẩn mà không cần phải mở DevTools để `clear()` thủ công.

---

## 8. BẢNG TỔNG HỢP STATE LIFECYCLE & CÁC HOOKS QUAN TRỌNG

| Tên Hook / Kỹ thuật | Component áp dụng | Mục đích và Vai trò trong Hệ thống |
|---|---|---|
| `useState` | Toàn bộ các Pages & Modals | Quản lý UI State nội bộ: form inputs, trạng thái mở/đóng popup (`isOpen`), chế độ form (`modalMode`), từ khóa tìm kiếm (`searchTerm`). |
| `useEffect(fn, [])` | `Dashboard`, `Category`, `News`, `Users` | Đóng vai trò như Lifecycle `componentDidMount`. Chỉ chạy đúng 1 lần khi trang được nạp để kéo dữ liệu từ Service Layer vào State. |
| `useMemo` | `CategoryManagement`, `NewsManagement` | **Tối ưu hiệu năng:** Tính toán dữ liệu phái sinh (Derived State) cho danh sách tìm kiếm và bảng tra cứu khóa ngoại `categoryMap` $O(1)$. Tránh re-compute không cần thiết khi component re-render. |
| `useNavigate` | `LoginPage`, `Header` | Điều hướng mượt mà giữa các trang trong ứng dụng Single Page Application (SPA) mà không tải lại trình duyệt. |
| `e.preventDefault()` | Toàn bộ các Form Handlers | Vô hiệu hóa hành vi gửi HTTP POST/GET mặc định của thẻ `<form>`, ngăn chặn tình trạng chớp trắng và tải lại trang. |
| `e.stopPropagation()` | `Modal.jsx`, `ConfirmModal.jsx` | Triệt tiêu sự kiện nổi bọt (Event Bubbling) từ hộp thoại lên lớp phủ nền mờ (Overlay), ngăn chặn việc click vào form làm đóng modal ngoài ý muốn. |
| `Spread Operator [...]` | Toàn bộ Service Layer | Đảm bảo tính bất biến của dữ liệu (Immutable State Updates), giúp thuật toán Virtual DOM Diffing của React nhận diện thay đổi ô nhớ và kích hoạt re-render chính xác. |

---

> **Tài liệu được xuất bản và xác thực bởi:** OanhTP (`oanhtp`)  
> **Dự án:** FUNewsManagementSystem — Frontend Quản trị ReactJS (SBA301)
