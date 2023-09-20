'use client'
import Grid from './Grid'
import { useState } from 'react'
import data from './data.yaml'
export default function Home() {
	const [state, setState] = useState({})
	console.log(state)
	const total = Object.keys(state).reduce(
		(memo, next) =>
			memo +
			(state[next] ? data.find(({ titre }) => titre === next).formule : 0),
		0
	)
	return (
		<div>
			{false && (
				<>
					<p
						css={`
							margin: 2rem;
							font-size: 300%;
							text-align: center;
						`}
					>
						Total : - {total} %
					</p>
				</>
			)}
			<Grid {...{ state, setState }} />
		</div>
	)
}
