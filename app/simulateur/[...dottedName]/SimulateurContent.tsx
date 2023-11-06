'use client'
import { getSituation } from '@/components/utils/simulationUtils'
import { useEngine2 } from '@/providers/EngineWrapper'
import CustomSimulateurEnding from 'Components/CustomSimulateurEnding'
import Emoji from 'Components/Emoji'
import Simulation from 'Components/Simulation'
import SimulationResults from 'Components/SimulationResults'
import Link from 'next/link'
import { utils } from 'publicodes'

const SimulateurContent = ({ objectives, rules, config, searchParams }) => {
	const objective = objectives[0]
	const rule = rules[objective]

	const validatedSituation = getSituation(searchParams, rules)
	const engine = useEngine2(rules, validatedSituation, objective)
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
					}}
				/>
			</div>
		</div>
	)
}

//TODO add metadata https://nextjs.org/docs/app/building-your-application/optimizing/metadata
//
export default SimulateurContent
