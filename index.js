// Node server, which will handle socket io connections

const io = require('socket.io')(process.env.PORT ||8000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

io.on('connection', socket => {

    // If a new user joins the chat, let others users connected to the server know!
    socket.on('new-user-joined', name1 => {
        // console.log("New user ", name1);
        users[socket.id] = name1;
        socket.broadcast.emit('user-joined', name1);
    })


    // If any user send any message, broadcast(send) this to other users
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name1: users[socket.id]});
    });


    // If someone leaves the chat, let other connected users know that!
    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    });
})