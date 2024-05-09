'use client'
import Engine from 'publicodes'
import { useSelector } from 'react-redux'

export default function Test({ maVar, rules }) {
	if (!rules) return 'En attente des règles'

	const engine = new Engine(rules)
	const evaluation = engine.evaluate('transport . avion . impact')
	const value = evaluation.nodeValue

	return maVar + value
}
