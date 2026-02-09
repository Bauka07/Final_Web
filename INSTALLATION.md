# 🚀 Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- express, mongoose, bcryptjs, jsonwebtoken (backend)
- passport, passport-google-oauth20 (OAuth)
- cloudinary, multer (file uploads)
- pdfkit (PDF export)
- express-session (sessions)

## Step 2: Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10

# Google OAuth (Already configured)
GOOGLE_CLIENT_ID=78805272321-hh7q631f2pj8ljv4rm6fvtoet9rguho1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# Cloudinary (Already configured)
CLOUDINARY_CLOUD_NAME=dggpirn0m
CLOUDINARY_API_KEY=147622182214285
CLOUDINARY_API_SECRET=mjOo2J6WDK6Q1r0z_wkCwRxdQ10
CLOUDINARY_URL=cloudinary://147622182214285:mjOo2J6WDK6Q1r0z_wkCwRxdQ10@dggpirn0m
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

## Step 4: Seed Initial Data (Optional)

Seed categories:
```bash
npm run seed:categories
```

Create an admin user:
```bash
npm run make:admin
```

## Step 5: Start the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:8080`

## Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

## 🎯 New Features

### 1. **Google OAuth Login**
- Click "Continue with Google" on the login page
- Authenticate with your Google account
- Automatically creates/links account

### 2. **Dark Mode**
- Toggle dark/light mode using the 🌙/☀️ button in the header
- Preference is saved in localStorage

### 3. **Archive Notes**
- Archive notes to hide them from main view
- Access archived notes via "Archived" button in sidebar
- Unarchive to restore to main view

### 4. **Trash/Soft Delete**
- Delete notes moves them to trash
- Access trash via "Trash" button in sidebar
- Restore deleted notes within 30 days
- Permanently delete from trash

### 5. **Advanced Search & Filters**
- Click 🔍 button for advanced search
- Filter by:
  - Keyword (searches title and content)
  - Category
  - Date range
  - Sort options (newest, oldest, title, updated)
- Simple search available in header

### 6. **Image Attachments**
- Upload images/PDFs to notes via Cloudinary
- Supports: JPG, PNG, GIF, WEBP, PDF
- Max file size: 5MB
- Attachments are displayed in notes

### 7. **Export to PDF**
- Export any note as PDF document
- Click "📄 PDF" button on note card
- Includes title, content, tags, category, and date

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes (with filters)
- `POST /api/notes` - Create note
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Move to trash (soft delete)
- `PATCH /api/notes/:id/archive` - Archive/unarchive note
- `PATCH /api/notes/:id/restore` - Restore from trash
- `DELETE /api/notes/:id/permanent` - Permanently delete
- `POST /api/notes/:id/attachments` - Upload attachment
- `DELETE /api/notes/:noteId/attachments/:attachmentId` - Delete attachment
- `GET /api/notes/:id/export/pdf` - Export note as PDF

### Categories & Tags
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/notes` - Get all notes (admin only)

## 🔐 Google OAuth Configuration

The Google OAuth is already configured with these redirect URIs:

**Authorized JavaScript Origins:**
- http://localhost:3000
- http://localhost:7777
- http://maqsatto.tech
- https://maqsatto.tech
- http://www.maqsatto.tech
- https://www.maqsatto.tech

**Authorized Redirect URIs:**
- http://localhost:8080/api/auth/google/callback
- http://maqsatto.tech/auth/google/callback
- https://maqsatto.tech/auth/google/callback
- http://www.maqsatto.tech/auth/google/callback
- https://www.maqsatto.tech/auth/google/callback

## 🧪 Testing

1. Register a new user or use Google OAuth
2. Create some notes with different categories
3. Add tags to notes
4. Upload images to notes
5. Try search functionality
6. Archive and restore notes
7. Move notes to trash and restore
8. Export a note to PDF
9. Toggle dark mode
10. Test as admin (create admin user first)

## 🚨 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check MONGODB_URI in .env file

### Google OAuth Not Working
- Verify Google credentials in .env
- Check authorized redirect URIs match your domain
- Clear browser cache and cookies

### Cloudinary Upload Fails
- Verify Cloudinary credentials in .env
- Check file size (max 5MB)
- Ensure file type is supported

### Port Already in Use
- Change PORT in .env file
- Kill process using port 8080: `npx kill-port 8080`

## 📝 Notes

- Default port is 8080 (can be changed in .env)
- JWT tokens expire in 7 days (configurable)
- Images are stored on Cloudinary (external service)
- PDFs are generated server-side, not stored

## 🎨 Features Summary

✅ User Registration & Login (email/password)  
✅ Google OAuth 2.0 Authentication  
✅ JWT-based authentication  
✅ Role-Based Access Control (User/Admin)  
✅ Create, Read, Update, Delete Notes  
✅ Categories & Tags  
✅ Pin notes to top  
✅ Color-code notes  
✅ **Dark Mode**  
✅ **Archive/Unarchive Notes**  
✅ **Trash/Restore Notes (Soft Delete)**  
✅ **Advanced Search & Filters**  
✅ **Image/PDF Attachments (Cloudinary)**  
✅ **Export Notes to PDF**  
✅ Admin Panel  
✅ Responsive Design  

Enjoy your enhanced Notes App! 🎉
