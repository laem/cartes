import emoji from 'react-easy-emoji'
export default ({ users, username }) => (
	<ul
		css={`
			display: flex;
			list-style-type: none;
			li {
				margin: 0.6rem;
			}
		`}
	>
		{users.map((u) => (
			<li
				key={u.name}
				css={`
					color: ${u.color};
				`}
			>
				{emoji('👤 ')}
				{u.name}
				{u.name === username && ' (toi)'}
			</li>
		))}
	</ul>
)
