var BeamParticle = IgeEntityBox2d.extend({
  classId: 'BeamParticle',
  init: function(beamType, direction) {
    var self = this;
    IgeEntityBox2d.prototype.init.call(this);
    /* CEXCLUDE */
    if(ige.isServer) {
      this.addComponent(IgeVelocityComponent);
      this.box2dBody({
        type: 'dynamic',
        linearDamping: 0.0,
        angularDamping: 0.1,
        allowSleep: true,
        bullet: false,
        gravitic: true,
        fixedRotation: false,
        fixtures: [{
          density: 1.0,
          friction: 0.5,
          restitution: 0.2,
          shape: {
            type: 'circle'
          }
        }]
      }).streamMode(1);
    }
    /* CEXCLUDE */
    this.category('BeamParticle');
    this._beamType = beamType;
    this._direction = direction;
    this._inPlayer = true;
    this.streamSections(['transform', 'beamType', 'direction']);
  },
  update:function(ctx) {
    if(!ige.isServer) {
      console.log("BEAMTYPE", this._beamType);
      switch (this._beamType) {
        case 'cop':
          this.texture(ige.client.textures.shot_blue);
          break;
        case 'marine':
          this.texture(ige.client.textures.shot_purple);
          break;
        case 'robot':
          this.texture(ige.client.textures.shot_red);
          break;
        case 'zapper':
          this.texture(ige.client.textures.shot_yellow);
          break;
      }
    }
    IgeEntityBox2d.prototype.update.call(this, ctx);
  },
  streamSectionData: function(sectionId, data) {
    if(sectionId === 'beamType') {
      if(!ige.isServer) {
        if(data) {
          this._beamType = data;
        }
      }
      else {

        return this._beamType;
      }
    }
    else if(sectionId === 'direction') {
      if(!ige.isServer) {
        if(data) {
          // We have been given new data!
          this._direction = data;
        }
      }
      else {
        // Return current data.
        return this._direction;
      }
    }
    else {
      // Any other stream data sections forward to the parent class to
      // deal with.
      return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
    }
  },

  /**
   * Destroys the beam particle entity and associated resources. Triggers sound
   * effect on the client.
   *
   * @name BeamParticle.prototype.destroy
   * @function
   */
  destroy: function() {
    if(!ige.isServer) {
      if(ClientSound.status.beamPlayerContact) {
        createjs.Sound.play('beamPlayerContact', {volume: 0.15});
      }
    }
    IgeEntityBox2d.prototype.destroy.call(this);
  }
});

if(typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
  module.exports = BeamParticle;
}