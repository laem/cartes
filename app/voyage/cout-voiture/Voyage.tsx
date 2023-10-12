'use client'
import rules from './data/rules.ts'

import { useEngine2 } from '@/providers/EngineWrapper'
import Questions from './Questions'
import { getSituation } from '@/components/utils/simulationUtils'

export default function Voyage({ searchParams }) {
	const objective = 'trajet voiture . coût trajet par personne'

	const engine = useEngine2(rules, getSituation(searchParams, rules))
	const evaluation = engine.evaluate(objective)

	return (
		<Questions {...{ objective, rules, engine, evaluation, searchParams }} />
	)
}
