//Socket io
const socket = io();

//boolean check if game has started
var hasGameStarted;

//Data to send to other clients after first person starts the game
var receivedGameData;

//receive if game has started
socket.on("sendHasGameStarted",GameStarted=>{
    hasGameStarted = GameStarted;
});

//receive data if game has started
socket.on('gameHasStarted',sentgameData=>{
receivedGameData = sentgameData;
});



//function to decode html text
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

        
    //get questions via api
    $.getJSON("https://opentdb.com/api.php?amount=10", function(result){
        
    
        //if game has started, get the questions from the server
        if(hasGameStarted ==true) {
            result = receivedGameData;
        }

        //create elements 
        var listView = document.createElement('ol');
        listView.className = "questionlist";
        //data from api
        data = result.results;

        //loop through questions
        for(let i=0;i<data.length;i++)
        {
            var listViewItem=document.createElement('li');
            var title =document.createElement("h4");
            title.innerHTML = htmlDecode(data[i].question);
            listViewItem.appendChild(title);
           
           //TODO make random order of answers
           //insert correct answer and insert
            var correct = document.createElement("button");
            correct.innerHTML = htmlDecode(data[i].correct_answer);
            listViewItem.appendChild(correct);
            
            //loop through wrong answers and insert
            for(let j=0;j<data[i].incorrect_answers.length;j++){
            var incorrect= document.createElement("button");
            incorrect.innerHTML = htmlDecode(data[i].incorrect_answers[j]);
            listViewItem.appendChild(incorrect);

            }
            //add questions and answers to final list
            listView.appendChild(listViewItem);
            
        }
     
        //insert list into DOM
        document.getElementById("questionList").appendChild(listView); 
       
        
        //if game has already started, do not overwrite the questions on the server
        if(hasGameStarted==false){
        socket.emit('gameData',result); 
        }
        //flag game started
        hasGameStarted =true;
        //tell server that game has started
        socket.emit('startGame',hasGameStarted); 
    });







  
