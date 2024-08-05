import { uncapitalise0 } from '@/components/utils/utils'
import Link from 'next/link'
import { exactThreshold } from './QuickFeatureSearch'
import { goldCladding } from './QuickFeatureSearchUI'

export default function MoreCategories({
	getNewSearchParamsLink,
	categorySet,
	filteredMoreCategories,
}) {
	const groups = filteredMoreCategories.reduce((memo, next) => {
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

					/* Touch devices can scroll horizontally, desktop devices (hover:hover) cannot */
					@media (hover: hover) {
						flex-wrap: wrap;
					}
					li {
						margin: 0.2rem 0.2rem;
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
					margin: 0.4rem 0 0.1rem 0;
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
										css={`
											${categorySet?.name === category.name &&
											`
background: var(--lighterColor) !important;
border-color: var(--darkColor) !important;
`}

											${console.log('catscore', category.score) ||
											(category.score < exactThreshold && goldCladding)}
										`}
									>
										<Link href={getNewSearchParamsLink(category)}>
											{uncapitalise0(category.title || category.name)}
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
