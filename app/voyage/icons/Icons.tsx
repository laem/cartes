import getIcons from './getIcons'

export default function Icons({ tags }) {
	const icons = getIcons(tags)
	return (
		<ul
			css={`
				display: inline-flex;
				align-items: center;
				list-style-type: none;
				li {
					margin-right: 0.2rem;
				}
				img {
					width: 1.4rem;
					height: 1.4rem;
					filter: invert(1);
					vertical-align: sub;
				}
			`}
		>
			{icons.map((icon) => (
				<li key={icon}>
					<img src={icon} width="10" height="10" />
				</li>
			))}
		</ul>
	)
}
