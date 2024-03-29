import { useLocalStorage } from 'usehooks-ts'
import { pointHash } from './BookmarkButton'
import Image from 'next/image'
import { AddressDisc, buildAddress } from '@/components/voyage/Address'

export default function QuickBookmarks() {
	const [bookmarks] = useLocalStorage('bookmarks', [])
	console.log('purple', bookmarks)
	return (
		<section>
			<h2>Mes favoris</h2>

			<h3>Adresses</h3>
			<ul
				css={`
					padding-left: 0.6rem;
					display: flex;
					align-items: center;
					li {
						display: flex;
						align-items: center;
						margin: 0 0.4rem;
					}
				`}
			>
				{bookmarks.map((bookmark) => (
					<QuickBookmark key={pointHash(bookmark)} bookmark={bookmark} />
				))}
			</ul>
			<h3>Itinéraires</h3>
			<p>Bientôt.</p>
		</section>
	)
}

const QuickBookmark = ({ bookmark }) => {
	const address = buildAddress(bookmark.properties, true)
	console.log('purple add', address, bookmark.properties)
	return (
		<li
			key={pointHash(bookmark)}
			css={`
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0.3rem 0;
				margin-bottom: 0.4rem;
				border-bottom: 1px solid var(--lightestColor);
			`}
		>
			{address ? (
				<AddressDisc {...{ t: bookmark.properties, noPrefix: true }} />
			) : (
				<div>
					Point <small>{pointHash(bookmark)}</small>
				</div>
			)}
		</li>
	)
}
