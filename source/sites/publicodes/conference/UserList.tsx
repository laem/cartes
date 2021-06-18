import emoji from 'react-easy-emoji'
import { findContrastedTextColor } from '../../../components/utils/colors'
export default ({ users, username }) => (
	<ul
		css={`
			display: flex;
			list-style-type: none;
			flex-wrap: wrap;
			li {
				margin: 0.6rem;
			}
		`}
	>
		{users.map((u) => (
			<li
				key={u.name}
				css={`
					background: ${u.color};
					color: ${findContrastedTextColor(u.color, true)};
					padding: 0.1rem 0.4rem;
					border-radius: 0.6rem;
				`}
			>
				{u.name}
				{u.name === username && ' (toi)'}
			</li>
		))}
	</ul>
)
