import Link from 'next/link'
import categories from './moreCategories.yaml'
import { initializeFuse } from './QuickFeatureSearch'

const fuse = initializeFuse(categories)

export default function MoreCategories({
	getNewSearchParamsLink,
	categorySet,
	doFilter,
	searchInput,
}) {
	const filteredCategories = doFilter
		? fuse
				.search(searchInput)
				.filter((el) => el.score < 0.5)
				.map((el) => console.log('SSS', el) || categories[el.refIndex])
		: categories
	const groups = filteredCategories.reduce((memo, next) => {
		return {
			...memo,
			[next.category]: [...(memo[next.category] || []), next],
		}
	}, {})
	return (
		<div
			css={`
				margin-bottom: 0.6rem;
				ol,
				ul {
					list-style-type: none;
				}
				ol > li > div {
					overflow-x: scroll;
					white-space: nowrap;
					scrollbar-width: none;
					width: 100%;
				}
				ul {
					display: flex;
					align-items: center;
					li {
						margin: 0 0.2rem;
						padding: 0rem 0.4rem;
						line-height: 1.5rem;
						border-radius: 0.2rem;
						background: white;
						border: 2px solid var(--lighterColor);
						white-space: nowrap;

						a {
							text-decoration: none;
							color: inherit;
						}
					}
				}
				h2 {
					font-size: 100%;
					margin: 0.6rem 0 0.1rem 0;
					line-height: initial;
					color: var(--lighterTextColor);
				}
			`}
		>
			<ol>
				{Object.entries(groups).map(([group, categories]) => (
					<li key={group}>
						<h2>{group}</h2>
						<div>
							<ul>
								{categories.map((category) => (
									<li
										key={category.name}
										css={
											categorySet?.name === category.name &&
											`
				background: var(--lighterColor) !important;
  border-color: var(--darkColor) !important;

						`
										}
									>
										<Link href={getNewSearchParamsLink(category)}>
											{category.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</li>
				))}
			</ol>
		</div>
	)
}
