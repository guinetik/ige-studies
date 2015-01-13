var igeClientConfig = {
  include: [
      './lib/createjs-2013.12.12.min.js',
      './lib/TexturePackerAtlas.js',
      './gameClasses/BeamParticle.js',
      './gameClasses/Crown.js',
      './gameClasses/Player.js',
      './gameClasses/ClientNetworkEvents.js',
      './gameClasses/PlayerControlComponent.js',
      './gameClasses/Wall.js',
      './gameClasses/AttributeBox.js',
      './gameClasses/DeathParticle.js',
      './gameClasses/ClientSound.js',
      // Standard game scripts.
      './client.js',
      './index.js']
};

if(typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
  module.exports = igeClientConfig;
}