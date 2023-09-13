'use client'

import { usePublicodes } from '@/providers/PublicodesContext'
import { formatValue } from 'publicodes'
import { Button, Card } from '../UI'

export default function ComputeButton() {
	const [requestPublicodes, engine] = usePublicodes()
	const setLoadEngine = () => {
		requestPublicodes('common')
	}
	if (!engine)
		return (
			<Button
				onClick={() => setLoadEngine(true)}
				className="ui__ button cta plain attention"
			>
				🧮 Lancer le calcul
			</Button>
		)
	const evaluation = engine.evaluate(
			'trajet voiture . coût trajet par personne'
		),
		value = formatValue(evaluation)
	return (
		<div>
			<Card>{value}</Card>
		</div>
	)
}
