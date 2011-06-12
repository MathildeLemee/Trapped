
exports.Game = require('./play-server')
exports.listen = function(socket, options){
  return new exports.Game(socket, options)
}
