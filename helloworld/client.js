var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		ige.showStats(1);

		// Load our textures
		var self = this;
		this.gameTextures = {};
		
		// Load a game texture here
		this.gameTextures.frank = {frank_standing:new IgeTexture('./../sprites/frank_standing.png')};
		
		///////////////////////////////////////////////////////////////////////////////
		// *** PLEASE READ - BLANK PROJECT RUNNING DETAILS ***
		///////////////////////////////////////////////////////////////////////////////
		// The engine will wait for your textures to load before it starts because
		// of the code below waiting for an "on('texturesLoaded')" before executing.
		// The problem is there are no textures loaded because this is a blank project
		// so if you run this from the index.html the loading symbol will spin forever.
		// I've added an example line (line 11) to show how to load at least one
		// texture into memory but you'll have to provide an image file for it :)
		///////////////////////////////////////////////////////////////////////////////

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
                    frank.mount(scene);
				}
			});
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }