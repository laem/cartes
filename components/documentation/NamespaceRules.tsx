import { title as getTitle } from '@/components/utils/publicodesUtils'
import RuleListItem from './RuleListItem'

export const NamespaceRules = ({ rules, dottedName }) => {
	const namespaceRules = Object.keys(rules).filter(
		(key) => key.includes(dottedName) && key !== dottedName
	)
	if (!namespaceRules.length) return null
	return (
		<section>
			<h2>Pages proches</h2>
			<ul
				css={`
					list-style: none;
				`}
			>
				{namespaceRules.map((ruleName) => {
					const item = {
						...rules[ruleName],
						dottedName: ruleName,
						espace: ruleName.split(' . ').reverse(),
					}
					const titledItem = { ...item, title: getTitle(item) }
					return (
						<RuleListItem
							key={item.dottedName}
							{...{
								rules,
								item: titledItem,
							}}
						/>
					)
				})}
			</ul>
		</section>
	)
}
