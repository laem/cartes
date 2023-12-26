import { goodIconSize } from '@/components/voyage/mapUtils'
import maplibregl from 'maplibre-gl'
import { useEffect, useState } from 'react'

export default function useImageSearch(map, zoom) {
	const [images, setImages] = useState([])
	const bbox = map && map.getBounds().toArray()
	useEffect(() => {
		if (!bbox || zoom < 17) return
		const makeRequest = async () => {
			const [[lng2, lat1], [lng1, lat2]] = bbox

			const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsbbox=${lat2}|${lng2}|${lat1}|${lng1}&gsnamespace=6&gslimit=10&format=json&origin=*`
			const request = await fetch(url)

			const json = await request.json()
			const images = json.query.geosearch
			if (images.length) setImages((oldImages) => [...oldImages, ...images])
		}
		makeRequest()
	}, [zoom, bbox])

	console.log('IMAGES', images)

	useEffect(() => {
		if (!map) return

		if (!images.length) return
		const markers = images.map((image) => {
			const element = document.createElement('a')
			element.href =
				'https://commons.wikimedia.org/wiki/' + encodeURIComponent(image.title)
			element.setAttribute('target', '_blank')
			element.style.cssText = `
			display: block;

			`
			const size = goodIconSize(zoom, 1.3) + 'px'

			const img = document.createElement('img')
			img.src = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${image.title}&width=100`
			img.style.cssText = `
			width: ${size};height: ${size};border-radius: ${size};
			object-fit: cover
			`
			img.alt = image.title
			element.append(img)

			element.addEventListener('click', () => {
				console.log(image)
			})

			const marker = new maplibregl.Marker({ element })
				.setLngLat({ lng: image.lon, lat: image.lat })
				.addTo(map)
			return marker
		})
		return () => {
			markers.map((marker) => marker.remove())
		}
	}, [map, zoom, images])
}
