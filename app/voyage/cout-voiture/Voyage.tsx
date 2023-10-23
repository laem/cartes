'use client'
import rules from './data/rules.ts'

import { useEngine2 } from '@/providers/EngineWrapper'
import Questions from './Questions'
import { getSituation } from '@/components/utils/simulationUtils'

export default function Voyage({ searchParams }) {
	const objectives = ['trajet voiture . coût trajet par personne']

	const engine = useEngine2(
		rules,
		getSituation(searchParams, rules),
		objectives[0]
	)
	const evaluation = engine.evaluate(objectives[0])

	return (
		<Questions {...{ objectives, rules, engine, evaluation, searchParams }} />
	)
}
