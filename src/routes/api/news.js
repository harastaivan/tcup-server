import express from 'express';
import admin from '../../middleware/admin.js';
import News from '../../models/News.js';

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
		author
	});

	const savedNews = await newNews.save();

	return res.status(201).json({
		title: savedNews.title,
		body: savedNews.body,
		author: savedNews.author
	});
});

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get('/', async (req, res) => {
	const news = await News.find({}).populate('author', '-password');
	return res.json(news);
});

export default router;
