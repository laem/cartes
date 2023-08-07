'use client';
import Link from 'next/link'

import Emoji from 'Components/Emoji'
import { Card, LoudButton } from 'Components/UI'

const Page = () => {
	return (
		<div
			css={`
				height: 100%;
				> div > a {
				}
				text-align: center;
				> img {
					height: 50vh;
					object-fit: cover;
					width: 100vw;
					-webkit-mask-image: -webkit-gradient(
						linear,
						left top,
						left bottom,
						from(rgba(0, 0, 0, 1)),
						to(rgba(0, 0, 0, 0))
					);
					z-index: -10;
					position: relative;
				}
				strong {
				}
			`}
		>
			<img
				srcSet="https://i.imgur.com/HXWewY4l.jpg 640w, https://i.imgur.com/HXWewY4.jpg 1720w "
				src="https://i.imgur.com/HXWewY4.jpg"
			/>

			<div
				css={`
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;
					align-items: center;
					height: 48%;
					img {
						font-size: 140%;
						vertical-align: middle !important;
					}
					strong {
						background: var(--color);
					}

					header {
						h1 {
							font-size: 300%;
							margin-bottom: 0.6rem;
							line-height: 2.4rem;
							margin-top: -12rem;
						}
						h1 + p {
							margin-bottom: 1rem;
						}
						@media (min-width: 800px) {
							h1 {
								font-size: 400%;
								line-height: 4rem;
							}
						}
					}
					h2 {
						font-size: 200%;
					}
				`}
			>
				<header>
					<h1>
						<strong>Écolo</strong>,
						<br /> ou pas ?
					</h1>
					<p>
						<em>
							Le jeu dont <em>vous</em> êtes le héros.
						</em>
					</p>
				</header>
				<LoudButton to="/instructions">Faire le test</LoudButton>
				<p>
					<Emoji e="⏱️" /> 2 minutes chrono
				</p>

				<h2>Mini-calculateurs</h2>
				<ul
					css={`
						display: flex;
						justif-content: center;
						li {
							min-width: 12rem;
						}
						@media (max-width: 800px) {
							li {
								min-width: 8rem;
							}
							width: 100%;
							flex-wrap: nowrap;
							overflow-x: auto;
							white-space: nowrap;
							justify-content: normal;
							height: 12rem;
							scrollbar-width: none;
							display: flex;
						}
					`}
				>
					{/*
					<Link href="/ferry">
						<Card>
							<div>
								<Emoji e="⛴️" />
							</div>
							<h3>Ferry</h3>
						</Card>
					</Link>
					*/}
					<Link href="/simulateur/transport/avion/impact">
						<Card>
							<div>
								<Emoji e="✈️" />
							</div>
							<h3>Avion</h3>
						</Card>
					</Link>
					<Link href="/wiki">
						<Card>
							<div>
								<Emoji e="➕" />
							</div>
							<h3>Tout le reste</h3>
						</Card>
					</Link>
				</ul>
			</div>
		</div>
	)
};

export default Page;
