var Client = IgeClass
    .extend({
        classId: 'Client',
        init: function () {
            var self = this;

            ige.showStats(1);
            ige.globalSmoothing(true);

            ige.addComponent(IgeNetIoComponent);
            this.implement(ClientNetworkEvents);
            ige.createFrontBuffer(true);
            ClientSound.init();
            this._loadSplashScreen();
        },
        _joinGame: function () {
            var playerName = document.getElementById('txtPlayerName').value;
            var playerNameRegex = /^[a-zA-Z0-9]+$/;
            var validPlayerName = playerName.match(playerNameRegex);
            if (validPlayerName === null) {
                alert('Invalid name. Use one or more alphanumeric characters.');
                return;
            }
            ige.client._validPlayerName = validPlayerName;
            document.getElementById('splashScreen').style.display = 'none';
            ige.client._initOnTexturesLoaded();
            ige.client._loadTextures();
        },
        _loadSplashScreen: function () {
            var self = this;
            var splashScreen = document.createElement('DIV');
            splashScreen.id = 'splashScreen';
            splashScreen.style.cssText = 'position:absolute;left: 37.5%;top: 25%;width: 410px;height: 410px;margin-left: -35px; margin-top: -35px;background-color:#eee;';

            var logo = document.createElement('IMG');
            logo.id = 'logo';
            logo.src = 'assets/images/logo.jpg';
            logo.style.cssText = 'margin:0 auto;width:410px;';

            splashScreen.appendChild(logo);
            this._loadLoginBox(splashScreen);
            document.body.appendChild(splashScreen);
        },
        _loadLoginBox: function (parent) {
            var self = this;

            var login = document.createElement('DIV');
            login.id = 'login';

            var labelPlayerName = document.createElement('P');
            labelPlayerName.id = 'labelPlayerName';
            labelPlayerName.style.cssText = 'font-family:Arial, Helvetica, sans-serif;margin-left:10px;';
            labelPlayerName.innerHTML = '<b>Your Name</b>';

            var txtPlayerName = document.createElement('INPUT');
            txtPlayerName.id = 'txtPlayerName';
            txtPlayerName.name = 'txtPlayerName';
            txtPlayerName.type = 'text';
            txtPlayerName.value = '';
            txtPlayerName.style.cssText = 'width:380px; height:35px; font-size:22px; margin-left:10px;';

            var btLogin = document.createElement('INPUT');
            btLogin.id = 'btLogin';
            btLogin.name = 'btLogin';
            btLogin.type = 'button';
            btLogin.value = 'Play';
            btLogin.onclick = self._joinGame;
            btLogin.style.cssText = 'background-color:#FFFF00; width:385px; height:45px; margin-left:10px;margin-top:10px';

            login.appendChild(labelPlayerName);
            login.appendChild(txtPlayerName);
            login.appendChild(btLogin);
            parent.appendChild(login);
        },
        _initOnTexturesLoaded: function () {
            var self = this;
            ige.on('texturesLoaded', function () {
                ige.start(function (success) {
                    if (success) {
                        ClientSound.musicLoadInterval = new IgeInterval()
                            .init(function () {
                                if (!ClientSound.musicLoadIntervalPlaying
                                    && ClientSound.status.music) {
                                    createjs.Sound.play('music', {
                                        loop: -1,
                                        volume: 0.5
                                    });
                                    ClientSound.musicLoadIntervalPlaying = true;
                                }
                                else if (ClientSound.musicLoadIntervalPlaying) {
                                    this.cancel();
                                }
                            }, 1000);

                        // Start the networking.
                        ige.network.start('http://localhost:1337', function () {
                            ige.network.define('playerEntity', self._onPlayerEntity);
                            ige.network.define('postScores', self._onPostScores);
                            ige.network.addComponent(IgeStreamComponent).stream.renderLatency(80).stream.on('entityCreated', function (entity) {
                                self.log('Stream entity created with ID: '
                                + entity.id());
                                if (entity.category() === 'Player') {
                                    entity.mountFloatingUi(self.foregroundScene);
                                    if (entity.id() === self.playerEntityId) {
                                        entity.mountFixedUi(self.uiScene);
                                    }
                                }
                            });
                            //scenes
                            self.mainScene = new IgeScene2d().id('mainScene');
                            self.backgroundScene = new IgeScene2d().id('backgroundScene').layer(0).mount(self.mainScene);
                            self.foregroundScene = new IgeScene2d().id('foregroundScene').layer(1).mount(self.mainScene);
                            self.uiScene = new IgeScene2d().id('uiScene').layer(2).ignoreCamera(true).mount(self.mainScene);

                            self.vp1 = new IgeViewport().id('vp1').autoSize(true).scene(self.mainScene).drawBounds(false).mount(ige);

                            self.textureMap1 = new IgeTextureMap().depth(0).tileWidth(32).tileHeight(32).translateTo(-384, -384, 0).mount(self.backgroundScene);
                            var texIndex = self.textureMap1.addTexture(self.textures.room);
                            // Paint the map tiles.
                            for (var x = 0; x < 24; ++x) {
                                for (var y = 0; y < 24; ++y) {
                                    self.textureMap1.paintTile(x, y, texIndex, (y * 24 + x) + 1);
                                }
                            }
                            self.textureMap1.cacheDirty(true);
                            self.scoreBoard = new IgeFontEntity()
                                .id('scoreBoard').depth(1000).width(100)
                                .height(100).textAlignX(1)
                                .colorOverlay('#daa520')
                                .nativeFont('12pt Arial').nativeStroke(1)
                                .nativeStrokeColor('#666666')
                                .textLineSpacing(0)
                                .translateTo(window.innerWidth / 2 - 100, -window.innerHeight / 2 + 100, 0)
                                .mount(self.uiScene);

                            ige.network.send('playerEntity', {
                                playerName: self._validPlayerName
                            });
                        });
                    }
                });
            });
        },
        _loadTextures: function () {
            this.textures = {
                room: new IgeCellSheet('./assets/textures/rooms/room_B_768x768.png', 24, 24),
                /*mageSprites: new IgeCellSheet('./assets/textures/sprites/mage_sprite_sheet.png', 12, 16),*/
                mageSprites: new TexturePackerAtlas('Characters','./../sprites/characters.png','./../../sprites/characters.js'),
                beamParticle: new IgeTexture('./assets/textures/shapes/BeamParticle.js'),
                attributeBox: new IgeTexture('./assets/textures/shapes/AttributeBox.js'),
                deathParticle: new IgeTexture('./assets/textures/shapes/DeathParticle.js')
            };
        }
    });

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = Client;
}
