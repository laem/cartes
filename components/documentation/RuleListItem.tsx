import { utils } from 'publicodes'
import Link from 'next/link'
import highlightMatches from '../highlightMatches'

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
		<li
			key={item.dottedName}
			css={`
				margin: 0.4rem 0;
				padding: 0.6rem 0.6rem;
				border-bottom: 1px solid var(--lighterColor);
				small {
					display: block;
				}
			`}
		>
			<Link
				href={`/documentation/${utils.encodeRuleName(item.dottedName)}`}
				css={`
					text-decoration: none;
				`}
			>
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
				<span
					css={`
						margin-right: 0.6rem;
					`}
				>
					{rules[item.dottedName]?.icônes}
				</span>
				{matches
					? highlightMatches(
							item.title,
							matches.filter((m) => m.key === 'title')
					  )
					: item.title}
			</Link>
		</li>
	)
}
