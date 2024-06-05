import { useEffect } from 'react'
import BikeRouteRésumé from '../BikeRouteRésumé'
import { ContentSection } from '../ContentUI'
import { ModalCloseButton } from '../UI'
import Steps from './Steps'
import Transit from './transit/Transit'
import Image from 'next/image'
import itineraryIcon from '@/public/itinerary-circle-plain.svg'
import Link from 'next/link'
import CircularIcon from '@/components/CircularIcon'
import useSetSearchParams from '@/components/useSetSearchParams'
import Timeline from './Timeline'

export const modes = [
	['cycling', { label: 'Vélo', query: 'velo' }],
	['transit', { label: 'Transports', query: 'commun' }],
	['walking', { label: 'Marche', query: 'marche' }],
	['car', { label: 'Voiture', query: 'voiture' }],
]

export const modeKeyFromQuery = (myQuery) =>
	(modes.find(([, { query }]) => query === myQuery) || [])[0]

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

	const mode = modeKeyFromQuery(searchParams.mode)

	useEffect(() => {
		setSnap(1, 'Itinerary')
	}, [setSnap])

	if (!itinerary.isItineraryMode) return null
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
						{[
							[
								undefined,
								{
									label: 'résumé',
									icon: 'frise',
									description: "Toutes les options en un clin d'oeuil",
								},
							],
							...modes,
						].map(([key, { label, icon, description, query }]) => (
							<li key={key || 'undefined'}>
								<Link
									href={setSearchParams(
										{ mode: mode === key ? undefined : query },
										true
									)}
									title={description || label}
								>
									<CircularIcon
										src={`/${key || icon}.svg`}
										alt={'Icône représentant le mode ' + label}
										background={
											mode !== key ? 'var(--lighterColor)' : 'var(--color)'
										}
									/>
								</Link>
							</li>
						))}
					</ol>
					{mode === undefined && <Timeline itinerary={itinerary} />}
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
						<Transit itinerary={itinerary} searchParams={searchParams} />
					)}
				</div>
			)}
		</ContentSection>
	)
}
