import express from 'express';

import News from '../../models/News';
import admin from '../../middleware/admin';
import User from '../../models/User';

const router = express.Router();

// @route   POST api/news
// @desc    Create a news
// @access  Admin
router.post('/', admin, async (req, res) => {
    const { title, body } = req.body;
    const author = req.user.id;
    // Simple validation
    if (!title || !body || !author) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const newNews = new News({
        title,
        body,
        author: await User.findById(author).select('-password')
    });

    const savedNews = await newNews.save();

    return res.status(201).json(savedNews);
});

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const news = await News.find({})
            .sort([['updatedAt', -1]])
            .populate('author', '-password');
        return res.json(news);
    } catch (error) {
        next(error);
    }
});

// @route   DELETE api/news/:id
// @desc    Delete a news
// @access  Admin
router.delete('/:id', admin, async (req, res) => {
    try {
        await News.findByIdAndDelete(req.params.id);
        return res.json({ success: true });
    } catch (err) {
        res.status(404).json({ success: false });
    }
});

export default router;
