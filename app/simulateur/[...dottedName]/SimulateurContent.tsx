'use client'
import { getSituation } from '@/components/utils/simulationUtils'
import { useEngine2 } from '@/providers/EngineWrapper'
import Simulation from 'Components/Simulation'
import SimulationResults from 'Components/SimulationResults'

const getSituationValue = (validatedSituation, dottedName) => {
	const value = validatedSituation[dottedName]
	if (value == null) return
	if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1)
	return value
}
const SimulateurContent = ({ objectives, rules, config, searchParams }) => {
	const objective = objectives[0]
	const rule = rules[objective]

	const validatedSituation = getSituation(searchParams, rules)
	const engine = useEngine2(rules, validatedSituation, objective)
	const evaluation = engine.evaluate(objective)

	const SubTitle = () => {
		if (objective !== 'transport . avion . impact') return null
		const origin = getSituationValue(
				validatedSituation,
				'transport . avion . départ'
			),
			destination = getSituationValue(
				validatedSituation,
				'transport . avion . arrivée'
			)
		if (!(origin && destination)) return null
		return (
			<div>
				{origin} ⇄ {destination}
			</div>
		)
	}
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
						SubTitle,
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
