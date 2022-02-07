
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');





const app = express();
const server = http.createServer(app);
const io = socketio(server);
var listView;
var hasGameStarted = false; //game has not started

var userList = {};
//Set static folder
app.use(express.static(path.join(__dirname, 'public')));



//Run when client connects
io.on('connection', socket => {
  
  
  //receive when game has started
  socket.on('startGameBool',GameStarted=>{
    hasGameStarted = GameStarted;
    io.emit('sendHasGameStarted', hasGameStarted);
  });



//send if game has started


 socket.on('startGameForAll',startgame =>{
  io.emit('startGameAll',"startgame");
 });



 //if game has started, send questions from server
 
 socket.on('resetGame',bool=>{
   hasGameStarted = bool;
   userList = {};
   console.log(hasGameStarted);
   io.emit('refresh','refresh');
 })


 socket.on('userPoints', data =>{
  userList[data.user] = data.points;
  setTimeout(() => {  socket.emit('userList',userList);}, 500);
  
 });

   

    //receive questions from client that started game
   

   

   
    
    socket.on('chatmsg',msg=>{
        io.emit("sendChatMsg",msg);
    });
    

  
    socket.on('gameData',gameData=>{
      console.log("server received gameData")
      listView = gameData;
      if(listView){
        io.emit('gameHasStarted',listView);
      }
    });

       

});




const PORT =  process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));