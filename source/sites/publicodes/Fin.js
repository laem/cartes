import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router'
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
import Meta from '../../components/utils/Meta'
import DefaultFootprint from './DefaultFootprint'
import Dialog from '../../components/ui/Dialog'

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
	const headlessMode =
		!window || window.navigator.userAgent.includes('HeadlessChrome')

	const { value } = headlessMode
		? { value: score }
		: useSpring({
				config: { mass: 1, tension: 150, friction: 150, precision: 1000 },
				value: score,
				from: { value: 0 },
		  });
	function inIframe () {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}
	var [isOpen, setIsOpen] = useState(false);
	//To delay the dialog show in to let the animation play
	const timeoutRef = useRef(null);
	useEffect(() => {
		if (!inIframe()) return;
		if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(()=> {
			timeoutRef.current = null;
			setIsOpen(true);
		},3500);
	},[null]);
	function onReject() {
		setIsOpen(false);
		window.parent.postMessage({error: "The user refused to share his result."}, '*');
	};
	function onAccept() {
		setIsOpen(false);
		window.parent.postMessage(rehydratedDetails, '*');
	};
	const parent = document.referrer;
	const title = "Partage de vos résultats à "+parent+"?",
	text = "En cliquant sur le bouton Accepter, vous acceptez d'envoyer les données de votre Bilan Carbone au site "
		+parent+
		". Nos Gestes Climat n'est en aucun cas affilié à "+parent;

	return (
		<div>
			<AnimatedDiv
				value={value}
				score={score}
				details={Object.fromEntries(rehydratedDetails)}
				headlessMode={headlessMode}
			/>
			<Dialog title={title} text={text} isOpen={isOpen} onReject={onReject} onAccept={onAccept} />
		</div>
	)
}

const AnimatedDiv = animated(({ score, value, details, headlessMode }) => {

	const backgroundColor = getBackgroundColor(value).toHexString(),
		backgroundColor2 = getBackgroundColor(value + 2000).toHexString(),
		textColor = findContrastedTextColor(backgroundColor, true),
		roundedValue = Math.round(value / 1000),
		shareImage =
			'https://aejkrqosjq.cloudimg.io/v7/' +
			window.location.origin +
			'/.netlify/functions/ending-screenshot?pageToScreenshot=' +
			window.location

	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 0 auto;">
			<Meta
				title="Nos Gestes Climat"
				description={`Mon empreinte climat est de ${roundedValue} tonnes de CO2e. Mesure la tienne !`}
				image={shareImage}
				url={window.location}
			/>
			<SessionBar noResults />
			<motion.div
				animate={{ scale: [0.9, 1] }}
				transition={{ duration: headlessMode ? 0 : 0.6 }}
				className=""
				id="fin"
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
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
				`}
			>
				<div id="shareImage" css="padding: 2rem 0">
					<div css="display: flex; align-items: center; justify-content: center">
						<img src={BallonGES} css="height: 10rem" />
						<div
							css={`
								flex-direction: ${headlessMode ? 'column-reverse' : 'column'};
								display: flex;
								justify-content: space-evenly;
								height: 10rem;
							`}
						>
							<div css="font-weight: bold; font-size: 280%;">
								<span css="width: 3.6rem; text-align: right; display: inline-block">
									{roundedValue}
								</span>{' '}
								tonnes
							</div>
							<div
								css={`
									background: #ffffff3d;
									border-radius: 0.6rem;
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
									<strong>
										{' '}
										<DefaultFootprint />{' '}
									</strong>
								</div>
								<div>
									<span>
										{emoji('🎯 ')}
										objectif{' '}
									</span>
									<strong>2 tonnes</strong>
								</div>
								{!headlessMode && (
									<div css="margin-top: .2rem;justify-content: flex-end !important">
										<a
											css="color: inherit"
											href="https://datagir.ademe.fr/blog/budget-empreinte-carbone-c-est-quoi/"
										>
											Comment ça ?
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
					<ActionButton />
					<div css="padding: 1rem">
						<Chart
							details={details}
							color={textColor}
							noAnimation
							noText
							noCompletion
							valueColor={textColor}
						/>
					</div>
				</div>
				<div css="display: flex; flex-direction: column; margin: 1rem 0">
					<ShareButton
						text="Voilà mon empreinte climat. Mesure la tienne !"
						url={window.location}
						title={'Nos Gestes Climat'}
						color={textColor}
						label="Partager mes résultats"
					/>
				</div>
			</motion.div>
		</div>
	)
})

const ActionButton = () => (
	<Link
		to="/actions"
		className="ui__ button plain"
		css={`
			margin: 0.6rem 0;
			width: 100%;
			img {
				transform: scaleX(-1);
				height: 2rem;
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
)
