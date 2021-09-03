module.exports = (req, res) => {
    res.statusCode = 200;
    res.end(JSON.stringify({data: 'Hello world!\n'}));
}