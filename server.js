/*Les valeurs à utiliser avec cloud9Ide*/
var PORT = process.env.C9_PORT;
var HOST = "0.0.0.0";
/* Import des librairies dont j'ai besoin.
* Sous Cloud9IDE, utilisez npm dans la console
* e.g. npm install socket.io
*/
var sys = require("sys"),
    http = require("http"),
    io = require("socket.io");
/* On crée un serveur simple que l'on va utiliser via
* l'extension socket.io
*/
var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end("Allo oui j'ecoute ?\n");
});
server.listen(PORT, HOST);
var socket = io.listen(server);
var player = [];
var rooms = {};
var NUMBER_CLIENT_PER_ROOM=2;
//init first room
var currentRoom = initRoom();

function initRoom(){
var id = Math.floor(Math.random() * 50000) + 1;
rooms[id] = [];
return id;
}
var direction = ['up', 'down', 'left', 'right'];
var color = ['yellow', 'green', 'blue', 'red'];

function registerClient(client) {
    rooms[currentRoom].push(client);
    if (rooms[currentRoom].length == NUMBER_CLIENT_PER_ROOM) {
        launchGame(currentRoom);
        currentRoom = initRoom();
    }   
}

function launchGame(room) {
    console.log("launching the game");
    rooms[room].forEach(function(client, index) {
        console.log("launching the game for client" + client + " direction " + direction[index] + " room " + room);
        client.send({
            "direction": direction[index],
            "color": color[index],
            "room": room
        });
    });
}
socket.on('connection', function(client) {
    console.log("Connection");
    registerClient(client);
    //each begin request => pseudo boradcat to all player in the room - not optimized but works.
    client.on('message', function(data) {
        console.log({
            "x": data.x,
            "y": data.y,
            "color": data.color
        });
        rooms[data.room].forEach(function(c, index) {
            if (c.sessionId != client.sessionId) {
                c.send({
                    "x": data.x,
                    "y": data.y,
                    "color": data.color
                });
            }
        });
    });
    client.on('disconnect', function() {
        //TODO Should removed the player from the room
        console.log("DeConnection");
    });
});