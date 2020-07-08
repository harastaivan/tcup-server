// eslint-disable-next-line
const error = (err, req, res, next) => {
    // eslint-disable-next-line
    console.log('error middleware');
    const status = err.status || 500;
    // eslint-disable-next-line
    console.log('status', status);
    console.log(status);
    res.status(status);
    res.end();
};

export default error;
