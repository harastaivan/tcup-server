const error = (err, req, res) => {
    res.status(500).json({
        error: err.message
    });
};

export default error;
