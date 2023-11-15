export const osmRequest = async (featureType, id) => {
	const request = await fetch(
		`https://api.openstreetmap.org/api/0.6/${featureType}/${id}.json`
	)
	const json = await request.json()

	return json.elements
}
