var Wall = IgeEntityBox2d.extend({
  classId: 'Wall',
  init: function(id, pos, width, height) {
    var self = this;
    IgeEntityBox2d.prototype.init.call(this);
    /* CEXCLUDE */
    if(ige.isServer) {
      this.id(id).translateTo(pos.x, pos.y, pos.z).width(width).height(height)
              .box2dBody({
                type: 'static',
                allowSleep: true,
                fixtures: [{
                  shape: {
                    type: 'rectangle'
                  }
                }]
              }).streamMode(1);
    }
    /* CEXCLUDE */
    this.category('Wall');
    this._wallId = id;
  }
});

if(typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
  module.exports = Wall;
}