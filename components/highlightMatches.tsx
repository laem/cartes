import React from 'react'

export default function highlightMatches(str: string, matches: Matches) {
	if (!matches?.length) {
		return str
	}
	const indices = matches[0].indices
		.sort(([a], [b]) => a - b)
		.map(([x, y]) => [x, y + 1])
		.reduce(
			(acc, value) =>
				acc[acc.length - 1][1] <= value[0] ? [...acc, value] : acc,
			[[0, 0]]
		)
		.flat()
	return [...indices, str.length].reduce(
		([highlight, prevIndice, acc], currentIndice, i) => {
			const currentStr = str.slice(prevIndice, currentIndice)
			return [
				!highlight,
				currentIndice,
				[
					...acc,
					<span
						style={highlight ? { fontWeight: 'bold' } : {}}
						className={highlight ? 'ui__ light-bg' : ''}
						key={i}
					>
						{currentStr}
					</span>,
				],
			] as [boolean, number, Array<React.ReactNode>]
		},
		[false, 0, []] as [boolean, number, Array<React.ReactNode>]
	)[2]
}
