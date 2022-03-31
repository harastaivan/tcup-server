import express from 'express';
import CompetitionClass from '../../models/CompetitionClass';
import CompetitionDay from '../../models/CompetitionDay';
import DailyResult from '../../models/DailyResult';

const router = express.Router();

const getCompetitionDays = async () => {
    const competitionDays = await CompetitionDay.find({ task: 'TASK' }).sort({ date: 'desc' });

    return competitionDays;
};

const getCompetitionDay = async (id) => {
    const competitionDay = await CompetitionDay.findById(id);

    return competitionDay;
};

const getLastCompetitionDay = async () => {
    const competitionDay = await CompetitionDay.findOne({ task: 'TASK' }).sort({ date: 'desc' });

    return competitionDay;
};

const getCompetitionClasses = async () => {
    const competitionClasses = await CompetitionClass.find({});

    return competitionClasses;
};

const getCompetitionClass = async (id) => {
    const competitionClass = await CompetitionClass.findById(id);

    return competitionClass;
};

const getTopResults = async (day, competitionClass) => {
    const mapResult = (result) => ({
        position: result.position_total,
        name: result.name,
        aeroclub: result.aeroclub,
        glider: result.glider,
        points: result.points_total
    });

    const results = await DailyResult.find({ day, competitionClass })
        .sort({ position_total: 'asc' })
        .limit(3);

    const { _id, name, type } = competitionClass;

    return { _id, name, type, results: results.map(mapResult) };
};

const getTotalResults = async (day, competitionClass) => {
    const mapResult = (result) => ({
        position: result.position_total,
        name: result.name,
        aeroclub: result.aeroclub,
        glider: result.glider,
        points: result.points_total,
        handicap: result.handicap
    });

    const results = await DailyResult.find({ day, competitionClass }).sort({ position_total: 'asc' });

    return results.map(mapResult);
};

const getDailyResults = async (day, competitionClass) => {
    const mapResult = (result) => ({
        position: result.position,
        name: result.name,
        aeroclub: result.aeroclub,
        glider: result.glider,
        points: result.points,
        handicap: result.handicap,
        flightId: result.flightId
    });

    const results = await DailyResult.find({ day, competitionClass }).sort({ position: 'asc' });

    return results.map(mapResult);
};

// @route   GET api/results/top
// @desc    Get top results for each class
// @access  Public
router.get('/top', async (req, res, next) => {
    try {
        const day = await getLastCompetitionDay();
        const classes = await getCompetitionClasses();

        const results = await Promise.all(classes.map((competitionClass) => getTopResults(day, competitionClass)));

        return res.json({ classes: results });
    } catch (error) {
        next(error);
    }
});

// @route   GET api/results/total
// @desc    Get total results for each class
// @access  Public
router.get('/total/:competitionClassId', async (req, res, next) => {
    try {
        const { competitionClassId } = req.params;
        const day = await getLastCompetitionDay();
        const competitionClass = await getCompetitionClass(competitionClassId);

        if (!day) {
            return res.status(400).json({ msg: "Competition day doesn't exists" });
        }

        const results = await getTotalResults(day, competitionClass);

        return res.json(results);
    } catch (error) {
        next(error);
    }
});

// @route   GET api/results/daily/filters
// @desc    Get daily filters (classes and competition days)
// @access  Public
router.get('/daily/filters', async (req, res, next) => {
    try {
        const days = await getCompetitionDays();
        const classes = await getCompetitionClasses();

        const filters = classes.map((competitionClass) => {
            const { _id, name, type } = competitionClass;

            return {
                _id,
                name,
                type,
                days
            };
        });

        return res.json({ classes: filters });
    } catch (error) {
        next(error);
    }
});

// @route   GET api/results/daily/:competitionClassId/:dayId
// @desc    Get daily results based on class and day
// @access  Public
router.get('/daily/:competitionClassId/:dayId', async (req, res, next) => {
    try {
        const { competitionClassId, dayId } = req.params;

        const day = await getCompetitionDay(dayId);
        const competitionClass = await getCompetitionClass(competitionClassId);

        if (!day) {
            return res.status(400).json({ msg: "Day doesn't exist" });
        }

        if (!competitionClass) {
            return res.status(400).json({ msg: "Competition class doesn't exist" });
        }

        const results = await getDailyResults(day, competitionClass);

        return res.json(results);
    } catch (error) {
        next(error);
    }
});

export default router;
