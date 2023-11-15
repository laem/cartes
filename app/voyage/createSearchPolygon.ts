const createSearchBBox = (latLngClicked) => {
	const diffLng = 0.0005,
		diffLat = 0.0003
	const { lat, lng } = latLngClicked

	const lat1 = +lat - diffLat,
		lng1 = +lng + diffLng,
		lat2 = +lat1 + diffLat,
		lng2 = +lng1 - diffLng

	const result = { lat1, lng1, lat2, lng2 }
	console.log(result)
	return result
}

export default createSearchBBox
