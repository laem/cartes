import categories from './moreCategories.yaml'
export default function MoreCategories() {
	const groups = categories.reduce((memo, next) => {
		return {
			...memo,
			[next.category]: [...(memo[next.category] || []), next],
		}
	}, {})
	return (
		<div>
			<ol>
				{Object.entries(groups).map(([group, categories]) => (
					<li key={group}>
						<h2>{group}</h2>
						<ul>
							{categories.map((category) => (
								<li key={category}>{category.name}</li>
							))}
						</ul>
					</li>
				))}
			</ol>
		</div>
	)
}
