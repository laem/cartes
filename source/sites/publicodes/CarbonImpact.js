import { utils } from 'publicodes'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	objectifsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import SimulationHumanWeight from './HumanWeight'
import { useEngine } from 'Components/utils/EngineContext'
import { correctValue, splitName } from '../../components/publicodesUtils'
import { lightenColor } from '../../components/utils/colors'

export default ({}) => {
	const objectif = useSelector(objectifsSelector)[0],
		// needed for this component to refresh on situation change :
		situation = useSelector(situationSelector),
		engine = useEngine(),
		rules = useSelector((state) => state.rules),
		evaluation = engine.evaluate(objectif),
		{ nodeValue: rawNodeValue, dottedName, unit, rawNode } = evaluation
	const foldedSteps = useSelector((state) => state.simulation?.foldedSteps),
		simulationStarted = foldedSteps && foldedSteps.length

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	const category = rules[splitName(dottedName)[0]],
		color = category && category.couleur
	return (
		<div
			css={`
				background: rgba(0, 0, 0, 0)
					linear-gradient(
						60deg,
						${color ? color : 'var(--color)'} 0%,
						${color ? lightenColor(color, -20) : 'var(--lightColor)'} 100%
					)
					repeat scroll 0% 0%;
				color: var(--textColor);
				padding: 0.4rem;

				a {
					color: inherit;
				}
				text-align: center;
				display: flex;
				justify-content: space-evenly;
				> div {
					display: flex;
					justify-content: center;
					align-items: center;
				}
				box-shadow: 2px 2px 10px #bbb;

				.unitSuffix {
					font-size: 90%;
				}
			`}
		>
			<div
				css={`
					display: flex;
					justify-content: space-evenly;
					flex-direction: column;
					width: 80%;
				`}
			>
				{!simulationStarted ? (
					<em>{emoji('🇫🇷 ')} Un Français émet en moyenne</em>
				) : (
					<em>Votre total provisoire</em>
				)}
				<div>
					<SimulationHumanWeight nodeValue={nodeValue} />
				</div>
			</div>
			<div>
				<Link to={'/documentation/' + utils.encodeRuleName(dottedName)}>
					<span css="font-size: 140%">{emoji('❔️ ')}</span>
				</Link>
			</div>
		</div>
	)
}
