const socketio = require('socket.io')
const stories = require('./controller.js')


module.exports.listen = function(http){
  var io = socketio(http)
  io.on('connection', function(client){

    client.on('createRoom', function(roomId) {
      client.join(roomId);
    });


    client.on('addMessage', function(message) {
      io.to(message.roomId).emit('addMessage', message)
    })
    // when the client submits a new line save it to the
    // database and return the story

  })
}
