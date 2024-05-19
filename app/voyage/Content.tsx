import useSetSearchParams from '@/components/useSetSearchParams'
import { getThumb } from '@/components/wikidata'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import BookmarkButton from './BookmarkButton'
import Bookmarks from './Bookmarks'
import ClickedPoint from './ClickedPoint'
import { ContentSection, ContentWrapper, ExplanationWrapper } from './ContentUI'
import { FeatureImage } from './FeatureImage'
import OsmFeature from './OsmFeature'
import { PlaceButtonList } from './PlaceButtonsUI'
import PlaceSearch from './PlaceSearch'
import QuickBookmarks from './QuickBookmarks'
import QuickFeatureSearch from './QuickFeatureSearch'
import SetDestination from './SetDestination'
import ShareButton from './ShareButton'
import { DialogButton, ModalCloseButton } from './UI'
import { ZoneImages } from './ZoneImages'
import Explanations from './explanations.mdx'
import Itinerary from './itinerary/Itinerary'
import StyleChooser from './styles/StyleChooser'
import { defaultTransitFilter } from './transport/TransitFilter'
import TransportMap from './transport/TransportMap'
import useOgImageFetcher from './useOgImageFetcher'
import useWikidata from './useWikidata'

const getMinimumQuickSearchZoom = (mobile) => (mobile ? 10.5 : 12) // On a small screen, 70 %  of the tiles are not visible, hence this rule

export default function Content({
	latLngClicked,
	setLatLngClicked,
	clickedGare,
	bikeRoute,
	setBikeRouteProfile,
	bikeRouteProfile,
	clickGare,
	zoneImages,
	bboxImages,
	panoramaxImages,
	resetZoneImages,
	state,
	setState,
	zoom,
	sideSheet, // This gives us the indication that we're on the desktop version, where the Content is on the left, always visible, as opposed to the mobile version where a pull-up modal is used
	searchParams,
	snap,
	setSnap = (snap) => null,
	openSheet = () => null,
	setStyleChooser,
	style,
	styleChooser,
	itinerary,
	transportStopData,
	clickedPoint,
	resetClickedPoint,
	transportsData,
	geolocation,
	focusImage,
	vers,
	osmFeature,
	triggerGeolocation,
}) {
	const url = osmFeature?.tags?.website || osmFeature?.tags?.['contact:website']
	const ogImages = useOgImageFetcher(url),
		ogImage = ogImages[url],
		tagImage = osmFeature?.tags?.image,
		mainImage = tagImage || ogImage // makes a useless request for ogImage that won't be displayed to prefer mainImage : TODO also display OG

	const [tutorials, setTutorials] = useLocalStorage('tutorials', {})
	const introductionRead = tutorials.introduction,
		clickTipRead = true || tutorials.clickTip
	const wikidata = useWikidata(osmFeature, state)

	const setSearchParams = useSetSearchParams()
	useEffect(() => {
		if (!introductionRead) setSnap(1)
	}, [introductionRead, setSnap])

	const wikidataPictureUrl = wikidata?.pictureUrl
	const wikiFeatureImage =
		!tagImage && // We can't easily detect if tagImage is the same as wiki* image
		// e.g.
		// https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Cathédrale Sainte-Croix d'Orléans 2008 PD 33.JPG&width=500
		// https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Cathédrale_Sainte-Croix_d'Orléans_2008_PD_33.JPG/300px-Cathédrale_Sainte-Croix_d'Orléans_2008_PD_33.JPG
		// are the same but with a different URL
		// hence prefer tag image, but this is questionable
		osmFeature &&
		(osmFeature.tags?.wikimedia_commons
			? getThumb(osmFeature.tags.wikimedia_commons, 500)
			: wikidataPictureUrl)

	const recherche = state.findIndex((el) => el == null || el.key == null)

	const content = [
		osmFeature,
		zoneImages,
		bboxImages,
		panoramaxImages,
		!clickTipRead,
		clickedPoint,
		searchParams.gare,
	]

	const hasContent = content.some((el) =>
		el != null && Array.isArray(el) ? el.length > 0 : el
	)

	const showContent =
		hasContent &&
		// treat the case click on a OSM feature -> feature card -> click on "go
		// there" -> it's ok to keep the card -> click on origin -> state.length ===
		// 2 -> useless destination card
		// Note : what we wanted to do would need a filter(Boolean), but in practice
		// removing the card after the destination click is good too
		!(state.length >= 2)

	console.log('onglets', state)

	const bookmarkable = clickedPoint || osmFeature // later : choice

	const hasDestination = osmFeature || clickedPoint

	const showSearch =
		!styleChooser &&
		(recherche > -1 || !(osmFeature || itinerary.itineraryMode)) // at first, on desktop, we kept the search bar considering we have room. But this divergence brings dev complexity

	const minimumQuickSearchZoom = getMinimumQuickSearchZoom(!sideSheet)

	useEffect(() => {
		if (clickedPoint) {
			setSnap(1, 'Content')
		}
	}, [clickedPoint, setSnap])

	useEffect(() => {
		if (!showSearch) return
		if (snap === 3)
			if (zoom > minimumQuickSearchZoom) {
				setSnap(2, 'Content')
			}
	}, [showSearch, zoom, snap])

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
		<ContentWrapper>
			{showSearch && (
				<section>
					<PlaceSearch
						{...{
							state,
							setState,
							sideSheet,
							setSnap,
							zoom,
							setSearchParams,
							searchParams,
							autoFocus: recherche != null,
							stepIndex: recherche,
							geolocation,
							triggerGeolocation,
						}}
					/>
					{/* TODO reuse the name overlay and only that ?
					wikidataPictureUrl && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{}}
							key={wikidataPictureUrl}
							exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
						>
							<ImageWithNameWrapper>
								<CityImage
									src={wikidataPictureUrl}
									alt={`Une photo emblématique de la destination, ${state.vers.choice?.name}`}
								/>
								<Destination>
									<NextImage src={destinationPoint} alt="Vers" />
									<h2>{osmFeature.tags.name}</h2>
								</Destination>
							</ImageWithNameWrapper>
						</motion.div>
					)
					*/}
					{zoom > minimumQuickSearchZoom && (
						<QuickFeatureSearch
							{...{
								searchParams,
								searchInput: vers?.inputValue,
								setSnap,
							}}
						/>
					)}
					{searchParams.favoris !== 'oui' &&
						searchParams.transports !== 'oui' && (
							<QuickBookmarks oldAllez={searchParams.allez} />
						)}
				</section>
			)}

			{searchParams.favoris === 'oui' && <Bookmarks />}
			{searchParams.transports === 'oui' && (
				<TransportMap
					{...{
						day: searchParams.day,
						data: transportsData,
						selectedAgency: searchParams.agence,
						routesParam: searchParams.routes,
						stop: searchParams.arret,
						trainType: searchParams['type de train'],
						transitFilter: searchParams['filtre'] || defaultTransitFilter,
					}}
				/>
			)}

			<Itinerary
				{...{
					itinerary,
					bikeRouteProfile,
					setBikeRouteProfile,
					searchParams,
					setSnap,
					close: () => {
						setSearchParams({ allez: undefined, mode: undefined })
						itinerary.setItineraryMode(false)
					},
					state,
				}}
			/>

			{styleChooser ? (
				<StyleChooser {...{ setStyleChooser, style, setSnap }} />
			) : (
				showContent && (
					<ContentSection>
						{osmFeature && (
							<ModalCloseButton
								title="Fermer l'encart point d'intéret"
								onClick={() => {
									console.log('will yo')
									setSearchParams({ allez: undefined })
									setLatLngClicked(null)
									resetZoneImages()
									console.log('will set default stat')
									openSheet(false)
								}}
							/>
						)}
						{mainImage && (
							<FeatureImage
								src={mainImage}
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
						{wikiFeatureImage && (
							<FeatureImage
								src={wikiFeatureImage}
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
							zoneImages={bboxImages || zoneImages} // bbox includes zone, usually
							panoramaxImages={panoramaxImages}
							focusImage={focusImage}
						/>
						{(hasDestination || bookmarkable) && (
							<PlaceButtonList>
								{hasDestination && (
									<SetDestination
										clickedPoint={clickedPoint}
										geolocation={geolocation}
										searchParams={searchParams}
									/>
								)}
								{bookmarkable && (
									<BookmarkButton
										clickedPoint={clickedPoint}
										osmFeature={osmFeature}
									/>
								)}
								{bookmarkable && (
									<ShareButton {...{ clickedPoint, osmFeature }} />
								)}
							</PlaceButtonList>
						)}
						{osmFeature ? (
							<OsmFeature
								data={osmFeature}
								transportStopData={transportStopData}
							/>
						) : clickedPoint ? (
							<>
								<ModalCloseButton
									title="Fermer l'encart point d'intéret"
									onClick={() => {
										resetClickedPoint()
									}}
								/>
								<ClickedPoint
									clickedPoint={clickedPoint}
									geolocation={geolocation}
								/>
							</>
						) : (
							!clickTipRead && (
								<div>
									<p
										css={`
											max-width: 20rem;
										`}
									>
										Cliquez sur un point d'intérêt ou saisissez une destination
										puis explorez les gares autour.
									</p>
									<DialogButton
										onClick={() =>
											setTutorials({ ...tutorials, clickTip: true })
										}
									>
										OK
									</DialogButton>
								</div>
							)
						)}
					</ContentSection>
				)
			)}
		</ContentWrapper>
	)
}
