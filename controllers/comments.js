const sendFakeComment = (io) => {
	const firstnames = ['John','David','Michael','Sarah','Anna','Hayley','James','Emily','Jane']
	const lastnames = ['Brown','Smith','Baker','Mitchell','Bond','Morrison','Davis','Williams','Johnson']
	const randcomments = ['Hello','Wow, this is interesting','Does anyone actually understand this?','Um what is this','Why am I even watching this?','I really should be doing something else, but this is so captivating','That was unexpected','My favourite video of all time','Really thought provoking']
	let random = Math.random();
	if (random < 0.5) {
	  	const first = firstnames[Math.floor(Math.random() * 9)]
	  	const last = lastnames[Math.floor(Math.random() * 9)]
	  	const comment = randcomments[Math.floor(Math.random() * 9)]
	  	const randimg = Math.floor(Math.random()*100)
	  	const imageurl = `http://placeimg.com/40/40/any/${randimg}`
	  	io.emit('comments', [first,last,imageurl,comment,new Date() - 60])
	  }
}

const handleFakeLiveComments = (io) => {
	setInterval(() => sendFakeComment(io), 5000)
}

const handleAddComment = (client, message) => {
	client.broadcast.emit('comments', ['Guest','','',message,new Date() - 60]);
}

module.exports = {
  handleAddComment,
  handleFakeLiveComments
};