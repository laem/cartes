import css from '@/components/css/convertToJs'
import { goodIconSize } from '@/components/voyage/mapUtils'
import maplibregl from 'maplibre-gl'
import { useEffect, useState } from 'react'
import { gtfsServerUrl } from '../serverUrls'

export default function useSearchLocalTransit(map, active, center, zoom) {
	return null
	const [stops, setStops] = useState([])
	const [stopTimes, setStopTimes] = useState({})
	const notZoomEnough = zoom < 15
	useEffect(() => {
		if (!active || !center || notZoomEnough) return
		const [longitude, latitude] = center,
			distance = 200

		const url = `${gtfsServerUrl}/geoStops/${latitude}/${longitude}/${distance}`

		const doFetch = async () => {
			const request = await fetch(url)
			const json = await request.json()
			setStops(json)
		}

		doFetch()
	}, [active, center, setStops, notZoomEnough])

	useEffect(() => {
		if (!stops.length) return

		const doFetch = () => {
			stops.map(async (stop) => {
				const id = stop.stop_id
				const url = `${gtfsServerUrl}/stopTimes/${id}`
				const request = await fetch(url)
				const json = await request.json()
				setStopTimes((stopTimes) => ({ ...stopTimes, [id]: json }))
			})
		}
		doFetch()
	}, [stops, setStopTimes])

	useEffect(() => {
		if (!map || !stops.length || !active || notZoomEnough) return
		const markers = stops.map((stop) => {
			const routes = stopTimes[stop.stop_id]?.routes

			const jsx = `<div><div style="padding: 0 .2rem">${stop.stop_name}</div>
${
	routes
		? `
				<ul style="list-style-type: none">${routes
					.map(
						(route) =>
							`<li style="${`
							padding: 0 .2rem;
							font-weight: bold;
							  background: #${route.route_color};
								color: #${route.route_text_color}`}">${route.route_short_name}</li>`
					)
					.join('')}</ul>`
		: ''
}</div>`

			const element = document.createElement('div')
			const size = goodIconSize(zoom, 1.3) + 'px'

			element.style.cssText = `
			display: block;
			background: var(--lightestColor);
			width: ${size}; height: auto;
			`
			element.innerHTML = jsx

			element.addEventListener('click', () => {
				console.log(stop)
			})

			const marker = new maplibregl.Marker({ element })
				.setLngLat({ lng: stop.stop_lon, lat: stop.stop_lat })
				.addTo(map)

			return marker
		})
		return () => {
			markers.map((marker) => marker.remove())
		}
	}, [map, stops, stopTimes, zoom, notZoomEnough])
}
