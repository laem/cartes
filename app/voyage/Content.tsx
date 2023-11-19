import { toThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import BikeRouteRésumé from './BikeRouteRésumé'
import { createSearchBBox } from './createSearchPolygon'
import { FeatureImage } from './FeatureImage'
import GareInfo from './GareInfo'
import OsmFeature from './OsmFeature'
import useOgImageFetcher from './useOgImageFetcher'
import ZoneImages from './ZoneImages'

export default function Content({
	latLngClicked,
	clickedGare,
	bikeRoute,
	osmFeature,
	setBikeRouteProfile,
	bikeRouteProfile,
}) {
	const url = osmFeature?.tags?.website
	const ogImage = useOgImageFetcher(url)

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
				<p>Cliquez sur une gare pour obtenir ses horaires.</p>
			)}
		</section>
	)
}
