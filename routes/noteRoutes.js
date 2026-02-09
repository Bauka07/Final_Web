import express from "express";
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  toggleArchiveNote,
  restoreNote,
  permanentDeleteNote,
  uploadAttachment,
  deleteAttachment,
  exportNoteToPDF,
} from "../controllers/noteController.js";
import validateNote from "../middleware/validateNote.js";
import { authenticate, optionalAuth } from "../middleware/authenticate.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Public GET routes with optional authentication
router.route("/").get(optionalAuth, getAllNotes);

router.route("/:id").get(optionalAuth, getNoteById);

// Protected POST route (authenticated users)
router.route("/").post(authenticate, validateNote, createNote);

// Protected PUT and DELETE routes (authenticated users)
router
  .route("/:id")
  .put(authenticate, validateNote, updateNote)
  .delete(authenticate, deleteNote);

// Archive/Unarchive
router.patch("/:id/archive", authenticate, toggleArchiveNote);

// Restore from trash
router.patch("/:id/restore", authenticate, restoreNote);

// Permanent delete
router.delete("/:id/permanent", authenticate, permanentDeleteNote);

// Upload attachment
router.post("/:id/attachments", authenticate, upload.single("file"), uploadAttachment);

// Delete attachment
router.delete("/:noteId/attachments/:attachmentId", authenticate, deleteAttachment);

// Export to PDF
router.get("/:id/export/pdf", authenticate, exportNoteToPDF);

export default router;
