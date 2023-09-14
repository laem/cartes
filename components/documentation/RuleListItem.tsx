import { utils } from 'publicodes'
import Link from 'next/link'
import highlightMatches from '../highlightMatches'
import { InlineSmall, Item } from './RuleListItemUI'

export default function RuleListItem({
	rules,
	item,
	matches = null,
	pathPrefix,
}: {
	rules: NGCRules
	item: SearchItem
	matches: Matches | null
}) {
	const parents = item.espace.slice(1).reverse()

	return (
		<Item key={item.dottedName}>
			<Link
				href={
					pathPrefix + `/documentation/${utils.encodeRuleName(item.dottedName)}`
				}
			>
				{parents.length > 0 && (
					<small>
						{parents.map((name) => (
							<span key={name}>
								{matches
									? highlightMatches(
											name,
											matches.filter(
												(m) => m.key === 'espace' && m.value === name
											)
									  )
									: name}{' '}
								›{' '}
							</span>
						))}
						<br />
					</small>
				)}
				<div>
					<span>{rules[item.dottedName]?.icônes}</span>
					{matches
						? highlightMatches(
								item.title,
								matches.filter((m) => m.key === 'title')
						  )
						: item.title}
					{item.unité && <InlineSmall>{item.unité}</InlineSmall>}
				</div>
			</Link>
		</Item>
	)
}
