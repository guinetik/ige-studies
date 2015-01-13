var Crown = IgeEntityBox2d.extend({
    classId: 'Crown',
    player: null,
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
                    density: 0.3,
                    friction: 0.1,
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
    update: function (ctx) {
        if (!ige.isServer) {
            if (this._inPlayer == 'n') {

            } else {

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
                }
                if (this.player._facing == "right") {
                    this.translateTo(playerX - 30, playerY, 10000);
                }
            } else {
                this.player = null;
                this._inPlayer = 'n';
                this.box2dActive(true);
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