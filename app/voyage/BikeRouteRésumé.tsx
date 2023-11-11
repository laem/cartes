import Emoji from '@/components/Emoji'

export default function BikeRouteRésumé({ data }) {
	if (!data.features) return
	const feature = data.features[0]
	if (!feature) return

	const seconds = feature.properties['total-time'],
		distance = feature.properties['track-length'],
		km = Math.round(distance / 1000),
		date = new Date(1000 * seconds).toISOString().substr(11, 8).split(':'),
		heures = +date[0],
		minutes = date[1]

	const déniveléCumulé = feature.properties['filtered ascend']
	const dénivelé = feature.properties['plain-ascend']
	return (
		<div
			css={`
				display: flex;
				align-items: center;
				background: var(--lightestColor);
				padding: 0.6rem;
				max-width: 20rem;
				color: var(--darkestColor);
				line-height: 1.4rem;
				border: 5px solid var(--color);
				img {
					margin-right: 0.4rem;
					width: 2.5rem;
					height: auto;
				}
				@media (min-width: 1200px) {
					margin-top: 6rem;
					max-width: 35rem;
					height: 6rem;
				}
			`}
		>
			<Emoji e="🚲️" />
			<p>
				Le trajet de <strong>{km} km</strong> depuis la gare vous prendra{' '}
				<strong>
					{heures ? heures + ` heure${heures > 1 ? 's' : ''} et ` : ''}
					{minutes} minutes
				</strong>{' '}
				pour <strong>{déniveléCumulé} m de dénivelé cumulé</strong> et{' '}
				{dénivelé} m en absolu.
			</p>
		</div>
	)
}
