const style = (key) => ({
	version: 8,
	id: 'basic-v2',
	name: 'Basic',
	sources: {
		maptiler_planet: {
			url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=' + key,
			type: 'vector',
		},
		maptiler_attribution: {
			attribution:
				'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
			type: 'vector',
		},
		'raster-tiles': {
			type: 'raster',
			tiles: [
				'https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
			],
			tileSize: 256,
			attribution: 'CyclOSM | Map data © OpenStreetMap contributors',
		},
	},
	layers: [
		{
			id: 'simple-tiles',
			type: 'raster',
			source: 'raster-tiles',
			minzoom: 0,
			maxzoom: 22,
		},
	],
	glyphs: 'https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=' + key,
	bearing: 0,
	pitch: 0,
	center: [0, 0],
	zoom: 1,
})

export default style
