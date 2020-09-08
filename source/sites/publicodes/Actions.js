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
			<Action
				color1={'#e58e26'}
				color2={'#d0b105'}
				icônes="🍽🍖"
				titre="Diviser ma consommation de viande par 4"
				empreinte={'-1 tonne'}
				nom={'viande'}
			/>
			<Action
				color1={'#04a4ac'}
				color2={'#05569d'}
				icônes={'🏠📺'}
				titre="Éteindre mes appareils en veille"
				empreinte={'-33 kg'}
			/>
		</div>
	)
})

const Action = ({ nom, icônes, color1, color2, titre, empreinte }) => (
	<Link css="text-decoration: none" to={'/actions/' + nom}>
		<motion.div
			animate={{ scale: [0.85, 1] }}
			transition={{ duration: 0.2, ease: 'easeIn' }}
			className=""
			css={`
				background: linear-gradient(180deg, ${color1} 0%, ${color2} 100%);
				color: white;
				margin: 1rem auto;
				border-radius: 0.6rem;
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
					margin-right: 0.4rem !important;
				}
			`}
		>
			<h2>
				<span>{emoji(icônes)}</span>
				{titre}
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
				<span css="font-size: 200%">{empreinte}</span> de CO₂e par an
			</div>
		</motion.div>
	</Link>
)
