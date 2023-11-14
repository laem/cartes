import { Card } from 'Components/UI'
import data from './data.yaml'
import { utils } from 'publicodes'

export default function Total({ state }) {
	const total = Object.keys(state).reduce((memo, next) => {
			console.log('will find', next)
			const found = data.find(
					({ titre }) => utils.encodeRuleName(titre) === next
				),
				active = state[next]
			const stillValid = !data.find(
				({ dépasse, titre }) =>
					dépasse &&
					state[utils.encodeRuleName(titre)] &&
					dépasse.includes(next)
			)
			const addition = active && stillValid ? found.formule : 0
			return memo + addition
		}, 0),
		humanTotal = new Intl.NumberFormat('fr-FR', {
			maximumSignificantDigits: 2,
		}).format(total)

	const explanation = `Votre planification écologique réduit l'empreinte climat de la France de ${total} %.`
	const years = Math.round(total / 5)
	return (
		<Card
			$spotlight
			css={`
				text-align: center;
				position: sticky;
				top: 0;
				z-index: 10;
				padding: 0.6rem;
			`}
			title={explanation}
		>
			<div>Votre total : {humanTotal} %</div>

			<small
				css={`
					font-size: 60%;
					display: ${years > 0 ? 'block' : 'none'};
				`}
			>
				Soit {years} années d'avance
			</small>
		</Card>
	)
}
