//TODO complete with spec possibilities https://gtfs.org/fr/schedule/reference/#routestxt
export default function (frenchTrainType, routeType, route) {
	if (frenchTrainType) return `/transit/${frenchTrainType.toLowerCase()}.svg`

	const correspondance = {
		0: '/icons/tram.svg',
		1: '/icons/metro.svg',
		2: '/icons/train.svg',
		3: '/icons/bus.svg',
		4: '/icons/ferry.svg',
		5: '/icons/tram.svg', // so rare
		6: '/icons/téléphérique.svg',
		7: '/icons/funiculaire.svg',
		11: '/icons/trolleybus.svg',
		12: '/icons/train.svg', // how to represent this ?
	}
	if (route?.route_id === 'BIBUS:C') return correspondance[6] // LOL, merci bibus, you had one job...
	const found = correspondance[routeType]
	return found || '/icons/bus.svg'
}
