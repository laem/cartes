'use client'
import rules from './data/rules.ts'

import { useEngine2 } from '@/providers/EngineWrapper'
import { useSimulationConfig } from '@/app/simulateur/[...dottedName]/configBuilder'
import Questions from './Questions'

export default function Voyage() {
	const objective = 'trajet voiture . coût trajet par personne'
	const config = useSimulationConfig(rules, objective)

	const engine = useEngine2(rules)
	const evaluation = engine.evaluate(objective)

	if (!config) return null
	return <Questions {...{ objective, rules, engine, config, evaluation }} />
}
