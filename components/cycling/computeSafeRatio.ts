export default function computeSafeRatio(cyclingSegmentsGeojson) {
	const [secure, total] = cyclingSegmentsGeojson.features.reduce(
		(memo, next) => {
			const d = +next.properties.distance
			return [
				memo[0] + (next.properties.isSafePath === 'oui' ? d : 0),
				memo[1] + d,
			]
		},
		[0, 0]
	)
	return secure / total
}
