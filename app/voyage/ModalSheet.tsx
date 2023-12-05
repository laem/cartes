import css from '@/components/css/convertToJs'
import { useState } from 'react'
import Sheet from 'react-modal-sheet'
import styled from 'styled-components'
import Content from './Content'

const popSize = 6
export default function ModalSheet(props) {
	const [isOpen, setOpen] = useState(true)
	if (!isOpen)
		return (
			<div
				style={css(`
					background: red;
					position: fixed;
					bottom: -${popSize / 2}rem;
					left: -${popSize / 2}rem;
					background: var(--lightestColor);
					width: ${popSize}rem;
					height: ${popSize}rem;
					border-radius: ${popSize}rem;
					border: 2px solid var(--color);
					box-shadow:rgba(0, 0, 0, 0.3) 0px -2px 16px;
					cursor: pointer;
				`)}
				onClick={() => setOpen(true)}
			>
				UP
			</div>
		)

	return (
		<CustomSheet
			isOpen={isOpen}
			onClose={() => {
				setOpen(false)
			}}
			snapPoints={[-50, 0.5, 100]}
			initialSnap={2}
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
							<Content {...props} />
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
