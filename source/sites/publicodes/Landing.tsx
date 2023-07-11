import { Link } from 'react-router-dom'

import Emoji from '../../components/Emoji'
import { LoudButton } from './UI'

export default () => {
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
				className="ui__ container"
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
				<LoudButton to="instructions">Faire le test</LoudButton>
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
					<Link to="/ferry">
						<li className="ui__ interactive card light-border box">
							<div class="ui__ big box-icon">
								<Emoji e="⛴️" />
							</div>
							<h3>Ferry</h3>
						</li>
					</Link>
					<Link to="/simulateur/transport/avion/impact">
						<li className="ui__ interactive card light-border box">
							<div class="ui__ big box-icon">
								<Emoji e="✈️" />
							</div>
							<h3>Avion</h3>
						</li>
					</Link>
					<Link to="/wiki">
						<li className="ui__ interactive card light-border box">
							<div class="ui__ big box-icon">
								<Emoji e="➕" />
							</div>
							<h3>Tout le reste</h3>
						</li>
					</Link>
				</ul>

				<footer css="display: flex; justify-content: center; align-items: center; height: 3rem">
					<div
						css={`
							display: flex;
							justify-content: center;
							flex-wrap: wrap;
							> * {
								margin: 0 0.6rem;
							}
						`}
					>
						<Link to="/à-propos">À propos</Link>
					</div>
					<img src="/logo.svg" css="width: 2rem !important" />
				</footer>
			</div>
		</div>
	)
}
