var ClientSound = {
    path: './assets/audio/',
    manifest: [
        {
            id: 'music', // Ok
            src: './assets/audio/mage_rage_theme.ogg'
        },
        {
            id: 'beamBeamContact', // No
            src: './assets/audio/beam_beam_contact.ogg'
        },
        {
            id: 'beamFire', // Ok
            src: './assets/audio/beam_fire.ogg'
        },
        {
            id: 'beamPlayerContact', // beam destroy sound
            src: './assets/audio/beam_player_contact.ogg'
        },
        {
            id: 'playerDeath', // Ok
            src: './assets/audio/player_death.ogg'
        }
    ],
    status: {
        music: false,
        beamBeamContact: false,
        beamFire: false,
        beamPlayerContact: false,
        playerDeath: false
    },
    musicLoadIntervalPlaying: false,
    init: function () {
        if (!createjs.Sound.initializeDefaultPlugins()) {
            return;
        }
        var self = this;
        createjs.Sound.alternateExtensions = ['mp3'];
        createjs.Sound.addEventListener("fileload", function (event) {
            self.status[event.id] = true;
            console.log('Audio file (' + event.src + ') loaded successfully');
        });
        createjs.Sound.registerManifest(this.manifest);
    }
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = ClientSound;
}