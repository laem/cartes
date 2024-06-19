import Image from 'next/image'
import itineraryIcon from '@/public/itinerary-circle-plain.svg'
export default function ClickItineraryInstruction() {
	return (
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
	)
}
