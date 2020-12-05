import { useEvaluation } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import { objectifsSelector } from 'Selectors/simulationSelectors'
import SimulationHumanWeight from './HumanWeight'

export default ({}) => {
	let interestingFormula = formule && formule.explanation.text !== '0'
	const objectifs = useSelector(objectifsSelector)
	const { nodeValue, formule, dottedName } = useEvaluation(objectifs)

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
				{interestingFormula && (
					<div>
						<span css="font-size: 120%">{emoji('🔬 ')}</span>
						<Link to={'/documentation/' + utils.encodeRuleName(dottedName)}>
							comprendre le calcul
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}
