/*Les valeurs à utiliser avec cloud9Ide*/
var PORT = process.env.C9_PORT;
var HOST = "0.0.0.0";


var sys = require("sys"),
    http = require("http"),
    io = require("socket.io"),
    games = require("./server/play-server-index");


var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end("Allo oui j'ecoute ?\n");
});
server.listen(PORT, HOST);
var socket = io.listen(server),
    game = games.listen(socket, {});

var player = [];
var rooms = {};
var direction = ['up', 'down', 'left', 'right'];
var color = ['yellow', 'green', 'blue', 'red'];

initRoom();

function registerClient(client) {
    rooms[currentRoom].push(client);
    if (rooms[currentRoom].length == 2) {
        launchGame(currentRoom);
       initRoom();

    }        
}
function initRoom(){
     currentRoom = Math.floor(Math.random() * 50000) + 1;
     rooms[currentRoom] = [];
}

function launchGame(room) {
    console.log("launching the game");
    rooms[room].forEach(function(client, index) {
        console.log("launching the game for client" + client + " direction " + direction[index] + " room " + room);
        client.send({'event':'init','data':{
            "direction": direction[index],
            "color": color[index],
            "room": room
        }});
    });
}
game.on('connection', function(client) {
    console.log("Connection");
    registerClient(client);
});

game.on("move",function(client,data){
console.log({
            "x": data.x,
            "y": data.y,
            "color": data.color
        });
        rooms[data.room].forEach(function(c, index) {
             if (c.sessionId != client.sessionId) {
              game.infoMove(c,data);
            }
        });
    });
       
game.on("loose",function(client,data){
rooms[data.room].forEach(function(c, index) {
            if (c.sessionId != client.sessionId) {
               game.infoMessage(c,"Congratulations, you win the game !!! ");
            }
        });
});