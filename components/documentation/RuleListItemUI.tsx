'use client'
import styled from 'styled-components'

export const Item = styled.li`
	margin: 0.4rem 0;
	padding: 0.6rem 0.6rem;
	border-bottom: 1px solid var(--darkerColor);
	> small {
		display: block;
	}
	a {
		text-decoration: none;
	}
	span {
		margin-right: 0.6rem;
	}
`

export const NamespaceList = styled.ul`
	list-style-type: none;
`

export const InlineSmall = styled.small`
	margin: 0 0.4rem;
	display: inline-block;
	color: var(--lighterColor);
	font-size: 90%;
`
