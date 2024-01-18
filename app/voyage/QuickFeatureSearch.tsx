import useSetSearchParams from '@/components/useSetSearchParams'
import { omit } from '@/components/utils/utils'
import { backIn } from 'framer-motion'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import categories from './categories.yaml'
import MoreCategories from './MoreCategories'
import {
	quickSearchButtonStyle,
	QuickSearchButtonStyle,
} from './QuickFeatureSearchUI'

export const categoryIconUrl = (category) => {
	if (!category.icon)
		throw new Error(
			'Chaque catégorie doit fournir une icône au format suivant (voir le code)'
		)
	const url = category.icon.startsWith('http')
		? category.icon
		: '/icons/' + category.icon + '.svg'
	return url
}

const fuse = new Fuse(categories, {
	keys: ['name', 'title', 'query', 'dictionary'],
	includeScore: true,
})

export default function QuickFeatureSearch({
	category: categorySet,
	searchParams, // dunno why params is not getting updated here, but updates hash though, we need searchParams
	searchInput,
	setSnap,
}) {
	const [showMore, setShowMore] = useState(false)
	const hasLieu = searchParams.lieu
	const setSearchParams = useSetSearchParams()
	console.log('hasLieu', hasLieu)
	const filteredCategories = useMemo(
		() =>
			!hasLieu && searchInput?.length > 2
				? fuse
						.search(searchInput)
						.filter((el) => el.score < 0.5)
						.map((el) => console.log('SSS', el) || categories[el.refIndex])
				: categories,

		[searchInput, hasLieu]
	)
	return (
		<div
			css={`
				margin-top: 0.8rem;
			`}
		>
			<div
				css={`
					display: flex;
					align-items: center;
					> div {
					}
				`}
			>
				<div
					css={`
						overflow: hidden;
						overflow-x: scroll;
						white-space: nowrap;
						scrollbar-width: none;
						&::-webkit-scrollbar {
							width: 0px;
							background: transparent; /* Disable scrollbar Chrome/Safari/Webkit */
						}
						width: calc(100% - 3rem);
					`}
				>
					<ul
						css={`
							padding: 0;
							list-style-type: none;
							display: flex;
							align-items: center;
						`}
					>
						<li
							key="photos"
							css={`
								${quickSearchButtonStyle(searchParams.photos === 'oui')}
							`}
						>
							<Link
								href={setSearchParams(
									{
										...omit(['photos'], searchParams),
										...(searchParams.photos ? {} : { photos: 'oui' }),
									},
									true,
									true
								)}
							>
								<img src={'/icons/photo.svg'} />
							</Link>
						</li>
						{filteredCategories.map((category) => {
							const newSearchParams = {
								...omit(['cat'], searchParams),
								...(!categorySet || categorySet.name !== category.name
									? { cat: category.name }
									: {}),
							}

							return (
								<li
									key={category.name}
									css={`
										${quickSearchButtonStyle(
											categorySet?.name === category.name
										)}
									`}
									title={category.title || category.name}
								>
									<Link
										href={setSearchParams(newSearchParams, true, true)}
										replace={true}
										prefetch={false}
									>
										<img src={categoryIconUrl(category)} />
									</Link>
								</li>
							)
						})}
					</ul>
				</div>
				<div
					css={`
						${quickSearchButtonStyle(
							showMore,
							'var(--darkerColor)',
							'invert(1)'
						)}
					`}
				>
					<Link
						href="/"
						onClick={() => {
							setSnap(1)
							setShowMore(!showMore)
						}}
					>
						<img
							src={'/icons/more.svg'}
							width="100"
							height="100"
							alt="Voir plus de catégories de recherche"
						/>
					</Link>
				</div>
			</div>
			{showMore && <MoreCategories />}
		</div>
	)
}
