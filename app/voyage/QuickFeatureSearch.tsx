import useSetSearchParams from '@/components/useSetSearchParams'
import { omit } from '@/components/utils/utils'
import Link from 'next/link'
import categories from './categories.yaml'

export const categoryIconUrl = (category) => {
	const queryKey = Object.keys(category.query)[0],
		queryValue = category.query[queryKey],
		queryFirstValue = Array.isArray(queryValue) ? queryValue[0] : queryValue

	const url = category.icon
		? '/icons/' + category.icon + '.svg'
		: `https://cdn.jsdelivr.net/gh/gravitystorm/openstreetmap-carto@5.8.0/symbols/${queryKey}/${queryFirstValue}.svg`
	return url
}

const width = '2.2rem'
export default function QuickFeatureSearch({
	category: categorySet,
	searchParams, // dunno why params is not getting updated here, but updates hash though, we need searchParams
}) {
	const setSearchParams = useSetSearchParams()

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
				{categories.map((category) => {
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
