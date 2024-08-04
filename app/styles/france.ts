import voyageStyle from './voyage'

export default function franceStyle(key) {
	return {
		...voyageStyle(key),
		id: 'france',
		name: 'France',
		sources: {
			maptiler_planet: {
				url: 'cartes://https://panoramax.openstreetmap.fr/pmtiles/planet.pmtiles',
				type: 'vector',
			},
			maptiler_attribution: {
				attribution:
					'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
				type: 'vector',
			},
		},
	}
}
