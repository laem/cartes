import { utils } from 'publicodes'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import SimulationHumanWeight from './HumanWeight'

export default ({ evaluation }) => {
	const { nodeValue, dottedName } = evaluation

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
