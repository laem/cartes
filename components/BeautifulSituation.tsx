import css from './css/convertToJs'
import { title } from './utils/publicodesUtils'

const cleanString = (s) => s.replace(/'/g, '')
const displayHandlers = [
	{
		replaces: ['départ', 'arrivée', 'distance'],
		jsx: (départ, arrivée, distance) => (
			<div
				style={css`
					display: flex;
				`}
			>
				{cleanString(départ)} → {cleanString(arrivée)} ({distance} km)
			</div>
		),
	},
]

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
			{displayHandlers.map((handler) =>
				handler.jsx(
					...handler.replaces.map(
						(ending) => findRuleEndingWith(entriesRaw, ending)[1]
					)
				)
			)}
			<Separator />
			{entries.map(([k, v], i) => (
				<li
					style={css`
						display: flex;
						align-items: center;
					`}
					key={k}
				>
					{title({ ...rules[k], dottedName: k })} : {v} {rules[k]?.unité}
					{i < entries.length - 1 && <Separator />}
				</li>
			))}
		</ul>
	)
}

const Separator = () => (
	<span
		style={css`
			font-size: 50;
			color: #007ef0;
			margin: 0 0.6rem;
		`}
	>
		/
	</span>
)
