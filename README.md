## Todo API — NestJS

Project là một **REST API quản lý công việc (Todo)** xây dựng trên NestJS + TypeORM + SQLite.

---

### Chức năng chính

**Authentication** — Đăng ký, đăng nhập bằng email/password. Sau khi login nhận về JWT token dùng cho các request tiếp theo.

**Todo CRUD** — Mỗi user quản lý todo của riêng mình: tạo, xem, sửa, xóa. Không thể truy cập todo của người khác.

**Phân quyền (RBAC)** — 3 role: `ADMIN`, `USER`, `GUEST`. Admin có thể xem và thao tác todo/user của toàn hệ thống qua các endpoint `/admin/*`. User thao tác todo của mình. Guest chỉ xem.

---

### Kỹ thuật sử dụng

- **NestJS** — framework chính, tổ chức theo module
- **TypeORM + SQLite** — lưu trữ dữ liệu local
- **Passport JWT** — xác thực token
- **class-validator** — validate request body

---

### Cấu trúc module

```
AuthModule   → login, JWT
UserModule   → register, profile, admin quản lý user
TodoModule   → CRUD todo theo user, admin quản lý tất cả
CommonModule → decorators, guards dùng chung
```

---

### Luồng hoạt động cơ bản

```
Đăng ký → Đăng nhập → Nhận JWT
→ Gửi request kèm token
→ JwtAuthGuard xác thực → RolesGuard kiểm tra quyền
→ Controller xử lý
```
