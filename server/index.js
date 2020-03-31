const server = require('./server.js');

server.listen(8000, () => {
	console.log(`Server listening at http://localhost:${8000}`);
});
