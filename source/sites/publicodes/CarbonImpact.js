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

	return (
		<div
			css={`
				font-size: 85%;
				a {
					color: inherit;
				}
				text-align: center;
			`}
		>
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
