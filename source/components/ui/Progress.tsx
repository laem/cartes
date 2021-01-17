import React from 'react'
import { useEngine } from '../utils/EngineContext'
import './Progress.css'
import tinygradient from 'tinygradient'

type ProgressProps = {
	progress: number
	style?: React.CSSProperties
	className: string
}

const gradient = tinygradient([
		'#78e08f',
		'#e1d738',
		'#f6b93b',
		'#b71540',
		'#000000',
	]),
	colors = gradient.rgb(20),
	incompressible = 1112,
	durable = 2000,
	limit = durable + incompressible

const getBackgroundColor = (score) =>
	colors[
		Math.round(score < 200 ? 0 : score > limit ? 19 : (score / limit) * 20)
	]
export default function Progress({
	progress,
	style,
	className,
}: ProgressProps) {
	const engine = useEngine()
	const { nodeValue } = engine.evaluate('bilan')
	const color = getBackgroundColor(nodeValue)
	return (
		<div className={'progress__container ' + className} style={style}>
			{nodeValue}
			<div
				className="progress__bar"
				style={{ width: `${progress * 100}%`, background: color }}
			/>
		</div>
	)
}
