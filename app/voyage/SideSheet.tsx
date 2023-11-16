import Content from './Content'

export default function SideSheet({
	isSheetOpen,
	setSheetOpen,
	clickedGare,
	bikeRoute,
	osmFeature,
	latLngClicked,
}) {
	return (
		<div
			css={`
				background: var(--lighterColor);
				width: 40rem;
				margin-top: 1rem;
				padding: 1rem 0.6rem;
				border-radius: 0.6rem;
				height: calc(90vh - 15rem);
				overflow: scroll;
			`}
		>
			<Content
				{...{
					isSheetOpen,
					setSheetOpen,
					clickedGare,
					bikeRoute,
					osmFeature,

					latLngClicked,
				}}
			/>
		</div>
	)
}
