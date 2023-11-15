import Emoji from '@/components/Emoji'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import categories from './categories.yaml'

const width = '2rem'
export default function QuickFeatureSearch() {
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
					background: var(--darkColor);
					margin-right: 0.2rem;
					img {
						padding: 0.2rem;
					}
				}
			`}
		>
			{categories.map((category) => (
				<li key={category.emoji}>
					<Link
						href={
							pathname +
							'?' +
							new URLSearchParams({ cat: category.name }) +
							hash
						}
						replace={true}
						prefetch={false}
					>
						<Emoji e={category.emoji} />
					</Link>
				</li>
			))}
		</ul>
	)
}
