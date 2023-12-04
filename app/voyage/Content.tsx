import { useLocalStorage } from 'usehooks-ts'
import BikeRouteRésumé from './BikeRouteRésumé'
import { ExplanationWrapper } from './ContentUI'
import Explanations from './explanations.mdx'
import { FeatureImage } from './FeatureImage'
import GareInfo from './GareInfo'
import OsmFeature from './OsmFeature'
import { DialogButton, ModalCloseButton } from './UI'
import useOgImageFetcher from './useOgImageFetcher'
import ZoneImages from './ZoneImages'

export default function Content({
	latLngClicked,
	setLatLngClicked,
	clickedGare,
	bikeRoute,
	osmFeature,
	setBikeRouteProfile,
	bikeRouteProfile,
	clickGare,
	setOsmFeature,
}) {
	const url = osmFeature?.tags?.website || osmFeature?.tags?.['contact:website']
	const ogImages = useOgImageFetcher(url),
		ogImage = ogImages[url]

	const [tutorials, setTutorials] = useLocalStorage('tutorials', {})
	const introductionRead = tutorials.introduction,
		clickTipRead = tutorials.clickTip

	if (!introductionRead)
		return (
			<ExplanationWrapper>
				<Explanations />
				<DialogButton
					onClick={() => setTutorials({ ...tutorials, introduction: true })}
				>
					OK
				</DialogButton>
			</ExplanationWrapper>
		)
	return (
		<section
			css={`
				position: relative;
				padding-top: 1.4rem;
			`}
		>
			<ModalCloseButton
				title="Fermer l'encart point d'intéret"
				onClick={() => {
					setOsmFeature(null)
					setLatLngClicked(null)
				}}
			>
				×
			</ModalCloseButton>
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
			<ZoneImages
				latLngClicked={latLngClicked}
				setLatLngClicked={setLatLngClicked}
			/>
			{clickedGare ? (
				<div>
					<ModalCloseButton
						title="Fermer l'encart gare"
						onClick={() => clickGare(null)}
					>
						×
					</ModalCloseButton>
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
				!clickTipRead && (
					<div>
						<p
							css={`
								max-width: 20rem;
							`}
						>
							Cliquez sur un point d'intérêt ou saisissez une destination puis
							explorez les gares autour.
						</p>
						<DialogButton
							onClick={() => setTutorials({ ...tutorials, clickTip: true })}
						>
							OK
						</DialogButton>
					</div>
				)
			)}
		</section>
	)
}
