import useSetSearchParams from '@/components/useSetSearchParams'
import { omit } from '@/components/utils/utils'
import { getCategory } from '@/components/categories'
import Fuse from 'fuse.js/basic'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import categories from './categories.yaml'
import MoreCategories from './MoreCategories'
import moreCategories from './moreCategories.yaml'
import {
	SpinningDiscBorder,
	goldCladding,
	quickSearchButtonStyle,
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

export function initializeFuse(categories) {
	return new Fuse(categories, {
		keys: ['name', 'title', 'query', 'dictionary'],
		includeScore: true,
	})
}

const fuse = initializeFuse(categories)
const fuseMore = initializeFuse(moreCategories)
export const threshold = 0.1
export const exactThreshold = 0.01

export default function QuickFeatureSearch({
	searchParams,
	searchInput,
	setSnap,
	snap,
	loaded,
}) {
	const categorySet = getCategory(searchParams)
	const [showMore, setShowMore] = useState(false)
	const hasLieu = searchParams.allez
	const setSearchParams = useSetSearchParams()
	const doFilter = !hasLieu && searchInput?.length > 2
	const filteredCategories = useMemo(
		() =>
			doFilter
				? fuse
						.search(searchInput)
						.filter((el) => el.score < threshold)
						.map((el) => ({
							...categories[el.refIndex],
							score: el.score,
						}))
				: categories,

		[searchInput, hasLieu]
	)
	const filteredMoreCategories = useMemo(
		() =>
			doFilter
				? fuseMore
						.search(searchInput)
						.filter((el) => el.score < threshold)
						.map((el) => ({
							...moreCategories[el.refIndex],
							score: el.score,
						}))
				: moreCategories,

		[searchInput, hasLieu]
	)

	const getNewSearchParamsLink = buildGetNewSearchParams(
		searchParams,
		setSearchParams,
		categorySet
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
						touch-action: pan-x;
						white-space: nowrap;
						scrollbar-width: none;
						&::-webkit-scrollbar {
							width: 0px;
							height: 0px;
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
							${showMore &&
							`
							flex-wrap: wrap;
							li {margin-bottom: .3rem}

							`}
						`}
					>
						{!doFilter && (
							<>
								<li
									key="photos"
									css={`
										${quickSearchButtonStyle(searchParams.photos != null)}
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
							</>
						)}
						{filteredCategories.map((category) => {
							const theOne = categorySet?.name === category.name
							return (
								<li
									key={category.name}
									css={`
										${quickSearchButtonStyle(theOne)};
										${category.score < exactThreshold && goldCladding}
									`}
									title={category.title || category.name}
								>
									{theOne && !loaded && <SpinningDiscBorder />}
									<Link
										href={getNewSearchParamsLink(category)}
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
							!showMore ? 'invert(1)' : ''
						)}
					`}
				>
					<button
						onClick={() => {
							if (snap > 1) setSnap(1, 'QuickFeatureSearch')
							setShowMore(!showMore)
						}}
					>
						<Image
							src={'/icons/more.svg'}
							width="10"
							height="10"
							alt="Voir plus de catégories de recherche"
						/>
					</button>
				</div>
			</div>
			{(showMore || (doFilter && filteredMoreCategories.length > 0)) && (
				<MoreCategories
					getNewSearchParamsLink={getNewSearchParamsLink}
					categorySet={categorySet}
					filteredMoreCategories={filteredMoreCategories}
				/>
			)}
		</div>
	)
}

const buildGetNewSearchParams =
	(searchParams, setSearchParams, categorySet) => (category) => {
		const newSearchParams = {
			...omit(['cat'], searchParams),
			...(!categorySet || categorySet.name !== category.name
				? { cat: category.name }
				: {}),
		}
		return setSearchParams(newSearchParams, true, true)
	}
