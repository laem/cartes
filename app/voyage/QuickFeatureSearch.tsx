import Emoji from '@/components/Emoji'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import categories from './categories.yaml'

const width = '2rem'
export default function QuickFeatureSearch({ category: categorySet }) {
	const pathname = usePathname(),
		params = useParams()

	const [hash, setHash] = useState(null)

	useEffect(() => {
		setHash(window.location.hash)
	}, [params])

	return (
		<ul
			css={`
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
				const newSearchParams = { cat: category.name }

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
								pathname +
								'?' +
								new URLSearchParams(
									!categorySet
										? newSearchParams
										: categorySet.name === category.name
										? {}
										: newSearchParams
								) +
								hash
							}
							replace={true}
							prefetch={false}
						>
							<Emoji e={category.emoji} />
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
