module.exports = (req, res, path) => {
    res.statusCode = 200;
    res.end(JSON.stringify({data: 'Hello world!\n'}));
}