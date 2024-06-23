'use client'

import closeIcon from '@/public/close.svg'
import Image from 'next/image'
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

export const ContentWrapper = styled.div`
	position: absolute;
	top: min(2vh, 0.5rem);
	left: min(4vw, 2rem);
	z-index: 10;
`

const size = 1.3
export const ModalCloseButton = (props) => (
	<ModalCloseButtonButton {...props}>
		<Image src={closeIcon} alt="Fermer" />
	</ModalCloseButtonButton>
)
export const ModalCloseButtonButton = styled.button`
	position: absolute;
	top: 0rem;
	right: 0rem;
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
	> img {
		width: 1;
		margin: 0;
	}
`

export const DialogButton = styled.button`
	background: var(--darkColor);
	color: white;
`
