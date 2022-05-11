import { useEngine } from '../../components/utils/EngineContext'
import { motion } from 'framer-motion'

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
				h3 {
					margin: 2rem 0;
				}
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

					> div {
						height: 100%;
						display: inline-flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
						border: 3px solid white;
					}
				`}
			>
				<motion.div
					initial={{ width: '0%' }}
					whileInView={{ width: 100 * (co2Only / impact) + '%' }}
					transition={{ duration: 1 }}
					css={`
						background: var(--color);
						background: linear-gradient(
							0.25turn,
							var(--darkerColor),
							var(--darkColor)
						);
					`}
				>
					<div>CO₂</div>
				</motion.div>
				<motion.div
					initial={{ width: '0rem', opacity: 0 }}
					whileInView={{
						width: 100 * (nonCo2 / impact) + '%',
						opacity: 1,
						color: 'white',
					}}
					transition={{ duration: 1, delay: 2 }}
					css={`
						> div {
							white-space: nowrap;
						}
						background: var(--lightColor);
						background: linear-gradient(
							0.25turn,
							var(--color),
							var(--lightColor)
						);
						border-left: none !important;
					`}
				>
					<div>Hors CO₂</div>
				</motion.div>
			</div>
			<p>
				<strong>CO₂</strong> : continue de réchauffer la planète très longtemps
				après le vol
			</p>
			<p>
				<strong>Hors CO₂</strong> : réchauffe principalement à court-terme
			</p>
			<blockquote>
				<p>
					Concrètement, le CO₂ émis s'accumule d'année en année pour très
					longtemps. À l'inverse, si le trafic aérien se mettait à baisser, les
					effets hors CO₂ des vols passés s'estomperaient rapidement.
				</p>
				<p>
					Ces deux composantes du réchauffement sont pondérées pour donner un
					seul chiffre en CO₂<strong>e</strong>quivalent.
				</p>
			</blockquote>
		</div>
	)
}
