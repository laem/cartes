import { ModalCloseButton } from '@/app/UI'
import useSetSearchParams from '../useSetSearchParams'
import Image from 'next/image'
import { formatMotis, humanDuration } from '@/app/itinerary/transit/utils'
import TransportMoveBlock from '@/app/itinerary/transit/TransportMoveBlock'

export default function TransitInstructions({ connection }) {
	const setSearchParams = useSetSearchParams()
	console.log('lightpurple', connection)
	if (connection.transports.length < 3) return

	const firstTransitStopIndex = connection.transports[1].trip.range.from,
		firstTransitStop = connection.stops[firstTransitStopIndex]

	const approach = moveTypeToFrench[connection.transports[0].move_type]
	return (
		<div
			css={`
				position: relative;
			`}
		>
			<ModalCloseButton
				onClick={() => {
					setSearchParams({ details: undefined })
				}}
			/>
			<h2>Détail de l'itinéraire</h2>
			<section
				css={`
					> img {
						width: 1.4rem;
						height: auto;
						vertical-align: sub;
					}
				`}
			>
				<Image
					src={'/' + approach.icon + '.svg'}
					width="10"
					height="10"
					alt={
						"Icône de l'approche vers le premier arrêt de transport en commun"
					}
				/>{' '}
				{approach.verb} jusqu'à l'arrêt {firstTransitStop.station.name}
			</section>
			<section
				css={`
					ol {
						list-style-type: none;
					}
				`}
			>
				<ol>
					{connection.transports
						.filter(({ move_type }) => move_type === 'Transport')
						.map((transport) => {
							const {
								trip: {
									range: { from, to },
								},
							} = transport
							const stops = connection.stops.slice(from, to)

							console.log('lightpurple', stops)

							return (
								<li
									key={transport.route_id}
									css={`
										border-left: 4px solid ${transport.route_color};
										> span {
											border-top-right-radius: 0.3rem;
											border-bottom-right-radius: 0.3rem;
										}
										margin-bottom: 0.6rem;
									`}
								>
									<TransportMoveBlock transport={transport} />
									<details
										css={`
											summary {
												padding-left: 0.5rem;
												color: var(--darkColor);
												list-style-type: none;
											}
											padding-bottom: 0.1rem;
										`}
									>
										<summary>
											{stops.length} arrêts,{' '}
											<span>
												{
													humanDuration(
														stops.slice(-1)[0].arrival.time -
															stops[0].departure.time
													).single
												}
											</span>
										</summary>
										<ol
											css={`
												margin-left: 1rem;
												li {
													line-height: 1.2rem;
													display: flex;
													justify-content: space-between;
													align-items: center;
													> span {
														display: flex;
														align-items: center;
														gap: 0.4rem;
													}
													> small {
														color: gray;
														margin-right: 3rem;
													}
												}
											`}
										>
											{stops.map((stop, index) => (
												<li key={stop.station.id}>
													<span>
														<StationDisc color={transport.route_color} />{' '}
														<small>{stop.station.name}</small>
													</span>
													{index > 0 && (
														<small>
															{
																humanDuration(
																	-stops[0].departure.time + stop.arrival.time
																).single
															}
														</small>
													)}
												</li>
											))}
										</ol>
									</details>
								</li>
							)
						})}
				</ol>
			</section>
			plop
		</div>
	)
}

const StationDisc = ({ color }) => (
	<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width=".6rem">
		<circle
			cx="50"
			cy="50"
			r="35"
			fill="white"
			stroke={color}
			stroke-width="18"
		/>
	</svg>
)

const moveTypeToFrench = {
	Walk: { verb: 'Marchez', icon: 'walking' },
	Bike: { verb: 'Roulez', icon: 'cycling.svg' },
	Car: { verb: 'Roulez', icon: 'car.svg' },
}
