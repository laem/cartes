import { capitalise0, sortBy } from '@/components/utils/utils'
import { area, bboxPolygon } from '@turf/turf'

export const defaultAgencyFilter = 'urbain'
// these are filter functions that select lines depending on properties
// then, another function will adapt to keep only the points where filtered
// routes pass

export const getAgencyFilter = (keyTest) =>
	agencyFilters.find(([key]) => keyTest(key))[1]

export const agencyFilters = [
	[
		'urbain',
		{
			filter: (agency) => {
				const { routeTypeStats: stats, bbox } = agency
				const areaKm2 = area(bboxPolygon(bbox)) / 1000000
				// because flixbus has route type 3, this old attribute does not
				// distinguish local buses and long range buses, what a bad decision
				if (areaKm2 > 3000) return

				return (stats[3] || 0) + (stats[1] || 0) > 0.8
			},
		},
	],
	[
		'train',
		{
			filter: (agency) => agency.routeTypeStats[2] > 0.7, // SNCF has .79 train
		},
	],
	[
		'car',
		{
			filter: (agency) => {
				const { routeTypeStats: stats, bbox } = agency
				// example taken from PENNARBED
				console.log(
					'orange agency car stats',
					agency,
					sumOfRouteTypes(['2xx'], stats)
				)
				if (sumOfRouteTypes(['2xx', 715], stats) > 0.7) return true

				const areaKm2 = area(bboxPolygon(bbox)) / 1000000
				// because flixbus has route type 3, this old attribute does not
				// distinguish local buses and long range buses, what a bad decision
				if (areaKm2 < 3000) return

				return stats[3] > 0.7
			},
		},
	],
]

const sumOfRouteTypes = (types, stats) =>
	types.reduce((memo, next) => {
		if (typeof next === 'string' && next.match(/\dxx/)) {
			const sum = Object.entries(stats)
				.filter(([key, value]) => key >= 100 && ('' + key).startsWith(+next[0]))
				.reduce((memo2, [_, next2]) => memo2 + next2, 0)
			return sum + memo
		}
		return (stats[next] || 0) + memo
	}, 0)
export default function AgencyFilter({ agencyFilter, setAgencyFilter }) {
	return (
		<section
			css={`
				margin-top: 1rem;
			`}
		>
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
				{agencyFilters.map(([key]) => (
					<label>
						<input
							type="checkbox"
							checked={agencyFilter === key}
							key={key}
							onClick={() => setAgencyFilter(key)}
						/>
						{key}
					</label>
				))}
			</form>
		</section>
	)
}
