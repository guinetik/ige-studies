var Server = IgeClass
    .extend({
        classId: 'Server',
        init: function (options) {
            var self = this;
            ige.timeScale(1);
            this.players = {};
            this.playerClasses = {};
            this.availableClasses = ['cop', 'marine', 'robot', 'zapper'];
            this.walls = {};
            this.implement(ServerNetworkEvents);

            //setup box2d
            ige.addComponent(IgeBox2dComponent).box2d.sleep(true).box2d.gravity(0, 0).box2d.createWorld().box2d.start();

            ige.addComponent(IgeNetIoComponent).network.start(1337, function () {
                ige.start(function (success) {
                    if (success) {
                        ige.network.define('playerEntity', self._onPlayerEntity);
                        ige.network.define('postScores');

                        ige.network.define('playerControlLeftDown', self._onPlayerLeftDown);
                        ige.network.define('playerControlRightDown', self._onPlayerRightDown);
                        ige.network.define('playerControlUpDown', self._onPlayerUpDown);
                        ige.network.define('playerControlDownDown', self._onPlayerDownDown);
                        ige.network.define('playerControlShootDown', self._onPlayerShootDown);

                        ige.network.define('playerControlLeftUp', self._onPlayerLeftUp);
                        ige.network.define('playerControlRightUp', self._onPlayerRightUp);
                        ige.network.define('playerControlUpUp', self._onPlayerUpUp);
                        ige.network.define('playerControlDownUp', self._onPlayerDownUp);
                        ige.network.define('playerControlShootUp', self._onPlayerShootUp);

                        ige.network.on('connect', self._onPlayerConnect);
                        ige.network.on('disconnect', self._onPlayerDisconnect);

                        // Add the network stream component.
                        ige.network.addComponent(IgeStreamComponent).stream.sendInterval(30).stream.start();
                        // Accept incoming network connections.
                        ige.network.acceptConnections(true);
                        //post scores
                        self.postScoresInterval = new IgeInterval().init(function () {
                            var player;
                            var scores = {};

                            if (self.playerClasses['cop']) {
                                player = self.playerClasses['cop'];
                                scores.cop = {
                                    name: player._playerName,
                                    kills: player._kills,
                                    deaths: player._deaths
                                };
                            }

                            if (self.playerClasses['marine']) {
                                player = self.playerClasses['marine'];
                                scores.marine = {
                                    name: player._playerName,
                                    kills: player._kills,
                                    deaths: player._deaths
                                };
                            }

                            if (self.playerClasses['robot']) {
                                player = self.playerClasses['robot'];
                                scores.robot = {
                                    name: player._playerName,
                                    kills: player._kills,
                                    deaths: player._deaths
                                };
                            }

                            if (self.playerClasses['zapper']) {
                                player = self.playerClasses['zapper'];
                                scores.wapper = {
                                    name: player._playerName,
                                    kills: player._kills,
                                    deaths: player._deaths
                                };
                            }

                            ige.network.send('postScores', scores);
                        }, 10000);
                        //setup game scenes
                        self.setupScenes();
                        //create walls
                        self.walls['topWall'] = self.wallFactory('topWall', new IgePoint(-16, -392, 0), 768, 64, self.foregroundScene);
                        self.walls['bottomWall'] = self.wallFactory('bottomWall', new IgePoint(-16, 308, 0), 768, 32, self.foregroundScene);
                        self.walls['leftWall'] = self.wallFactory('leftWall', new IgePoint(-352, 0, 0), 32, 768, self.foregroundScene);
                        self.walls['rightWall'] = self.wallFactory('rightWall', new IgePoint(320, 0, 0), 32, 768, self.foregroundScene);
                        //viewport setup
                        self.vp1 = new IgeViewport().id('vp1').autoSize(true).scene(self.mainScene).drawBounds(true).mount(ige);
                        //b2d entity contact
                        self.addComponent(EntityContactResolver);
                        ige.box2d.contactListener(self.contactResolver.begin, self.contactResolver.end, self.contactResolver.preSolver);
                    }
                });
            });
        },
        setupScenes:function() {
            var self = this;
            self.mainScene = new IgeScene2d().id('mainScene');
            self.backgroundScene = new IgeScene2d().id('backgroundScene').mount(self.mainScene);
            self.foregroundScene = new IgeScene2d().id('foregroundScene').mount(self.mainScene);
        },
        playerFactory: function (clientId, playerName, scene) {
            var index = Math.floor(Math.random() * this.availableClasses.length);
            var playerClass = this.availableClasses[index];
            this.availableClasses.splice(index, 1);
            return new Player(clientId, playerClass, playerName).mount(scene);
        },
        beamParticleFactory: function (type, facing, pos, vel) {
            new BeamParticle(type, facing).translateTo(pos.x, pos.y, pos.z).velocity.x(vel.x).velocity.y(vel.y).lifeSpan(3000).mount(this.foregroundScene);
        },
        wallFactory: function (id, pos, width, height, scene) {
            return new Wall(id, pos, width, height).mount(scene);
        }
    });

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = Server;
}
