var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		ige.showStats(1);

		// Load our textures
		var self = this;
		this.gameTextures = {};
		var fruits = new TexturePackerAtlas('Fruits','./../sprites/fruits.png','./../../sprites/fruits.js');
		this.gameTextures.frank = {frank_standing:new IgeTexture('./../sprites/frank_standing.png')};
		// Wait for our textures to load before continuing
		ige.on('texturesLoaded', function () {
			// Create the HTML canvas
			ige.createFrontBuffer(true);
			// Start the engine
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					// Add base scene data
					ige.addGraph('IgeBaseScene');
                    var scene = ige.$('baseScene');
                    // CREATE SOME ENTITIES AND WHOTNOT HERE
                    var frank = new IgeEntity();
                    frank.texture(self.gameTextures.frank.frank_standing).dimensionsFromTexture();
					frank.translateTo(0, 10, 10);
                    frank.mount(scene);

					var apple = new IgeEntity();
					apple.texture(fruits).cellById("apple.png").dimensionsFromCell();
					apple.translateTo(100, 10, 10);
					apple.mount(scene);

					var banana = new IgeEntity();
					banana.texture(fruits).cellById("banana.png").dimensionsFromCell();
					banana.translateTo(200, 10, 10);
					banana.mount(scene);

					var cherry = new IgeEntity();
					cherry.texture(fruits).cellById("cherry.png").dimensionsFromCell();
					cherry.translateTo(100, 100, 10);
					cherry.mount(scene);

					var prune = new IgeEntity();
					prune.texture(fruits).cellById("prune.png").dimensionsFromCell();
					prune.translateTo(200, 100, 10);
					prune.mount(scene);

					var strawberry = new IgeEntity();
					strawberry.texture(fruits).cellById("strawberry.png").dimensionsFromCell();
					strawberry.translateTo(-100, 100, 10);
					strawberry.mount(scene);

					var tomato = new IgeEntity();
					tomato.texture(fruits).cellById("tomato.png").dimensionsFromCell();
					tomato.translateTo(0, 100, 10);
					tomato.mount(scene);
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }