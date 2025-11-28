# Library Management System - Starbhak Library

Sistem manajemen perpustakaan dengan autentikasi berbasis role (Admin & User) menggunakan Next.js, NextAuth, MySQL, dan Tailwind CSS.

## 🚀 Fitur

### Autentikasi
- ✅ Login dengan email & password
- ✅ Register user baru
- ✅ Hashing password dengan bcrypt
- ✅ Session management dengan NextAuth
- ✅ Role-based access control (Admin & User)

### Admin Dashboard
- ✅ Statistik perpustakaan (Total Books, Active Loans, Overdue, Users)
- ✅ Chart peminjaman berdasarkan kategori (Donut Chart)
- ✅ Loan overview dengan export data
- ✅ Sidebar navigation

### User Dashboard
- ✅ Home page dengan fresh books dan recommendations
- ✅ Books page dengan filter kategori
- ✅ Categories page dengan grouping books
- ✅ Book detail page dengan related books
- ✅ Search functionality
- ✅ Responsive UI dengan Tailwind CSS

## 📦 Teknologi yang Digunakan

- **Next.js 16** - React Framework
- **NextAuth** - Authentication
- **MySQL2** - Database
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **Tailwind CSS 4** - Styling

## 🛠️ Setup & Installation

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Setup Database
Jalankan query SQL yang telah disediakan untuk membuat database dan tabel:

\`\`\`sql
use library_aas;

CREATE TABLE `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user','admin') NOT NULL DEFAULT 'user',
  `avatar` VARCHAR(512) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `books` (
  `id_buku` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nama_buku` VARCHAR(255) NOT NULL,
  `genre_buku` ENUM(
    'Self-Improvement',
    'Politics',
    'Biography',
    'Politics-Biography',
    'Fiction',
    'Novel'
  ) NOT NULL,
  `author` VARCHAR(150) NOT NULL,
  `gambar` VARCHAR(512) NOT NULL,
  `status` ENUM('tersedia','dipinjam') DEFAULT 'tersedia',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `borrows` (
  `borrow_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `id_buku` INT NOT NULL,
  `borrow_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` TIMESTAMP AS (borrow_date + INTERVAL 7 DAY) STORED,
  `return_date` TIMESTAMP NULL,
  `status` ENUM('pending','ongoing','requested_return','returned','late') DEFAULT 'pending',
  `fine_amount` INT DEFAULT 0,
  CONSTRAINT fk_user
    FOREIGN KEY (`user_id`) REFERENCES users(`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_buku
    FOREIGN KEY (`id_buku`) REFERENCES books(`id_buku`)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data (jalankan INSERT statements yang sudah disediakan)
\`\`\`

### 3. Configure Environment Variables
Edit file \`.env.local\` dan sesuaikan dengan konfigurasi database Anda:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_aas

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
\`\`\`

### 4. Generate NextAuth Secret (Optional)
Jalankan command berikut untuk generate secret key:

\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

Kemudian copy hasilnya ke \`NEXTAUTH_SECRET\` di file \`.env.local\`

### 5. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Aplikasi akan berjalan di: http://localhost:3000

## 👤 Default Credentials

### Admin Account
- Email: \`admin@gmail.com\`
- Password: \`admin123\` (sudah di-hash dalam database)

### Test User
Buat akun baru melalui halaman register untuk test sebagai user.

## 📂 Struktur Folder

\`\`\`
library-web-aas/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js  # NextAuth configuration
│   │   │   └── register/route.js        # Registration endpoint
│   │   ├── admin/
│   │   │   └── dashboard/route.js       # Admin dashboard API
│   │   ├── books/
│   │   │   ├── route.js                 # Get all books
│   │   │   └── [id]/route.js            # Get book by ID
│   │   └── user/
│   │       └── borrows/route.js         # User borrow history
│   ├── admin/
│   │   └── dashboard/page.jsx           # Admin dashboard page
│   ├── user/
│   │   ├── home/page.jsx                # User home page
│   │   ├── books/
│   │   │   ├── page.jsx                 # Books list page
│   │   │   └── [id]/page.jsx            # Book detail page
│   │   └── categories/page.jsx          # Categories page
│   ├── auth/
│   │   ├── login/page.jsx               # Login page
│   │   └── signup/page.jsx              # Register page
│   ├── providers/
│   │   └── AuthProvider.jsx             # NextAuth SessionProvider
│   ├── context/
│   │   └── searchContext.jsx            # Search context
│   ├── layout.js                        # Root layout
│   └── page.jsx                         # Root page (redirect)
├── components/
│   ├── authLayout.jsx                   # Auth pages layout
│   ├── bookCard.jsx                     # Book card component
│   ├── header.jsx                       # Header component
│   └── sidebar.jsx                      # Sidebar component
├── lib/
│   ├── db.js                            # MySQL connection pool
│   └── dummyData.js                     # Dummy data
├── public/
│   ├── icon/                            # Icons
│   └── picture/                         # Images
├── .env.local                           # Environment variables
├── middleware.js                        # NextAuth middleware
└── package.json
\`\`\`

## 🔐 Authentication Flow

1. **Login**: User memasukkan email & password
2. **Validation**: NextAuth memverifikasi credentials dengan database
3. **Session**: JWT token dibuat dengan role user
4. **Redirect**: 
   - Admin → \`/admin/dashboard\`
   - User → \`/user/home\`
5. **Protection**: Middleware memeriksa authentication untuk protected routes

## 🎨 UI Pages

### Admin Pages
- **Dashboard** (\`/admin/dashboard\`)
  - Statistics cards
  - Borrow by category chart
  - Loan overview table

### User Pages
- **Home** (\`/user/home\`)
  - Fresh books banner
  - Recently added section
  - For you recommendations
  
- **Books** (\`/user/books\`)
  - Category filters
  - Books grid with search
  
- **Categories** (\`/user/categories\`)
  - Books grouped by genre
  - See more links
  
- **Book Detail** (\`/user/books/[id]\`)
  - Book information
  - Buy/Borrow buttons
  - Related books

## 🔧 API Routes

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/signin\` - Login (handled by NextAuth)
- \`GET /api/auth/session\` - Get session
- \`POST /api/auth/signout\` - Logout

### Books
- \`GET /api/books\` - Get all books (with optional genre filter)
- \`GET /api/books/[id]\` - Get book by ID

### Admin
- \`GET /api/admin/dashboard\` - Get dashboard statistics

### User
- \`GET /api/user/borrows\` - Get user's borrow history

## 📝 Notes

- Password di-hash menggunakan bcrypt dengan salt rounds 10
- Session menggunakan JWT strategy dengan max age 30 hari
- Middleware melindungi routes \`/admin/*\` dan \`/user/*\`
- Images harus diletakkan di folder \`public/\` sesuai path di database

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan MySQL server berjalan
- Cek credentials di \`.env.local\`
- Pastikan database \`library_aas\` sudah dibuat

### Login Error
- Cek apakah user ada di database
- Pastikan password sudah di-hash dengan benar
- Cek console untuk error details

### Image Not Found
- Pastikan path gambar sesuai dengan yang ada di database
- Letakkan gambar di folder \`public/\`
- Path di database harus relatif dari \`public/\` (misal: \`/books/picture/atomic_habits.jpg\`)

## 📧 Support

Jika ada pertanyaan atau masalah, silakan hubungi developer.

---

Built with ❤️ using Next.js and Tailwind CSS
