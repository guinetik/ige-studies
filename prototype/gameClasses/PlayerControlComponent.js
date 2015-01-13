var PlayerControlComponent = IgeEntity.extend({
    classId: 'PlayerControlComponent',
    componentId: 'playerControl',
    init: function (entity) {
        var self = this;
        this._entity = entity;

        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false,
            shoot: false
        };
        this._speed = this._DEFAULT_SPEED = 0.1;
        this._prevVelocityX = this._prevVelocityY = 0;

        // Setup the control system.
        ige.input.mapAction('left', ige.input.key.a);
        ige.input.mapAction('right', ige.input.key.d);
        ige.input.mapAction('up', ige.input.key.w);
        ige.input.mapAction('down', ige.input.key.s);
        ige.input.mapAction('shoot', ige.input.key.space);
        this._entity.addBehaviour('playerControlComponent_behaviour', this.move);
    },
    move: function (ctx) {
        var self = this;
        if (!ige.isServer) {
            if (ige.input.actionState('left')) {
                if (!this.playerControl.controls.left) {
                    this.playerControl.controls.left = true;
                    ige.network.send('playerControlLeftDown');
                }
            } else {
                if (this.playerControl.controls.left) {
                    this.playerControl.controls.left = false;
                    ige.network.send('playerControlLeftUp');
                }
            }

            if (ige.input.actionState('right')) {
                if (!this.playerControl.controls.right) {
                    this.playerControl.controls.right = true;
                    ige.network.send('playerControlRightDown');
                }
            } else {
                if (this.playerControl.controls.right) {
                    this.playerControl.controls.right = false;
                    ige.network.send('playerControlRightUp');
                }
            }

            if (ige.input.actionState('up')) {
                if (!this.playerControl.controls.up) {
                    // Record the new state.
                    this.playerControl.controls.up = true;

                    // Tell the server about our control change.
                    ige.network.send('playerControlUpDown');
                }
            } else {
                if (this.playerControl.controls.up) {
                    // Record the new state.
                    this.playerControl.controls.up = false;

                    // Tell the server about our control change.
                    ige.network.send('playerControlUpUp');
                }
            }

            if (ige.input.actionState('down')) {
                if (!this.playerControl.controls.down) {
                    this.playerControl.controls.down = true;
                    ige.network.send('playerControlDownDown');
                }
            } else {
                if (this.playerControl.controls.down) {
                    this.playerControl.controls.down = false;
                    ige.network.send('playerControlDownUp');
                }
            }

            if (ige.input.actionState('shoot')) {
                if (!this.playerControl.controls.shoot) {
                    this.playerControl.controls.shoot = true;
                    ige.network.send('playerControlShootDown');
                }
            } else {
                if (this.playerControl.controls.shoot) {
                    this.playerControl.controls.shoot = false;
                    ige.network.send('playerControlShootUp');
                }
            }
        }
        /* CEXCLUDE */
        if (ige.isServer) {
            if (this._dead) {
                return;
            }
            //shooting
            if (this.playerControl.controls.shoot && this._currentMagicPoints == this._MAX_MAGIC_POINTS) {
                this._shoot = 'on';
            } else {
                this._shoot = 'off';
                this.playerControl.controls.shoot = false;
            }
            //movement
            if (this._canMove) {
                var facing = '', facing_prefix = '', facing_postfix = '';

                var speed = 0;
                var restVelocityX = 0;
                var restVelocityY = 0;
                var velocityX = 0;
                var velocityY = 0;
                speed = this.playerControl._speed;

                if (this.playerControl.controls.up) {
                    velocityY = -speed;
                    this.velocity.y(velocityY);
                    this.playerControl._prevVelocityY = velocityY;
                    facing_prefix = 'up';
                } else if (this.playerControl.controls.down) {
                    velocityY = speed;
                    this.velocity.y(velocityY);
                    this.playerControl._prevVelocityY = velocityY;
                    facing_prefix = 'down';
                } else {
                    this.velocity.y(restVelocityY);
                }

                if (this.playerControl.controls.left) {
                    velocityX = -speed;
                    this.velocity.x(velocityX);
                    this.playerControl._prevVelocityX = velocityX;
                    if (facing_prefix === '') {
                        facing_postfix = 'left';
                    } else {
                        facing_postfix = 'Left';
                    }
                } else if (this.playerControl.controls.right) {
                    velocityX = speed;
                    this.velocity.x(velocityX);
                    this.playerControl._prevVelocityX = velocityX;
                    if (facing_prefix === '') {
                        facing_postfix = 'right';
                    } else {
                        facing_postfix = 'Right';
                    }
                } else {
                    this.velocity.x(restVelocityX);
                }

                facing = facing_prefix + facing_postfix;
                if (facing !== '') {
                    this._facing = facing;
                }
            }
        }
        /* CEXCLUDE */
    }
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = PlayerControlComponent;
}