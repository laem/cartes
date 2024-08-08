import { Marker } from 'maplibre-gl'
import { useEffect, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'
import { safeRemove } from './utils'

// colors to use for the categories
export const partyColors = {
	UG: '#de3c80',
	ENS: '#9859fc',
	RN: '#002E61',
	DVC: '#FF8400',
	REC: '#1019c1',
	LR: '#005ce6',
	EXG: '#AF0000',
	FI: '#AF0000',
	COM: '#AF0000',
	UDI: '#9AC4F9',
	DVD: '#0099FF',
	DVG: '#de3c80',
	RDG: '#de3c80',
	HOR: '#9859fc',
	REG: 'gray',
	UXD: '#002E61',
	EXD: '#002E61',
	SOC: '#de3c80',
	ECO: 'green',
	VEC: 'green',
	DIV: '#9AC4F9',
	DSV: '#002E61',
}

// filters for classifying party results into five categories based on magnitude

const cat = (index) => [
	'==',
	['get', 'result'],
	Object.keys(partyColors)[index],
]

const filterFeatures = (filter) => (featureCollection) => {
	const features = featureCollection.features.filter((feature) => {
		if (filter === 'elus') {
			const results = feature.properties.results
			const first = results[0]
			return first.score > 50 && first.scoreInscrits > 25
		} else return featureCollection
	})

	return { type: 'FeatureCollection', features }
}
export default function useDrawElectionClusterResults(
	map,
	styleKey,
	rawFilter
) {
	const filter = rawFilter || 'elus'
	const [rawData, setData] = useState(null)
	useEffect(() => {
		if (styleKey !== 'elections') return
		const download = async () => {
			const dataUrl = gtfsServerUrl + '/resultats-legislatives-2024.geojson'
			const request = await fetch(dataUrl)
			const json = await request.json()
			setData(json)
		}
		download()
	}, [])

	const data = rawData && filterFeatures(filter)(rawData)

	useEffect(() => {
		if (!map || styleKey !== 'elections') return

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

		const handleOnData = (e) => {
			if (e.sourceId !== 'resultats_legislatives_2024' || !e.isSourceLoaded)
				return

			//const features = map.querySourceFeatures('resultats_legislatives_2024')

			map.on('move', updateMarkers)
			map.on('moveend', updateMarkers)
			updateMarkers()
		}
		// after the GeoJSON data is loaded, update markers on the screen and do so on every map move/moveend
		map.on('data', handleOnData)

		map.addSource('resultats_legislatives_2024', {
			type: 'geojson',
			data,
			cluster: true,
			clusterRadius: 80,
			clusterProperties: Object.fromEntries(
				Object.entries(partyColors).map(([party, color], index) => [
					'cat' + index,
					['+', ['case', cat(index), 1, 0]],
				])
			),
		})
		map.addLayer({
			id: 'resultats_legislatives_2024_circles',
			type: 'circle',
			source: 'resultats_legislatives_2024',
			filter: ['!=', 'cluster', true],
			paint: {
				'circle-color': [
					'case',
					...Object.entries(partyColors)
						.map(([party, color]) => [['in', ['get', 'result'], party], color])
						.flat(),
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
				'text-font': ['Roboto Regular', 'Noto Sans Regular'],
				'text-size': 10,
			},
			paint: {
				'text-color': 'black',
			},
		})
		return () => {
			map.off('data', handleOnData)
			map.off('move', updateMarkers)
			map.off('moveend', updateMarkers)
			safeRemove(map)(
				[
					'resultats_legislatives_2024_labels',
					'resultats_legislatives_2024_circles',
				],
				['resultats_legislatives_2024']
			)
			updateMarkers()
		}
	}, [map, styleKey, data, filter])
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
	const counts = Object.entries(partyColors).map(
		(a, index) => props['cat' + index]
	)
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
			Object.values(partyColors)[i]
		)
	}
	html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" /><text dominant-baseline="central" transform="translate(${r}, ${r})">${total.toLocaleString()}</text></svg></div>`

	const el = document.createElement('div')
	el.innerHTML = html
	return el.firstChild
}
