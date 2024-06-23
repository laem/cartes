'use client'

import styled from 'styled-components'

export const PresentationWrapper = styled.div`
	max-width: 700px;
	margin: 8vh auto;
	header {
		text-align: center;
		h2 {
			font-size: 300%;
			line-height: 3.4rem;
			margin-top: 0;
		}
		h1 {
			margin-bottom: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			img {
				width: 1.4rem;
				height: auto;
				margin-right: 0.4rem;
				margin-bottom: -0.1rem;
			}
			color: #2988e6;
		}
	}
`

export const WebStore = styled.div`
	a {
		text-decoration: none;
		margin: 0 auto;
		background: var(--darkestColor);
		border-radius: 0.6rem;
		display: flex;
		align-items: center;
		width: 10rem;
		height: 2.8rem;
		color: white;
		img {
			width: 2.4rem;
			height: auto;
			margin-right: 0.6rem;
			margin-left: 0.6rem;
		}
		> div {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			small {
				margin-top: -0.2rem;
				font-size: 70%;
			}
			div {
				font-size: 150%;
				line-height: 1rem;
			}
		}
	}
`
