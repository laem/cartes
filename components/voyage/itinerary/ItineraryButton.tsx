import useItinerary from '@/app/voyage/itinerary/useItinerary'
import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import { MapButton } from '../MapButtons'

export default function ItineraryButton({
	setItineraryMode,
	itineraryMode,
	distance,
	reset,
}) {
	return (
		<MapButton $active={itineraryMode}>
			<button onClick={() => setItineraryMode(!itineraryMode)}>
				<div>
					<ItineraryIcon />
				</div>
				{itineraryMode ? <small>{distance}</small> : null}
			</button>
			{itineraryMode && (
				<button
					onClick={() => reset()}
					css={`
						position: absolute;
						bottom: -1.2rem;
						right: -1.7rem;
					`}
				>
					<ResetIcon />
				</button>
			)}
		</MapButton>
	)
}

export const ItineraryIcon = () => (
	<img
		style={css`
			width: 1.4rem;
			height: 1.4rem;
			margin: 0 !important;
		`}
		src={'/itinerary.svg'}
		width="100"
		height="100"
		alt="Icône itinéraire"
	/>
)
export const ResetIcon = () => (
	<img
		style={css`
			width: 1.4rem;
			height: 1.4rem;
		`}
		src={'/trash.svg'}
		width="100"
		height="100"
		alt="Icône poubelle"
	/>
)
