var config = {
    include: [
        {
            name: 'Crown',
            path: './gameClasses/Crown'
        },
        {
            name: 'BeamParticle',
            path: './gameClasses/BeamParticle'
        },
        {
            name: 'EntityContactResolver',
            path: './gameClasses/EntityContactResolver'
        },
        {
            name: 'Player',
            path: './gameClasses/Player'
        },
        {
            name: 'PlayerControlComponent',
            path: './gameClasses/PlayerControlComponent'
        },
        {
            name: 'ServerNetworkEvents',
            path: './gameClasses/ServerNetworkEvents'
        },
        {
            name: 'Wall',
            path: './gameClasses/Wall'
        },
        {
            name: 'DeathParticle',
            path: './gameClasses/DeathParticle'
        }
    ]
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = config;
}