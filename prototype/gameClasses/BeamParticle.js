var BeamParticle = IgeEntityBox2d.extend({
    classId: 'BeamParticle',
    init: function (beamType, direction) {
        var self = this;
        IgeEntityBox2d.prototype.init.call(this);
        /* CEXCLUDE */
        if (ige.isServer) {
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
                    friction: 0.8,
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
    update: function (ctx) {
        if (!ige.isServer) {
            function rotate(angle, canvas, ctx, originalImage, texture, data) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(angle * Math.PI / 180);
                ctx.drawImage(originalImage, -canvas.width / 2, -canvas.height / 2);
            }
            var rightFlip =function (canvas, ctx, originalImage, texture, data) {
                rotate(90, canvas, ctx, originalImage, texture, data);
            };
            var leftFlip =function (canvas, ctx, originalImage, texture, data) {
                rotate(-90, canvas, ctx, originalImage, texture, data);
            };
            var downFlip =function (canvas, ctx, originalImage, texture, data) {
                rotate(180, canvas, ctx, originalImage, texture, data);
            };
            console.log("BEAMTYPE", this._beamType);
            var t;
            switch (this._beamType) {
                case 'cop':
                    t = ige.client.textures.shot_blue.clone();
                    break;
                case 'marine':
                    t = ige.client.textures.shot_purple.clone();
                    break;
                case 'robot':
                    t = ige.client.textures.shot_red.clone();
                    break;
                case 'zapper':
                    t = ige.client.textures.shot_yellow.clone();
                    break;
            }
            switch (this._direction) {
                case 'down':
                    t.applyFilter(downFlip);
                    break;
                case 'left':
                    t.applyFilter(leftFlip);
                    break;
                case 'right':
                    t.applyFilter(rightFlip);
                    break;
            }
            if(t) {
                this.texture(t).dimensionsFromTexture();
            }
        }
        IgeEntityBox2d.prototype.update.call(this, ctx);
    },
    streamSectionData: function (sectionId, data) {
        if (sectionId === 'beamType') {
            if (!ige.isServer) {
                if (data) {
                    this._beamType = data;
                }
            }
            else {

                return this._beamType;
            }
        }
        else if (sectionId === 'direction') {
            if (!ige.isServer) {
                if (data) {
                    // We have been given new data!
                    this._direction = data;
                }
            }
            else {
                return this._direction;
            }
        }
        else {
            return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
        }
    },
    destroy: function () {
        if (!ige.isServer) {
            if (ClientSound.status.beamPlayerContact) {
                createjs.Sound.play('beamPlayerContact', {volume: 0.15});
            }
        }
        IgeEntityBox2d.prototype.destroy.call(this);
    }
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = BeamParticle;
}