'use client'
import Highlighter from 'react-highlight-words'
import { useDispatch } from 'react-redux'
import { updateSituation as updateGlobalSituation } from '@/actions'

const hash = ({ item: { nom, ville, pays } }) => '' + nom + ville + pays
const removeDuplicates = (elements) =>
	elements.reduce((memo, next) => {
		const duplicate = memo.find((el) => hash(el) === hash(next))
		return [...memo, ...(duplicate ? [] : [next])]
	}, [])

export default ({
	whichInput,
	data,
	updateState,
	onChange,
	rulesPath,
	updateSituation,
}) =>
	data?.results.length > 0 ? (
		<ul>
			{removeDuplicates(data.results.slice(0, 5)).map((option) => (
				<Option
					{...{
						whichInput,
						option,
						updateState,
						onChange,
						rulesPath,
						data,
						updateSituation,
					}}
				/>
			))}
		</ul>
	) : (
		<p>Chargement en cours</p>
	)

const Option = ({
	whichInput,
	option,
	updateState,
	onChange,
	updateSituation,
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

					updateSituation
						? updateSituation(entry[0])(entry[1])
						: dispatch(updateGlobalSituation(...entry))
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
