import useSetSearchParams from '@/components/useSetSearchParams'
import { Line } from './transit/Transit'
import { defaultRouteColor, nowStamp } from './transit/motisRequest'
import Link from 'next/link'

export default function Timeline({ data }) {
	const setSearchParams = useSetSearchParams()
	console.log('cyan', data)
	const cyclingSeconds =
		data.cycling?.features && +data.cycling.features[0].properties['total-time']
	const walkingSeconds =
		data.walking?.features && +data.walking.features[0].properties['total-time']
	const max = Math.max(...[cyclingSeconds, walkingSeconds].filter(Boolean))
	const now = nowStamp()
	const connectionsTimeRange = {
		from: now,
		to: now + max,
	}
	console.log('cyan range', connectionsTimeRange)
	return (
		<ol
			css={`
				margin-top: 1rem;
				li {
				}
				a {
					color: inherit;
				}
			`}
		>
			{data.cycling?.features && (
				<Link href={setSearchParams({ mode: 'cycling' }, true)}>
					<Line
						{...{
							connectionsTimeRange,
							connection: { seconds: cyclingSeconds },
							connectionRange: [now, now + cyclingSeconds],
							transports: [
								{
									seconds: cyclingSeconds,
									route_color: '#8f53c1',
									route_text_color: 'white',
									shortName: 'Vélo',
									move_type: 'Cycle',
								},
							],
						}}
					/>
				</Link>
			)}
			{data.walking?.features && (
				<Link href={setSearchParams({ mode: 'walking' }, true)}>
					<Line
						{...{
							connectionsTimeRange,
							connection: { seconds: walkingSeconds },
							connectionRange: [now, now + walkingSeconds],
							transports: [
								{
									seconds: walkingSeconds,
									route_color: '#8f53c1',
									route_text_color: 'white',
									shortName: 'Marche',
									move_type: 'Walk',
								},
							],
						}}
					/>
				</Link>
			)}
		</ol>
	)
}
