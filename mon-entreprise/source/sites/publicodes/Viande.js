import React from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'

import BallonGES from './images/ballonGES.svg'
import SessionBar from 'Components/SessionBar'
import { Link } from 'react-router-dom'
import { humanWeight } from './HumanWeight'

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	const { score } = useParams()
	const { value } = useSpring({
		config: { mass: 1, tension: 150, friction: 150, precision: 1000 },
		value: +score,
		from: { value: 0 },
	})

	return <AnimatedDiv value={value} score={score} />
}

const AnimatedDiv = animated(({ score, value }) => {
	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 0 auto;">
			<h1 css="margin: 0;font-size: 160%">Mes actions</h1>
			<motion.div
				animate={{ scale: [0.85, 1] }}
				transition={{ duration: 0.2, ease: 'easeIn' }}
				className=""
				css={`
					background: linear-gradient(180deg, #e58e26 0%, #d0b105 100%);
					color: white;
					margin: 0 auto;
					border-radius: 0.6rem;
					height: 75vh;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					padding: 1rem;

					text-align: center;
					font-size: 110%;
					h2 {
						color: white;
						font-size: 130%;
					}
					> h2 > span > img {
						margin-right: 1rem;
					}
				`}
			>
				<h2>
					<span>{emoji('🍽🍖')}</span>
					Diviser ma consommation de viande par 4
				</h2>
				<div
					css={`
						background: white;
						color: var(--color);
						border-radius: 1rem;
						padding: 0.6rem;
						margin-bottom: 0.6rem;
					`}
				>
					<span css="font-size: 200%">-1 tonne</span> de CO₂e par an
				</div>
				<div>
					<p>
						Exemples pour un repas <small>en CO₂e</small>
					</p>
					<ul
						css={`
							text-align: left;
							list-style-type: none;
							li {
								img {
									font-size: 120%;
								}
							}
						`}
					>
						{[
							{
								icônes: '🥩🍟',
								nom: 'steak frites',
								empreinte: '5000',
								color: 'red',
							},
							{
								icônes: '🍗🍚',
								nom: 'poulet riz',
								empreinte: '1000',
								color: 'orange',
							},
							{
								icônes: '🥗🍅',
								nom: 'Repas végé',
								empreinte: '200',
								color: 'green',
							},
						].map(({ icônes, nom, color, empreinte }) => (
							<li>
								<span css="width: 20%; display: inline-block">
									<span title={nom}>{emoji(icônes)}</span>
								</span>
								<span
									css={`
										width: ${60 * (empreinte / 5000)}%;
										height: 1rem;
										background: ${color};
										border-radius: 0.6rem;
										display: inline-block;
										border: 2px solid var(--color);
										margin-right: 0.6rem;
									`}
								></span>
								<span>{humanWeight(empreinte / 1000)}</span>
							</li>
						))}
					</ul>
				</div>
				<p>Le saviez-vous ?</p>
				<ul
					css={`
						background: #ffffff60;
						border-radius: 0.6rem;
						padding: 0.3rem 1rem;
						font-size: 100%;
					`}
				>
					<li>
						En France, 80% des surfaces agricoles sont dédiées à l'alimentation
						animale
					</li>
				</ul>
				<div>
					<p>Pour une famille 2 adultes 2 enfants</p>
					<ul
						css={`
							background: #ffffff60;
							border-radius: 0.6rem;
							padding: 0.3rem 1rem;
							font-size: 100%;
						`}
					>
						<li>Régime classique : 187 € / semaine</li>
						<li>Régime peu carné : 147 € / semaine</li>
					</ul>
				</div>
				<button className="ui__ button simple small">En savoir plus</button>
			</motion.div>
			<p>Autres gestes climat</p>
			<div>
				<div css="> button {margin: .3rem .6rem}">
					<button className="ui__ small plain button">
						Devenir végétarien
					</button>
					<button className="ui__ small plain button">Moins gaspiller</button>
					<button className="ui__ small plain button">
						Manger local et de saison
					</button>
				</div>
			</div>
		</div>
	)
})
