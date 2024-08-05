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
			//https://github.com/wipfli/h3-landcover/blob/main/style.json
			{
				id: 'Grass-Bare-Snow',
				type: 'fill',
				source: 'landcover',
				'source-layer': 'landcover',
				filter: ['==', ['get', 'kind'], 'Grass-Bare-Snow'],
				layout: {
					visibility: 'visible',
				},
				paint: {
					'fill-color': '#b6dcc1',
					'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 11, 0],
				},
			},
			{
				id: 'Bare-Snow',
				type: 'fill',
				source: 'landcover',
				'source-layer': 'landcover',
				filter: ['==', ['get', 'kind'], 'Bare-Snow'],
				layout: {
					visibility: 'visible',
				},
				paint: {
					'fill-color': '#f3ede0',
					'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 11, 0],
				},
			},
			{
				id: 'Snow',
				type: 'fill',
				source: 'landcover',
				'source-layer': 'landcover',
				filter: ['==', ['get', 'kind'], 'Snow'],
				layout: {
					visibility: 'visible',
				},
				paint: {
					'fill-color': 'white',
					'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 11, 0],
				},
			},
			{
				id: 'Crops',
				type: 'fill',
				source: 'landcover',
				'source-layer': 'landcover',
				filter: ['==', ['get', 'kind'], 'Crops'],
				layout: {
					visibility: 'visible',
				},
				paint: {
					'fill-color': '#bbe2c6',
					'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 11, 0],
				},
			},
			{
				id: 'Tree',
				type: 'fill',
				source: 'landcover',
				'source-layer': 'landcover',
				filter: ['==', ['get', 'kind'], 'Tree'],
				paint: {
					'fill-color': '#94d2a5',
					'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 11, 0],
				},
			},
			{
				id: 'BuiltUp',
				type: 'fill',
				source: 'landcover',
				'source-layer': 'landcover',
				filter: ['==', ['get', 'kind'], 'BuiltUp'],
				paint: {
					'fill-color': '#e8eaed',
					'fill-opacity': ['interpolate', ['linear'], ['zoom'], 10, 1, 11, 0],
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
			landcover: {
				type: 'vector',
				url: 'pmtiles://' + gtfsServerUrl + '/h3-landcover.pmtiles',
			},
		},
	}
}
