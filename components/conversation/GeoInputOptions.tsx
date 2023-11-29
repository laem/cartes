'use client'
import Highlighter from 'react-highlight-words'

const hash = ({ nom, ville, pays, département }) =>
	'' + nom + ville + pays + département
const removeDuplicates = (elements) =>
	elements.reduce((memo, next) => {
		const duplicate = memo.find((el) => hash(el.item) === hash(next.item))
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
					key={hash(option.item)}
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
	const { nom = '', ville = '', pays = '', département = '' } = option.item,
		choice = option.choice,
		inputValue = data.inputValue

	console.log('ITEM', option.item)

	const nameIncludes = (what) =>
		nom && nom.toLowerCase().includes((what || '').toLowerCase())
	const displayCity = !nameIncludes(ville),
		displayCountry = !nameIncludes(pays) && pays !== 'France' // these web apps are mostly designed for metropolitan France
	const displayDépartement = pays === 'France' // French people will probably not search for cities with the same name, hence small, abroad
	const locationText = `${
		displayCity ? ville + (displayCountry ? ' - ' : '') : ''
	} ${displayDépartement ? département : ''} ${displayCountry ? pays : ''}`

	return (
		<li
			key={hash(option.item)}
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
					const newState = { ...data, choice: { ...option, inputValue } }

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
