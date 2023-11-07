import css from './css/convertToJs'
import { title } from './utils/publicodesUtils'

const cleanString = (s) => s.replace(/'/g, '')

const Value = ({ children }) => (
	<div
		style={css`
			display: flex;
		`}
	>
		{children}
	</div>
)
const displayHandlers = [
	{
		replaces: ['départ', 'arrivée', 'distance'],
		jsx: (départ, arrivée, distance) => (
			<Value>
				{cleanString(départ)} → {cleanString(arrivée)} ({distance} km)
			</Value>
		),
	},
	{
		replaces: ['voyage . trajet voiture . péages . prix calculé . prix 2018'],
		jsx: (prix) => <Value>{prix} € de péages</Value>,
	},
]

//http://localhost:8080/voyage/cout-voiture/og?dottedName=voyage . trajet voiture . coût trajet par personne&title=Coût du trajet en voiture&emojis=🪙🚗&_action=reset&lu=true&voyage.trajet+voiture.départ='Brest'&voyage.trajet+voiture.arrivée='Rennes'&voyage.trajet+voiture.distance=242&voyage.trajet+voiture.péages.prix+calculé.prix+2018=0&voyage.trajet.voyageurs=1&voyage.voiture.motorisation='diesel'&voyage.voiture.occasion=non&voyage.voiture.km+annuels=12000&voyage.voiture.coût+de+possession.entretien+thermique=840+€&voyage.trajet+voiture.prix+carburant=2&voyage.voiture.consommation+thermique=6&voyage.voiture.prix+d'achat+neuf=18000&voyage.voiture.coût+de+possession.assurance=527+€%2Fan&voyage.voiture.coûts+divers.parking=600+€%2Fan&voyage.voiture.coûts+divers.pv=40

const findRuleEndingWith = (entries, ending) =>
	entries.find(
		(entry) =>
			entry[0] === ending || entry[0].split(' . ').slice(-1)[0] === ending
	)
export default function BeautifulSituation({ validatedSituation, rules }) {
	const entriesRaw = Object.entries(validatedSituation)
	const entries = entriesRaw.filter(
		(entry) =>
			!displayHandlers.find(({ replaces }) =>
				replaces.some((ending) => findRuleEndingWith([entry], ending))
			)
	)
	return (
		<ul
			style={css`
				display: flex;
				max-width: 80vw;
				flex-wrap: wrap;
				justify-content: center;
			`}
		>
			{displayHandlers.map((handler) => (
				<Entry>
					{handler.jsx(
						...handler.replaces.map(
							(ending) => findRuleEndingWith(entriesRaw, ending)[1]
						)
					)}
					<Separator />
				</Entry>
			))}
			{entries.map(([k, v], i) => {
				const unit = rules[k]?.unité,
					displayUnit = v.includes(unit) ? '' : unit,
					ruleTitle = rules[k]?.abrégé || title({ ...rules[k], dottedName: k })
				const uselessKey =
					unit && ruleTitle.toLowerCase() === unit.toLowerCase()
				return (
					<Entry key={k}>
						{!uselessKey && <span>{ruleTitle} : </span>}
						<span style={{ marginLeft: '.2rem' }}>
							{cleanString(v)} {unit}
						</span>
						{i < entries.length - 1 && <Separator />}
					</Entry>
				)
			})}
		</ul>
	)
}

const Entry = ({ children }) => (
	<li
		style={css`
			display: flex;
			align-items: center;
		`}
	>
		{children}
	</li>
)

const Separator = () => (
	<span
		style={css`
			font-size: 40;
			color: #007ef0;
			margin: 0 0.6rem;
		`}
	>
		/
	</span>
)
