import { useEffect, useState } from 'react'
import Sheet from 'react-modal-sheet'
import styled from 'styled-components'
import Content from './Content'
import ModalSheetReminder from './ModalSheetReminder'

export default function ModalSheet(props) {
	console.log('render modal sheet', props)
	const [isOpen, setOpen] = useState(true)
	const [initialSnap, setInitialSnap] = useState(2)
	useEffect(() => {
		if (props.osmFeature) {
			setOpen(true)
			setInitialSnap(1)
		}
	}, [setInitialSnap, props.osmFeature])
	if (!isOpen) return <ModalSheetReminder setOpen={setOpen} />

	return (
		<CustomSheet
			isOpen={isOpen}
			onClose={() => {
				setOpen(false)
			}}
			snapPoints={[-50, 0.5, 200]}
			initialSnap={initialSnap}
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
					<Sheet.Scroller draggableAt="both">
						<SheetContentWrapper>
							<Content
								{...props}
								sideSheet={false}
								setSnap={setInitialSnap}
								openSheet={setOpen}
							/>
						</SheetContentWrapper>
					</Sheet.Scroller>
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
	padding: 0rem 0.6rem;
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
		height: 1rem !important;
	}
	.react-modal-sheet-drag-indicator {
		/* custom styles */
	}
	.react-modal-sheet-content {
		/* custom styles */
	}
	color: var(--darkestColor);
`
