var igeClientConfig = {
  include: [
      './lib/TexturePackerAtlas.js',
      './gameClasses/BeamParticle.js',
      './gameClasses/Player.js',
      './gameClasses/ClientNetworkEvents.js',
      './gameClasses/PlayerControlComponent.js',
      './gameClasses/Wall.js',
      './gameClasses/AttributeBox.js',
      './gameClasses/DeathParticle.js',
      './gameClasses/ClientSound.js',
      // External CDNs
      'http://code.createjs.com/createjs-2013.12.12.min.js',//'http://code.createjs.com/soundjs-0.5.2.min.js',
      // Standard game scripts.
      './client.js',
      './index.js']
};

if(typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
  module.exports = igeClientConfig;
}