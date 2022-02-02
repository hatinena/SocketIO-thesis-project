
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);
var hasGameStarted = false; //game has not started
//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
//Run when client connects
io.on('connection', socket => {
 

//send if game has started
 socket.emit('sendHasGameStarted', hasGameStarted);

 //if game has started, send questions from server
 if(hasGameStarted==true){
    socket.emit('gameHasStarted',listView);
   }


   //receive when game has started
    socket.on('startGame',GameStarted=>{
        hasGameStarted = GameStarted;

    });

   

    //receive questions from client that started game
    socket.on('gameData',gameData=>{
        listView = gameData;
    });

    
 
});
const PORT =  process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));