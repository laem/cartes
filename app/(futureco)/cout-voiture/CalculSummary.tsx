import css from '@/components/css/convertToJs'
import { CalculSummaryWrapper } from './CalculSummaryUI'
import rules from './data/rules'
import { capitalise0, formatValue, utils } from 'publicodes'
import { title } from '@/components/utils/publicodesUtils'
import Publicodes from 'publicodes'

const rulesEntries = Object.entries(rules)
export default function CalculSummary({
	engine: givenEngine,
	horizontal = false,
}) {
	const engine =
		givenEngine ||
		new Publicodes(rules).setSituation({
			'voyage . trajet voiture . distance': 'voiture . km annuels . par défaut',
			'voyage . trajet voiture . péages': `moyens par an`,
		})

	return (
		<CalculSummaryWrapper $horizontal={horizontal}>
			<ul>
				{rules['voyage . trajet voiture . coût trajet'].formule.somme.map(
					(el) => (
						<li key={el}>
							<details open={true}>
								<summary>
									<h4>
										{capitalise0(el)} {}
									</h4>
								</summary>

								<Sum
									engine={engine}
									data={rulesEntries.find(
										([k, v]) => k.includes(el) && v.formule.somme
									)}
								/>
							</details>
						</li>
					)
				)}
			</ul>
		</CalculSummaryWrapper>
	)
}

const Sum = ({ data: [parentDottedName, parentRule], engine }) => (
	<ul>
		{parentRule.formule.somme.map((le) => {
			const dottedName = utils.disambiguateReference(
					rules,
					parentDottedName,
					le
				),
				rule = rules[dottedName]

			const evaluation = engine && engine.evaluate(dottedName),
				value = evaluation && formatValue(evaluation)

			return (
				<li
					key={le}
					style={css`
						margin-left: 1rem;
					`}
				>
					{title({ ...rule, dottedName })}
					<small
						style={css`
							margin-left: 0.6rem;
						`}
					>
						{value}
					</small>
				</li>
			)
		})}
	</ul>
)
