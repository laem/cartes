import byCategory from 'Components/categories'
import Emoji from 'Components/Emoji'
import Link from 'next/link'
import { utils } from 'publicodes'
import Highlighter from 'react-highlight-words'
import Image from 'next/image'
import energy from '@/public/energy.svg'

const { encodeRuleName } = utils

import topElements from '@/app/wiki/topElements.yaml'
import {
	CardUnits,
	CategoryList,
	RuleListStyle,
	WikiCard,
} from '@/components/WikiUI'
import { Card } from '@/components/UI'
import { title as ruleTitle } from 'Components/utils/publicodesUtils'

export default function Wiki({ rules }) {
	const exposedRules = Object.entries(rules)
		.map(([dottedName, v]) => ({ ...v, dottedName }))
		.filter((rule) => rule?.exposé)

	const withCustomSimulators = [
		...exposedRules,
		{
			titre: 'Prix à la pompe',
			description:
				'Décomposition du prix des carburants à la pompe (essence, gazole)',
		},
	]

	return (
		<section>
			<section css="@media (min-width: 800px){margin-top: .6rem}">
				<CategoryView exposedRules={exposedRules} rules={rules} />
			</section>
		</section>
	)
}

const CategoryView = ({ exposedRules, rules }) => {
	const categories = byCategory(exposedRules)
	return (
		<CategoryList>
			<li key="actualités">
				<h2>
					<Emoji e="🔥" /> Actualités
				</h2>
				<RuleList
					{...{
						rules: topElements.map((dottedName) =>
							typeof dottedName === 'string'
								? { dottedName, ...rules[dottedName] }
								: dottedName
						),
					}}
				/>
			</li>
			{categories.map(([category, rules], i) => (
				<li key={category}>
					<h2>{category}</h2>
					<RuleList {...{ rules }} />
				</li>
			))}
		</CategoryList>
	)
}
const RuleList = ({ rules, input }) => (
	<RuleListStyle>
		{rules.map((rule) => {
			const dottedName = rule.dottedName
			if (dottedName === 'lave-linge . renouveler') return null // TODO deactivated for our switch to searchParams. To be reactivated

			const title = ruleTitle(rule),
				icônes = rule.icônes || rule.rawNode?.icônes,
				units =
					rule.unités ||
					(rule.exposé.type === 'question éco'
						? ['€', 'kWh', 'CO2e']
						: ['CO2e'])

			return (
				<li key={dottedName || rule.titre}>
					<Link href={rule.url || '/simulateur/' + encodeRuleName(dottedName)}>
						<WikiCard $inversedColor={rule.inversedColor}>
							<Emoji e={icônes} />
							<h3>
								{input ? (
									<Highlighter
										searchWords={input.split(' ')}
										autoEscape={true}
										textToHighlight={title}
										highlightClassName="highlighted"
									/>
								) : (
									title
								)}
							</h3>
							<CardUnits>
								{units.map((unit) => {
									const { text, title } = unitRepresentations[unit]
									return (
										<span key={unit} title={title}>
											{text}
										</span>
									)
								})}
							</CardUnits>
						</WikiCard>
					</Link>
				</li>
			)
		})}
	</RuleListStyle>
)

const unitRepresentations = {
	'€': { text: '€', title: 'Combien ça vous coûte ?' },
	CO2e: { text: 'ⵛ', title: 'Combien de CO₂ₑ ça émet (empreinte climat) ?' },
	kWh: {
		text: <Image src={energy} alt="Symbôle représentant l'énergie en kWh" />,
		title: "Combien d'énergie ça consomme ?",
	},
}
