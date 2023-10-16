import css from '@/components/css/convertToJs'
import rules from './data/rules'

const rulesEntries = Object.entries(rules)
console.log(
	'yoyo',
	rulesEntries.find((el) => el[0].includes('coût de possession'))
)
export default function CalculSummary() {
	return (
		<ul
			style={css`
				list-style-type: none;
			`}
		>
			{rules['trajet voiture . coût trajet'].formule.somme.map((el) => (
				<li key={el}>
					<details open={true}>
						<summary>{el}</summary>

						<ul>
							{rulesEntries
								.find(([k, v]) => k.includes(el) && v.formule.somme)[1]
								.formule.somme.map((le) => (
									<li
										key={le}
										style={css`
											margin-left: 1rem;
										`}
									>
										{le}
									</li>
								))}
						</ul>
					</details>
				</li>
			))}
		</ul>
	)
}
