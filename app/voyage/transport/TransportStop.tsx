import { findContrastedTextColor } from '@/components/utils/colors'
import { useEffect, useState } from 'react'

const TransportRoute = ({ data }) => {
	console.log('plop', data)
	return (
		<li>
			<small
				css={`
					background: ${data.route_color ? `#${data.route_color}` : 'grey'};
					padding: 0 0.2rem;
					border-radius: 0.3rem;
					color: ${data.route_color
						? findContrastedTextColor(data.route_color, true)
						: '#ffffff'};
				`}
			>
				🚍️ <strong>{data.route_short_name}</strong> {data.route_long_name}
			</small>
		</li>
	)
}

export const isNotTransportStop = (tags) =>
	!tags || tags.public_transport !== 'platform'
export default function TransportStop({ tags }) {
	console.log('tags', tags)
	const [data, setData] = useState(null)

	const ref = Object.entries(tags).find(([k, v]) => k.match(/ref(\:FR)?\:.+/g))
	console.log(ref)
	if (!ref) return null
	const splits = ref[0].split(':')
	const network = splits.length === 3 ? splits[2] : splits[1]
	const stopId = ref[1].includes(network.toUpperCase())
		? ref[1]
		: network.toUpperCase() + ':' + ref[1]

	console.log('bus data', data)
	useEffect(() => {
		const doFetch = async () => {
			const response = await fetch(
				'https://gtfs-server.osc-fr1.scalingo.io/stopTimes/' + stopId,
				{ mode: 'cors' }
			)
			const json = await response.json()

			setData(json)
		}
		doFetch()
	}, [stopId, setData])
	if (!data || !data.routes) return null

	return (
		<div>
			<ul>
				{data.routes.map((route) => (
					<TransportRoute key={route.route_id} data={route} />
				))}
			</ul>
		</div>
	)
}

export const transportKeys = ['ref:FR:STAR']
