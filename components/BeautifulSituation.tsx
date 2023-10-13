import css from './css/convertToJs'
import { title } from './utils/publicodesUtils'

export default function BeautifulSituation({ validatedSituation, rules }) {
	const entries = Object.entries(validatedSituation)
	return (
		<ul
			style={css`
				display: flex;
			`}
		>
			{entries.map(([k, v], i) => (
				<li
					style={css`
						display: flex;
						align-items: center;
					`}
					key={k}
				>
					{title({ ...rules[k], dottedName: k })} :{' '}
					{title({ ...rules[v], dottedName: v })}
					{i < entries.length - 1 && (
						<span
							style={css`
								font-size: 50;
								color: #007ef0;
								margin: 0 0.6rem;
							`}
						>
							/
						</span>
					)}
				</li>
			))}
		</ul>
	)
}
