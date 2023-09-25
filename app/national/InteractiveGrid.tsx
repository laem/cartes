'use client'
import Grid from './Grid'
import { useState } from 'react'
import Total from './Total'
export default function Home() {
	const [state, setState] = useState({})
	console.log('state', state)
	return (
		<div>
			<Total state={state} />
			<Grid {...{ state, setState }} />
		</div>
	)
}
