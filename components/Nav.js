'use client'
import Link from 'next/link'
import { Footer } from './NavUI'
import { usePathname } from 'next/navigation'
import Emoji from './Emoji'

export default function Nav({}) {
	const pathname = usePathname()
	const displayIntro = ['/', '/wiki', '/contribuer/', '/a-propos'].includes(
		pathname
	)
	if (pathname === '/' || pathname.includes('/fin')) return null
	return (
		<nav>
			<section
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0.6rem;
					margin-bottom: 0;
					@media (max-width: 800px) {
						padding: 0;
					}
				`}
			>
				<Link href="/" title="Revenir à l'accueil">
					<img
						width="10px"
						height="10px"
						css={`
							aspect-ratio: 1 / 1;
							width: ${displayIntro ? '8em' : '5em'};
							height: auto;
							@media (max-width: 800px) {
								${displayIntro ? 'display: none;' : ''}
							}
						`}
						src={'/logo.svg'}
						alt=""
					/>
				</Link>
				{displayIntro && (
					<p
						id="intro"
						css="max-width: 25rem; line-height: 1.4rem; margin-right: 1em; "
					>
						{displayIntro && (
							<img
								css={`
									aspect-ratio: 1 / 1;
									width: 1.4rem;
									vertical-align: text-bottom;
									display: inline;
									@media (min-width: 800px) {
										display: none;
									}
									margin-right: 0.4em;
								`}
								src={'/logo.svg'}
								alt=""
								width="10px"
								height="10px"
							/>
						)}
						La catastrophe climatique n'est plus une menace lointaine, c'est une
						actualité.&nbsp;<Link href="/a-propos">En savoir plus</Link>.
					</p>
				)}
				{!pathname.includes('/scenarios') && (
					<div
						css={`
							img {
								width: 2rem;
								height: auto;
							}
							position: fixed;
							right: 1rem;
							top: 2rem;
						`}
					>
						<Link href="/scenarios" title="Paramètres">
							<Emoji e="⚙️" />
						</Link>
					</div>
				)}
			</section>
		</nav>
	)
}

export const NavFooter = () => (
	<Footer>
		<div
			css={`
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
			`}
		>
			<Link href="/a-propos">À propos</Link>
		</div>
		<img
			src="/logo.svg"
			css="width: 2rem !important; height: auto;margin-left: 1rem"
			width="10px"
			height="10px"
		/>
	</Footer>
)
