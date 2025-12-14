# Enterprise CMS Project

A robust, full-stack Content Management System built with **Laravel 12** and **React**.
This project features a secure API-driven backend, a modern SPA Admin Panel, and a SEO-optimized public frontend.

---

## 🚀 Key Features

### 🎨 Modern Admin Panel (React + Vite)
-   **Dashboard**: Real-time statistics with animated counters and visual data.
-   **Post Management**: Full CRUD with rich-text editing (`react-quill-new`), slug generation, and image uploads.
-   **SEO Tools**: **Real-time Search Preview** to see how posts look in Google results before publishing.
-   **Media Library**: Drag-and-drop image uploads with gallery view.
-   **UX Polish**: Toast notifications, Skeleton loaders, and Responsive Mobile Sidebar.

### 🌐 Public Website (Laravel Blade)
-   **SEO Optimized**: Dynamic Meta titles and descriptions for every page.
-   **User Experience**: "Reading Time" estimates on blog posts.
-   **Modern UI**: Glassmorphism header, Inter typography, and responsive grid layouts.
-   **Performance**: Server-side rendered views for maximum speed and indexability.

### 🛡️ Security & Architecture
-   **Authentication**: Secure JWT-based auth via **Laravel Sanctum**.
-   **XSS Protection**: Automatic sanitization of rich-text content to prevent script injection.
-   **Edge Case Handling**:
    -   Auto-incrementing Slugs (e.g., `my-post-2`) to prevent crashes.
    -   Orphan Media Cleanup (deletes images when posts are deleted).
    -   Strict CORS configuration.

### 🚀 Bonus Features ("The Extra Mile")
-   **🔍 Public Search Bar**: Real-time filtering of blog posts by title and content.
-   **🏷️ Categories**: Full categorization system (Backend + Admin Select + Public Badge).
-   **🐳 Docker Support**: `Dockerfile` and `docker-compose.yml` included for one-click deployment.

---

## 🛠️ Tech Stack

-   **Backend**: Laravel 12, PHP 8.2+, SQLite
-   **Frontend**: React 18, TailwindCSS, Lucide Icons, Axios
-   **Tooling**: Vite, Composer, NPM

---

## 📦 Installation & Setup

### Prerequisites
-   PHP 8.2 or higher
-   Node.js & NPM
-   Composer

### 1. Backend Setup (Laravel)
The backend is pre-configured with SQLite. No database setup required.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed  # Seeds default Admin user & fake posts
```

**Start Server:**
```bash
php artisan serve
# Runs on http://localhost:8000
```
*(Note: If `php` is not in your PATH, use `C:\xampp\php\php.exe artisan serve`)*

### 2. Admin Panel Setup (React)

```bash
cd admin
npm install
```

**Start Server:**
```bash
npm run dev
# Runs on http://localhost:5173
```

### 3. Docker Setup (Alternative)
Run the entire stack with a single command:

```bash
docker-compose up -d --build
# Backend: http://localhost:8000
# Admin:   http://localhost:5173
```

---

## 🔑 Default Credentials

-   **Login URL**: `http://localhost:5173/login`
-   **Email**: `admin@example.com`
-   **Password**: `password`

---

## 🔌 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticate user & get Token |
| `GET` | `/api/posts` | Get paginated list of posts |
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/stats` | Get dashboard analytics |
| `POST` | `/api/media/upload` | Upload an image |

---

## ❓ Troubleshooting

**"CORS Error" / Login Failed**
-   Ensure Backend is running on port `8000`.
-   Ensure Admin is running on port `5173` or `5174`.
-   If you switch ports, restart the Backend to apply CORS config.

**"PHP not recognized"**
-   Use the included `start_backend.bat` script in the root folder, or specify the full path to your php executable.

**Blank Screen on Admin**
-   Check your terminal. If the port is `5174`, make sure you visit `localhost:5174`.
