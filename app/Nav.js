'use client'
import Link from 'next/link'
import { Footer } from './NavUI'

export default function Nav({}) {
	return (
		<nav
			css={`
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				background: linear-gradient(var(--color1), var(--color2));
				a {
					color: white;
					text-decoration: none;
					font-weight: 600;
				}
				padding: 0.6rem;
			`}
		>
			<ul
				css={`
					margin: 0rem;
					display: flex;
					justify-content: center;
					padding-left: 0;
					font-size: 120%;
					align-items: center;
					li {
						margin: 0 1rem;
						list-style-type: none;
					}
				`}
			>
				<li>
					<Link href="/">
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/3/34/Home-icon.svg"
							width="10px"
							height="10px"
							css={`
								width: 1.2rem;
								height: auto;
								filter: invert(1);
							`}
						/>
					</Link>
				</li>
				{false && (
					<>
						<li>
							<Link href={`/explications`}>Explications</Link>
						</li>
						<li>
							<a
								href="https://github.com/laem/villes.plus"
								title="Le code source sur Github"
							>
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
									width="10px"
									height="10px"
									css={`
										width: 1.2rem;
										height: auto;
										filter: invert(1);
									`}
								/>
							</a>
						</li>
					</>
				)}
			</ul>
		</nav>
	)
}

export const NavFooter = () => (
	<Footer>
		Fait avec 🥞 à Rennes par <a href="https://kont.me">Maël THOMAS</a>
	</Footer>
)
