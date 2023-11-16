import Sheet from 'react-modal-sheet'
import styled from 'styled-components'
import Content from './Content'

export default function ModalSheet({
	isSheetOpen,
	setSheetOpen,
	clickedGare,
	bikeRoute,
	osmFeature,
	latLngClicked,
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
						<Content
							{...{
								clickedGare,
								bikeRoute,
								osmFeature,
								latLngClicked,
							}}
						/>
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
