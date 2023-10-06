'use client'

import { useSelector } from 'react-redux'
import styled from 'styled-components'
import FriendlyObjectViewer from '../FriendlyObjectViewer'
import { Circle } from './DocumentationStyle'

export default function ExempleHeader() {
	const exemple = useSelector((state) => state.exemple)

	if (!exemple) return <Wrapper />

	return (
		<Wrapper>
			<details>
				<summary>
					<Circle $clicked />
					{exemple.titre}
				</summary>
				<div
					css={`
						> div {
							margin: 0.8rem 4rem 1.6rem;
						}
					`}
				>
					<FriendlyObjectViewer data={exemple.situation} />
				</div>
			</details>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	min-height: 2.2rem;
	details {
	}
	summary {
		display: flex;
		align-items: center;
		cursor: pointer;
		justify-content: end;
	}
`
