export const gtfsServerUrl =
	process.env.NEXT_PUBLIC_LOCAL_GTFS_SERVER === 'true'
		? 'http://localhost:3001'
		: 'https://motis.cartes.app/gtfs'

export const getFetchUrlBase = () => {
	const branchUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
		isMaster = branchUrl?.includes('-git-master-'),
		domain = isMaster ? 'cartes.app' : branchUrl
	const urlBase =
		process.env.NEXT_PUBLIC_NODE_ENV === 'development'
			? 'http://localhost:8080'
			: 'https://' + domain
	return urlBase
}
