import protomaps from './protomaps'

export default function elections(key) {
	const baseStyle = protomaps(key)
	return {
		...baseStyle,
		version: 8,
		id: 'elections.cartes.app',
		name: 'Cartes élections',
		sources: {
			...baseStyle.sources,
			circonscriptions_legislatives_2024: {
				type: 'vector',
				url: 'pmtiles://https://motis.cartes.app/gtfs/circonscriptions-legislatives-2024.pmtiles',
				attribution:
					'https://umap.openstreetmap.fr/tr/map/circonscriptions-legislatives-2022_767781',
			},
		},
		layers: [
			...baseStyle.layers,
			{
				id: 'circonscriptions_legislatives_2024',
				type: 'fill',
				source: 'circonscriptions_legislatives_2024',
				'source-layer': 'circolegislativesumap',
				//maxzoom: 8,
				layout: { visibility: 'visible' },
				paint: {
					'fill-color': 'purple',
					'fill-opacity': 0.4,
					'fill-antialias': true,
				},
				//filter: ['==', 'class', 'grass'],
			},
			{
				id: 'circonscriptions_legislatives_2024_outline',
				type: 'line',
				source: 'circonscriptions_legislatives_2024',
				'source-layer': 'circolegislativesumap',
				paint: {
					'line-color': 'white',
					'line-width': 1,
				},
			},
		],
	}
}
