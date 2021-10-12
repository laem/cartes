import { Link } from 'react-router-dom'
import SessionBar from 'Components/SessionBar'
import ConferenceBarLazy from './conference/ConferenceBarLazy'
import Logo, { InlineLogo } from './Logo'

export default ({ isHomePage }) => (
	<>
		<ConferenceBarLazy />
		<nav
			css={`
				display: flex;
				justify-content: center;
				margin: 0.6rem auto;

				@media (min-width: 800px) {
					flex-shrink: 0;
					width: 12rem;
					height: 100vh;
					overflow: auto;
					position: sticky;
					top: 0;
					flex-direction: column;
					justify-content: start;
					border-right: 1px solid #eee;
				}
				${isHomePage && `display: none`}
			`}
		>
			<Link
				to="/"
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
					text-decoration: none;
					font-size: 170%;
					margin-bottom: 0;
					#blockLogo {
						display: none;
					}
					@media (min-width: 800px) {
						margin-bottom: 0.4rem;
						#inlineLogo {
							display: none;
						}
						justify-content: start;
						#blockLogo {
							margin: 1rem;
							display: block;
						}
					}
				`}
			>
				<Logo />
				<InlineLogo />
			</Link>
			{location.pathname !== '/' && <SessionBar />}
		</nav>
	</>
)
