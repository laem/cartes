'use client'
import styled from 'styled-components'

export const CalculSummaryWrapper = styled.ul`
	width: 100%;
	list-style-type: none;
	${(p) =>
		p.$horizontal &&
		`
    display: flex;
	justify-content: space-evenly;
	`}
`
