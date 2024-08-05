import { gtfsServerUrl } from '../serverUrls'
import protomaps from './protomaps'

export default function franceStyle(key) {
	const base = protomaps(key)
	return {
		...base,
		layers: [
			{
				id: 'Background',
				type: 'background',
				layout: { visibility: 'visible' },
				paint: {
					'background-color': '#6688dd',
				},
			},
			{
				id: 'Land',
				type: 'fill',
				source: 'land',
				'source-layer': 'land',
				layout: { visibility: 'visible' },
				paint: {
					'fill-color': '#dfecbe',
				},
			},
			...base.layers.slice(1),
		],
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
			land: {
				type: 'vector',
				url: 'pmtiles://' + gtfsServerUrl + '/land.pmtiles',
			},
		},
	}
}
