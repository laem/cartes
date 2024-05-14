import turfDistance from '@turf/distance'
const lineProgress = [
	0,
	'blue',
	0.1,
	'royalblue',
	0.3,
	'cyan',
	0.5,
	'lime',
	0.7,
	'yellow',
	1,
	'red',
]
export function computeSlopeGradient(geojson) {
	const slopeColor = (slope) => {
		if (slope < 1) return '#01ff13'

		if (slope < 3) return 'yellow'
		if (slope < 5) return 'orange'
		if (slope < 10) return 'red'
		return 'black'
	}
	console.log('indigo', geojson)
	const coordinates = geojson.features[0].geometry.coordinates

	const distanceColors = coordinates
		.slice(0, -1)
		.map(([lon, lat, meters], i) => {
			const distance = turfDistance([lon, lat], coordinates[i + 1]) * 1000
			const elevationDifference = coordinates[i + 1][2] - meters

			const slope = 100 * (elevationDifference / distance)
			console.log(
				'indigo',
				'+ ',
				elevationDifference,
				' pour distance de ',
				Math.round(distance),
				' et une pente de ',
				Math.round(slope),
				'%'
			)

			return [distance, slopeColor(slope)]
		})
	const totalDistance = distanceColors.reduce((memo, next) => memo + next[0], 0)

	console.log('indigo', distanceColors)
	const lineProgress = distanceColors.reduce(
		(memo, [distance, color]) => {
			const d = Math.min(1, memo.slice(-1)[0][0] + distance / totalDistance)
			return [...memo, [d, color]]
		},
		[[0, distanceColors[0][1]]]
	)
	console.log('indigo', lineProgress)
	return lineProgress.flat()
}
