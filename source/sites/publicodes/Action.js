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
import { humanWeight, HumanWeight } from './HumanWeight'
import { Markdown } from 'Components/utils/markdown'

export const Footprint = ({ value }) => <div>Lala {value}</div>

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({ data: { nodeValue, description, icons, title } }) => {
	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 0 auto;">
			<div className="ui__ card" css={'padding: .1rem'}>
				<header css="margin-bottom: 1rem; h1 > span {margin-right: 1rem}">
					<h1>
						<span>{emoji(icons)}</span>
						{title}
					</h1>
					<HumanWeight nodeValue={nodeValue} />
				</header>
				<Markdown source={description} />
				<button className="ui__ button simple small">En savoir plus</button>
			</div>
			<p>Autres gestes climat (ces boutons ne marchent pas)</p>
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
}
