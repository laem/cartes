import { utils } from 'publicodes'
import Link from 'next/link'
import highlightMatches from '../highlightMatches'
import { Item } from './RuleListItemUI'

export default function RuleListItem({
	rules,
	item,
	matches = null,
}: {
	rules: NGCRules
	item: SearchItem
	matches: Matches | null
}) {
	return (
		<Item key={item.dottedName}>
			<Link href={`/documentation/${utils.encodeRuleName(item.dottedName)}`}>
				<small>
					{item.espace
						.slice(1)
						.reverse()
						.map((name) => (
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
				<span>{rules[item.dottedName]?.icônes}</span>
				{matches
					? highlightMatches(
							item.title,
							matches.filter((m) => m.key === 'title')
					  )
					: item.title}
			</Link>
		</Item>
	)
}
