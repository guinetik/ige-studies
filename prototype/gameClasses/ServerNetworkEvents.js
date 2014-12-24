var ServerNetworkEvents = {
  _onPlayerConnect: function(socket) {
    if(ige.server.availableClasses.length === 0) {
      return true;
    }
    return false;
  },
  _onPlayerDisconnect: function(clientId) {
    if(ige.server.players[clientId]) {
      var mageType = ige.server.players[clientId]._playerClass;
      ige.server.availableClasses.push(mageType);
      ige.server.players[clientId].destroy();
      delete ige.server.players[clientId];
      delete ige.server.playerClasses[mageType];
    }
  },
  _onPlayerEntity: function(data, clientId) {
    if(!ige.server.players[clientId]) {
      var player = ige.server.playerFactory(clientId,
                                            data.playerName,
                                            ige.server.foregroundScene);

      ige.server.players[clientId] = player;
      ige.server.playerClasses[player._playerClass] = player;

      var x = Math.floor(Math.random() * 600) - 300;
      var y = Math.floor(Math.random() * 600) - 300;

      player.translateTo(x, y, 0);

      // Tell the client to track their player entity.
      ige.network.send('playerEntity', player.id(), clientId);
    }
  },
  _onPlayerLeftDown: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.left = true;
  },
  _onPlayerLeftUp: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.left = false;
  },
  _onPlayerRightDown: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.right = true;
  },
  _onPlayerRightUp: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.right = false;
  },
  _onPlayerUpDown: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.up = true;
  },
  _onPlayerUpUp: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.up = false;
  },
  _onPlayerDownDown: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.down = true;
  },
  _onPlayerDownUp: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.down = false;
  },
  _onPlayerShootDown: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.shoot = true;
  },
  _onPlayerShootUp: function(data, clientId) {
    ige.server.players[clientId].playerControl.controls.shoot = false;
  }
};

if(typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
  module.exports = ServerNetworkEvents;
}