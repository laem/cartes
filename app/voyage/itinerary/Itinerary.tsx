import { useEffect } from 'react'
import BikeRouteRésumé from '../BikeRouteRésumé'
import { ContentSection } from '../ContentUI'
import { ModalCloseButton } from '../UI'
import Steps from './Steps'
import Transit from './Transit'
import Image from 'next/image'
import itineraryIcon from '@/public/itinerary-circle-plain.svg'
import Link from 'next/link'
import CircularIcon from '@/components/CircularIcon'
import useSetSearchParams from '@/components/useSetSearchParams'

export const modes = [
	['cycling', { label: 'vélo' }],
	['walking', { label: 'marche' }],
	['transit', { label: 'Transports' }],
]

export default function Itinerary({
	itinerary,
	bikeRouteProfile,
	setBikeRouteProfile,
	searchParams,
	close,
	state,
	setSnap,
}) {
	const setSearchParams = useSetSearchParams()

	const mode = searchParams.mode

	useEffect(() => {
		setSnap(1, 'Itinerary')
	}, [setSnap])

	if (!itinerary.itineraryMode) return null
	return (
		<ContentSection css="margin-bottom: 1rem">
			<ModalCloseButton title="Fermer l'encart itinéraire" onClick={close} />
			<Steps state={state} />
			{!itinerary.routes ? (
				<div
					css={`
						margin: 1rem 0;

						text-align: center;
						img {
							width: 1.2rem;
							height: auto;
							margin-right: 0.6rem;
						}
					`}
				>
					<Image
						src={itineraryIcon}
						alt="Icone flèche représentant le mode itinéraire"
					/>
					<p>Cliquez sur la carte pour construire un itinéraire.</p>
				</div>
			) : (
				<div>
					<ol
						css={`
							list-style-type: none;
							display: flex;
							align-items: center;
							justify-content: space-evenly;
							li {
								margin: 0 0.4rem;
							}
						`}
					>
						{modes.map(([key, { label }]) => (
							<li key={key}>
								<Link
									href={setSearchParams(
										{ mode: mode === key ? undefined : key },
										true
									)}
									title={label}
								>
									<CircularIcon
										src={`/${key}.svg`}
										alt={'Icône représentant le mode ' + label}
										background={
											mode !== key ? 'lightgrey' : 'var(--lightColor)'
										}
									/>
								</Link>
							</li>
						))}
					</ol>
					{['cycling', 'walking'].includes(mode) && (
						<BikeRouteRésumé
							{...{
								mode,
								data: itinerary.routes[mode],
								bikeRouteProfile,
								setBikeRouteProfile,
							}}
						/>
					)}
					{mode === 'transit' && (
						<Transit
							data={{
								...itinerary.routes.transit,
								date: itinerary.date,
								setDate: itinerary.setDate,
							}}
							searchParams={searchParams}
						/>
					)}
				</div>
			)}
		</ContentSection>
	)
}
