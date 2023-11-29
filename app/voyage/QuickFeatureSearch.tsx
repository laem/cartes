import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import useSetSeachParams from '@/components/useSetSearchParams'
import useTraceComponentUpdate from '@/components/utils/useTraceComponentUpdate'
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
	const setSearchParams = useSetSeachParams()

	return (
		<div
			css={`
				margin-top: 0.8rem;
				overflow: hidden;
				overflow-x: scroll;
				white-space: nowrap;
				max-width: 90vw;
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
						border: 2px solid var(--darkColor);
					}
					li a {
						width: ${width};
						height: ${width};
						display: block;
						padding: 0;
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
							key={category.emoji}
							css={`
								background: ${!categorySet
									? 'var(--lightestColor)'
									: categorySet.name === category.name
									? 'var(--darkColor)'
									: 'var(--lightestColor)'};
								text-align: center;
								img {
									width: 1.6rem;
									height: auto;
									vertical-align: middle;
								}
							`}
							title={category.title}
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
