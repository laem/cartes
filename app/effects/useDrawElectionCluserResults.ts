import { Marker } from 'maplibre-gl'
import { useEffect } from 'react'
import { gtfsServerUrl } from '../serverUrls'
import { safeRemove } from './utils'

// colors to use for the categories
const partyColors = ['crimson', 'Gold', 'darkblue', '#fc4e2a', '#e31a1c']
// filters for classifying party results into five categories based on magnitude
const cat1 = ['==', ['get', 'result'], 'NFP']
const cat2 = ['==', ['get', 'result'], 'Ensemble']
const cat3 = ['==', ['get', 'result'], 'RN']
export default function useDrawElectionClusterResults(map, styleKey) {
	console.log('lg plopi', styleKey, map)
	useEffect(() => {
		if (!map || styleKey !== 'elections') return

		console.log('lg', 'salut')
		// objects for caching and keeping track of HTML marker objects (for performance)
		const markers = {}
		let markersOnScreen = {}

		const updateMarkers = () => {
			const newMarkers = {}
			const features = map.querySourceFeatures('resultats_legislatives_2024')
			console.log('lg f', features, map)

			// for every cluster on the screen, create an HTML marker for it (if we didn't yet),
			// and add it to the map if it's not there already
			for (let i = 0; i < features.length; i++) {
				const coords = features[i].geometry.coordinates
				const props = features[i].properties
				if (!props.cluster) continue
				const id = props.cluster_id

				let marker = markers[id]
				if (!marker) {
					const el = createDonutChart(props)
					marker = markers[id] = new Marker({
						element: el,
					}).setLngLat(coords)
				}
				newMarkers[id] = marker

				if (!markersOnScreen[id]) marker.addTo(map)
			}
			// for every marker we've added previously, remove those that are no longer visible
			for (let id in markersOnScreen) {
				if (!newMarkers[id]) markersOnScreen[id].remove()
			}
			markersOnScreen = newMarkers
		}

		// after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
		map.on('data', (e) => {
			if (e.sourceId !== 'resultats_legislatives_2024' || !e.isSourceLoaded)
				return

			const features = map.querySourceFeatures('resultats_legislatives_2024')
			console.log('lg f2', features)
			console.log('lg loaded', e)

			map.on('move', updateMarkers)
			map.on('moveend', updateMarkers)
			updateMarkers()
		})

		const dataUrl = gtfsServerUrl + '/resultats-legislatives-2024.geojson'
		map.addSource('resultats_legislatives_2024', {
			type: 'geojson',
			data: dataUrl,
			cluster: true,
			clusterRadius: 80,
			clusterProperties: {
				// keep separate counts for each magnitude category in a cluster
				cat1: ['+', ['case', cat1, 1, 0]],
				cat2: ['+', ['case', cat2, 1, 0]],
				cat3: ['+', ['case', cat3, 1, 0]],
			},
		})
		map.addLayer({
			id: 'resultats_legislatives_2024_circles',
			type: 'circle',
			source: 'resultats_legislatives_2024',
			filter: ['!=', 'cluster', true],
			paint: {
				'circle-color': [
					'case',
					['in', ['get', 'result'], 'RN'],
					'darkblue',
					['in', ['get', 'result'], 'NFP'],
					'crimson',
					['in', ['get', 'result'], 'Ensemble'],
					'yellow',
					'white',
				],
				'circle-opacity': 0.6,
				'circle-radius': 12,
			},
		})
		map.addLayer({
			id: 'resultats_legislatives_2024_labels',
			type: 'symbol',
			source: 'resultats_legislatives_2024',
			filter: ['!=', 'cluster', true],
			layout: {
				'text-field': [
					'number-format',
					['get', 'cat'],
					{ 'min-fraction-digits': 1, 'max-fraction-digits': 1 },
				],
				'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
				'text-size': 10,
			},
			paint: {
				'text-color': 'black',
			},
		})
		return () => {
			map.off('move', updateMarkers)
			map.off('moveend', updateMarkers)
			safeRemove(map)(
				[
					'resultats_legislatives_2024_labels',
					'resultats_legislatives_2024_circles',
				],
				['resultats_legislatives_2024']
			)
		}
	}, [map, styleKey])
}

function donutSegment(start, end, r, r0, color) {
	if (end - start === 1) end -= 0.00001
	const a0 = 2 * Math.PI * (start - 0.25)
	const a1 = 2 * Math.PI * (end - 0.25)
	const x0 = Math.cos(a0),
		y0 = Math.sin(a0)
	const x1 = Math.cos(a1),
		y1 = Math.sin(a1)
	const largeArc = end - start > 0.5 ? 1 : 0

	return [
		'<path d="M',
		r + r0 * x0,
		r + r0 * y0,
		'L',
		r + r * x0,
		r + r * y0,
		'A',
		r,
		r,
		0,
		largeArc,
		1,
		r + r * x1,
		r + r * y1,
		'L',
		r + r0 * x1,
		r + r0 * y1,
		'A',
		r0,
		r0,
		0,
		largeArc,
		0,
		r + r0 * x0,
		r + r0 * y0,
		`" fill="${color}" />`,
	].join(' ')
}

// code for creating an SVG donut chart from feature properties
function createDonutChart(props) {
	const offsets = []
	const counts = [props.cat1, props.cat2, props.cat3]
	let total = 0
	for (let i = 0; i < counts.length; i++) {
		offsets.push(total)
		total += counts[i]
	}
	const fontSize =
		total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16
	const r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18
	const r0 = Math.round(r * 0.6)
	const w = r * 2

	let html = `<div><svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`

	for (let i = 0; i < counts.length; i++) {
		html += donutSegment(
			offsets[i] / total,
			(offsets[i] + counts[i]) / total,
			r,
			r0,
			partyColors[i]
		)
	}
	html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" /><text dominant-baseline="central" transform="translate(${r}, ${r})">${total.toLocaleString()}</text></svg></div>`

	const el = document.createElement('div')
	el.innerHTML = html
	return el.firstChild
}
