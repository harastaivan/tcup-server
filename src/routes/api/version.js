import express from 'express';
import { version } from '../../../package.json';

const router = express.Router();

// @route   GET /
// @desc    Gets npm package version
// @access  Public
router.get('/', async (req, res) => {
    return res.status(200).json({
        version
    });
});

export default router;
