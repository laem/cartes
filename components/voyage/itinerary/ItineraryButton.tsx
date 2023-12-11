import useItinerary from '@/app/voyage/itinerary/useItinerary'
import Emoji from '@/components/Emoji'
import trashIcon from '@/public/trash.svg'
import Image from 'next/image'
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
					<Emoji e="🚲️" />
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
						img {
							width: 1.4rem;
							height: 1.4rem;
						}
					`}
				>
					<Image src={trashIcon} />
				</button>
			)}
		</MapButton>
	)
}
