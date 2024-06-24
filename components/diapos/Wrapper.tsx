'use client'

import styled from 'styled-components'

export const DiapoWrapper = styled.div`
	> section {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		justify-content: center;
		border-bottom: 1px solid var(--lightestColor);
	}

	h2,
	h3 {
		font-size: 400%;
		display: inline-block;
		margin: 4rem 0;
	}
`
