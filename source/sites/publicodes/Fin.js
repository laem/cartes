import React from 'react'
import { useLocation, useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'

import BallonGES from './images/ballonGES.svg'
import StartingBlock from './images/starting block.svg'
import SessionBar from 'Components/SessionBar'
import Chart from './chart'
import { Link } from 'react-router-dom'

const gradient = tinygradient([
		'#78e08f',
		'#e1d738',
		'#f6b93b',
		'#b71540',
		'#000000',
	]),
	colors = gradient.rgb(20)

const getBackgroundColor = (score) =>
	colors[
		Math.round((score < 2000 ? 0 : score > 20000 ? 19000 : score - 2000) / 1000)
	]

const sumFromDetails = (details) =>
	details.reduce((memo, [name, value]) => memo + value, 0)

export default ({}) => {
	const query = new URLSearchParams(useLocation().search)
	const details = query.get('details')

	// details=a2.6t2.1s1.3l1.0b0.8f0.2n0.1
	const encodedDetails = details,
		rehydratedDetails =
			encodedDetails &&
			encodedDetails
				.match(/[a-z][0-9]+\.[0-9][0-9]/g)
				.map(([category, ...rest]) => [category, 1000 * +rest.join('')])
				// Here we convert categories with an old name to the new one
				// 'biens divers' was renamed to 'divers'
				.map(([category, ...rest]) =>
					category === 'b' ? ['d', ...rest] : [category, ...rest]
				)

	const score = sumFromDetails(rehydratedDetails)
	const { value } = useSpring({
		config: { mass: 1, tension: 150, friction: 150, precision: 1000 },
		value: score,
		from: { value: 0 },
	})

	return (
		<AnimatedDiv
			value={value}
			score={score}
			details={Object.fromEntries(rehydratedDetails)}
		/>
	)
}

const AnimatedDiv = animated(({ score, value, details }) => {
	const backgroundColor = getBackgroundColor(value).toHexString(),
		backgroundColor2 = getBackgroundColor(value + 2000).toHexString(),
		textColor = findContrastedTextColor(backgroundColor, true)

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 0 auto;">
			<SessionBar />
			<motion.div
				animate={{ scale: [0.85, 1] }}
				transition={{ duration: 0.2, ease: 'easeIn' }}
				className=""
				css={`
					background: ${backgroundColor};
					background: linear-gradient(
						180deg,
						${backgroundColor} 0%,
						${backgroundColor2} 100%
					);
					color: ${textColor};
					margin: 0 auto;
					border-radius: 0.6rem;
					height: 65vh;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
				`}
			>
				<div css="display: flex; align-items: center; justify-content: center">
					<img src={BallonGES} css="height: 10rem" />
					<div>
						<div css="font-weight: bold; font-size: 280%; margin-bottom: .3rem">
							<span css="width: 3.6rem; text-align: right; display: inline-block">
								{Math.round(value / 1000)}
							</span>{' '}
							tonnes
						</div>
						<div
							css={`
								background: #ffffff3d;
								border-radius: 0.6rem;
								margin: 0 auto;
								padding: 0.4rem 1rem;

								> div {
									display: flex;
									justify-content: space-between;
									flex-wrap: wrap;
								}
								strong {
									font-weight: bold;
								}
								> img {
									margin: 0 0.6rem !important;
								}
							`}
						>
							<div>
								<span>
									{emoji('🇫🇷 ')}
									moyenne{' '}
								</span>{' '}
								<strong> 11 tonnes</strong>
							</div>
							<div>
								<span>
									{emoji('🎯 ')}
									objectif{' '}
								</span>
								<strong>2 tonnes</strong>
							</div>
							<div css="margin-top: .2rem;justify-content: flex-end !important">
								<a
									css="color: inherit"
									href="https://datagir.ademe.fr/blog/budget-empreinte-carbone-c-est-quoi/"
								>
									Comment ça ?
								</a>
							</div>
						</div>
					</div>
				</div>
				<div css="padding: 1rem">
					<Chart
						details={details}
						color={textColor}
						noAnimation
						noText
						noCompletion
					/>
				</div>

				<div css="display: flex; flex-direction: column;">
					<ShareButton
						text="Voilà mon empreinte climat. Mesure la tienne !"
						url={window.location}
						title={'Nos Gestes Climat'}
						color={textColor}
						label="Partager mes résultats"
					/>
				</div>
			</motion.div>
			{true && (
				<Link
					to="/actions"
					className="ui__ button plain"
					css={`
						margin: 0.6rem 0;
						width: 100%;
						img {
							transform: scaleX(-1);
							height: 3rem;
							margin: 0 0.6rem;
							display: inline-block;
						}
						a {
							color: var(--textColor);
							text-decoration: none;
						}
					`}
				>
					<div
						css={`
							display: flex;
							justify-content: center;
							align-items: center;
							width: 100%;
						`}
					>
						<img src={StartingBlock} />
						Passer à l'action
					</div>
				</Link>
			)}
		</div>
	)
})
