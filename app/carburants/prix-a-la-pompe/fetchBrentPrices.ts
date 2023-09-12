export default function fetchBrentPrices() {
	return fetch(
		'https://api.eia.gov/v2/seriesid/PET.RBRTE.D?api_key=hnH14aRQSrK2Ds4uV9u7uGZt6LvcjWsjKYZpKJG8'
	)
		.then((res) => res.json())
		.then((json) => {
			const data = json.response.data[0]
			const result = [parseDate(data.period), data.value]
			console.log(result)
			return result
		})
}

export function parseDate(str) {
	var y = str.substr(0, 4),
		m = str.substr(5, 2) - 1,
		d = str.substr(8, 2)
	var D = new Date(y, m, d)
	return D.getFullYear() == y && D.getMonth() == m && D.getDate() == d
		? D
		: 'invalid date'
}
