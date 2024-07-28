import useCompass from './useCompass'
import compassArrow from '@/public/compass-arrow.svg'
import { Marker } from 'maplibre-gl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function MapCompassArrow({ geolocate, map }) {
	const [compass] = useCompass()
	const [where, setWhere] = useState()
	const [marker, setMarker] = useState()

	useEffect(() => {
		if (!geolocate) return
		const events = [
			['geolocate', (position) => setWhere(position.coords)],
			['trackuserlocationend', () => setWhere(null)],
		]

		events.map(([eventName, eventHandler]) =>
			geolocate.on(eventName, eventHandler)
		)

		return () => {
			events.map(([eventName, eventHandler]) =>
				geolocate.off(eventName, eventHandler)
			)
		}
	}, [geolocate, setWhere])

	useEffect(() => {
		if (!map || !where) return
		const element = document.createElement('div')
		element.style.cssText = `
				display: flex;
				flex-direction: column;
				align-items: center;
			`
		const size = '45px'

		const image = document.createElement('img')
		image.src = '/compass-arrow.svg'
		image.style.width = size
		image.style.height = size
		image.alt = 'Flèche indiquant votre orientation'
		element.append(image)

		const marker = new Marker({ element })
			.setLngLat([where.longitude, where.latitude])
			.addTo(map)

		setMarker(marker)

		return () => {
			marker.remove()
		}
	}, [map, where, setMarker])

	useEffect(() => {
		if (!marker) return
		marker.setRotation(compass)
	}, [marker, compass])

	return (
		<div
			css={`
				position: fixed;
				left: 50%;
				top: 50%;
				transform: translateX(-50%) translateY(-50%);
				z-index: 20;
				img {
					width: 1rem;
					height: auto;
					filter: drop-shadow(0px 1px 3px rgba(0, 0, 0, 0.7));
				}
				${compass != null
					? `
transform: translate(-50%, -50%) rotate(${compass}deg) !important;`
					: ''}
			`}
		></div>
	)
}
