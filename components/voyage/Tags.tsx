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
					{k} : {v}
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
			`}
		>
			{tags.map((tag) => (
				<li key={tag}>{tag}</li>
			))}
		</ul>
	)
}
