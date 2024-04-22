'use client'

import styled from 'styled-components'

export const PlaceButtonList = styled.ul`
	padding: 0;
	list-style-type: none;
`

export const PlaceButton = styled.li`
	button {
		border-radius: 0.6rem;
		background: var(--color);
		width: 6rem;
		height: 4rem;
		padding: 0.4rem 0;
		color: white;
		> div:first-child  {
			background: white;
			height: 1.8rem;
			width: 1.8rem;
			border-radius: 1rem;
			margin: 0 auto 0.2rem;
			img {
				width: 100%;
				height: 100%;
				padding: 0.25rem;
			}
		}
	}
`
