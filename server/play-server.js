var sys = require('sys'),
    events = require('events');

function Game(socket, options) {
    events.EventEmitter.call(this)
    this.listen(socket, options);

}
Game.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Game,
        enumerable: false
    }
});
// for us to do a require later
module.exports = Game;



Game.prototype.listen = function(socket, options) {
    
  this.socket = socket
    var context = this;
    this.socket.on('connection', function(client) {
        console.log("Conn");
            context.connect(client)

client.on('message', function(msg) {
            context.receive(client, msg)
        })
        client.on('disconnect', function() {
            console.log("DeConn");
            context.disconnect(client)
        })
    })
}

Game.prototype.connect = function(client) {
    var context = this
    console.log("Conn-func");
    context.emit('connection', client);
}

Game.prototype.disconnect = function(client) {
    var context = this
    context.emit('disconnection', client.sessionId);
};


Game.prototype.infoMove = function(c,data) {
     c.send({'event':'move','data':data});
}

Game.prototype.infoMessage = function(c,data) {
     c.send({'event':'message','data':data});
}

Game.prototype.infoWin = function(c,data) {
     c.send({'event':'win','data':data});
}


Game.prototype.receive = function(client, msg) {
    var parsed = null,
        context = this;

    try {
        parsed = JSON.parse(msg)
    }
    catch (e) {
        parsed = msg
    }

    if (!parsed.event) {
        return;
    }
    this.emit(parsed.event, client, parsed)
}
