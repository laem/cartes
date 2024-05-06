import { capitalise0 } from '@/components/utils/utils'
import { trainColors } from '../itinerary/motisRequest'

// these are filter functions that select lines depending on properties
// then, another function will adapt to keep only the points where filtered
// routes pass
export const transitFilters = [
	['tout', { filter: (data) => data }],
	['métro', { filter: (data) => data.properties.route_type === 1 }],
	['tram', { filter: (data) => data.properties.route_type === 0 }],
	[
		'bus',
		{
			filter: (data) =>
				console.log('yellow', data) || data.properties.route_type === 3,
		},
	],
	[
		'fréquent',
		{
			filter: (feature) =>
				console.log('cornflowerblue fréquent') ||
				feature.properties.perDay > 10000,
		},
	],
	['bus de nuit', { filter: (data) => data.properties.isNight }],
	['bus scolaire', { filter: (data) => data }],
]
export default function TransitFilter({
	data,
	transitFilter,
	setTransitFilter,
}) {
	if (!data || !data.length) return null
	const features = data
		.map(
			([
				agencyId,
				{
					geojson: { features },
				},
			]) => features
		)
		.flat()
	console.log('cornflowerblue data', data, features)
	const filtered = transitFilters.map(([key, { filter }]) => {
		const routes = features.filter(
			(feature) => feature?.geometry?.type === 'LineString'
		)
		const filtered = routes.filter(filter)
		const selectedRoutes = filtered.length

		return [key, selectedRoutes]
	})
	return (
		<section>
			<form
				css={`
					width: 100%;
					overflow: scroll;
					height: 2.4rem;
					label {
						margin: 0.6rem;
						white-space: nowrap;
					}
					input {
						margin-right: 0.4rem;
					}
				`}
			>
				{filtered.map(([key, selectedRoutes]) => {
					return (
						<label
							key={key}
							css={`
								background: white;
								padding: 0 0.6rem 0.1rem 0.4rem;
								border-radius: 0.3rem;
								border: 1px solid var(--darkColor);
								color: var(--darkColor);
								cursor: pointer;
							`}
						>
							<input
								type="radio"
								checked={key === transitFilter}
								onClick={() => setTransitFilter(key)}
							/>
							{capitalise0(key)} ({selectedRoutes})
						</label>
					)
				})}
			</form>
		</section>
	)
}
