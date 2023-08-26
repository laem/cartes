import {
	parentName,
	title as getTitle,
} from '@/components/utils/publicodesUtils'
import RuleListItem from './RuleListItem'
import { NamespaceList } from './RuleListItemUI'

export const NamespaceRules = ({ rules, dottedName }) => {
	const parent = parentName(dottedName)
	const namespaceRules = Object.keys(rules).filter(
		(key) => key.includes(parent) && key !== dottedName
	)
	if (!namespaceRules.length) return null
	return (
		<section>
			<h2>Pages proches</h2>
			<NamespaceList>
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
			</NamespaceList>
		</section>
	)
}
