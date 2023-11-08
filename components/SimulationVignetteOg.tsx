import BeautifulSituation from '@/components/BeautifulSituation'
import css from '@/components/css/convertToJs'
import { getSituation } from '@/components/utils/simulationUtils'
import Publicodes, { formatValue } from 'publicodes'
const futurecoRules = 'https://futureco-data.netlify.app/co2.json'
import voitureRules from '@/app/voyage/cout-voiture/data/rules'

export default function SimulationVignetteOg({
	engine,
	situation,
	rules,
	title,
	emojis,
	dottedName,
}) {
	const evaluation = engine.setSituation(situation).evaluate(dottedName),
		rawValue = formatValue(evaluation, { precision: 1 }),
		valueWithoutUnit = formatValue(evaluation, {
			precision: 1,
			displayedUnit: '',
		}),
		rawUnit = rawValue.split(valueWithoutUnit)[1],
		[value, unit] = formatUnit(rawUnit, evaluation.nodeValue, valueWithoutUnit)
	return (
		<div
			style={{
				display: 'flex',
				height: '100%',
				width: '100%',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
				fontSize: 100,
				letterSpacing: -2,
				fontWeight: 700,
				textAlign: 'center',
				lineHeight: 0.8,
			}}
		>
			{
				/* 
				<Piece />
				*/
				<div
					style={css(`
					 font-size: 160;
					`)}
				>
					{emojis}
				</div>
			}
			<div
				style={{
					backgroundImage:
						'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
					backgroundClip: 'text',
					'-webkit-background-clip': 'text',
					color: 'transparent',
				}}
			>
				{title}
			</div>
			<div
				style={css`
					font-size: 30;
					display: flex;
					margin-top: 1rem;
				`}
			>
				<BeautifulSituation {...{ situation, rules }} />
			</div>
			<div
				style={css`
					display: flex;
					align-items: center;
					margin-top: 1rem;
				`}
			>
				<span>{value}</span>
				<small
					style={css`
						font-size: 60;
						margin-left: 1rem;
					`}
				>
					{unit}
				</small>
			</div>
		</div>
	)
}
const isVoiture = (dottedName) =>
	dottedName === 'voyage . trajet voiture . coût trajet par personne'

const formatUnit = (rawUnit, nodeValue, formattedValue) => {
	console.log('|' + rawUnit + '|')
	if (rawUnit === ' kgCO₂e') {
		const [v, u] = humanWeight(nodeValue)
		return [v, u + ' de CO2e']
	}
	return [formattedValue, rawUnit]
}
