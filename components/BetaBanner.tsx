import css from './css/convertToJs'

export default function BetaBanner() {
	return (
		<p>
			Vous utilisez une{' '}
			<strong
				style={css`
					background: purple;
					padding: 0rem 0.4rem;
				`}
			>
				version beta
			</strong>{' '}
			de l'outil.
		</p>
	)
}
