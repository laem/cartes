import maplibregl from 'maplibre-gl'
import { useEffect, useState } from 'react'

const defaultCenter =
	// Saint Malo [-1.9890417068124002, 48.66284934737089]
	[-1.6776317608896583, 48.10983044383964]
export const defaultZoom = 8
export default function useAddMap(styleUrl, setZoom, setBbox, mapContainerRef) {
	const [map, setMap] = useState(null)
	useEffect(() => {
		if (!mapContainerRef.current) return undefined

		const newMap = new maplibregl.Map({
			container: mapContainerRef.current,
			style: styleUrl,
			center: defaultCenter,
			zoom: defaultZoom,
			hash: true,
		})
		newMap.on('style.load', function () {
			console.log('ONLOAD STYLE', newMap._mapId)
		})
		newMap.on('load', () => {
			console.log('ONLOAD', newMap._mapId)
			setMap(newMap)

			newMap.addControl(
				new maplibregl.NavigationControl({
					visualizePitch: true,
					showZoom: true,
					showCompass: true,
				}),
				'top-right'
			)

			newMap.addControl(
				new maplibregl.GeolocateControl({
					positionOptions: {
						enableHighAccuracy: true,
					},
					trackUserLocation: true,
				})
			)

			setZoom(Math.round(newMap.getZoom()))
			setBbox(newMap.getBounds().toArray())
		})

		return () => {
			setMap(null)
			newMap?.remove()
		}
	}, [setMap, setZoom, setBbox, mapContainerRef])

	return map
}
