import Emoji from '@/components/Emoji'
import { omit } from '@/components/utils/utils'
import { NoopObservableUpDownCounterMetric } from '@opentelemetry/api/build/src/metrics/NoopMeter'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import categories from './categories.yaml'

const width = '2rem'
export default function QuickFeatureSearch({
	category: categorySet,
	searchParams, // dunno why params is not getting updated here, but updates hash though, we need searchParams
}) {
	const pathname = usePathname(),
		params = useParams()

	const [hash, setHash] = useState(null)

	useEffect(() => {
		setHash(window.location.hash)
	}, [params])

	return (
		<ul
			css={`
				margin-top: 0.8rem;
				padding: 0;
				list-style-type: none;
				display: flex;
				align-items: center;
				li {
					width: ${width};
					height: ${width};
					border-radius: ${width};

					margin-right: 0.2rem;
					img {
						padding: 0.2rem;
					}
					border: 1px solid var(--lightestColor);
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
								? 'var(--lighterColor)'
								: categorySet.name === category.name
								? 'var(--darkColor)'
								: 'var(--lighterColor)'};
						`}
					>
						<Link
							href={
								pathname + '?' + new URLSearchParams(newSearchParams) + hash
							}
							replace={true}
							prefetch={false}
						>
							<Emoji e={category.emoji} />
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
					width: 8rem !important;
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
					href={
						pathname +
						'?' +
						new URLSearchParams({
							...omit(['o'], searchParams),
							...(searchParams.o ? {} : { o: 'oui' }),
						}) +
						hash
					}
				>
					Seulement ouvert
				</Link>
			</li>
		</ul>
	)
}
