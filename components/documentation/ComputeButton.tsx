'use client'

import { usePublicodes } from '@/providers/PublicodesContext'
import { formatValue } from 'publicodes'
import styled from 'styled-components'
import { Button, Card } from '../UI'

export default function ComputeButton({ dottedName }) {
	const [requestPublicodes, engine] = usePublicodes()
	const setLoadEngine = () => {
		requestPublicodes('common')
	}
	if (!engine)
		return (
			<Wrapper>
				<h2>Valeur</h2>
				<Button
					onClick={() => setLoadEngine(true)}
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
