import { goodIconSize } from '@/components/voyage/mapUtils'
import maplibregl from 'maplibre-gl'
import { useEffect, useState } from 'react'

export default function useSearchLocalTransit(map, active, center, zoom) {
	const [stops, setStops] = useState([])
	const [stopTimes, setStopTimes] = useState({})
	useEffect(() => {
		if (!active || !center) return
		const [longitude, latitude] = center,
			distance = 200

		const url = `https://motis.cartes.app/gtfs/geoStops/${latitude}/${longitude}/${distance}`

		const doFetch = async () => {
			const request = await fetch(url)
			const json = await request.json()
			setStops(json)
		}

		doFetch()
	}, [active, center, setStops])

	useEffect(() => {
		if (!stops.length) return

		const doFetch = () => {
			stops.map(async (stop) => {
				const id = stop.stop_id
				const url = `https://motis.cartes.app/gtfs/stopTimes/${id}`
				const request = await fetch(url)
				const json = await request.json()
				setStopTimes((stopTimes) => ({ ...stopTimes, [id]: json }))
			})
		}
		doFetch()
	}, [stops, setStopTimes])

	useEffect(() => {
		if (!map || !stops.length || !active) return
		const markers = stops.map((stop) => {
			const routes = stopTimes[stop.stop_id]?.routes

			const jsx = `<div><div>${stop.stop_name}</div>
${
	routes &&
	`
				<ul>${routes.map((route) => `<li>${route.route_short_name}</li>`)}</ul>`
}</div>`

			const element = document.createElement('div')
			const size = goodIconSize(zoom, 1.3) + 'px'

			element.style.cssText = `
			display: block;
			background: chartreuse;
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
	}, [map, stops, stopTimes, zoom])
}
