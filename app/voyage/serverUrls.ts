export const gtfsServerUrl =
	process.env.NEXT_PUBLIC_LOCAL_GTFS_SERVER === 'true'
		? 'http://localhost:3001'
		: 'https://motis.cartes.app/gtfs'
