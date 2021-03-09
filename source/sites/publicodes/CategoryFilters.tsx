import { Link } from 'react-router-dom'
export default ({ categories, selected, countByCategory }) => {
	return (
		<ul
			css={`
				display: flex;
				flex-wrap: wrap;
				list-style-type: none;
				justify-content: center;
				li {
					padding: 0.1rem 0rem;
					margin: 0.15rem 0.2rem;
					border-radius: 0.2rem;
				}
				li button {
					color: white;
					font-weight: 500;
				}
			`}
		>
			{categories.map((category) => (
				<li
					css={`
						background: ${category.color};
						${selected === category.dottedName
							? 'border: 3px solid var(--color)'
							: ''}
						${!countByCategory[category.dottedName] ? 'background: #ccc' : ''}
					`}
				>
					<Link
						to={
							selected === category.dottedName
								? '/actions'
								: '/actions/catégorie/' + category.dottedName
						}
					>
						<button>
							{category.dottedName}{' '}
							<span
								css={`
									background: white;
									color: var(--color);
									border-radius: 1rem;
									width: 1rem;
									margin-left: 0.2rem;
									display: inline-block;
								`}
							>
								{countByCategory[category.dottedName] || 0}
							</span>
						</button>
					</Link>
				</li>
			))}
		</ul>
	)
}
