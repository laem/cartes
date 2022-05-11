import { useEngine } from '../../components/utils/EngineContext'

export default () => {
	const engine = useEngine(),
		impact = engine.evaluate('transport . avion . impact').nodeValue,
		forcingFactor = engine.evaluate(
			'transport . avion . forçage radiatif . coefficient'
		).nodeValue,
		co2Only = impact / forcingFactor,
		nonCo2 = impact - co2Only

	return (
		<div
			css={`
				margin: 2rem auto;
				p {
					line-height: 1.3rem;
				}
			`}
		>
			<h3>
				Le réchauffement climatique de l'aviation ne se limite pas au seul CO₂
			</h3>
			<div
				css={`
					width: 100%;
					padding: 0;
					height: 4rem;
					margin: 1rem auto;
					border: 3px solid white;

					> div {
						height: 100%;
						display: inline-flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
					}
				`}
			>
				<div
					css={`
						width: ${100 * (co2Only / impact)}%;
						background: var(--color);
						background: linear-gradient(
							0.25turn,
							var(--darkerColor),
							var(--darkColor)
						);
						border-right: 4px solid white;
					`}
				>
					<div>CO₂</div>
				</div>
				<div
					css={`
						width: ${100 * (nonCo2 / impact)}%;
						background: var(--lightColor);
						background: linear-gradient(
							0.25turn,
							var(--color),
							var(--lightColor)
						);
					`}
				>
					<div>Hors CO₂</div>
				</div>
			</div>
			<p>
				<strong>CO₂</strong> : continue de réchauffer la planète longtemps après
				le vol
			</p>
			<p>
				<strong>Hors CO₂</strong> : réchauffe à court-terme, disparaît si le
				trafic aérien baisse
			</p>
		</div>
	)
}
