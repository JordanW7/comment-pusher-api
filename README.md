Backend (Node.js API) for React/Vue Pusher Application Repository.

*To install dependencies from terminal: npm install
*To run from terminal: docker-compose up --build

Note: The application is setup to run on localhost:3000 by default, please ensure that there is no other application running on this port.

Features:
* Real-Time Application, using Socket.IO
* Broadcasts random(ish) fake messages, using Cron
* Input Validation, using Validator
* Receives new messages from the front-end and broadcasts the messages to all other users (except the sender).
* Dockerized

Weaknesses:
* No code tests have been added.
