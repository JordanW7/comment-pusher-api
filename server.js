const app = require('express')();
const cors = require("cors");
const morgan = require("morgan");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const validator = require('validator');

const comments = require("./controllers/comments");
comments.handleFakeLiveComments(io);

const whitelist = [
  "http://localhost:3001",
  "http://localhost:8080"
];
const corsOptions = {
  origin: function(origin, callback) {
  	callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(morgan("combined"));
app.use(cors(corsOptions));

io.on('connection', (client) => {
	console.log(new Date(),'user connected');    
	client.on('disconnect', () => {
		console.log(new Date(),'user disconnected')
	    client.removeAllListeners('addnewcomment');
	    io.removeAllListeners('disconnect');
	});
	client.on('addnewcomment', (data) => {
		let message = validator.trim(data);
		if (!message) { return }
		comments.handleAddComment(client, message);
		});
});

app.get(
  "/",
  (req, res) => {
      return res.status(200).json('Hello');
    }
);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server is listening on port ${port}.`));
