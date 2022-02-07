
var timeLeft = 19;
var elem = document.getElementById("timer");



// Get username and room from URL
const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const user = urlParams.get('username');

const socket = io();





   
//boolean check if game has started
var hasGameStarted = false;

//Data to send to other clients after first person starts the game
var receivedGameData;
var myPoints = 0;
//receive if game has started
gameran = false;
reloaded = false;

socket.on('refresh', refresh=>{
    console.log(refresh);
    if(reloaded == false){
        location.reload();
    }
    reloaded =true;
   
});

socket.on('gameHasStarted',sentgameData=>{
    receivedGameData = sentgameData;
    console.log(receivedGameData);
     });

socket.on("sendHasGameStarted",GameStarted=>{
hasGameStarted = GameStarted;
});
    

socket.on('startGameAll',function(data){
    if(gameran==false){
        startGame()
    }
    gameran = true;
});

socket.on("message", message=>{
    console.log(message);
});

function resetGame(){
    console.log("resetted");
    hasGameStarted = false;
    socket.emit('resetGame',hasGameStarted);
}

socket.on('userList', userList=>{

    while (document.getElementById("users").firstChild) {
        document.getElementById("users").removeChild(document.getElementById("users").lastChild);
      }
    
    for (const property in userList) {
      var node = document.createElement("li");
      var userPoints =  String(`${property} Points:  ${userList[property]}`);
      var textnode = document.createTextNode(userPoints);
      node.appendChild(textnode);
      document.getElementById("users").appendChild(node);

      }
});   




//receive data if game has started


socket.on("sendChatMsg",msg=>{
    console.log(msg);
    var node = document.createElement("li");
    var textnode = document.createTextNode(msg);
    node.appendChild(textnode);
    document.getElementById("receivedMessages").appendChild(node);
});


//function to decode html text
function htmlDecode(value) {
    return $('<div/>').html(value).text();
}



    
    //get questions via api
var listView = document.createElement('div');
listView.className = "questionlist";
function startGame(){

document.getElementById("mypoints").innerText = "My points: " + myPoints
   
   // if(hasGameStarted ==true){
   //  console.log("GAME HAS ALREADY STARTED"); 
    // return;
  //  }
  

$.getJSON("https://opentdb.com/api.php?amount="+document.getElementById("questionsAmount").value+"", function(result){

console.log(hasGameStarted);  
if(hasGameStarted==false){
console.log(result);
socket.emit('gameData',result);
}

if(hasGameStarted == true){
    result = receivedGameData; 
}        

         
    


    
 
    
//if game has already started, do not overwrite the questions on the server
data = result.results;
console.log(data);
hasGameStarted =true;
socket.emit('startGameBool',hasGameStarted);
//flag game started
if(hasGameStarted == true){
 document.getElementById("startbtn").disabled = true;
}
//tell server that game has started
gameran = true;
socket.emit('startGameForAll',"startgame");
console.log("game hasnt started sent startgameforall");
     




//create elements 

//data from api

console.log(data);
//loop through questions
var timerId = setInterval(countdown, 1000);
for (let i=0; i<data.length+1; i++) {
    setTimeout(() => {addQuestion(i);}, 20000*i);
}





});



}


function countdown() {
    if (timeLeft == 0) {
      timeLeft =19;
    } else {
      elem.innerHTML = timeLeft + ' seconds remaining';
      timeLeft--;
    }
  }

function addQuestion(i){
    
    if(listView.firstChild){
        addPoints();  
    }

    while(listView.firstChild){
      
    listView.removeChild(listView.firstChild);
    }
    var listViewItem=document.createElement('select');
    listViewItem.name ="questions"
    listViewItem.id = "id_questions"
    listViewItem.setAttribute("multiple","");
    var title =document.createElement("h4");
    try{
    title.innerHTML = htmlDecode((i+1)+". "+data[i].question);
    }catch{
        return;
    }  
    listView.appendChild(title);
   
   //TODO make random order of answers
   //insert correct answer and insert
    var correct = document.createElement("option");
    correct.value = "correct";
    correct.innerHTML = htmlDecode(data[i].correct_answer);
    
    randomInsert = getRandomInt(0,data[i].incorrect_answers.length);
    
    //loop through wrong answers and insert
    for(let j=0;j<data[i].incorrect_answers.length;j++){
            
    var incorrect= document.createElement("option");
    incorrect.value = "incorrect";
    incorrect.innerHTML = htmlDecode(data[i].incorrect_answers[j]);
    listViewItem.appendChild(incorrect);
    if(j== randomInsert){
        listViewItem.appendChild(correct);
    }
    }

    //add questions and answers to final list
    listView.appendChild(listViewItem);
    


//insert list into DOM
document.getElementById("questionList").appendChild(listView); 

}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }



function addPoints(){
    const selection = document.querySelector("#id_questions");
    const val  = selection.value;
    if (val == "correct"){
        myPoints++;
        document.getElementById("mypoints").innerText = "My points: " + myPoints;
        socket.emit('userPoints',{"user":user, "points":myPoints});
    }
    else{
        console.log("incorrect answer");
    }

} 

    function openForm() {
        document.getElementById("myForm").style.display = "block";
      }
      
      function closeForm() {
        document.getElementById("myForm").style.display = "none";
      }


    function sendMessage(){
       
       
        msg = document.getElementById("sendMessage").value;
        socket.emit("chatmsg",msg);
      

        

    }



  
