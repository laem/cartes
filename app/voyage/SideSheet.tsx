import Content from './Content'

export default function SideSheet(props) {
	return (
		<div
			css={`
				background: var(--lighterColor);
				max-width: 40rem;
				margin-top: 1rem;
				padding: 1rem 0.6rem;
				border-radius: 0.6rem;
				max-height: calc(90vh - 15rem);
				overflow: scroll;
			`}
		>
			<Content {...props} />
		</div>
	)
}
