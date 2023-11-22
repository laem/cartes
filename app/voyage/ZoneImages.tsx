import { toThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import { createSearchBBox } from './createSearchPolygon'
import { FeatureImage } from './FeatureImage'
export default function ZoneImages({ latLngClicked }) {
	const [wikimedia, setWikimedia] = useState([])

	useEffect(() => {
		if (!latLngClicked) return
		const makeRequest = async () => {
			const { lat1, lng1, lat2, lng2 } = createSearchBBox(latLngClicked)

			const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsbbox=${lat2}|${lng2}|${lat1}|${lng1}&gsnamespace=6&gslimit=500&format=json&origin=*`
			const request = await fetch(url)
			const json = await request.json()
			const images = json.query.geosearch
			setWikimedia(images)
		}
		makeRequest()
	}, [latLngClicked])
	const imageUrls = wikimedia.map((json) => {
		const title = json.title,
			url = toThumb(title)
		return url
	})
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
			{imageUrls.length > 0 && (
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
					{imageUrls.map((url) => (
						<li key={url}>
							<FeatureImage src={url} css={``} />
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
