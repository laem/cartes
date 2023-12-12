import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import ProfileChooser from './ProfileChooser'

export default function BikeRouteRésumé({
	data,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	console.log('data', data)
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
				color: var(--darkestColor);
				line-height: 1.4rem;
				border: 4px solid var(--color);
				border-radius: 0.5rem;
				img {
					margin-right: 0.4rem;
					width: 2.5rem;
					height: auto;
				}
				@media (min-width: 1200px) {
				}
			`}
		>
			<img src="/bike.svg" alt="Icône d'un vélo" width="100" height="100" />

			<div>
				<p>
					Le trajet de <strong>{km} km</strong> depuis la gare vous prendra{' '}
					<strong>
						{heures ? heures + ` heure${heures > 1 ? 's' : ''} et ` : ''}
						{minutes} min
					</strong>{' '}
					pour{' '}
					<strong
						style={css(
							`background: ${deniveléColor(
								déniveléCumulé
							)}; padding: 0 .2rem; border-radius: 0.3rem;`
						)}
					>
						{déniveléCumulé} m
					</strong>{' '}
					de dénivelé (<small>{dénivelé} m en absolu</small>).
				</p>
				<ProfileChooser
					{...{
						bikeRouteProfile,
						setBikeRouteProfile,
					}}
				/>
			</div>
		</div>
	)
}

const deniveléColor = (height) =>
	height > 600
		? '#f98080'
		: height > 300
		? '#f7b63f'
		: height > 150
		? '#f7f769'
		: '#a0dba0'
