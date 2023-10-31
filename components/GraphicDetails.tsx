'use client'

import { styled } from 'styled-components'

export default styled.details`
	summary {
		list-style-type: none;
		cursor: pointer;
	}
	summary::-webkit-details-marker {
		display: none;
	}
`
