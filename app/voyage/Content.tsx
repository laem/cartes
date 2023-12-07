import { getCategory } from '@/components/categories'
import {
	CityImage,
	Destination,
	ImageWithNameWrapper,
} from '@/components/conversation/VoyageUI'
import { toThumb } from '@/components/wikidata'
import destinationPoint from '@/public/destination-point.svg'
import { motion } from 'framer-motion'
import NextImage from 'next/image'
import { useLocalStorage } from 'usehooks-ts'
import BikeRouteRésumé from './BikeRouteRésumé'
import { ExplanationWrapper } from './ContentUI'
import Explanations from './explanations.mdx'
import { FeatureImage } from './FeatureImage'
import GareInfo from './GareInfo'
import OsmFeature from './OsmFeature'
import PlaceSearch from './PlaceSearch'
import QuickFeatureSearch from './QuickFeatureSearch'
import { DialogButton, ModalCloseButton } from './UI'
import useOgImageFetcher from './useOgImageFetcher'
import useWikidata from './useWikidata'
import { ZoneImages } from './ZoneImages'

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
	zoneImages,
	resetZoneImages,
	state,
	setState,
	zoom,
	sideSheet,
	searchParams,
	setSnap = () => null,
}) {
	const url = osmFeature?.tags?.website || osmFeature?.tags?.['contact:website']
	const ogImages = useOgImageFetcher(url),
		ogImage = ogImages[url]

	const [tutorials, setTutorials] = useLocalStorage('tutorials', {})
	const introductionRead = tutorials.introduction,
		clickTipRead = tutorials.clickTip
	const wikidata = useWikidata(state)

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
	const versImageURL = wikidata?.pic && toThumb(wikidata?.pic.value)
	const choice = state.vers?.choice
	const category = getCategory(searchParams)

	return (
		<section>
			{!choice && <PlaceSearch {...{ state, setState, sideSheet, setSnap }} />}
			{choice && versImageURL && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{}}
					key={versImageURL}
					exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
				>
					<ImageWithNameWrapper>
						<CityImage
							src={versImageURL}
							alt={`Une photo emblématique de la destination, ${state.vers.choice?.item?.nom}`}
						/>
						<Destination>
							<NextImage src={destinationPoint} alt="Vers" />
							<h2>{state.vers.choice.item.nom}</h2>
						</Destination>
					</ImageWithNameWrapper>
				</motion.div>
			)}
			{zoom > 12 && (
				<QuickFeatureSearch category={category} searchParams={searchParams} />
			)}

			<section
				css={`
					padding-top: 1.6rem;
					position: relative;
				`}
			>
				{(choice || osmFeature) && (
					<ModalCloseButton
						title="Fermer l'encart point d'intéret"
						onClick={() => {
							setOsmFeature(null)
							setLatLngClicked(null)
							resetZoneImages()
						}}
					/>
				)}
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
				<ZoneImages images={zoneImages} />
				{clickedGare ? (
					<div>
						<ModalCloseButton
							title="Fermer l'encart gare"
							onClick={() => clickGare(null)}
						/>
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
		</section>
	)
}
