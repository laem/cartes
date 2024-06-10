import { useEffect, useState } from 'react'
import { Drawer } from 'vaul'
import Content from './Content'
import ModalSheetReminder from './ModalSheetReminder'
import styled from 'styled-components'

const snapPoints = [0, '100px', '150px', 0.5, 1]
//const snapPoints = [-50, 0.5, 150, 100, 0],
const initialSnap = 0.5

export default function ModalSheet(props) {
	const [snap, setSnap] = useState<number | string | null>(initialSnap)
	console.log('snapp', snap)
	const setSnapIndex = (index) => setSnap(snapPoints[index])

	const { osmFeature, styleChooser, searchParams } = props
	const bookmarksView = searchParams.favoris === 'oui'

	useEffect(() => {
		if (!osmFeature && !styleChooser && !bookmarksView) return

		const timeout = () => {
			setSnapIndex(1)
		}
		setTimeout(timeout, 400)

		return () => {
			clearTimeout(timeout)
		}
	}, [setSnap, osmFeature, styleChooser, bookmarksView])

	const isOpen = snap !== 0
	return (
		<Drawer.Root
			snapPoints={snapPoints}
			activeSnapPoint={snap}
			setActiveSnapPoint={setSnap}
			modal={false}
			open={true}
		>
			{!isOpen && <ModalSheetReminder />}

			<Drawer.Portal container={document.querySelector('main')}>
				<Drawer.Content
					css={`
						background: var(--lightestColor2);
						height: 100%;
						display: flex;
						flex-direction: column;
						padding: 0rem 0.6rem;
					`}
				>
					<Drawer.Handle
						css={`
							background: var(--lighterColor);
							margin: 0.5rem auto;
						`}
					/>
					<Content
						{...props}
						sideSheet={false}
						snap={snap}
						setSnap={(index) => setSnapIndex(index)}
						openSheet={() => setSnapIndex(initialSnap)}
					/>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
const SheetContentWrapper = styled.div``
