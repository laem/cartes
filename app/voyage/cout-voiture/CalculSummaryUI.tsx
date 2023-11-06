'use client'
import styled from 'styled-components'

export const CalculSummaryWrapper = styled.div`
	width: 100%;
	text-align: left;
	> ul {
		list-style-type: none;
	}
	${(p) =>
		p.$horizontal &&
		`
		> ul {
    display: flex;
	justify-content: space-evenly;
  min-width: 40rem;
	}
	overflow-x: auto;
  white-space: nowrap;
	`}

	summary > h4 {
		display: inline;
	}
`
