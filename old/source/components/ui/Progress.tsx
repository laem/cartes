import React from 'react'
import { useEngine } from '../utils/EngineContext'
import './Progress.css'

type ProgressProps = {
	progress: number
	style?: React.CSSProperties
	className: string
}

export default function Progress({
	progress,
	style,
	className,
}: ProgressProps) {
	const engine = useEngine()
	const { nodeValue } = engine.evaluate('bilan')
	return (
		<div className={'progress__container ' + className} css={style}>
			<div className="progress__bar" style={{ width: `${progress * 100}%` }} />
		</div>
	)
}
