import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { toThumb } from '@/components/wikidata'
import { useEffect, useState } from 'react'
import Sheet from 'react-modal-sheet'
import styled from 'styled-components'
import BikeRouteRésumé from './BikeRouteRésumé'
import { createSearchBBox } from './createSearchPolygon'
import GareInfo from './GareInfo'
import OsmFeature from './OsmFeature'

export default function ModalSheet({
	isSheetOpen,
	setSheetOpen,
	clickedGare,
	bikeRoute,
	osmFeature,
	latLngClicked,
}) {
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
		<CustomSheet
			isOpen={isSheetOpen}
			onClose={() => setSheetOpen(false)}
			snapPoints={[-50, 0.5, 100, 0]}
			initialSnap={1}
			mountPoint={document.querySelector('main')}
		>
			<Sheet.Container
				css={`
					background-color: var(--lightestColor) !important;
				`}
			>
				<Sheet.Header
					css={`
						span {
							background-color: var(--lighterColor) !important;
						}
					`}
				/>
				<Sheet.Content>
					<SheetContentWrapper>
						{imageUrls.length > 0 && (
							<ul
								css={`
									--shadow-color: 210deg 28% 58%;
									--shadow-elevation-medium: 0.3px 0.5px 0.7px
											hsl(var(--shadow-color) / 0.36),
										0.8px 1.6px 2px -0.8px hsl(var(--shadow-color) / 0.36),
										2.1px 4.1px 5.2px -1.7px hsl(var(--shadow-color) / 0.36),
										5px 10px 12.6px -2.5px hsl(var(--shadow-color) / 0.36);

									margin: 0 0 1.4rem 0;
									display: flex;
									list-style-type: none;

									li {
										padding: 0;
										margin: 0 0.4rem;
									}
									img {
										box-shadow: var(--shadow-elevation-medium);
										height: 6rem;
										width: auto;
										border-radius: 0.3rem;
									}
								`}
							>
								{imageUrls.map((url) => (
									<li key={url}>
										<img src={url} />
									</li>
								))}
							</ul>
						)}
						{osmFeature ? (
							<OsmFeature data={osmFeature} />
						) : clickedGare ? (
							<div
								css={`
									@media (min-width: 1200px) {
										display: flex;
										justify-content: space-evenly;
									}
								`}
							>
								{bikeRoute && <BikeRouteRésumé data={bikeRoute} />}
								<GareInfo clickedGare={clickedGare} />
							</div>
						) : (
							<p>Cliquez sur une gare pour obtenir ses horaires.</p>
						)}
					</SheetContentWrapper>
				</Sheet.Content>
			</Sheet.Container>
			<Sheet.Backdrop />
		</CustomSheet>
	)
}
const SheetContentWrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	padding: 16px;
`
const CustomSheet = styled(Sheet)`
	.react-modal-sheet-backdrop {
		background-color: unset !important;
	}
	.react-modal-sheet-container {
		/* custom styles */
	}
	.react-modal-sheet-header {
		/* custom styles */
	}
	.react-modal-sheet-drag-indicator {
		/* custom styles */
	}
	.react-modal-sheet-content {
		/* custom styles */
	}
	color: var(--darkestColor);
`
