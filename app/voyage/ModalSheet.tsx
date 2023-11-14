import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'
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
}) {
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
