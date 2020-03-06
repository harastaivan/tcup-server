/* eslint no-console: 0 */
const error = (err, req, res) => {
    console.log('error middleware');
    const status = err.status || 500;
    console.log('status', status);
    res.status(status);
    res.end();
};

export default error;
