import { useCallback, useEffect, useRef, useState } from 'react'
import Sheet, { SheetRef } from 'react-modal-sheet'
import styled from 'styled-components'
import Content from './Content'
import ModalSheetReminder from './ModalSheetReminder'

const snapPoints = [-50, 0.5, 200, 0],
	initialSnap = 2

export default function ModalSheet(props) {
	const [isOpen, setOpen] = useState(true)
	const ref = useRef<SheetRef>()
	const setSnap = useCallback(
		(i: number) => {
			console.log('snapp to ' + i)

			ref.current?.snapTo(i)
		},
		[ref]
	)

	useEffect(() => {
		if (props.osmFeature) {
			setSnap(1)
		}
	}, [setSnap, props.osmFeature])
	if (!isOpen) return <ModalSheetReminder setOpen={setOpen} />

	return (
		<CustomSheet
			ref={ref}
			isOpen={isOpen}
			onClose={() => {
				setOpen(false)
			}}
			snapPoints={snapPoints}
			initialSnap={initialSnap}
			mountPoint={document.querySelector('main')}
			onSnap={(snapIndex) =>
				console.log('> Current snap point index:', snapIndex)
			}
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
								setSnap={setSnap}
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
		height: 2.6rem !important;
	}
	.react-modal-sheet-drag-indicator {
		/* custom styles */
	}
	.react-modal-sheet-content {
		/* custom styles */
	}
	color: var(--darkestColor);
`
