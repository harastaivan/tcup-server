import express from 'express';

import admin from '../../middleware/admin';
import Document from '../../models/Document';
import upload from '../../services/upload';

const router = express.Router();

// @route   POST api/documents
// @desc    Create a document
// @access  Admin
router.post('/', admin, upload.single('document'), async (req, res) => {
    const document = await Document.findOne({ name: req.file.key });

    if (document) {
        document.originalName = req.file.originalname;
        document.path = req.file.location;
        document.mimetype = req.file.mimetype;
        document.size = req.file.size;
        document.updatedAt = new Date();

        const savedDocument = await document.save();

        res.status(200).json(savedDocument);
    } else {
        const newDocument = new Document({
            name: req.file.key,
            originalName: req.file.originalname,
            path: req.file.location,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        const savedDocument = await newDocument.save();

        res.status(201).json(savedDocument);
    }
});

// @route   GET api/documents
// @desc    Get all documents
// @access  Public
router.get('/', async (req, res) => {
    const documents = await Document.find({}).sort('name');

    res.json(documents);
});

// @route   DELETE api/documents/:id
// @desc    Delete a document
// @access  Admin
router.delete('/:id', admin, async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ success: false });
        }
        await Document.deleteOne(document);
        return res.json({ success: true });
    } catch (err) {
        res.status(404).json({ success: false });
    }
});

export default router;
