var SocketIOGame= function(host){
  this.connected = false;
  this.eventHandlers = [];


  this.socket = new io.Socket(host || 'localhost');


  this.socket.connect();


    var context = this;

    this.socket.on('connect', function(){
    context.connected = true;

    context._emit('connect',{});

    context._send('connectToChannel', {
    });
	});

	this.socket.on('disconnect', function(){
    context.connected = false;

    
    // publish the message so people know we got disconnected,
    // and if/when we're going to try to reconnect:

    context._emit('disconnect',{
    });

    // auto-reconnect, if option is set:
    if (retry){

      context.reconnectInterval = setInterval(function(){
        if (!context.connected){
          context._emit('connectionRetry',{
            retryIn: retryEvery
          });

          context.socket.connect();

        } else {
          clearInterval(context.reconnectInterval);
        }
      }, retryEvery);
    }
	})

	this.socket.on('message', function(data){
    context._receive(data);
  });
}

// Public method to publish an event with a
// message hash.  the message hash should have
// a channel attribute
SocketIOGame.prototype.send = function(event, msg){
  msg = msg || {};
  this._send(event,msg);
}

// Public method for registeing event handlers
// that should be called when certain events
// are pushed to the browser
SocketIOGame.prototype.on = function(event, closure){
  if(this.eventHandlers[event]){
    this.eventHandlers[event].push(closure);
  } else {
    this.eventHandlers[event] = [closure];
  }
};

SocketIOGame.prototype._send = function(event, msg){
    console.log("sending message: ", event, msg);
    msg = msg || {};

    msg['event'] = event;

    console.log("for realz",msg);
    this.socket.send(JSON.stringify(msg));
};

SocketIOGame.prototype._emit = function(event, msg){
  if (this.eventHandlers[event]){
    this._executeCallbacks(this.eventHandlers[event],msg);
  }
}

SocketIOGame.prototype._receive = function(msg){
    console.log("received message: ", msg);
    parsed=msg;
    if (!parsed || !parsed.event){
      return;
    }

    for(var p in parsed){
      if (typeof parsed[p] == "string"){
        parsed[p] = this.esc(parsed[p])
      }
    }

    this._emit(parsed.event,parsed.data);
}

SocketIOGame.prototype.init = function(data){
    this._send("init",data);
}


SocketIOGame.prototype.move = function(data){
     this._send("move",data);

}


SocketIOGame.prototype.loose = function(data){
      this._send("loose",data);

}
SocketIOGame.prototype._executeCallbacks = function(callbacks, data){
  for(var i=0;i<callbacks.length;i++){
    callbacks[i](data);
  }
}

SocketIOGame.prototype.esc = function(msg){
  return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


