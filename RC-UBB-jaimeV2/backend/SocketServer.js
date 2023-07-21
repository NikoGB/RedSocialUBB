const http = require('http')
const express = require('express')
const cors = require('cors')

// Create the Express app and the HTTP server
const app = express()
const socketServer = http.createServer(app)

// Serve static files from the public directory
app.use(express.static('public'))
app.use(cors())

const io = require('socket.io')(socketServer, {
    cors: {
        origin: 'http://localhost:3001',
        methods: ['GET', 'POST']
    }
})

let connectedUsers = ['-1']

io.on('connection', function (socket) {

    socket.on('connected user', data => {
        if (!data.friends) {
            return;
        }
        console.log('A user connected from', socket.handshake.address, "ID", data.id)

        socket.join(data.id);
        if (!connectedUsers.includes(data.id)) {
            connectedUsers.push(data.id);

            data.friends.forEach(friend => {
                if (connectedUsers.includes(friend.id)) {
                    console.log('emittin to ', friend.id)
                    io.to(friend.id).emit('connected friend', data.id);
                    io.to(data.id).emit('connected friend', friend.id);
                }
            })


        }
        console.log("usersON", connectedUsers);
    })

    // Add a listener for incoming chat messages
    socket.on('chat message', async function (data, callback) {
        const reciveds = [];
        const promises = [];

        for (const userID of data.toUsers) {
            console.log('emitting to', userID);

            if (connectedUsers.includes(userID)) {
                let recived = false;

                promises.push(
                    new Promise((resolve, reject) => {

                        const timeout = setTimeout(() => {
                            reject(new Error('Timeout: No response received'));
                        }, 10000); // Timeout after 10 seconds 

                        io.to(userID).emit('chat message', data.content, () => {
                            console.log("response to chat message from ", data.content, "RECIBIDO");
                            if (!recived) {
                                reciveds.push(userID);
                                recived = true;
                            }

                            clearTimeout(timeout);
                            resolve();
                        });

                    })
                );
            }
        }

        try {
            await Promise.all(promises);
        } catch (error) {
            console.log(error.message);
        }

        callback(reciveds);
    });

    socket.on('read mark', (toUsers, chatID, msgID, userID) => {
        for (const user of toUsers) {
            console.log('emitting to', user);

            if (connectedUsers.includes(user)) {
                io.to(user).emit('read mark', chatID, msgID, userID);
            }
        }
    })

    socket.on('disconnect friend', (userID, friends) => {
        friends.forEach((friend) => {
            if (connectedUsers.includes(friend)) {
                io.to(friend).emit('disconnected friend', userID);
            }
        })
    })

    socket.on("disconnecting", () => {
        console.log(socket.handshake.address, "Disconnecting from:", socket.rooms);
        const rooms = Array.from(socket.rooms);
        let idx = 0;

        if ((idx = connectedUsers.findIndex((us) => rooms.some((r) => us == r))) > -1) {
            connectedUsers.splice(idx, 1)
        }

        //console.log("OnUsers", connectedUsers); 
    });
})

// Start the server listening on port 3001
socketServer.listen(3001, function () {
    console.log('Server listening on port 3001')
})
