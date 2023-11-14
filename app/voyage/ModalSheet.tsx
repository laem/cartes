import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
import { useEffect } from 'react'
import Sheet from 'react-modal-sheet'
import styled from 'styled-components'
import BikeRouteRésumé from './BikeRouteRésumé'
import GareInfo from './GareInfo'
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
			const diff = 0.000002
			const { lat1, lng1 } = latLngClicked,
				lat2 = lat1 + diff,
				lng2 = lng1 + diff

			const url = `https://commons.wikimedia.org/w/api.php?action=query&list=geosearch&gsbbox=${lat1}|${lng1}|${lat2}|${lng2}&gsnamespace=6&gslimit=500&format=json&_=1699996741238`
			const request = await fetch(url)
			const json = await request.json()
			const images = json.query.geosearch
			setWikimedia(images)
		}
		makeRequest()
	}, [latLngClicked])

	const imageUrls = wikimedia.map((json) => {
		const title = json.title.split('File:')[1],
			encodedTitle = title.replace(/\s/g, '_'),
			url = `azd`
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
						{osmFeature ? (
							<div css={``}>
								<FriendlyObjectViewer data={osmFeature.tags} />
							</div>
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
`
