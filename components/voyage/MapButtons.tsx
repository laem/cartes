'use client'

import useMeasureDistance from '@/app/voyage/useMeasureDistance'
import Link from 'next/link'
import styled from 'styled-components'
import Emoji from '../Emoji'
import useSetSeachParams from '../useSetSearchParams'

export const MapButtonsWrapper = styled.div`
	position: fixed;
	bottom: 0.4rem;
	left: 0.4rem;
	z-index: 1;
	display: flex;
	align-items: center;
`
export const MapButton = styled.div`
	margin-right: 0.4rem;
	width: 4.5rem;
	height: 4rem;
	text-align: center;
	border-radius: 0.4rem;
	border: 4px solid white;
	padding: 0;
	background: white;
	opacity: 0.8;
	img {
		width: 1.5rem;
		height: auto;
	}
	border: 2px solid var(--lighterColor);
	cursor: pointer;
	${(p) => p.$active && `border: 2px solid var(--color)`}
	position: relative;
	> button:first-child {
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
`

export default function MapButtons({
	style,
	setDistanceMode,
	map,
	distanceMode,
}) {
	const setSearchParams = useSetSeachParams()
	const [distance, resetDistance] = useMeasureDistance(map, distanceMode)
	return (
		<MapButtonsWrapper>
			<MapButton>
				<Link
					href={setSearchParams(
						{ style: style === 'satellite' ? 'streets' : 'satellite' },
						true,
						false
					)}
				>
					{style === 'streets' ? (
						<div>
							<Emoji e="🛰️" />
							<div>Satellite</div>
						</div>
					) : (
						<div>
							<Emoji e="🗺️" />
							<div>Carte</div>
						</div>
					)}
				</Link>
			</MapButton>
			<MapButton $active={distanceMode}>
				<button onClick={() => setDistanceMode(!distanceMode)}>
					<div>
						<Emoji e="📐" />
					</div>
					{distanceMode ? <small>{distance}</small> : <span>Distance</span>}
				</button>
				{distanceMode && (
					<button
						onClick={() => resetDistance()}
						css={`
							position: absolute;
							top: -1rem;
							right: -1.1rem;
							img {
								width: 1.8rem;
								height: 1.8rem;
							}
						`}
					>
						<Emoji e="🚮" />
					</button>
				)}
			</MapButton>
		</MapButtonsWrapper>
	)
}
