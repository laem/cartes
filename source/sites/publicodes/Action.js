import React, { useContext } from 'react'
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
import { encodeRuleName } from 'Engine/rules'
import { SitePathsContext } from 'Components/utils/withSitePaths'

export const Footprint = ({ value }) => <div>Lala {value}</div>

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({
	data: { dottedName, nodeValue, description, icons, title },
}) => {
	const sitePaths = useContext(SitePathsContext)
	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 1rem auto;">
			<div className="ui__ card" css={'padding: .1rem'}>
				<header css="margin-bottom: 1rem; h1 > span {margin-right: 1rem}">
					<h1>
						{icons && <span>{emoji(icons)}</span>}
						{title}
					</h1>
					<HumanWeight nodeValue={nodeValue} />
					<Link
						to={
							sitePaths.documentation.index + '/' + encodeRuleName(dottedName)
						}
					>
						{emoji('🔬 ')} comprendre le calcul
					</Link>
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
