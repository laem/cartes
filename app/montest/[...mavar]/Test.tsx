'use client'
import Engine from 'publicodes'
import { useSelector } from 'react-redux'

export default function Test({ maVar }) {
	const rules = useSelector((state) => state.rules)
	if (!rules) return 'En attente des règles'

	console.log('RULES', rules)
	const engine = new Engine(rules)
	const evaluation = engine.evaluate('transport . avion . impact')
	const value = evaluation.nodeValue

	return maVar + value
}
