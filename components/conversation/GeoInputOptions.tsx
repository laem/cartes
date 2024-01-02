'use client'
import Highlighter from 'react-highlight-words'
import icons from '@/app/voyage/icons/icons.json'

// Beware, this file is shared by the Map app, and the carbon footprint / € calculators

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

	console.log('icons', option.item)

	const nameIncludes = (what) =>
		nom && nom.toLowerCase().includes((what || '').toLowerCase())
	const displayCity = !nameIncludes(ville),
		displayCountry = !nameIncludes(pays) && pays !== 'France' // these web apps are mostly designed for metropolitan France
	const displayDépartement = pays === 'France' // French people will probably not search for cities with the same name, hence small, abroad
	const locationText = `${
		displayCity ? ville + (displayCountry ? ' - ' : '') : ''
	} ${displayDépartement ? département : ''} ${displayCountry ? pays : ''}`

	const { osm_key: osmKey, osm_value: osmValue } = option.item

	const foundIcon = icons.find(
		([key]) => key === osmKey + '_' + osmValue || key === osmValue
	)
	const urlBase = `https://cdn.jsdelivr.net/gh/osmandapp/OsmAnd-resources/icons/svg/`
	const iconPath = foundIcon ? urlBase + foundIcon[1] : `/dot.svg`

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
					align-items: center;
					text-align: left;
					width: 100%;
					padding: 0;
				}
				button > span {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
				}

				button:hover {
					background: var(--darkerColor2);
					border-radius: 0.3rem;
				}
				button > img {
					width: 1.2rem;
					height: 1.2rem;
					margin-right: 0.6rem;
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
				<img
					width="10"
					height="10"
					src={iconPath}
					alt="Icône représentant au mieux le type de lieu"
				/>
				<span>
					<Highlighter searchWords={[inputValue]} textToHighlight={nom} />
					<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
						<Highlighter
							searchWords={[inputValue]}
							textToHighlight={locationText}
						/>
					</span>
				</span>
			</button>
		</li>
	)
}
