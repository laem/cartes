import * as animate from 'Components/ui/animate'
import FocusTrap from 'focus-trap-react'
import { PageInfo } from 'iframe-resizer'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

type OverlayProps = React.HTMLAttributes<HTMLDivElement> & {
	onClose?: () => void
	xPosition?: number
	children: React.ReactNode
}

export default function Overlay({
	onClose,
	children,
	className,
	...otherProps
}: OverlayProps) {
	useEffect(() => {
		const body = document.getElementsByTagName('body')[0]
		body.classList.add('no-scroll')
		return () => {
			body.classList.remove('no-scroll')
		}
	}, [])
	return (
		<StyledOverlayWrapper>
			<div className="overlayContent">
				<animate.fromBottom>
					<FocusTrap
						focusTrapOptions={{
							onDeactivate: onClose,
							clickOutsideDeactivates: !!onClose,
						}}
					>
						<div
							aria-modal="true"
							className={'ui__ card  ' + className ?? ''}
							{...otherProps}
						>
							{children}
							{onClose && (
								<button
									aria-label="Fermer"
									onClick={onClose}
									className="overlayCloseButton"
								>
									×
								</button>
							)}
						</div>
					</FocusTrap>
				</animate.fromBottom>
			</div>
		</StyledOverlayWrapper>
	)
}

const StyledOverlayWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 30;
	max-height: 100vh;
	width: 100vw;
	@media (max-width: 800px) {
		width: 100vw;
		top: 0;
		left: 0;
		height: calc(100vh - 4rem);
		.overlayContent {
			transform: none;
			max-height: calc(100vh - 4rem);
			overflow: scroll;
		}
	}
	@media (min-width: 800px) {
		.overlayCloseButton {
			top: 0;
			bottom: auto;
			font-size: 2rem;
		}
		.overlayContent {
			position: absolute;
			transform: translateX(-50%);
			left: 50%;
			width: 80%;
			bottom: auto;
			height: auto;
			max-width: 40em;
			min-height: 6em;
			margin-top: 8rem;
		}
		.ui__.card[aria-modal='true'] {
			padding-bottom: 2rem;
			margin-bottom: 2rem;
		}
	}
	background: rgba(0, 0, 0, 0.5);
	overflow: auto;
	.overlayCloseButton {
		position: absolute;
		top: 0rem;
		text-decoration: none;
		font-size: 3rem;
		color: rgba(0, 0, 0, 0.6);
		color: var(--lighterTextColor);
		padding: 0 0.5rem;
		right: 0;
	}
	.ui__.card[aria-modal='true'] {
		padding-bottom: 4rem;
		display: flex;
		flex-direction: column;
	}
`
