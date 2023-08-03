export default () =>
	fetch(
		'https://api.eia.gov/series/?api_key=hnH14aRQSrK2Ds4uV9u7uGZt6LvcjWsjKYZpKJG8&series_id=PET.RBRTE.D'
	)
		.then((res) => res.json())
		.then((json) => {
			const data = json.series[0].data[0]
			return [parseDate(data[0]), data[1]]
		})

export function parseDate(str) {
	var y = str.substr(0, 4),
		m = str.substr(4, 2) - 1,
		d = str.substr(6, 2)
	var D = new Date(y, m, d)
	return D.getFullYear() == y && D.getMonth() == m && D.getDate() == d
		? D
		: 'invalid date'
}
