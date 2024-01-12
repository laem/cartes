export default function Transit({ data }) {
	const connections = data?.connections
	if (!connections.length) return null
	return <div>{connections.length} itinéraires trouvés :)</div>
}
