import { toThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import BikeRouteRésumé from './BikeRouteRésumé'
import { createSearchBBox } from './createSearchPolygon'
import { FeatureImage } from './FeatureImage'
import GareInfo from './GareInfo'
import OsmFeature from './OsmFeature'
import useOgImageFetcher from './useOgImageFetcher'
import ZoneImages from './ZoneImages'
import Explanations from './explanations.mdx'

export default function Content({
	latLngClicked,
	clickedGare,
	bikeRoute,
	osmFeature,
	setBikeRouteProfile,
	bikeRouteProfile,
}) {
	const url = osmFeature?.tags?.website
	const ogImages = useOgImageFetcher(url),
		ogImage = ogImages[url]

	const [introductionRead, setIntroductionRead] = useState(false)

	useEffect(() => {
		const tutorials = JSON.parse(localStorage?.getItem('tutorials') || '{}'),
			introductionRead = tutorials.introduction
		setIntroductionRead(introductionRead)
	}, [setIntroductionRead])

	if (!introductionRead) return <Explanations />
	return (
		<section>
			{ogImage && (
				<FeatureImage
					src={ogImage}
					css={`
						width: 100%;
						height: 6rem;
						@media (min-height: 800px) {
							height: 9rem;
						}
						object-fit: cover;
					`}
				/>
			)}
			<ZoneImages latLngClicked={latLngClicked} />
			{clickedGare ? (
				<div css={``}>
					{bikeRoute && (
						<BikeRouteRésumé
							{...{ data: bikeRoute, bikeRouteProfile, setBikeRouteProfile }}
						/>
					)}
					<GareInfo clickedGare={clickedGare} />
				</div>
			) : osmFeature ? (
				<OsmFeature data={osmFeature} />
			) : (
				<Explanations />
			)}
		</section>
	)
}
