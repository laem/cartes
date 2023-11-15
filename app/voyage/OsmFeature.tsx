import FriendlyObjectViewer from '@/components/FriendlyObjectViewer'

export default function OsmFeature({ data }) {
	const { name, ...rest } = data.tags
	return (
		<div>
			<h2
				css={`
					margin: 0;
					margin-bottom: 0.6rem;
					font-size: 110%;
					line-height: 1.3rem;
				`}
			>
				{name}
			</h2>
			<div
				css={`
					> div {
						background: var(--lighterColor);
					}
				`}
			>
				<FriendlyObjectViewer data={rest} />
			</div>
		</div>
	)
}
