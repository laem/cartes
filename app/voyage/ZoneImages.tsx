import { getThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import { createSearchBBox } from './createSearchPolygon'
import { FeatureImage } from './FeatureImage'
import Image from 'next/image'

export function useZoneImages({ latLngClicked, setLatLngClicked }) {
	const [wikimedia, setWikimedia] = useState(null)
	const [panoramax, setPanoramax] = useState(null)

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
	}, [latLngClicked, setLatLngClicked])

	useEffect(() => {
		if (!latLngClicked) return
		const makeRequest = async () => {
			const { lat1, lng1, lat2, lng2 } = createSearchBBox(latLngClicked)

			const url = `https://api.panoramax.xyz/api/search?limit=1&bbox=${lng2},${lat1},${lng1},${lat2}`
			setPanoramax([])
			const request = await fetch(url)

			const json = await request.json()
			const images = json.features
			if (images.length) setPanoramax(images)
			if (!images.length) {
				setPanoramax(null)
				setLatLngClicked(null)
			}
		}
		makeRequest()
	}, [latLngClicked, setLatLngClicked])
	return [
		wikimedia,
		panoramax,
		() => {
			setWikimedia(null)
			setPanoramax(null)
		},
	]
}

export function ZoneImages({ zoneImages: images, panoramaxImages }) {
	console.log('panoramax', panoramaxImages)

	const panoramaxImage = panoramaxImages && panoramaxImages[0],
		panoramaxThumb = panoramaxImage?.assets?.thumb

	const imageUrls =
		images &&
		images.map((json) => {
			const title = json.title,
				url = getThumb(title, 400)
			return {
				url,
				fullUrl: `https://commons.wikimedia.org/wiki/${title.replace(
					' ',
					'_'
				)}`,
			}
		})
	return (
		<div
			css={`
				overflow: scroll;
				white-space: nowrap;
				&::-webkit-scrollbar {
					display: none;
				}
			`}
		>
			{(panoramaxThumb || imageUrls?.length > 0) && (
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
					{panoramaxThumb && (
						<a
							href={`https://panoramax.fr/photos#focus=pic&map=${window.location.hash.slice(
								1
							)}&pic=${panoramaxImage.id}`}
							target="_blank"
						>
							<div
								css={`
									position: relative;
									> img:first-child {
										position: absolute;
										bottom: 0.8rem;
										left: 0.4rem;
										width: 2.2rem;
										height: auto;
									}
								`}
								title="Cette zone est visualisable depuis la rue grâce au projet Panoramax"
							>
								<Image
									src={`/panoramax.svg`}
									width="10"
									height="10"
									alt="Logo du projet Panoramax"
								/>
								<FeatureImage
									src={panoramaxThumb.href}
									alt="Image de terrain issue de Panoramax"
									width="150"
									height="150"
								/>
							</div>
						</a>
					)}
					{imageUrls &&
						imageUrls.length > 0 &&
						imageUrls.map(({ url, fullUrl }) => (
							<li key={fullUrl}>
								<a href={fullUrl} target="_blank">
									<FeatureImage
										src={url}
										alt="Image de terrain issue de Wikimedia Commons"
										width="150"
										height="150"
									/>
								</a>
							</li>
						))}
				</ul>
			)}
		</div>
	)
}
