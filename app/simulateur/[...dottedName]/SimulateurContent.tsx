'use client'
import IntermediateMessage from '@/components/bilan/IntermediateMessage'
import { getSituation } from '@/components/utils/simulationUtils'
import { useEngine2 } from '@/providers/EngineWrapper'
import CustomSimulateurEnding from 'Components/CustomSimulateurEnding'
import Emoji from 'Components/Emoji'
import FuturecoMonochrome from 'Components/FuturecoMonochrome'
import Simulation from 'Components/Simulation'
import SimulationResults from 'Components/SimulationResults'
import { getBackgroundColor, limit } from 'Components/testColors'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const SimulateurContent = ({ objectives, rules, config, searchParams }) => {
	const objective = objectives[0]
	const rule = rules[objective]

	const validatedSituation = getSituation(searchParams, rules)
	const engine = useEngine2(rules, validatedSituation)
	const evaluation = engine.evaluate(objective)

	return (
		<div className="ui__ container">
			<div
				css={`
					height: 90%;
				`}
			>
				<SimulationResults
					{...{
						rule,
						evaluation,
						engine,
						rules,
						searchParams,
						objectives,
					}}
				/>

				<Simulation
					{...{
						rules,
						engine,
						objectives,
						searchParams,
						customEnd: rule.description ? (
							<CustomSimulateurEnding
								rule={rule}
								dottedName={objectives[0]}
								engine={engine}
							/>
						) : (
							<EndingCongratulations />
						),
					}}
				/>
			</div>
			<div
				css={`
					margin-top: 2rem;
					text-align: center;
					a {
						display: flex;
						align-items: center;
						justify-content: center;
						text-decoration: none;
						color: var(--lighterColor);
						opacity: 0.5;
						font-size: 90%;
						text-transform: uppercase;
					}
				`}
			>
				<Link href={'/documentation/' + utils.encodeRuleName(objective)}>
					<Emoji e="⚙️" /> Comprendre le calcul
				</Link>
			</div>
		</div>
	)
}

//TODO add metadata https://nextjs.org/docs/app/building-your-application/optimizing/metadata
//
export default SimulateurContent

export const EndingCongratulations = () => (
	<h3>
		<Emoji e="🌟" /> Vous avez complété cette simulation
	</h3>
)
