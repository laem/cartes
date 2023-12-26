import { goodIconSize } from '@/components/voyage/mapUtils'
import maplibregl from 'maplibre-gl'
import { useEffect, useMemo, useState } from 'react'

/*
 * TODO
 * This component is not optimized, and may feel clumsy
 * - we limit the nb of images since there could be 10 000 images in a single bbox
 * - wikimedia can return images on a localised small part of the bbox because of that limit
 * - when you do a search somewhere, then drag the map, the new search should be done only in the added surface
 * - etc
 *
 *
 */
const serializeBbox = (bbox) => {
	if (!bbox) return null

	const [[lng2, lat1], [lng1, lat2]] = bbox,
		bboxString = `${lat2}|${lng2}|${lat1}|${lng1}`
	return bboxString
}
export default function useImageSearch(map, zoom, bbox, active) {
	const [bboxImages, setBboxImages] = useState({})

	const bboxString = serializeBbox(bbox)

	const images = useMemo(
		() => bboxImages[bboxString] || [],
		[bboxString, bboxImages]
	)
	useEffect(() => {
		if (!active) return
		if (!bboxString) return
		if (images.length) return
		const makeRequest = async () => {
			const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsbbox=${bboxString}&gsnamespace=6&gslimit=30&format=json&origin=*`
			const request = await fetch(url)

			const json = await request.json()
			const newImages = json.query.geosearch
			if (newImages.length)
				setBboxImages((old) => ({ ...old, [bboxString]: newImages }))
		}
		makeRequest()
	}, [setBboxImages, bboxString, images, active])

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
			img.src = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${image.title}&width=150`
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
