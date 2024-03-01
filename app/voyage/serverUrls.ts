export const gtfsServerUrl =
	process.env.LOCAL_GTFS_SERVER === 'true'
		? 'http://localhost:3000'
		: 'https://motis.cartes.app/gtfs'
