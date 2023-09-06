'use client'
import styled from 'styled-components'

export const Header = styled.header`
	margin-top: 1rem;
	h1 {
		margin-top: 0;
	}
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	align-items: center;
	> div {
		margin-left: 2rem;
		max-width: 600px;
	}
	img {
		max-width: 6vw;
		height: auto;
		border-radius: 0.6rem;
	}
`

export const Sources = styled.aside`
	margin-top: 6rem;
	hr {
		opacity: 0.3;
		color: var(--lightColor);
	}
`
