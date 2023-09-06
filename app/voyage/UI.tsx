'use client'
import styled from 'styled-components'

export const Header = styled.header`
	margin-top: 1rem;
	h1 {
		margin-top: 0;
	}
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	> div {
		margin-left: 2rem;
		max-width: 700px;
	}
	img {
		width: 6vw;
		height: auto;
		border-radius: 0.6rem;
	}
`
