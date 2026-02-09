# 🧪 Quick Testing Guide

## Prerequisites
- MongoDB running
- Dependencies installed (`npm install`)

## Start the Application

```bash
npm run dev
```

Server starts at: `http://localhost:8080`

---

## 🔐 Test 1: Google OAuth Login

1. Open `http://localhost:8080`
2. Click **"Sign In"** or **"Get Started"**
3. Click **"Continue with Google"** button (with Google logo)
4. Select your Google account
5. ✅ You should be redirected back and logged in
6. Check sidebar - your email should appear
7. Google profile picture may load (if available)

**Troubleshooting:**
- If error: Check `.env` has correct `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Clear browser cookies and try again

---

## 🌙 Test 2: Dark Mode

1. After logging in, look at top-right header
2. Click the **🌙** button
3. ✅ Entire app switches to dark theme
4. Button changes to **☀️**
5. Refresh page - theme persists (saved in localStorage)
6. Click again to toggle back to light mode

---

## 📝 Test 3: Create Note with Attachment

1. Click **"+ New Note"** button
2. Fill in title: "Test Note with Image"
3. Add content
4. Select category and color
5. Click **"📎 Add Attachment"**
6. Choose an image file (JPG/PNG) under 5MB
7. ✅ Wait for upload (may take 2-3 seconds)
8. See attachment preview appear
9. Click **"Save Note"**
10. Note card shows attachment icon/link

**Note:** You need to save the note FIRST before uploading attachments!

---

## 📦 Test 4: Archive System

1. On any note card, click **"📦 Archive"**
2. ✅ Note disappears from main view
3. In sidebar, click **"Archived"** 
4. See your archived note
5. Click **"↩️ Unarchive"**
6. Note returns to main view
7. Click **"All Notes"** to confirm

---

## 🗑️ Test 5: Trash & Restore

1. On any note, click **"🗑️ Trash"**
2. ✅ Note disappears (moved to trash)
3. In sidebar, click **"Trash"**
4. See deleted note
5. Click **"↩️ Restore"** - note returns
6. OR click **"🗑️ Delete Forever"** and confirm
7. ✅ Permanent deletion removes note completely

---

## 📄 Test 6: Export to PDF

1. Click **"📄 PDF"** button on any note
2. ✅ PDF file downloads automatically
3. Open the PDF
4. Should see:
   - Note title as header
   - Category, date, tags as metadata
   - Full content formatted nicely

**File name:** `Your_Note_Title.pdf`

---

## 🔍 Test 7: Simple Search

1. Look at top-right header
2. Type in search box: "test"
3. ✅ Notes filter in real-time as you type
4. Shows only notes with "test" in title or content
5. Clear search box - all notes appear

---

## 🔎 Test 8: Advanced Search

1. Click **🔍** button (next to search box)
2. Advanced Search modal opens
3. Try these filters:
   - **Keyword:** "meeting"
   - **Category:** "Work"
   - **Date From:** Select a past date
   - **Sort By:** "Title A-Z"
4. Click **"Apply Filters"**
5. ✅ Results match all selected criteria
6. Click **"Clear Filters"** to reset

---

## 🎯 Test 9: Combined Features

**Create a complete note:**

1. Click **"+ New Note"**
2. Title: "My Complete Test Note"
3. Content: "This note has everything!"
4. Category: "Ideas"
5. Color: Pick a nice color
6. Tags: "test", "demo", "complete"
7. Check **"📌 Pin this note to top"**
8. Save note first
9. Edit the note again
10. Click **"📎 Add Attachment"**
11. Upload an image
12. Save again
13. Now the note appears first (pinned)
14. Click **"📄 PDF"** - download it
15. Click **"📦 Archive"** - hide it
16. Go to Archived, click **"↩️ Unarchive"**
17. Note back in main view

---

## 🎨 Test 10: UI Features

1. **Responsive Design:**
   - Resize browser window
   - Should adapt to mobile size
   
2. **Note Colors:**
   - Create notes with different colors
   - Color bar appears on left side

3. **Pinned Notes:**
   - Pin multiple notes
   - They stay at top
   - Sorted by most recent

4. **Tags:**
   - Click tag on a note
   - Filters by that tag

5. **Categories:**
   - Use category dropdown in sidebar
   - Filter by category

---

## 🔐 Test 11: Regular Login

1. Logout
2. Click **"Create New Account"**
3. Register with email and password
4. ✅ Successfully logged in
5. Both OAuth and regular auth work

---

## 👨‍💼 Test 12: Admin Panel (Optional)

If you created an admin user:

```bash
npm run make:admin
# Enter your email
```

1. Login as admin
2. Click **"⚙️ Admin Panel"** in sidebar
3. View all users and notes
4. Test admin CRUD operations

---

## ✅ Expected Results Checklist

- [ ] Google OAuth login works
- [ ] Dark mode toggles and persists
- [ ] File upload to Cloudinary succeeds
- [ ] Archived notes hidden from main view
- [ ] Trash system with restore works
- [ ] PDF export downloads correctly
- [ ] Simple search filters instantly
- [ ] Advanced search with multiple filters
- [ ] All buttons respond correctly
- [ ] No console errors
- [ ] Responsive on mobile size
- [ ] Data persists after refresh

---

## 🐛 Common Issues & Solutions

### Issue: "Google Auth Failed"
**Solution:** 
- Check `.env` file has correct credentials
- Verify MongoDB is running
- Clear browser cache

### Issue: "File Upload Error"
**Solution:**
- Check `.env` has Cloudinary credentials
- File size must be under 5MB
- Only JPG, PNG, GIF, WEBP, PDF allowed

### Issue: "PDF Download Doesn't Work"
**Solution:**
- Check browser allows downloads
- Try right-click > Save As
- Verify note has content

### Issue: "Notes Don't Load"
**Solution:**
- Check MongoDB connection
- Verify token in localStorage
- Check browser console for errors

### Issue: "Dark Mode Doesn't Persist"
**Solution:**
- Check browser allows localStorage
- Try incognito/private mode
- Clear cache and retry

---

## 📊 Performance Notes

- **Upload Speed:** 2-5 seconds for images (depends on internet)
- **Search:** Instant for < 100 notes
- **PDF Generation:** 1-2 seconds
- **Page Load:** < 1 second with cached assets

---

## 🎉 Success Criteria

All features working if:
1. ✅ Can login with Google
2. ✅ Can toggle dark mode
3. ✅ Can upload and view images
4. ✅ Can archive/unarchive notes
5. ✅ Can trash and restore notes
6. ✅ Can export PDF
7. ✅ Search finds notes correctly
8. ✅ Advanced filters work together
9. ✅ UI is responsive
10. ✅ No errors in console

---

## 📝 Test Data Suggestions

Create notes with:
- Different categories (Work, Personal, Ideas, etc.)
- Various tags (#important, #urgent, #later)
- Different dates (create, edit)
- Multiple attachments
- Long and short content
- Special characters (emoji, symbols)

This gives complete test coverage! 🚀
