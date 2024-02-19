import { Transport } from './Transit'

export default function BestConnection({ bestConnection }) {
	console.log('prune best', bestConnection)
	const transport = bestConnection.best.transports.find((t) => t.trip)
	const stop = bestConnection.best.stops[transport.move.range.from].station.name
	return (
		<div
			css={`
				background: white;
				margin: 0.6rem 0;
				border: 2px solid gold;
				display: flex;
				align-items: center;
				> div:first-child {
					margin: 1rem;
					font-size: 150%;
				}
				p {
					line-height: 1.4rem;
				}
			`}
		>
			<div>⭐️</div>
			<div>
				<small>Il y a un trajet optimal</small>
				<p>
					Le direct
					<span
						css={`
							display: inline-block;
							width: 4rem;
							margin: 0 0.4rem;
						`}
					>
						<Transport transport={transport} />
					</span>
					passe <strong>{bestConnection.interval}</strong> à l'arrêt{' '}
					<em
						css={`
							white-space: nowrap;
						`}
					>
						{stop}
					</em>
					.
				</p>
			</div>
		</div>
	)
}
