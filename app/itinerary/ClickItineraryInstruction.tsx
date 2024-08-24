import Image from 'next/image'
import itineraryIcon from '@/public/itinerary-circle-plain.svg'

export default function ClickItineraryInstruction({ state }) {
	const stepKeys = state?.map((step) => step != null),
		validSteps = stepKeys.filter(Boolean),
		stepsCount = validSteps.length

	console.log('cyan steps', state)
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
			{stepsCount === 0 ? (
				<p>
					Saisissez votre destination, <br />
					ou 📍 cliquez sur la carte pour définir le départ.
				</p>
			) : state.length === 2 && !stepKeys[0] ? (
				<p>
					Saisissez votre départ, <br />
					ou 📍 cliquez sur la carte pour le définir.
				</p>
			) : stepsCount === 1 ? (
				<p>
					Saisissez votre destination, <br />
					ou 📍 cliquez sur la carte pour la définir.
				</p>
			) : null}
		</div>
	)
}
