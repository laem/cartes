import useSetSearchParams from '@/components/useSetSearchParams'
import Image from 'next/image'
import {
	AddressDisc,
	AddressDiscContainer,
	buildAddress,
} from '@/components/voyage/Address'
import { SoloTags } from '@/components/voyage/Tags'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'
import { pointHash } from './BookmarkButton'
import { processTags } from './OsmFeature'
import { DialogButton } from './UI'
import { buildAllezPart, geoFeatureToDestination } from './SetDestination'

export default function QuickBookmarks() {
	const [bookmarks] = useLocalStorage('bookmarks', [])
	const [tutorials, setTutorials] = useLocalStorage('tutorials', {})
	const setSearchParams = useSetSearchParams()
	const bookmarksUrl = setSearchParams({ favoris: 'oui' }, true)
	if (!tutorials.bookmarks && !bookmarks?.length)
		return (
			<p
				css={`
					color: #666;
					line-height: 1.2rem;
					margin: 0.6rem 0 0.2rem 0;
					img {
						height: 1rem;
						width: 1rem;
						vertical-align: middle;
					}
				`}
			>
				<small>
					Ajoutez des favoris avec l'étoile{' '}
					<Image src="/star.svg" alt="" width="10" height="10" /> après une
					recherche
				</small>
				<DialogButton
					css={`
						font-size: 80%;
						margin-left: 0.3rem;
					`}
					onClick={() => setTutorials({ ...tutorials, bookmarks: true })}
				>
					OK
				</DialogButton>
			</p>
		)
	if (bookmarks?.length)
		return (
			<section
				css={`
					h3 {
						font-size: 90%;
						color: #666;
						font-weight: 500;
						margin: 0.2rem 0;
					}
					h3 + p {
						margin-left: 1rem;
					}
					header {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
				`}
			>
				<header>
					<h2>Mes favoris</h2>
					<Link href={bookmarksUrl}>Modifier</Link>
				</header>

				<section>
					<h3>Adresses</h3>
					<ul
						css={`
							padding-left: 0.6rem;
							display: flex;
							align-items: center;
							> li {
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
					<p>
						<small>À venir.</small>
					</p>
				</section>
			</section>
		)
}

const QuickBookmark = ({ bookmark }) => {
	const photonAddress = buildAddress(bookmark.properties, true),
		osmAddress =
			bookmark.properties.id && buildAddress(bookmark.properties, false),
		address = photonAddress || osmAddress

	const name = bookmark.properties.name
	console.log('lightblue bookmark', bookmark)
	const destination = geoFeatureToDestination(bookmark)
	const setSearchParams = useSetSearchParams()
	return (
		<li
			key={pointHash(bookmark)}
			css={`
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0.3rem 0;
				margin-bottom: 0.4rem;
				a {
					text-decoration: none;
				}
			`}
		>
			<Link href={setSearchParams({ allez: destination }, true)}>
				{name ? (
					<AddressDiscContainer>
						<SoloTags
							compact={true}
							tags={processTags(bookmark.properties)[1]}
							iconsOnly={true}
						/>
						<span>{name}</span>
					</AddressDiscContainer>
				) : address ? (
					<AddressDisc
						{...{ t: bookmark.properties, noPrefix: osmAddress == null }}
					/>
				) : (
					<div>
						Point <small>{pointHash(bookmark)}</small>
					</div>
				)}
			</Link>
		</li>
	)
}
