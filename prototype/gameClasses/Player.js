var Player = IgeEntityBox2d
    .extend({
        classId: 'Player',
        init: function (clientId, playerClass, playerName) {
            var self = this;
            IgeEntityBox2d.prototype.init.call(this);
            /* CEXCLUDE */
            if (ige.isServer) {
                this.addComponent(IgeVelocityComponent);
                this.width(120).height(120).box2dBody({
                    type: 'dynamic',
                    linearDamping: 0.0,
                    angularDamping: 0.1,
                    allowSleep: true,
                    bullet: false,
                    gravitic: true,
                    fixedRotation: false,
                    fixtures: [{
                        density: 1.0,
                        friction: 0.8,
                        restitution: 0.4,
                        shape: {
                            type: 'circle'
                        }
                    }]
                }).addComponent(PlayerControlComponent).streamMode(1);
                self._magicPointRechargeInterval = new IgeInterval().init(function () {
                    if (self._currentMagicPoints < self._MAX_MAGIC_POINTS) {
                        self.applyMagicPointDamage(-1);
                    }
                }, 1000);
                self._deathInterval = new IgeInterval();
            }
            /* CEXCLUDE */
            if (!ige.isServer) {
                self.addComponent(IgeAnimationComponent).depth(1);
                self.texture(ige.client.textures.mageSprites).dimensionsFromCell();
                self.addComponent(PlayerControlComponent);

                //ui
                self._playerNameFontEntity = new IgeFontEntity()
                    .id(self.id() + 'playerNameFontEntity').depth(1000)
                    .width(100).height(20).textAlignX(1)
                    .colorOverlay('#ffffff').nativeFont('12pt Arial')
                    .nativeStroke(1).nativeStrokeColor('#666666')
                    .textLineSpacing(0).bindData(self, '_playerName', '', '');

                /*self._currentHitPointsAttributeBox = new AttributeBox()
                 .id(self.id() + 'currentHitPointsAttributeBox')
                 .depth(-1000).width(50).height(5)
                 .colorOverlay('#ff0000').bindData(self,
                 '_currentHitPoints',
                 '_MAX_HIT_POINTS');

                 self._currentMagicPointsAttributeBox = new AttributeBox()
                 .id(self.id() + 'currentMagicPointsAttributeBox')
                 .depth(-1000).width(50).height(5)
                 .colorOverlay('#0000ff').bindData(self,
                 '_currentMagicPoints',
                 '_MAX_MAGIC_POINTS');*/

                self._deathParticleEmitter = new IgeParticleEmitter()
                    .id(self.id() + 'deathParticleEmitter')
                    .particle(DeathParticle).lifeBase(2500)
                    .quantityTimespan(1000).quantityBase(60)
                    .translateVarianceX(-16, 16).scaleBaseX(0.2)
                    .scaleBaseY(0.2).scaleLockAspect(true)
                    .rotateVariance(0, 360).opacityBase(1.0)
                    .velocityVector(new IgePoint(0, -0.1, 0),
                    new IgePoint(-0.2, -0.1, 0),
                    new IgePoint(0.2, -0.25, 0))
                    .linearForceVector(new IgePoint(0, 0.12, 0),
                    new IgePoint(0, 0, 0),
                    new IgePoint(0, 0, 0))
                    .deathScaleBaseX(0).deathScaleVarianceX(0, 1)
                    .deathScaleBaseY(0.7).deathRotateBase(0)
                    .deathRotateVariance(-360, 360).deathOpacityBase(0.0)
                    .depth(1).width(10).height(10);

                /*self._currentHitPointsFontEntity = new IgeFontEntity()
                 .id(self.id() + 'currentHitPointsFontEntity')
                 .depth(-1000).width(100).height(35).textAlignX(1)
                 .colorOverlay('#ff0000').nativeFont('12pt Arial')
                 .nativeStroke(1).nativeStrokeColor('#000000')
                 .textLineSpacing(0).bindData(self,
                 '_currentHitPoints',
                 '',
                 ' HP');*/

                /*self._currentMagicPointsFontEntity = new IgeFontEntity()
                 .id(self.id() + 'currentMagicPointsFontEntity').depth(1)
                 .width(100).height(35).textAlignX(1)
                 .colorOverlay('#0000ff').nativeFont('12pt Arial')
                 .nativeStroke(1).nativeStrokeColor('#000000')
                 .textLineSpacing(0).bindData(self,
                 '_currentMagicPoints',
                 '',
                 ' MP');*/

                self._killsFontEntity = new IgeFontEntity()
                    .id(self.id() + 'killsFontEntity').depth(1).width(100)
                    .height(35).textAlignX(1).colorOverlay('#00ff00')
                    .nativeFont('12pt Arial').nativeStroke(1)
                    .nativeStrokeColor('#000000').textLineSpacing(0)
                    .bindData(self, '_kills', '', ' Kills');

                self._deathsFontEntity = new IgeFontEntity()
                    .id(self.id() + 'deathsFontEntity').depth(1).width(100)
                    .height(35).textAlignX(0).colorOverlay('#00ff00')
                    .nativeFont('12pt Arial').nativeStroke(1)
                    .nativeStrokeColor('#000000').textLineSpacing(0)
                    .bindData(self, '_deaths', '', ' Deaths');
            }

            this.category('Player');
            this._clientId = clientId;
            this._playerClass = playerClass;
            this._playerName = playerName;
            this._lastTranslate = this._translate.clone();
            this._facing = 'down';
            this._shoot = 'off';
            this._MAX_HIT_POINTS = 1;
            this._currentHitPoints = 1;
            this._MAX_MAGIC_POINTS = 1;
            this._currentMagicPoints = 1;
            this._kills = 0;
            this._deaths = 0;
            this._canMove = true;
            this._dead = false;
            this._lastDamageType = '';
            this._shootingAnimation = false;
            this.streamSections(['transform', 'facing', 'shoot', 'playerClass', 'playerName', 'currentHitPoints', 'currentMagicPoints', 'kills', 'deaths']);
        },
        streamSectionData: function (sectionId, data) {
            if (sectionId === 'facing') {
                if (!ige.isServer) {
                    if (data) {
                        this._facing = data;
                    }
                } else {
                    return this._facing;
                }
            } else if (sectionId === 'shoot') {
                if (!ige.isServer) {
                    if (data) {
                        this._shoot = data;
                    } else {
                        this._shoot = 'off';
                    }
                } else {
                    return this._shoot;
                }
            } else if (sectionId === 'playerClass') {
                if (!ige.isServer) {
                    if (data) {
                        this._playerClass = data;
                    }
                } else {
                    // Return current data.
                    return this._playerClass;
                }
            } else if (sectionId === 'playerName') {
                if (!ige.isServer) {
                    if (data) {
                        this._playerName = data;
                    }
                } else {
                    return this._playerName;
                }
            }
            else if (sectionId === 'currentHitPoints') {
                if (!ige.isServer) {
                    if (data) {
                        this._currentHitPoints = parseInt(data);
                    }
                } else {
                    return this._currentHitPoints;
                }
            } else if (sectionId === 'currentMagicPoints') {
                if (!ige.isServer) {
                    if (data) {
                        this._currentMagicPoints = parseInt(data);
                    }
                } else {
                    return this._currentMagicPoints;
                }
            } else if (sectionId === 'kills') {
                if (!ige.isServer) {
                    if (data) {
                        this._kills = parseInt(data);
                    }
                } else {
                    return this._kills;
                }
            } else if (sectionId === 'deaths') {
                if (!ige.isServer) {
                    if (data) {
                        this._deaths = parseInt(data);
                    }
                } else {
                    return this._deaths;
                }
            } else {
                return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
            }
        },
        mountFloatingUi: function (scene) {
            this._playerNameFontEntity.mount(scene);
            /*this._currentHitPointsAttributeBox.mount(scene);
             this._currentMagicPointsAttributeBox.mount(scene);*/
            this._deathParticleEmitter.particleMountTarget(scene).mount(scene);
        },
        mountFixedUi: function (scene) {
            //this._currentHitPointsFontEntity.mount(scene);
            //this._currentMagicPointsFontEntity.mount(scene);
            this._killsFontEntity.mount(scene);
            this._deathsFontEntity.mount(scene);
        },
        applyHitPointDamage: function (value, type) {
            this._currentHitPoints = this._currentHitPoints - value;

            if (type) {
                this._lastDamageType = type;
            }
        },
        applyMagicPointDamage: function (value) {
            this._currentMagicPoints = this._currentMagicPoints - value;
        },
        setPlayerClass: function (type) {
            switch (type) {
                case 'cop':
                    this._defineCopAnimations();
                    this._playerNameFontEntity.colorOverlay('#ffffff');
                    break;
                case 'marine':
                    this._defineMarineAnimations();
                    this._playerNameFontEntity.colorOverlay('#964b00');
                    break;
                case 'robot':
                    this._defineRobotAnimations();
                    this._playerNameFontEntity.colorOverlay('#ff0000');
                    break;
                case 'zapper':
                    this._defineZapperAnimations();
                    this._playerNameFontEntity.colorOverlay('#0000ff');
                    break;
            }
            this._playerClass = type;
        },
        update: function (ctx) {
            var self = this;
            /* CEXCLUDE */
            if (ige.isServer) {
                if (!this._dead && this._currentHitPoints <= 0) {
                    this._dead = true;
                    this._deaths++;
                    this._deathInterval.init(function () {
                        if (self._dead) {
                            self._dead = false;

                            self._currentHitPoints = self._MAX_HIT_POINTS;

                            var x = Math.floor(Math.random() * 600) - 300;
                            var y = Math.floor(Math.random() * 600) - 300;

                            self.translateTo(x, y, 0);

                            this.cancel();
                        }
                    }, 5000);
                    switch (this._lastDamageType) {
                        case 'cop':
                            if (ige.server.playerClasses['cop'] && this._playerClass !== 'cop') {
                                ige.server.playerClasses['cop']._kills++;
                            }
                            break;
                        case 'marine':
                            if (ige.server.playerClasses['marine'] && this._playerClass !== 'marine') {
                                ige.server.playerClasses['marine']._kills++;
                            }
                            break;
                        case 'robot':
                            if (ige.server.playerClasses['robot'] && this._playerClass !== 'robot') {
                                ige.server.playerClasses['robot']._kills++;
                            }
                            break;
                        case 'zapper':
                            if (ige.server.playerClasses['zapper'] && this._playerClass !== 'zapper') {
                                ige.server.playerClasses['zapper']._kills++;
                            }
                            break;
                    }
                }
            }
            /* CEXCLUDE */
            if (!ige.isServer) {
                //set player class
                this.setPlayerClass(this._playerClass);
                this._updateUiPositions();
                // Test for death.
                if (this._currentHitPoints <= 0) {
                    this._dead = true;
                    this._deathParticleEmitter.start();
                    if (this.id() === ige.client.playerEntityId) {
                        ige.client._loadDiedScreen();
                    }
                } else {
                    this._dead = false;
                    self._deathParticleEmitter.stopAndKill();
                }
                // Set the current animation based on direction.
                this._setAnimation();
                this.depth(this._translate.y);
                this._lastTranslate = this._translate.clone();
            }
            IgeEntityBox2d.prototype.update.call(this, ctx);
        },
        destroy: function () {
            this._destroyUi();
            IgeEntityBox2d.prototype.destroy.call(this);
        },
        _updateUiPositions: function () {
            var playerX = this.translate().x();
            var playerY = this.translate().y();

            this._deathParticleEmitter.translateTo(playerX, playerY, 0);

            //var mpAttrBoxX = playerX;
            //var mpAttrBoxY = playerY - this.height() / 2;

            //var hpAttrBoxX = playerX;
            //var hpAttrBoxY = mpAttrBoxY - this._currentMagicPointsAttributeBox.height();

            var playerNameX = playerX;
            var playerNameY = playerY - 10;
            //var playerNameY = hpAttrBoxY - this._currentHitPointsAttributeBox.height();

            /*this._currentMagicPointsAttributeBox.translateTo(mpAttrBoxX, mpAttrBoxY, 0);
             this._currentHitPointsAttributeBox.translateTo(hpAttrBoxX, hpAttrBoxY, 0);*/
            this._playerNameFontEntity.translateTo(playerNameX, playerNameY, 0);

            var statusBoxX = -window.innerWidth / 2 + 35;
            var statusBoxY = window.innerHeight / 2 - 35;

            /*this._currentHitPointsFontEntity.translateTo(statusBoxX, statusBoxY, 0);
             this._currentMagicPointsFontEntity.translateTo(statusBoxX + this._currentHitPointsFontEntity.width(), statusBoxY, 0);*/

            this._killsFontEntity.translateTo(0, statusBoxY, 0);
            this._deathsFontEntity.translateTo(this._killsFontEntity.translate().x() + this._killsFontEntity.width(), statusBoxY, 0);
        },
        _destroyUi: function () {
            if (!ige.isServer) {
                this._playerNameFontEntity.destroy();
                /*this._currentHitPointsAttributeBox.destroy();
                 this._currentMagicPointsAttributeBox.destroy();*/

                this._deathParticleEmitter.destroy();

                //this._currentHitPointsFontEntity.destroy();
                //this._currentMagicPointsFontEntity.destroy();
                this._killsFontEntity.destroy();
                this._deathsFontEntity.destroy();
            }
        },
        _setAnimation: function () {
            var oldX = this._lastTranslate.x;
            var oldY = this._lastTranslate.y * 2;
            var currX = this.translate().x();
            var currY = this.translate().y() * 2;
            var distX = currX - oldX;
            var distY = currY - oldY;

            if (this._dead) {
                this._setDeathAnimation();
                if (ClientSound.status.playerDeath) {
                    createjs.Sound.play('playerDeath');
                }
                return;
            }

            if (distX == 0 && distY == 0) {
                this._setStationaryAnimation();
            } else if (distX == 0) {
                this._setVerticalAnimation(distY);
            } else if (distY == 0) {
                this._setHorizontalAnimation(distX);
            } else {
                this._setDiagonalAnimation(distX, distY);
            }

            if (this._shoot === 'on') {
                if (ClientSound.status.beamFire) {
                    //createjs.Sound.play('beamFire', {volume: 0.025});
                }
            }
        },
        _defineCopAnimations: function () {
            this.animation.define("shoot_down", [22, 1, 2, 3, 4, 5], 12, -1);
            this.animation.define("shoot_left", [25, 6, 7, 8, 9, 10], 12, -1);
            this.animation.define("shoot_right", [28, 11, 12, 13, 14, 15], 12, -1);
            this.animation.define("shoot_up", [31, 16, 17, 18, 19, 20], 12, -1);
            this.animation.define("walk_down", [21, 22, 23, 22], 8, -1);
            this.animation.define("walk_left", [24, 25, 26, 25], 8, -1);
            this.animation.define("walk_right", [27, 28, 29, 28], 8, -1);
            this.animation.define("walk_up", [30, 31, 32, 31], 8, -1);
        },
        _defineMarineAnimations: function () {
            this.animation.define("shoot_down", [54, 33, 34, 35, 36, 37], 12, -1);
            this.animation.define("shoot_left", [57, 38, 39, 40, 41, 42], 12, -1);
            this.animation.define("shoot_right", [60, 43, 44, 45, 46, 47], 12, -1);
            this.animation.define("shoot_up", [63, 48, 49, 50, 51, 52], 12, -1);
            this.animation.define("walk_down", [53, 54, 55, 54], 8, -1);
            this.animation.define("walk_left", [56, 57, 58, 57], 8, -1);
            this.animation.define("walk_right", [59, 60, 61, 60], 8, -1);
            this.animation.define("walk_up", [62, 63, 64, 63], 8, -1);
        },
        _defineRobotAnimations: function () {
            this.animation.define("shoot_down", [85, 65, 66, 67, 68, 69], 12, -1);
            this.animation.define("shoot_left", [88, 70, 71, 72, 73], 12, -1);
            this.animation.define("shoot_right", [91, 74, 75, 76, 77, 78], 12, -1);
            this.animation.define("shoot_up", [94, 79, 80, 81, 82, 83], 12, -1);
            this.animation.define("walk_down", [84, 85, 86, 85], 8, -1);
            this.animation.define("walk_left", [87, 88, 89, 88], 8, -1);
            this.animation.define("walk_right", [90, 91, 92, 91], 8, -1);
            this.animation.define("walk_up", [93, 94, 95, 94], 8, -1);
        },
        _defineZapperAnimations: function () {
            this.animation.define("shoot_down", [116, 96, 97, 98, 99, 100], 12, -1);
            this.animation.define("shoot_left", [119, 101, 102, 103, 104], 12, -1);
            this.animation.define("shoot_right", [122, 105, 106, 107, 108, 109], 12, -1);
            this.animation.define("shoot_up", [125, 110, 111, 112, 113, 114], 12, -1);
            this.animation.define("walk_down", [115, 116, 117, 116], 8, -1);
            this.animation.define("walk_left", [118, 119, 120, 119], 8, -1);
            this.animation.define("walk_right", [121, 122, 123, 122], 8, -1);
            this.animation.define("walk_up", [124, 125, 126, 125], 8, -1);
        },
        _setDeathAnimation: function () {
            //this.animation.select('death');
        },
        _shootingCallback: {
            onLoop: function (anim) {
                this._entity._shootingAnimation = false;
            }
        },
        _setStationaryAnimation: function () {
            if (this._shoot === 'on') {
                if (this._facing == "up") {
                    this.animation.select('shoot_up', this._shootingCallback);
                } else if (this._facing == "down") {
                    this.animation.select('shoot_down', this._shootingCallback);
                } else if (this._facing == "left") {
                    this.animation.select('shoot_left', this._shootingCallback);
                } else if (this._facing == "right") {
                    this.animation.select('shoot_right', this._shootingCallback);
                }
                this._shootingAnimation = true;
            } else {
                if(!this._shootingAnimation) this.animation.stop();
            }
        },
        _setHorizontalAnimation: function (distX) {
            // Moving left.
            if (distX < 0) {
                if (this._shoot === 'on') {
                    this._shootingAnimation = true;
                    this.animation.select('shoot_left', this._shootingCallback);
                }
                else {
                    if (!this._shootingAnimation) this.animation.select('walk_left');
                }
            } else {
                // Moving right.
                if (this._shoot === 'on') {
                    this._shootingAnimation = true;
                    this.animation.select('shoot_right', this._shootingCallback);
                }
                else {
                    if (!this._shootingAnimation) this.animation.select('walk_right');
                }
            }
        },
        _setVerticalAnimation: function (distY) {
            if (distY < 0) {
                if (this._shoot === 'on') {
                    this._shootingAnimation = true;
                    this.animation.select('shoot_up', this._shootingCallback);
                } else {
                    if (!this._shootingAnimation) this.animation.select('walk_up');
                }
            } else {
                if (this._shoot === 'on') {
                    this._shootingAnimation = true;
                    this.animation.select('shoot_down', this._shootingCallback);
                } else {
                    if (!this._shootingAnimation) this.animation.select('walk_down');
                }
            }
        },
        _setDiagonalAnimation: function (distX, distY) {
            if (distX < 0) {
                if (distY < 0) {
                    if (this._shoot === 'on') {
                        this.animation.select('shoot');
                    } else {
                        this.animation.select('walk');
                    }
                } else {
                    if (this._shoot === 'on') {
                        this.animation.select('shoot');
                    }
                    else {
                        this.animation.select('walk');
                    }
                }
            } else {
                if (distY < 0) {
                    if (this._shoot === 'on') {
                        this.animation.select('shoot');
                    } else {
                        this.animation.select('walk');
                    }
                } else {
                    if (this._shoot === 'on') {
                        this.animation.select('shoot');
                    } else {
                        this.animation.select('walk');
                    }
                }
            }
        }
    });

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = Player;
}