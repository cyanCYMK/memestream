const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5001
app.get('/', function(req, res) {
	res.send('memestream');
});
app.listen(port, function() {
	console.log('memestream app listening on port 3000');
});

