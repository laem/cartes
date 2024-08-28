import { getThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import { createSearchBBox } from './createSearchPolygon'
import { FeatureImage } from './FeatureImage'
import Image from 'next/image'
import {
	getWikimediaGeosearchUrl,
	handleWikimediaGeosearchImages,
} from './effects/useImageSearch'

export function useZoneImages({
	latLngClicked,
	setLatLngClicked,
	panoramaxOsmTag,
}) {
	const [wikimedia, setWikimedia] = useState(null)
	const [panoramax, setPanoramax] = useState(null)

	useEffect(() => {
		if (!latLngClicked) return
		const makeRequest = async () => {
			const { lat1, lng1, lat2, lng2 } = createSearchBBox(latLngClicked)
			const bboxString = `${lat2}|${lng2}|${lat1}|${lng1}`

			const url = getWikimediaGeosearchUrl(bboxString)

			setWikimedia([])
			const request = await fetch(url)

			const json = await request.json()

			const images = handleWikimediaGeosearchImages(json)

			if (images.length) setWikimedia(images)
			if (!images.length) {
				setWikimedia(null)
				setLatLngClicked(null)
			}
		}
		makeRequest()
	}, [latLngClicked, setLatLngClicked])

	useEffect(() => {
		console.log('panoramax url', panoramaxOsmTag)
		if (!latLngClicked && !panoramaxOsmTag) return
		const makeRequest = async () => {
			if (panoramaxOsmTag) {
				const pictureUrl = `https://panoramax.openstreetmap.fr/api/pictures/${panoramaxOsmTag}/thumb.webp`
				console.log('panoramax picture', pictureUrl)
				setPanoramax([
					{
						thumb: pictureUrl,
						link: `https://api.panoramax.xyz/#focus=pic&pic=${panoramaxOsmTag}`,
					},
				])
				return
			}

			const { lat1, lng1, lat2, lng2 } = createSearchBBox(latLngClicked)
			const url = `https://api.panoramax.xyz/api/search?limit=1&bbox=${lng2},${lat1},${lng1},${lat2}`
			setPanoramax([])
			const request = await fetch(url)

			const json = await request.json()
			const images = json.features
			if (images.length && images[0]?.assets?.thumb) {
				setPanoramax([
					{
						thumb: images[0].assets.thumb.href,
						link: `https://api.panoramax.xyz/#focus=pic&map=${window.location.hash.slice(
							1
						)}&pic=${images[0].id}`,
					},
				])
			} else {
				setPanoramax(null)
				setLatLngClicked(null)
			}
		}
		makeRequest()
	}, [latLngClicked, setLatLngClicked, panoramaxOsmTag])

	return [
		wikimedia,
		panoramax,
		() => {
			setWikimedia(null)
			setPanoramax(null)
		},
	]
}

export function ZoneImages({ zoneImages, panoramaxImages, focusImage }) {
	const images =
		zoneImages &&
		zoneImages.map((json) => {
			const title = json.title,
				url = getThumb(title, 400)
			return {
				...json,
				url,
			}
		})
	//TODO handle multiple images ?
	const panoramaxImage = panoramaxImages && panoramaxImages[0]
	return (
		<div
			css={`
				margin-top: 0.2rem;
				overflow: scroll;
				white-space: nowrap;
				&::-webkit-scrollbar {
					display: none;
				}
			`}
		>
			{(panoramaxImages || images?.length > 0) && (
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
					{panoramaxImage && (
						<a href={panoramaxImage.link} target="_blank">
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
									> img:last-child {
										border: 2px solid #83328a;
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
									src={panoramaxImage.thumb}
									alt="Image de terrain issue de Panoramax"
									width="150"
									height="150"
								/>
							</div>
						</a>
					)}
					{images &&
						images.length > 0 &&
						images.map((image) => {
							const { url } = image
							return (
								<li key={url}>
									<button
										onClick={() => focusImage(image)}
										css={`
											margin: 0;
											padding: 0;
										`}
									>
										<FeatureImage
											src={url}
											alt="Image de terrain issue de Wikimedia Commons"
											width="150"
											height="150"
										/>
									</button>
								</li>
							)
						})}
				</ul>
			)}
		</div>
	)
}
