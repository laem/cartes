'use client'
import styled from 'styled-components'

export const StyledReferences = styled.ul`
	list-style: none;
	padding-left: 0.6rem;
	a {
		flex: 1;
		min-width: 45%;
		text-decoration: none;
		margin-right: 1rem;
	}
	li {
		margin-bottom: 0.6em;
		width: 100%;
		display: flex;
		align-items: center;
	}
	.imageWrapper {
		width: 4.5rem;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
	}
	img {
		max-height: 3rem;
		vertical-align: sub;
		max-width: 100%;
		border-radius: 0.3em;
	}
`
