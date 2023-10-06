'use client'
import styled from 'styled-components'

export const Header = styled.header`
	margin-top: 0rem;
	h1 {
		margin-top: 0;
		margin-bottom: 0;
	}
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
	align-items: center;
	> div {
		margin-left: 1rem;
		max-width: 600px;
	}
	img {
		max-width: 12vw;
		height: auto;
		border-radius: 0.6rem;
	}
	@media (max-width: 800px) {
		img {
			display: none;
		}
		div {
			margin-left: 0;
		}
	}
	a {
		float: right;
	}
	div > p:first-of-type {
		margin-top: 1rem;
	}
`
