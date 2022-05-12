import GreatCircle from 'great-circle'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import Highlighter from 'react-highlight-words'
import Worker from 'worker-loader!./SearchAirports.js'
import getCityData, { toThumb } from 'Components/wikidata'
import styled from 'styled-components'
import Emoji from '../../Emoji'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { updateSituation } from '../../../actions/actions'

const worker = new Worker()

export default function SelectTwoAirports({ onChange }) {
	const [state, setState] = useState({
		depuis: { inputValue: '' },
		vers: { inputValue: '' },
		validated: false,
	})

	const dispatch = useDispatch()

	useEffect(() => {
		worker.onmessage = ({ data: { results, which } }) =>
			setState((state) => ({ ...state, [which]: { ...state[which], results } }))
	}, [])

	const [wikidata, setWikidata] = useState(null)

	useEffect(() => {
		if (!state.vers.choice) return undefined

		getCityData(state.vers.choice.item.ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])

	const versImageURL = wikidata?.pic && toThumb(wikidata?.pic.value)
	const { depuis, vers } = state
	const placeholder = 'Aéroport ou ville '
	const distance = computeDistance(state)

	const renderOptions = (whichInput, { results = [], inputValue }) =>
		!state.validated && (
			<ul>{results.slice(0, 5).map(renderOption(whichInput)(inputValue))}</ul>
		)

	const renderOption = (whichInput) => (inputValue) => (option) => {
		const { nom, ville, pays } = option.item,
			inputState = state[whichInput],
			choice = inputState && inputState.choice

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
						const newState = {
							...state,
							[whichInput]: { ...state[whichInput], choice: option },
						}

						dispatch(
							updateSituation(
								'transport . avion . ' +
									{ depuis: 'départ', vers: 'arrivée' }[whichInput],
								`'${ville}'`
							)
						)
						setState(newState)
						const distance = computeDistance(newState)
						if (distance) {
							onChange(distance)
						}
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

	return (
		<div
			css={`
				margin-top: 0.6rem;
				display: flex;
				justify-content: end;
				flex-wrap: wrap;
				width: 100%;
				@media (min-width: 800px) {
					flex-wrap: nowrap;
					justify-content: space-evenly;
				}
			`}
		>
			<div
				css={`
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					@media (min-width: 800px) {
						flex-direction: column;
					}
					img {
						margin-right: 1rem;
					}
				`}
			>
				{versImageURL && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{}}
						exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
					>
						<CityImage src={versImageURL} />
					</motion.div>
				)}
				{distance && (
					<div
						css={`
							margin: 1rem 0;
						`}
					>
						Distance : <strong>{distance + ' km'}</strong>
					</div>
				)}
			</div>
			<div
				css={`
					label {
						display: flex;
						justify-content: space-evenly;
						align-items: center;
						margin: 1em 1rem 0rem;
					}
					input {
						width: 9em !important;
						font-size: 130% !important;
					}
					label > span {
						display: inline-block;
						margin-right: 0.3rem;
					}
					ul {
						border-left: 1px solid #333;
						max-width: 30em;
						margin-left: 1rem;
						padding: 0;
					}
					width: 100%;
					@media (min-width: 800px) {
						width: 30rem;
					}
				`}
			>
				<div>
					<label>
						<span>Départ {emoji('🛫')}</span>
						<input
							type="text"
							className="ui__"
							value={depuis.inputValue}
							placeholder={placeholder}
							onChange={(e) => {
								let v = e.target.value
								setState({
									...state,
									depuis: { ...state.depuis, inputValue: v },
									validated: false,
								})
								if (v.length > 2)
									worker.postMessage({ input: v, which: 'depuis' })
							}}
						/>
					</label>
					{!depuis.choice &&
						depuis.results &&
						depuis.inputValue !== '' &&
						renderOptions('depuis', depuis)}
					{depuis.choice && (
						<div css="text-align: right">
							<Emoji e="✅" />
							{depuis.choice.item.nom}
							<button
								type="button"
								onClick={() => setState({ ...state, depuis: {} })}
							>
								<Emoji e="✏️" />{' '}
							</button>
						</div>
					)}
				</div>
				<div>
					<label>
						<span>Arrivée {emoji('🛬')}</span>
						<input
							className="ui__"
							type="text"
							value={vers.inputValue}
							placeholder={placeholder}
							onChange={(e) => {
								let v = e.target.value
								setState({
									...state,
									vers: { ...state.vers, inputValue: v },
									validated: false,
								})
								if (v.length > 2)
									worker.postMessage({ input: v, which: 'vers' })
							}}
						/>
					</label>
					{!vers.choice &&
						vers.results &&
						vers.inputValue !== '' &&
						renderOptions('vers', vers)}
					{vers.choice && (
						<div css="text-align: right">
							<Emoji e="✅" />
							{vers.choice.item.nom}
							<button
								type="button"
								onClick={() => setState({ ...state, vers: {} })}
							>
								<Emoji e="✏️" />{' '}
							</button>
						</div>
					)}
				</div>
			</div>
			{false && distance && !state.validated && (
				<button {...{ submit: () => setState({ ...state, validated: true }) }}>
					àimplementer
				</button>
			)}
		</div>
	)
}

function computeDistance({ depuis, vers }) {
	return (
		depuis.choice &&
		vers.choice &&
		Math.round(
			GreatCircle.distance(
				depuis.choice.item.latitude,
				depuis.choice.item.longitude,
				vers.choice.item.latitude,
				vers.choice.item.longitude,
				'KM'
			)
		)
	)
}

const CityImage = styled.img`
	object-fit: cover;
	border-radius: 6rem;
	max-height: calc(6rem + 6vw);
	height: auto;
`
