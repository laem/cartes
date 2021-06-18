import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'
export default ({ children, icon, to, onClick }) => (
	<Link
		to={to}
		className="ui__ button plain"
		css={`
			margin: 0.6rem 0;
			width: 100%;
			text-transform: none !important;
			img {
				font-size: 200%;
			}
			a {
				color: var(--textColor);
				text-decoration: none;
			}
		`}
		onClick={onClick}
	>
		<div
			css={`
				display: flex;
				justify-content: flex-start;
				align-items: center;
				width: 100%;
				> div {
					margin-left: 1.6rem;
					text-align: left;
					small {
						color: var(--textColor);
					}
				}
			`}
		>
			{emoji(icon)}

			{children}
		</div>
	</Link>
)
