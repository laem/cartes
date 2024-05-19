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
		if (slope < 0) return '#8f53c1' // give another color for negative slopes ?
		if (slope < 3) return '#8f53c1'
		if (slope < 5) return '#ae838a'
		if (slope < 7.5) return 'yellow'
		if (slope < 10) return 'orange'
		return 'red'
	}
	console.log('indigo', geojson)
	const coordinates = geojson.features[0].geometry.coordinates

	const distanceColors = coordinates
		.slice(0, -1)
		.map(([lon, lat, meters], i) => {
			const distance = turfDistance([lon, lat], coordinates[i + 1]) * 1000
			const elevationDifference = coordinates[i + 1][2] - meters

			const slope = 100 * (elevationDifference / distance)

			return [distance, elevationDifference]
		})

	// Slopes are quite erratic. We're getting e.g. 16 % for 1.5m at 0.25 of diff,
	// then 0 % for 20 m
	// hence the need to average
	// We can do it every 10 meters

	const totalDistance = distanceColors.reduce((memo, next) => memo + next[0], 0)

	const littles = distanceColors
		.map(([distance, elevationDifference]) =>
			[...new Array(Math.round(distance))].map(
				(el) => (elevationDifference * 100) / Math.round(distance)
			)
		)
		.flat()

	const chunkSize = 10
	const averaged = []
	for (let i = 0; i < littles.length; i += chunkSize) {
		const chunk = littles.slice(i, i + chunkSize)
		const sum = chunk.reduce((memo, next) => memo + next, 0)

		averaged.push(sum / 10)
	}

	const lineProgressAveraged = averaged
		.map((slope, i) => [(i * chunkSize) / totalDistance, slopeColor(slope)])
		.flat()

	console.log(
		'distanceco',
		lineProgressAveraged
		//	littles.map((little) => Math.round(little * 10) / 10)
	)
	return lineProgressAveraged
	/*
	const segmentLength = 30,
		segmentNumber = Math.floor(totalDistance / segmentLength),
		averaged = [...new Array(segmentNumber)].map((_, i) => {
			const from = segmentLength * i,
				to = from + segmentLength

			const elevationDifference = distanceColors.reduce(
				(memo, next) => {
					if (memo.done) return memo
					const [distance, _, _, elevation] = next

					if (memo.distance + next.distance > segmentLength)
						return {
							done: true,
							elevation:
								memo.elevation +
								elevation * (distance / (segmentLength - memo.distance)),
						}

					else return {elevation: memo.elevation + elevation, distance: memo.distance + distance}

				},
				{ distance: 0, elevation: 0, done: false }
			)
		})

/*
	/*
	const averaged = distanceColors.reduce((memo, next)=>{
		const [distance,_, slope, elevationDifference] = next
		const last = memo[memo.length-1]

		const remainingToCloseSegment = 30 - last.distance

		if (remainingToCloseSegment >= 0) {

			return [...memo.slice(0, -1), {last.distance }]

		}
		if (remainingToCloseSegment < 0)

	}, [{distance: 0}])
	*/

	console.log(
		'indigo distanceColors',
		averaged,
		distanceColors.map(([distance, color, slope, difference]) =>
			[
				difference,
				' sur ',
				Math.round(distance * 10) / 10,
				' m à ',
				Math.round(slope * 10) / 10,
				' %',
			].join('')
		)
	)
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
