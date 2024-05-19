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
	// Algo : we're splitting to 1m bits, disregarding the possibility that some
	// semgents are < 1m
	// Then averaging them to 10 m segments
	// It's not very efficient but we don't care for this kind of load, feel free :)

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
}
