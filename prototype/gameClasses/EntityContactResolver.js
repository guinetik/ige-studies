var EntityContactResolver = IgeEntity
    .extend({
        classId: 'EntityContactResolver',
        componentId: 'contactResolver',
        init: function () {
            var self = this;
            this.begin = function (contact) {
                console.log("begin", contact);
                var entityA = contact.igeEntityA();
                var entityB = contact.igeEntityB();
                if (contact.igeEitherCategory('Player') && contact.igeEitherCategory('BeamParticle')) {
                    self._playerBeamParticleBegin(entityA, entityB, contact);
                } else if (contact.igeEitherCategory('Player') && contact.igeEitherCategory('Wall')) {
                    self._playerWallBegin(entityA, entityB, contact);
                } else if (contact.igeEitherCategory('Wall') && contact.igeEitherCategory('BeamParticle')) {
                    self._beamParticleWallBegin(entityA, entityB, contact);
                }
                else if (entityA._beamType !== undefined && entityB._beamType !== undefined) {
                    self._beamParticleBeamParticleBegin(entityA, entityB, contact);
                }
            };
            this.end = function (contact) {
                var entityA = contact.igeEntityA();
                var entityB = contact.igeEntityB();
                if (contact.igeEitherCategory('Player') && contact.igeEitherCategory('BeamParticle')) {
                    self._playerBeamParticleEnd(entityA, entityB, contact);
                } else if (contact.igeEitherCategory('BeamParticle') && contact.igeEitherCategory('Wall')) {
                    self._beamParticleWallEnd(entityA, entityB, contact);
                }
            };
            this.preSolver = function (contact) {
                var entityA = contact.igeEntityA();
                var entityB = contact.igeEntityB();
                if (contact.igeEitherCategory('Player') && contact.igeEitherCategory('BeamParticle')) {
                    self._playerBeamParticlePreSolver(entityA, entityB, contact);
                }
                else if (entityA._beamType !== undefined && entityB._beamType !== undefined) {
                    self._beamParticleBeamParticlePreSolver(entityA, entityB, contact);
                }
            };
        },
        _playerBeamParticleBegin: function (entityA, entityB, contact) {
            var entities = this._separate(entityA, entityB, 'Player');
            if (entities.primary._playerClass !== entities.other._beamType) {
                entities.primary.applyHitPointDamage(1, entities.other._beamType);
                entities.other.destroy();
            }
        },
        _playerWallBegin: function (entityA, entityB, contact) {
            var entities = this._separate(entityA, entityB, 'Player');
            var player = entities.primary;
        },
        _beamParticleBeamParticleBegin: function (beamParticleA, beamParticleB, contact) {
            if (beamParticleA._beamType !== beamParticleB._beamType) {
                // Destroy beams when they collide if they differ in type.
                beamParticleA.destroy();
                beamParticleB.destroy();
            }
        },
        _beamParticleWallBegin: function (entityA, entityB, contact) {
            var entities = this._separate(entityA, entityB, 'BeamParticle');
            if (!entities.primary._inPlayer) {
                entities.primary.destroy();
            }
        },
        _playerBeamParticleEnd: function (entityA, entityB, contact) {
            var entities = this._separate(entityA, entityB, 'BeamParticle');
            entities.primary._inPlayer = false;
        },
        _beamParticleWallEnd: function (entityA, entityB, contact) {
            var entities = this._separate(entityA, entityB, 'BeamParticle');

            if (!entities.primary._inPlayer) {
                entities.primary.destroy();
            }
        },
        _playerBeamParticlePreSolver: function (entityA, entityB, contact) {
            var entities = this._separate(entityA, entityB, 'Player');

            // Allow beams to pass through playerClasses of the same type.
            if (entities.primary._playerClass === entities.other._beamType) {
                // Cancel the contact.
                contact.SetEnabled(false);
            }
        },
        _beamParticleBeamParticlePreSolver: function (beamParticleA, beamParticleB, contact) {
            if (beamParticleA._beamType === beamParticleB._beamType) {
                contact.SetEnabled(false);
            }
        },
        _separate: function (entityA, entityB, category) {
            var primary, other;
            if (entityA.category() === category) {
                primary = entityA;
                other = entityB;
            } else if (entityB.category() === category) {
                primary = entityB;
                other = entityA;
            }
            return {
                primary: primary,
                other: other
            };
        }
    });

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = EntityContactResolver;
}