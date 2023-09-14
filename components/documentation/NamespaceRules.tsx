import {
	parentName,
	title as getTitle,
} from '@/components/utils/publicodesUtils'
import { difference, intersection } from '../utils/utils'
import RuleListItem from './RuleListItem'
import { NamespaceList } from './RuleListItemUI'

export const NamespaceRules = ({
	rules,
	dottedName,
	pathPrefix,
	spotlight,
}) => {
	const parent = parentName(dottedName)
	const namespaceRules = Object.keys(rules).filter(
		(key) => key.includes(parent) && key !== dottedName
	)
	const allRules = [...spotlight, ...difference(namespaceRules, spotlight)]
	if (!allRules.length) return null
	return (
		<section>
			<h2>Pages proches</h2>
			<NamespaceList>
				{allRules.map((ruleName) => {
					const item = {
						...rules[ruleName],
						dottedName: ruleName,
						espace: ruleName.split(' . ').reverse(),
					}
					const titledItem = { ...item, title: getTitle(item) }
					return (
						<RuleListItem
							key={item.dottedName}
							pathPrefix={pathPrefix}
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
