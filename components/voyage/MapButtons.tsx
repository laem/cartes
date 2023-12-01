'use client'

import styled from 'styled-components'

export const MapButtons = styled.div`
	position: fixed;
	bottom: 0.4rem;
	left: 0.4rem;
	z-index: 1;
	display: flex;
	align-items: center;
`
export const MapButton = styled.button`
	margin-right: 0.4rem;
	width: 4.5rem;
	height: 4rem;
	text-align: center;
	border-radius: 0.4rem;
	border: 4px solid white;
	padding: 0;
	background: white;
	opacity: 0.8;
	img {
		width: 1.5rem;
		height: auto;
	}
	border: 2px solid var(--lighterColor);
`
