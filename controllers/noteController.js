import Note from "../models/Note.js";
import Tag from "../models/Tag.js";
import validateObjectId from "../utils/validateObjectId.js";
import { cloudinary } from "../config/cloudinary.js";
import PDFDocument from "pdfkit";

export const createNote = async (req, res, next) => {
  try {
    // Only authenticated users can create notes
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in to create a note",
      });
    }

    const noteData = { ...req.body };
    noteData.userId = req.user.id; // Associate note with current user

    // Convert tag names to tag IDs
    if (req.body.tags && req.body.tags.length > 0) {
      const tagIds = await convertTagNamesToIds(req.body.tags);
      noteData.tags = tagIds;
    }

    const note = await Note.create(noteData);
    const populatedNote = await Note.findById(note._id).populate(
      "tags",
      "name color",
    );

    res.status(201).json({
      success: true,
      data: populatedNote,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNotes = async (req, res, next) => {
  try {
    const { category, isPinned, search, tag, isArchived, isDeleted, dateFrom, dateTo, sortBy } = req.query;

    // Build query - filter by user if authenticated
    let query = {};
    if (req.user) {
      query.userId = req.user.id;
    }

    // By default, exclude archived and deleted notes
    if (isArchived === "true") {
      query.isArchived = true;
      query.isDeleted = false;
    } else if (isDeleted === "true") {
      query.isDeleted = true;
    } else {
      query.isArchived = false;
      query.isDeleted = false;
    }

    if (category) {
      query.category = category;
    }

    if (isPinned !== undefined) {
      query.isPinned = isPinned === "true";
    }

    // Advanced search - search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    // Filter by tag name
    if (tag) {
      const tagDoc = await Tag.findOne({ name: tag.toLowerCase() });
      if (tagDoc) {
        query.tags = tagDoc._id;
      } else {
        // If tag doesn't exist, return empty array
        return res.status(200).json({
          success: true,
          count: 0,
          data: [],
        });
      }
    }

    // Sorting
    let sortOption = { isPinned: -1, createdAt: -1 };
    if (sortBy === "title") {
      sortOption = { title: 1 };
    } else if (sortBy === "updated") {
      sortOption = { updatedAt: -1 };
    } else if (sortBy === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const notes = await Note.find(query)
      .populate("tags", "name color")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const query = { _id: req.params.id };
    // Filter by user if authenticated
    if (req.user) {
      query.userId = req.user.id;
    }

    const note = await Note.findOne(query).populate("tags", "name color");

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    // Only authenticated users can update notes
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in to update a note",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    // Check if note belongs to user
    const noteExists = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!noteExists) {
      return res.status(403).json({
        success: false,
        error: "You can only update your own notes",
      });
    }

    const noteData = { ...req.body };

    // Convert tag names to tag IDs
    if (req.body.tags && req.body.tags.length > 0) {
      const tagIds = await convertTagNamesToIds(req.body.tags);
      noteData.tags = tagIds;
    } else if (req.body.tags && req.body.tags.length === 0) {
      // Handle empty tags array
      noteData.tags = [];
    }

    const note = await Note.findByIdAndUpdate(req.params.id, noteData, {
      new: true,
      runValidators: true,
    }).populate("tags", "name color");

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    // Only authenticated users can delete notes
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in to delete a note",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    // Check if note belongs to user
    const noteExists = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!noteExists) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own notes",
      });
    }

    // Soft delete - move to trash
    await Note.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      data: {},
      message: "Note moved to trash",
    });
  } catch (error) {
    next(error);
  }
};

// Archive/Unarchive Note
export const toggleArchiveNote = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      success: true,
      data: note,
      message: note.isArchived ? "Note archived" : "Note unarchived",
    });
  } catch (error) {
    next(error);
  }
};

// Restore Note from Trash
export const restoreNote = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    note.isDeleted = false;
    note.deletedAt = null;
    await note.save();

    res.status(200).json({
      success: true,
      data: note,
      message: "Note restored successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Permanent Delete
export const permanentDeleteNote = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    // Delete attachments from Cloudinary
    if (note.attachments && note.attachments.length > 0) {
      for (const attachment of note.attachments) {
        if (attachment.publicId) {
          await cloudinary.uploader.destroy(attachment.publicId);
        }
      }
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: "Note permanently deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Upload Attachment
export const uploadAttachment = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "notes_attachments",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const attachment = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      filename: req.file.originalname,
      uploadedAt: new Date(),
    };

    note.attachments.push(attachment);
    await note.save();

    res.status(200).json({
      success: true,
      data: attachment,
      message: "Attachment uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Attachment
export const deleteAttachment = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in",
      });
    }

    const { noteId, attachmentId } = req.params;

    if (!validateObjectId(noteId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    const attachment = note.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        error: "Attachment not found",
      });
    }

    // Delete from Cloudinary
    if (attachment.publicId) {
      await cloudinary.uploader.destroy(attachment.publicId);
    }

    note.attachments.pull(attachmentId);
    await note.save();

    res.status(200).json({
      success: true,
      data: {},
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Export Note to PDF
export const exportNoteToPDF = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "You must be logged in",
      });
    }

    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid note ID format",
      });
    }

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("tags", "name color");

    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found",
      });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${note.title.replace(/[^a-z0-9]/gi, "_")}.pdf"`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(24).font("Helvetica-Bold").text(note.title, { align: "center" });
    doc.moveDown();

    doc.fontSize(10).font("Helvetica").fillColor("gray");
    doc.text(`Category: ${note.category}`, { align: "left" });
    doc.text(`Created: ${note.createdAt.toLocaleString()}`, { align: "left" });
    
    if (note.tags && note.tags.length > 0) {
      doc.text(`Tags: ${note.tags.map(t => t.name).join(", ")}`, { align: "left" });
    }
    
    doc.moveDown();
    doc.strokeColor("black").lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    // Content
    doc.fontSize(12).fillColor("black").font("Helvetica");
    doc.text(note.content, { align: "left", lineGap: 5 });

    // Finalize PDF
    doc.end();
  } catch (error) {
    next(error);
  }
};

// Helper function to convert tag names to tag IDs
async function convertTagNamesToIds(tagNames) {
  const tagIds = [];

  for (const tagName of tagNames) {
    const normalizedName = tagName.toLowerCase().trim();

    // Find or create tag
    let tag = await Tag.findOne({ name: normalizedName });

    if (!tag) {
      // Create new tag if it doesn't exist
      tag = await Tag.create({ name: normalizedName });
    }

    tagIds.push(tag._id);
  }

  return tagIds;
}
