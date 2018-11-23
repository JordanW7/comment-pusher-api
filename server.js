const express = require("express");
const io = require('socket.io')();
const CronJob = require('cron').CronJob;
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { check } = require("express-validator/check");

const app = express();

const comments = require("./controllers/comments");

const whitelist = [
  "localhost:3001"
];
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(bodyParser.json());

io.on('connection', (client) => {
client.on('subscribeToComments', () => {
	const timer = new Date()
    console.log(timer,'client is subscribing to comments');
    new CronJob('5 * * * * *', function() {
		  client.emit('comments', 'NEW STUFF')
		}, null, true);
  });
});

const port = process.env.PORT || 3000;
io.listen(port, () => console.log(`Server is listening on port ${port}.`));
