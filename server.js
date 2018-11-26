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

const sendRandomFakeLiveComments = () => {
	const firstnames = ['John','David','Michael','Sarah','Anna','Hayley','James','Emily','Jane']
	const lastnames = ['Brown','Smith','Baker','Mitchell','Bond','Morrison','Davis','Williams','Johnson']
	const randcomments = ['Hello','Wow, this is interesting','Does anyone actually understand this?','Um what is this','Why am I even watching this?','Hey Sarah - how was work?','That was unexpected','My favourite video of all time','Really thought provoking']
	new CronJob('*/5 * * * * *', () => {
		    	let random = Math.random();
		    	if (random < 0.5) {
				  	const first = firstnames[Math.floor(Math.random() * 9)]
				  	const last = lastnames[Math.floor(Math.random() * 9)]
				  	const comment = randcomments[Math.floor(Math.random() * 9)]
				  	const randimg = Math.floor(Math.random()*100)
				  	const imageurl = `http://placeimg.com/40/40/any/${randimg}`
				  	io.emit('comments', [first,last,imageurl,comment,new Date()])
				  }
				}, null, true);
}

sendRandomFakeLiveComments();

io.on('connection', (client) => {
	client.on('subscribeToComments', () => {
		const timer = new Date();
	    console.log(timer,'client is subscribing to comments');    
	});
	client.on('comments', (msg) => {
		console.log("RECEIVED NEW",msg)
		});
});

const port = process.env.PORT || 3000;
io.listen(port, () => console.log(`Server is listening on port ${port}.`));
