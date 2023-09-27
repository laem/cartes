'use client'
import { LightButton } from '@/components/UI'
import Link from 'next/link'
import Grid from './Grid'
import Total from './Total'

export default function Home({ state }) {
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
				<Link href={'/national'}>
					<LightButton>Tout décocher</LightButton>
				</Link>
			</div>
			<Grid {...{ state }} />
		</div>
	)
}
