import data from '@/app/voyage/cout-voiture/prix-autoroutes.csv'

console.log('Dada', data)

const result = data.reduce((memo, next) => {
	if (
		memo[next.Autoroute] &&
		next.avg_price_km_route !== memo[next.Autoroute]
	) {
		console.log(next, memo[next.Autoroute])
		throw new Error(
			'avg price should be the same on all Autoroutes with the same name'
		)
	}
	return { ...memo, [next.Autoroute]: next.avg_price_km_route }
}, {})
export default result
