'use client'

import { usePublicodes } from '@/providers/PublicodesContext'
import { formatValue } from 'publicodes'
import styled from 'styled-components'
import { Button, Card } from '../UI'

export default function ComputeButton({ dottedName }) {
	const context = usePublicodes()
	console.log('cont', context)
	if (!context) return null

	const [requestPublicodes, engine] = context
	if (!engine)
		return (
			<Wrapper>
				<h2>Valeur</h2>
				<Button
					onClick={() => requestPublicodes('common')}
					className="ui__ button cta plain attention"
				>
					🧮 Lancer le calcul
				</Button>
			</Wrapper>
		)
	const evaluation = engine.evaluate(dottedName),
		value = formatValue(evaluation)

	return (
		<Wrapper>
			<h2>Valeur</h2>
			<Card>{value}</Card>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	margin: 1rem 0;
`
