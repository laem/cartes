import { useEffect, useState } from 'react'

export default function Transit({ data }) {
	if (data === 'loading') return <div>Transports en commun en cours</div>
	const connections = data?.connections
	console.log('motis', data)
	if (!connections?.length) return null
	return (
		<div>
			<div>{connections.length} itinéraires trouvés :)</div>
			<Connections connections={connections} />
		</div>
	)
}

const Connections = ({ connections }) => (
	<div>
		<ul>
			{connections.map((el) => (
				<Connection connection={el} />
			))}
		</ul>
	</div>
)

const correspondance = { Walk: 'Marche', Transport: 'Transport' }

const startDateFormatter = Intl.DateTimeFormat('fr-FR', {
	hour: 'numeric',
	minute: 'numeric',
})
const Connection = ({ connection }) => (
	<li>
		{startDateFormatter.format(
			new Date(connection.stops[0].departure.time * 1000)
		)}
		<ul
			css={`
				display: flex;
				justify-content: space-evenly;
				list-style-type: none;
			`}
		>
			{connection.transports.map((transport) => (
				<li>
					<Transport
						transport={transport}
						trip={connection.trips.find(
							(trip) => trip.id.line_id === transport.move.line_id
						)}
					/>
				</li>
			))}
		</ul>
	</li>
)

const Transport = ({ transport, trip }) => {
	const [colors, setColors] = useState(null)

	const tripId = trip?.id.id.split('_')[1] // `bretagne_` prefix added by Motis it seems, coming from its config.ini file that names schedules with ids
	useEffect(() => {
		if (!tripId) return
		const doFetch = async () => {
			try {
				const request = await fetch(
					`https://gtfs-server.osc-fr1.scalingo.io/routes/trip/${tripId}`
				)
				const json = await request.json()
				const { route_color, route_text_color } = json.routes[0]
				setColors({ route_color, route_text_color })
			} catch (e) {
				console.error('Unable to fetch route color from GTFS server')
			}
		}
		doFetch()
	}, [tripId, setColors])

	return (
		<span
			css={`
				background: ${colors ? `#${colors.route_color}` : 'var(--darkColor)'};
			`}
		>
			{transport.move.name || correspondance[transport.move_type]}
		</span>
	)
}
