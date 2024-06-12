import React, {
	type TouchEvent,
	type UIEvent,
	forwardRef,
	useState,
	useEffect,
} from 'react'

import { useSheetScrollerContext } from './context'
import { type SheetScrollerProps } from './types'
import { isTouchDevice } from './utils'
import styles from './styles'

const SheetScroller = forwardRef<any, SheetScrollerProps>(
	({ draggableAt = 'top', children, style, className = '', ...rest }, ref) => {
		const sheetScrollerContext = useSheetScrollerContext()

		const [dragging, setDragging] = useState(false)

		function determineDragState(element: HTMLDivElement) {
			const { scrollTop, scrollHeight, clientHeight } = element
			const isScrollable = scrollHeight > clientHeight

			if (!isScrollable) return

			const isAtTop = scrollTop <= 0
			const isAtBottom = scrollHeight - scrollTop === clientHeight

			const shouldEnable =
				(draggableAt === 'top' && isAtTop) ||
				(draggableAt === 'bottom' && isAtBottom) ||
				(draggableAt === 'both' && (isAtTop || isAtBottom))

			if (shouldEnable) {
				sheetScrollerContext.setDragEnabled()
			} else {
				sheetScrollerContext.setDragDisabled()
			}
		}

		function onScroll(e: UIEvent<HTMLDivElement>) {
			console.log('sheet', e)
			determineDragState(e.currentTarget)
		}

		function onTouchStart(e: TouchEvent<HTMLDivElement>) {
			determineDragState(e.currentTarget)
		}
		function onTouchEnd(e: TouchEvent<HTMLDivElement>) {
			//determineDragState(e.currentTarget)
		}

		const scrollProps = isTouchDevice()
			? { onScroll, onTouchStart, onTouchEnd }
			: undefined

		/* not working https://github.com/bevacqua/dragula/issues/487
		useEffect(() => {
			if (!ref) return

			ref.current.addEventListener(
				'touchmove',
				function (e) {
					console.log('ploptouchmove')
					e.preventDefault()
				},
				{ passive: false }
			)
		}, [ref])
		*/

		return (
			<div
				{...rest}
				ref={ref}
				className={`react-modal-sheet-scroller ${className}`}
				style={{
					...styles.scroller,
					...style,
				}}
				{...scrollProps}
			>
				{children}
			</div>
		)
	}
)

SheetScroller.displayName = 'SheetScroller'

export default SheetScroller
