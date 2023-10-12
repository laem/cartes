import { useEngine2 } from '@/providers/EngineWrapper'
import { useState } from 'react'
import emoji from 'react-easy-emoji'

/* This component helps input a value that is not known by suggesting another input to the user. This new input will be multiplied by 12 (to convert from month to year) and then by the inputEstimation's formule attribute.
 *
 * It's originated from the estimation of an annual energy bill kWh from the monthly cost in €
 *
 * This is **highly hardcoded** for now, and the estimator can't yet be computed (since getInputComponent.js is passed non-evaluated flatRules,
 * but it could easily be made into a generic input helper */

export default function InputEstimation({ inputEstimation, setFinalValue }) {
	const engine = null || useEngine2(), //TODO
		evaluation = engine.evaluate(inputEstimation),
		nodeValue = evaluation.nodeValue || 1000

	const [value, setValue] = useState('')

	return (
		<div
			css={`
				margin: 0.6rem 0;
				input {
					margin: 0.4rem 0.6rem 0 0.6rem;
					border: 1px dashed var(--color) !important;
					border-radius: 0.3rem;
					font-size: 100%;
					width: 6rem;
				}
				display: flex;
				justify-content: left;
				align-items: center;
				img {
					font-size: 230%;
					margin-right: 1rem !important;
				}
			`}
		>
			<span>{emoji('🧮')} </span>
			<span>
				<div>
					{inputEstimation.rawNode.question}
					<input
						type="number"
						min="0"
						max="1000000"
						step="1"
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							setFinalValue(Math.round(12 * (+e.target.value / nodeValue)))
						}}
					/>
					<span>{inputEstimation.rawNode['unité'].split('/')[0]}</span>
				</div>
			</span>
		</div>
	)
}
