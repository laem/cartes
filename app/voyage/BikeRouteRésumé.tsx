import CircularIcon from '@/components/CircularIcon'
import css from '@/components/css/convertToJs'
import ProfileChooser from './ProfileChooser'

export default function BikeRouteRésumé({
	data,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
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
				position: relative;
				display: flex;
				align-items: center;
				background: var(--lightestColor);
				padding: 0.6rem;
				color: var(--darkestColor);
				line-height: 1.4rem;
				border: 4px solid var(--darkColor);
				margin-top: 1.4rem;
				border-radius: 0.5rem;
				@media (min-width: 1200px) {
				}
			`}
		>
			{' '}
			<div
				css={`
					> div {
						position: absolute !important;
						top: 0;
						left: calc(50% - 1rem);
						transform: translateX(-50%) translateY(-70%);
						margin-right: 0.4rem;
						width: 2rem;
						height: auto;
					}
					> div:nth-child(2) {
						left: calc(50% + 1rem);
					}
				`}
			>
				<CircularIcon
					src={'/bike.svg'}
					alt="Icône d'un vélo"
					color={
						bikeRouteProfile === 'hiking-mountain' ? 'lightColor' : 'darkColor'
					}
					onClick={() => setBikeRouteProfile('safety')}
				/>
				<CircularIcon
					src={'/walking.svg'}
					alt="Icône d'une personne qui marche"
					color={
						bikeRouteProfile !== 'hiking-mountain' ? 'lightColor' : 'darkColor'
					}
					onClick={() => setBikeRouteProfile('hiking-mountain')}
				/>
			</div>
			<div>
				<p>
					Le trajet de <strong>{km}&nbsp;km</strong> depuis la gare vous prendra{' '}
					<strong>
						{heures ? heures + ` heure${heures > 1 ? 's' : ''} et ` : ''}
						{minutes}&nbsp;min
					</strong>{' '}
					pour{' '}
					<strong
						style={css(
							`background: ${deniveléColor(
								déniveléCumulé
							)}; padding: 0 .2rem; border-radius: 0.3rem;`
						)}
					>
						{déniveléCumulé}&nbsp;m
					</strong>{' '}
					de dénivelé (<small>{dénivelé}&nbsp;m en absolu</small>).
				</p>
				{bikeRouteProfile !== 'hiking-mountain' && (
					<ProfileChooser
						{...{
							bikeRouteProfile,
							setBikeRouteProfile,
						}}
					/>
				)}
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
