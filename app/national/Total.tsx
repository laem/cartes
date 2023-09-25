import { Card } from 'Components/UI'
import data from './data.yaml'

export default function Total({ state }) {
	const total = Object.keys(state).reduce((memo, next) => {
		const found = data.find(({ titre }) => titre === next),
			active = state[next]
		const stillValid = !data.find(
			({ dépasse, titre }) => dépasse && state[titre] && dépasse.includes(next)
		)
		const addition = active && stillValid ? found.formule : 0
		return memo + addition
	}, 0)
	const explanation = `Votre planification écologique réduit l'empreinte climat de la France de ${total} %.`
	return (
		<Card
			$spotlight
			css={`
				margin: 2rem;
				font-size: 200%;
				text-align: center;
				position: sticky; top:0;
			`}
			title={explanation}
		>
			Votre total : {total} %
		</Card>
	)
}
