const io = require('socket.io')();
const CronJob = require('cron').CronJob;
const validator = require('validator');

io.origins((origin, callback) => {
  if (origin !== 'http://localhost:3001') {
      return callback('origin not allowed', false);
  }
  callback(null, true);
});

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
				  	io.emit('comments', [first,last,imageurl,comment,new Date() - 60])
				  }
				}, null, true);
}

sendRandomFakeLiveComments();

io.on('connection', (client) => {
	console.log(new Date(),'user connected');    
	client.on('disconnect', () => {
		console.log(new Date(),'user disconnected')
	    client.removeAllListeners('subscribeToComments');
	    client.removeAllListeners('addnewcomment');
	    io.removeAllListeners('disconnect');
	});
	client.on('addnewcomment', (data) => {
		let message = validator.trim(data);
		client.broadcast.emit('comments', ['Guest','','',message,new Date() - 60]);
		});
});

const port = process.env.PORT || 3000;
io.listen(port, () => console.log(`Server is listening on port ${port}.`));
