import express from 'express';
import multer from 'multer';

import admin from '../../middleware/admin';
import Document from '../../models/Document';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './documents/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 20
};

const upload = multer({ storage, limits });

// @route   POST api/documents
// @desc    Create a document
// @access  Admin
router.post('/', admin, upload.single('document'), async (req, res) => {
    console.log(req.file);

    const newDocument = new Document({
        name: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
    });

    const savedDocument = await newDocument.save();

    res.status(201).json(savedDocument);
});

// @route   GET api/documents
// @desc    Get all documents
// @access  Public
router.get('/', async (req, res) => {
    const documents = await Document.find({}).sort('name');

    res.json(documents);
});

export default router;
