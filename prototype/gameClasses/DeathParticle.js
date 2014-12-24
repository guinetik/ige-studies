var DeathParticle = IgeEntity.extend({
    classId: 'DeathParticle',
    init: function (emitter) {
        this._emitter = emitter;
        IgeEntity.prototype.init.call(this);
        this.addComponent(IgeVelocityComponent);
        this.texture(ige.client.textures.deathParticle).width(50).height(50).mount(ige.client.foregroundScene);
    },
    destroy: function () {
        if (this._emitter !== undefined) {
            this._emitter._particles.pull(this);
        }
        IgeEntity.prototype.destroy.call(this);
    }
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = DeathParticle;
}