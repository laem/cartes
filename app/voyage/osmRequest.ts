export const osmRequest = async (featureType, id, full) => {
	const request = await fetch(
		`https://api.openstreetmap.org/api/0.6/${featureType}/${id}${
			full ? '/full' : ''
		}.json`
	)
	const json = await request.json()

	return json.elements
}
