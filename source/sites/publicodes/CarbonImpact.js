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

export default ({}) => {
	const objectif = useSelector(objectifsSelector)[0],
		// needed for this component to refresh on situation change :
		situation = useSelector(situationSelector),
		engine = useEngine(),
		evaluation = engine.evaluate(objectif),
		{ nodeValue, dottedName } = evaluation
	const foldedSteps = useSelector((state) => state.simulation?.foldedSteps),
		simulationStarted = foldedSteps && foldedSteps.length

	return (
		<div
			css={`
				background: rgba(0, 0, 0, 0)
					linear-gradient(60deg, var(--color) 0%, var(--lightColor) 100%) repeat
					scroll 0% 0%;
				color: var(--textColor);
				padding: 0.4rem;

				@media (max-width: 800px) {
					position: fixed;

					bottom: 4rem;
					left: 0;
					width: 100%;
					z-index: 10;
				}

				a {
					color: inherit;
				}
				text-align: center;
				display: flex;
				justify-content: center;
				flex-direction: column;
				> div {
					display: flex;
					justify-content: center;
					align-items: center;
				}
				box-shadow: 2px 2px 10px #bbb;
			`}
		>
			{!simulationStarted ? (
				<em>{emoji('🇫🇷 ')} Un Français émet en moyenne</em>
			) : (
				<em>Votre total provisoire</em>
			)}
			<div>
				<SimulationHumanWeight nodeValue={nodeValue} />
				<div>
					<span css="font-size: 120%">{emoji('🔬 ')}</span>
					<Link to={'/documentation/' + utils.encodeRuleName(dottedName)}>
						comprendre le calcul
					</Link>
				</div>
			</div>
		</div>
	)
}
