var Crown = IgeEntityBox2d.extend({
    classId: 'Crown',
    player: null,
    countdown: null,
    init: function () {
        var self = this;
        IgeEntityBox2d.prototype.init.call(this);
        /* CEXCLUDE */
        if (ige.isServer) {
            this.box2dBody({
                type: 'dynamic',
                linearDamping: 0.0,
                angularDamping: 0.1,
                allowSleep: true,
                bullet: false,
                gravitic: true,
                fixedRotation: false,
                fixtures: [{
                    density: 0.1,
                    friction: 0,
                    restitution: 0.1,
                    shape: {
                        type: 'circle'
                    }
                }]
            }).streamMode(1);
        }
        /* CEXCLUDE */

        if (!ige.isServer) {
            self.texture(ige.client.textures.crown);
        }
        this.category('Crown');
        this._inPlayer = 'n';
        this.streamSections(['transform', 'inPlayer']);
    },
    startCrownCountdown: function () {
        var self = this;
        this.countdown = new ClientCountDown(this._inPlayer + ' will Win in ', 10, 's', 1000)
            .translateTo(0, -300, 1000)
            .mount(ige.client.mainScene)
            .start();
        this.countdown.on('complete', function () {
            self.countdown.destroy();
            self._inPlayer = 'n';
        });
    },
    reset:function() {
      console.log("CROWN RESET");
        this._inPlayer = 'n';
    },
    update: function (ctx) {
        if (!ige.isServer) {
            if (this._inPlayer != 'n') {
                if (this.countdown == null) {
                    this.startCrownCountdown();
                }
            } else {
                if (this.countdown != null) {
                    this.countdown.stop();
                    this.countdown.destroy();
                    this.countdown = null;
                }
            }
        }
        if (ige.isServer) {
            if (this.player != null && this._inPlayer != 'n' && this.player._dead == false) {
                this.box2dActive(false);
                var playerX = this.player.translate().x();
                var playerY = this.player.translate().y();
                var playerZ = this.player.translate().z();
                if (this.player._facing == "up") {
                    this.translateTo(playerX, playerY + 30, 10000);
                } else if (this.player._facing == "down") {
                    this.translateTo(playerX + 2, playerY - 30, 10000);
                } else if (this.player._facing == "left") {
                    this.translateTo(playerX + 38, playerY + 2, 10000);
                } else if (this.player._facing == "right") {
                    this.translateTo(playerX - 30, playerY, 10000);
                }
            } else {
                if(this.player != null) {
                    this.destroy();
                    ige.server.crownFactory();
                } else {
                    this._inPlayer = 'n';
                    this.box2dActive(true);
                }
            }
        }
        IgeEntityBox2d.prototype.update.call(this, ctx);
    },
    streamSectionData: function (sectionId, data) {
        if (sectionId === 'inPlayer') {
            if (!ige.isServer) {
                if (data) {
                    this._inPlayer = data;
                }
            }
            else {
                return this._inPlayer;
            }
        } else {
            return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
        }
    },
    destroy: function () {
        IgeEntityBox2d.prototype.destroy.call(this);
    }
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = Crown;
}