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

export default function TransportStop({ tags }) {
	const stopId = 'STAR:' + tags[transportKeys[0]]
	const [data, setData] = useState(null)

	console.log('bus data', data)
	useEffect(() => {
		const doFetch = async () => {
			const response = await fetch('http://localhost:3000/stopTimes/' + stopId)
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
