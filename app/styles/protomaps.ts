import voyageStyle from './voyage'

export default function protomaps(key) {
	const baseStyle = voyageStyle(key, [['get', 'name:latin']], 'name:latin')

	return {
		version: 8,
		id: 'cartes.app',
		name: 'Cartes',
		layers: baseStyle.layers.map((layer) => {
			// TODO
			// the Pedestrian layer won't work, since there is no subclass in the OSM
			// PMtiles
			// We could just use the path class instead
			// But these objects are coded as LineStrings, so painting as fill won't
			// work
			return layer
			//if (layer.id==='Other POI')  return {...layer, }
		}),
		sources: {
			maptiler_planet: {
				type: 'vector',
				url: 'pmtiles://https://panoramax.openstreetmap.fr/pmtiles/planet.pmtiles',
				attribution:
					'<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
			},
		},
		glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${key}`,
		sprite:
			'https://api.maptiler.com/maps/2f80a9c4-e0dd-437d-ae35-2b6c212f830b/sprite',
		bearing: 0,
		pitch: 0,
		center: [0, 0],
		zoom: 1,
	}
}
