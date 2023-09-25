'use client'
import Grid from './Grid'
import { useState } from 'react'
import Total from './Total'
import { LightButton } from '@/components/UI'
export default function Home() {
	const [state, setState] = useState({})
	console.log('state', state)
	const hasActiveActions = Object.keys(state).filter((el) => el[1]).length > 2
	return (
		<div>
			<Total state={state} />
			<div
				css={`
					visibility: ${hasActiveActions ? 'visible' : 'hidden'};
					text-align: right;
				`}
			>
				<LightButton onClick={() => setState({})}>Tout décocher</LightButton>
			</div>
			<Grid {...{ state, setState }} />
		</div>
	)
}
