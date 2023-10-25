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
				<Link
					href={{
						pathname: '/documentation/' + utils.encodeRuleName(objective),
						query: searchParams,
					}}
				>
					<Emoji e="⚙️" /> Comprendre le calcul
				</Link>
			</div>
		</div>
	)
}

//TODO add metadata https://nextjs.org/docs/app/building-your-application/optimizing/metadata
//
export default SimulateurContent
