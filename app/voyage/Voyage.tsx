'use client'
import Engine from 'publicodes'
import { createContext, useState } from 'react'
import rules from './data/rules.ts'

import VoyageInput from '@/components/conversation/VoyageInput'
import Questions from './Questions'
import { useEngine2 } from '@/providers/EngineWrapper'
import Simulateur from '../simulateur/[...dottedName]/Simulateur'
import { useSimulationConfig } from '../simulateur/[...dottedName]/configBuilder'

export default function Voyage() {
	const objective = 'trajet voiture . coût trajet par personne'
	const config = useSimulationConfig(rules, objective)

	const engine = useEngine2(rules)
	const evaluation = engine.evaluate(objective)

	if (!config) return null
	return <Questions {...{ objective, rules, engine, config, evaluation }} />
}
