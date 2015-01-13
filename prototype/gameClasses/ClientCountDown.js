var ClientCountDown = IgeFontEntity.extend({
	classId: 'ClientCountDown',
	init: function (prefix, countdownFrom, sufix, interval) {
		IgeFontEntity.prototype.init.call(this);

		this._prefix = prefix || '';
		this._countdown = countdownFrom;
		if(this.count == null) this._count = countdownFrom;
		this._sufix = sufix || '';
		this._interval = interval || 1000;

		this.depth(1)
			.width(300).height(30).textAlignX(1)
			.colorOverlay('#ffffff').nativeFont('20pt Arial')
			.nativeStroke(1).nativeStrokeColor('#666666')
			.textAlignX(1)
			.textLineSpacing(0)
			.text(this._prefix + this._count + this._sufix);

		this.streamMode(1);
		this.streamSections(['count']);
	},
	streamSectionData: function (sectionId, data) {
		if (sectionId === 'count') {
			if (ige.isServer) {
				if (data) {
					this.count = data;
				}
			}
			else {
				return this.count;
			}
		} else {
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},

	start: function () {
		var self = this;
		this._intervalTimer = setInterval(function () { self._timerTick(); }, this._interval);

		return this;
	},

	_timerTick: function () {
		this._count--;
		this.text(this._prefix + this._count + this._sufix);

		if (this._count === 0) {
			this.emit('complete');
			this.stop();
		}

		return this;
	},

	stop: function () {
		clearInterval(this._intervalTimer);
		return this;
	}
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = ClientCountDown;
}