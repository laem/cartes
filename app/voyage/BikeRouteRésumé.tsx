import CircularIcon from '@/components/CircularIcon'
import css from '@/components/css/convertToJs'
import { useState } from 'react'
import ProfileChooser from './ProfileChooser'

export default function BikeRouteRésumé({
	walking,
	cycling,
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	const [mode, setMode] = useState('cycling') // TODO set automatically a guessed mode from distance and possibly then user preferences

	if (walking === 'loading' || walking === 'loading')
		return <div>La roue tourne est en train de tourner</div>
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
					background={
						mode !== 'cycling' ? 'var(--lightColor)' : 'var(--darkColor)'
					}
					onClick={() => setMode('cycling')}
				/>
				<CircularIcon
					src={'/walking.svg'}
					alt="Icône d'une personne qui marche"
					background={
						mode === 'cycling' ? 'var(--lightColor)' : 'var(--darkColor)'
					}
					onClick={() => setMode('walking')}
				/>
			</div>
			<ModeContent
				{...{
					bikeRouteProfile,
					setBikeRouteProfile,
					mode,
					data: mode === 'cycling' ? cycling : walking,
				}}
			/>
		</div>
	)
}

const ModeContent = ({ mode, data, setBikeRouteProfile, bikeRouteProfile }) => {
	if (!data?.length) return null

	const feature = data[0]
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
		<div>
			<p>
				À {mode === 'walking' ? 'pieds' : 'vélo'}, le trajet de{' '}
				<strong>{km}&nbsp;km</strong> vous prendra{' '}
				<strong>
					{heures ? heures + ` h et ` : ''}
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
			{mode === 'cycling' && (
				<ProfileChooser
					{...{
						bikeRouteProfile,
						setBikeRouteProfile,
					}}
				/>
			)}
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
