import { Marker } from 'maplibre-gl'
import { useEffect } from 'react'

export default function useSetTargetMarkerAndZoom(
	map,
	target,
	marker,
	destinationType,
	setState,
	setLatLngClicked,
	zoom
) {
	useEffect(() => {
		if (!map || !target) return

		if (!marker) {
			const tailoredZoom = ['city'].includes(destinationType)
				? 12
				: Math.max(15, zoom)
			console.log(
				'blue',
				'will fly to in after OSM download from vers marker',
				target,
				tailoredZoom,
				destinationType
			)
			map.flyTo({
				center: target,
				zoom: tailoredZoom,
				pitch: 50, // pitch in degrees
				bearing: 20, // bearing in degrees
			})
			const marker = new Marker({
				color: 'var(--darkerColor)',
				draggable: true,
			})
				.setLngLat(target)
				.addTo(map)

			setState((state) => ({ ...state, vers: { ...state.vers, marker } }))
			setLatLngClicked({ lng: target[0], lat: target[1] })

			const onDragEnd = () => {
				const { lng, lat } = marker.getLngLat()
				setState((state) => ({
					...state,
					vers: {
						...state.vers,
						choice: { latitude: lat, longitude: lng },
					},
				}))
			}

			marker.on('dragend', onDragEnd)
			return () => {
				marker.off('dragend', onDragEnd)
				marker.remove()
			}
		}
	}, [target, map, setState, marker, destinationType, setLatLngClicked, zoom])
}
