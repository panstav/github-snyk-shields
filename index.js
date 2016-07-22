const server = require('./server');
const port = process.env.PORT || 3000;

server().listen(port, () => {
	console.info(`Listening on port ${port}`);
});