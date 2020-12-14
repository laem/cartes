import { useEvaluation } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import SimulationHumanWeight from './HumanWeight'
import { useSelector } from 'react-redux'

export default ({}) => {
	const objectifs = useSelector(objectifsSelector)
	const analysis = useEvaluation(objectifs)

	const { nodeValue, dottedName } = analysis[0]

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
