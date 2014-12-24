var ClientNetworkEvents = {
    _onPlayerEntity: function (data) {
        if (ige.$(data)) {
            ige.client.vp1.camera.trackTranslate(ige.$(data), 50);
        }
        else {
            var self = this;
            self._eventListener = ige.network.stream.on('entityCreated', function (entity) {
                if (entity.id() === data) {
                    ige.client.vp1.camera.trackTranslate(ige.$(data), 50);
                    ige.network.stream.off('entityCreated',
                        self._eventListener, function (result) {
                            if (!result) {
                                this.log('Could not disable event listener!', 'warning');
                            }
                        });
                }
            });
        }
        ige.client.playerEntityId = data;
    },
    _onPostScores: function (scores) {
        var list = [];
        if (scores['air']) {
            list.push(scores['air']);
        }

        if (scores['earth']) {
            list.push(scores['earth']);
        }

        if (scores['fire']) {
            list.push(scores['fire']);
        }
        if (scores['water']) {
            list.push(scores['water']);
        }
        list.sort(function (a, b) {
            var x = parseInt(a.kills);
            var y = parseInt(b.kills);

            if (x > y) {
                return -1;
            }
            if (x < y) {
                return 1;
            }

            var w = parseInt(a.deaths);
            var z = parseInt(b.deaths);

            if (w < y) {
                return -1;
            }
            if (w > z) {
                return 1;
            }

            return 0;
        });
        var listStr = '';
        for (var i = 0; i < list.length; ++i) {
            listStr += (list[i].kills + ' ' + list[i].deaths + ' ' + list[i].name + '\n');
        }
        ige.client.scoreBoard.text(listStr);
    }
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = ClientNetworkEvents;
}