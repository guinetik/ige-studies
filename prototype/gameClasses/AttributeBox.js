var AttributeBox = IgeEntity.extend({
    classId: 'AttributeBox',
    init: function () {
        var self = this;
        IgeEntity.prototype.init.call(this);
        if (!ige.isServer) {
            self.texture(ige.client.textures.attributeBox);
        }
        this._bindDataObject = {
            a: 1,
            b: 1
        };
        this._bindDataCurrAttrProperty = 'a';
        this._bindDataMaxAttrProperty = 'b';
        this._backgroundColor = '#000000';
        this._colorOverlay = '#000000';
        return this;
    },
    backgroundColor: function (color) {
        this._backgroundColor = color;

        return this;
    },
    colorOverlay: function (color) {
        this._colorOverlay = color;

        return this;
    },
    bindData: function (obj, currAttrPropName, maxAttrPropName) {
        if (obj !== undefined
            && currAttrPropName !== undefined
            && maxAttrPropName !== undefined) {
            this._bindDataObject = obj;
            this._bindDataCurrAttrProperty = currAttrPropName;
            this._bindDataMaxAttrProperty = maxAttrPropName;
        }

        return this;
    }
});

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = AttributeBox;
}