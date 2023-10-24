import { formatValue } from 'publicodes'
import css from '../css/convertToJs'
import { Card } from '../UI'

export default function ValueBlock({ dottedName, engine }) {
	const evaluation = engine.evaluate(dottedName),
		value = formatValue(evaluation)

	return (
		<div
			style={css`
				margin: 1rem 0;
			`}
		>
			<h2>Valeur</h2>
			<Card>{value}</Card>
		</div>
	)
}
