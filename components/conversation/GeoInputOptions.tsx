'use client'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'

const hash = ({ item: { nom, ville, pays } }) => '' + nom + ville + pays
const removeDuplicates = (elements) =>
	elements.reduce((memo, next) => {
		const duplicate = memo.find((el) => hash(el) === hash(next))
		return [...memo, ...(duplicate ? [] : [next])]
	}, [])

export default function GeoInputOptions({
	whichInput,
	data,
	updateState,
	rulesPath = '',
	dispatchUpdateSituation = () => () => null,
}) {
	return data?.results.length > 0 ? (
		<ul>
			{removeDuplicates(data.results.slice(0, 5)).map((option) => (
				<Option
					key={JSON.stringify(option.item)}
					{...{
						whichInput,
						option,
						updateState,
						rulesPath,
						data,
						dispatchUpdateSituation,
					}}
				/>
			))}
		</ul>
	) : (
		<p>Chargement en cours</p>
	)
}

const Option = ({
	whichInput,
	option,
	updateState,
	dispatchUpdateSituation,
	rulesPath,
	data,
}) => {
	const dispatch = useDispatch()
	const { nom, ville, pays } = option.item,
		choice = option.choice,
		inputValue = data.inputValue

	const nameIncludes = (what) =>
		nom.toLowerCase().includes((what || '').toLowerCase())
	const displayCity = !nameIncludes(ville),
		displayCountry = !nameIncludes(pays)
	const locationText =
		(displayCity ? ville + (displayCountry ? ' - ' : '') : '') +
		(displayCountry ? pays : '')

	return (
		<li
			key={nom + ville + pays}
			css={`
				padding: 0.2rem 0.6rem;
				border-radius: 0.3rem;
				${choice && choice.nom === nom
					? 'background: var(--color); color: var(--textColor)'
					: ''};
				button {
					color: white;
					font-size: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					text-align: left;
					width: 100%;
					padding: 0;
				}

				button:hover {
					background: var(--darkerColor2);
					border-radius: 0.3rem;
				}
			`}
		>
			<button
				onClick={(e) => {
					const newState = { ...data, choice: option }

					const entry = [
						rulesPath +
							' . ' +
							{ depuis: 'départ', vers: 'arrivée' }[whichInput],
						`'${ville}'`,
					]

					dispatchUpdateSituation(entry[0])(entry[1])
					updateState(newState)
				}}
			>
				<Highlighter searchWords={[inputValue]} textToHighlight={nom} />
				<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
					<Highlighter
						searchWords={[inputValue]}
						textToHighlight={locationText}
					/>
				</span>
			</button>
		</li>
	)
}
