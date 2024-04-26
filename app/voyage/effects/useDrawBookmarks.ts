import maplibregl from 'maplibre-gl'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export default function useDrawBookmarks(map) {
	const [bookmarks, setBookmarks] = useLocalStorage('bookmarks', [])

	useEffect(() => {
		const markers = bookmarks.map((bookmark) => {
			const el = document.createElement('div')
			el.innerHTML = `
			<img src="/pin.svg" width="40px" height="40px" alt="Marque page" style="filter: drop-shadow(0 0 0.2rem white); transform: translateY(-50%)"/>
			`

			el.addEventListener('click', () => {
				window.alert('plop')
			})

			const marker = new maplibregl.Marker({ element: el })
				.setLngLat({
					lng: bookmark.geometry.coordinates[0],
					lat: bookmark.geometry.coordinates[1],
				})
				.addTo(map)
			return marker
		})

		return () => {
			markers.map((marker) => marker.remove())
		}
	}, [bookmarks])
}
