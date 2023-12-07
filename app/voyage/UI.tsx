'use client'

import styled from 'styled-components'

export const MapContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #faf5e4;
	> div:last-child {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	> a {
		position: absolute;
		left: 10px;
		bottom: 10px;
		z-index: 999;
	}
	color: var(--darkestColor);
`

export const MapHeader = styled.div`
	position: absolute;
	top: min(2vh, 0.5rem);
	left: min(4vw, 2rem);
	z-index: 10;
	h1 {
		color: ${(p) =>
			p.$style === 'satellite' ? 'white' : 'var(--darkerColor)'};
		border-bottom: 5px solid var(--color);
		display: inline-block;
		padding: 0;
		line-height: 1.8rem;
		margin-top: 1rem;
		@media (max-width: 800px) {
			margin: 0;
			margin-bottom: 0.4rem;
			font-size: 120%;
			border-bottom-width: 2px;
			line-height: 1.2rem;
		}
	}
`

const size = 1.3
export const ModalCloseButton = () => (
	<ModalCloseButtonButton>
		<span>×</span>
	</ModalCloseButtonButton>
)
export const ModalCloseButtonButton = styled.button`
	position: absolute;
	top: -0.2rem;
	right: -0.4rem;
	margin: 0;
	background: var(--darkerColor);
	color: var(--lightestColor);
	border-radius: 2rem;
	font-size: 150%;
	width: ${size}rem;
	height: ${size}rem;
	line-height: ${size}rem;

	text-align: center;
	cursor: pointer;
	padding: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	span {
		margin-top: -0.42rem;
	}
`

export const DialogButton = styled.button`
	background: var(--darkColor);
	color: white;
`
