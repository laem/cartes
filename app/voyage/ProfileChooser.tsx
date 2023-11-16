import profiles from './bikeRouteProfiles.yaml'

export default function ProfileChooser({
	bikeRouteProfile,
	setBikeRouteProfile,
}) {
	return (
		<div>
			{profiles.map(({ key, name }) => (
				<label
					key={key}
					css={`
						margin: 0 1rem;
					`}
				>
					<input
						type="radio"
						name={key}
						value={key}
						checked={bikeRouteProfile === key}
						onChange={(e) => setBikeRouteProfile(e.target.value)}
					/>
					{name}
				</label>
			))}
		</div>
	)
}
