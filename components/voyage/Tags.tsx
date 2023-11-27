import Emoji from '../Emoji'

const cleanHttp = (v) => v.replace(/https?:\/\//g, '').replace(/www\./g, '')
export default function Tags({ tags }) {
	return (
		<ul
			css={`
				padding-left: 0.6rem;
				list-style-type: none;
				border-left: 4px solid var(--lightColor);
				line-height: 1.4rem;
			`}
		>
			{tags.map(([k, v]) => (
				<li key={k + v}>
					{k === 'Site Web' ? (
						<a
							href={v}
							target="_blank"
							title="Site Web"
							css={`
								color: inherit;
							`}
						>
							<Emoji e="🌍️" /> <span>{cleanHttp(v)}</span>
						</a>
					) : (
						<span>
							{k} : {v}
						</span>
					)}
				</li>
			))}
		</ul>
	)
}

export function SoloTags({ tags }) {
	return (
		<ul
			css={`
				list-style-type: none;
				display: flex;
				align-items: center;
				li {
					margin-right: 0.6rem;
				}
				overflow: scroll;
				white-space: nowrap;
				margin-bottom: 0.2rem;
			`}
		>
			{tags.map((tag) => (
				<li key={tag}>{tag}</li>
			))}
		</ul>
	)
}
