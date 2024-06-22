import {
	parentName,
	title as getTitle,
} from 'Components/utils/publicodesUtils'
import { difference, intersection } from '../utils/utils'
import RuleListItem from './RuleListItem'
import { NamespaceList } from './RuleListItemUI'

export const NamespaceRules = ({
	rules,
	dottedName,
	pathPrefix,
	spotlight,
	searchParams,
}) => {
	const parent = parentName(dottedName)
	const namespaceRules = Object.keys(rules).filter(
		(key) => key.includes(parent) && key !== dottedName
	)
	//This is a system to recommand the best rules to the user
	const closeRules = rules[dottedName]['similaires'] || [],
		promotedRules = [...closeRules, ...difference(spotlight, closeRules)]
	const allRules = [
		...promotedRules,
		...difference(namespaceRules, promotedRules),
	]
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
								searchParams,
							}}
						/>
					)
				})}
			</NamespaceList>
		</section>
	)
}
