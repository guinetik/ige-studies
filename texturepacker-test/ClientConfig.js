var igeClientConfig = {
	include: [
		'./lib/TexturePackerAtlas.js',
		/* Your custom game JS scripts */
		//'./gameClasses/MyCustomClassFile.js',
		
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }