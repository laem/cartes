import { useLocalStorage } from 'usehooks-ts'
import BikeRouteRésumé from './BikeRouteRésumé'
import { ExplanationWrapper } from './ContentUI'
import Explanations from './explanations.mdx'
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
	const ogImages = useOgImageFetcher(url),
		ogImage = ogImages[url]

	const [tutorials, setTutorials] = useLocalStorage('tutorials', {})
	const introductionRead = tutorials.introduction

	if (!introductionRead)
		return (
			<ExplanationWrapper>
				<Explanations />
				<button
					onClick={() => setTutorials({ ...tutorials, introduction: true })}
				>
					OK
				</button>
			</ExplanationWrapper>
		)
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
				<p>
					Cliquez sur un point d'intérêt ou saisissez une destination puis
					explorez les gares autour.
				</p>
			)}
		</section>
	)
}
