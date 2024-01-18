import useSetSearchParams from '@/components/useSetSearchParams'
import { omit } from '@/components/utils/utils'
import Fuse from 'fuse.js'
import Link from 'next/link'
import { useMemo } from 'react'
import categories from './categories.yaml'

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

const width = '2.2rem'

const fuse = new Fuse(categories, {
	keys: ['name', 'title', 'query', 'dictionary'],
	includeScore: true,
})

export default function QuickFeatureSearch({
	category: categorySet,
	searchParams, // dunno why params is not getting updated here, but updates hash though, we need searchParams
	searchInput,
}) {
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
				overflow: hidden;
				overflow-x: scroll;
				white-space: nowrap;
				height: 3.5rem;
				scrollbar-width: none;
				&::-webkit-scrollbar {
					width: 0px;
					background: transparent; /* Disable scrollbar Chrome/Safari/Webkit */
				}
			`}
		>
			<ul
				css={`
					padding: 0;
					list-style-type: none;
					display: flex;
					align-items: center;

					li {
						border-radius: ${width};

						margin-right: 0.2rem;
						img {
							padding: 0.2rem 0.2rem 0.1rem 0.2rem;
						}
						border: 2px solid var(--lighterColor);
					}
					li a {
						width: ${width};
						height: ${width};
						padding: 0;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					li a img {
						padding: 0;
						margin: 0;
						width: 1.2rem;
						height: 1.2rem;
					}
				`}
			>
				<li
					key="photos"
					css={`
						img {
							width: 1.6rem;
							height: auto;
							vertical-align: middle;
						}
						background: ${searchParams.photos !== 'oui'
							? 'white'
							: 'var(--lighterColor)'};

						${searchParams.photos === 'oui' &&
						`border-color: var(--darkColor) !important;

						img {
							filter: invert(23%) sepia(100%) saturate(1940%) hue-rotate(206deg)
								brightness(89%) contrast(84%);
						}`}
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
								text-align: center;
								img {
									width: 1.6rem;
									height: auto;
									vertical-align: middle;
									filter: invert(16%) sepia(24%) saturate(3004%)
										hue-rotate(180deg) brightness(89%) contrast(98%);
								}
								background: ${!categorySet
									? 'white'
									: categorySet.name === category.name
									? 'var(--lighterColor)'
									: 'white'};

								${categorySet?.name === category.name &&
								`border-color: var(--darkColor) !important;

img {filter: invert(23%) sepia(100%) saturate(1940%) hue-rotate(206deg) brightness(89%) contrast(84%);}

								`}
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
				<li
					key="onlyOpen"
					css={`
						background: ${!searchParams.o
							? 'var(--lighterColor)'
							: 'var(--darkColor)'} !important;
						width: auto !important;
						padding: 0 0.4rem !important;
						text-align: center;
						color: var(--darkerColor);
						height: 1.4rem !important;
						line-height: 1.2rem;
						a {
							color: inherit;
							text-decoration: none;
							font-size: 90%;
							width: 3rem !important;
							height: auto !important;
						}
					`}
				>
					<Link
						href={setSearchParams(
							{
								...omit(['o'], searchParams),
								...(searchParams.o ? {} : { o: 'oui' }),
							},
							true,
							true
						)}
					>
						Ouvert
					</Link>
				</li>
			</ul>
		</div>
	)
}
