import { toThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import { createSearchBBox } from './createSearchPolygon'
import { FeatureImage } from './FeatureImage'

export function useZoneImages({ latLngClicked, setLatLngClicked }) {
	const [wikimedia, setWikimedia] = useState(null)

	useEffect(() => {
		if (!latLngClicked) return
		const makeRequest = async () => {
			const { lat1, lng1, lat2, lng2 } = createSearchBBox(latLngClicked)

			const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsbbox=${lat2}|${lng2}|${lat1}|${lng1}&gsnamespace=6&gslimit=500&format=json&origin=*`
			setWikimedia([])
			const request = await fetch(url)

			const json = await request.json()
			const images = json.query.geosearch
			if (images.length) setWikimedia(images)
			if (!images.length) {
				setWikimedia(null)
				setLatLngClicked(null)
			}
		}
		makeRequest()
	}, [latLngClicked])
	return wikimedia
}

export function ZoneImages({ images }) {
	const imageUrls =
		images &&
		images.map((json) => {
			const title = json.title,
				url = toThumb(title)
			return {
				url,
				fullUrl: `https://commons.wikimedia.org/wiki/${title.replace(
					' ',
					'_'
				)}`,
			}
		})
	if (!imageUrls) return null
	return (
		<div
			css={`
				overflow: scroll;
				whitespace: nowrap;
				&::-webkit-scrollbar {
					display: none;
				}
			`}
		>
			{' '}
			{!imageUrls.length ? (
				<p>Recherche d'images...</p>
			) : (
				<ul
					css={`
						margin: 0 0 0.4rem 0;
						display: flex;
						list-style-type: none;

						li {
							padding: 0;
							margin: 0 0.4rem;
						}
						img {
						}
					`}
				>
					{imageUrls.map(({ url, fullUrl }) => (
						<li key={fullUrl}>
							<a href={fullUrl} target="_blank">
								<FeatureImage src={url} css={``} />
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
