import GreatCircle from 'great-circle'
import React, { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import Highlighter from 'react-highlight-words'
import Worker from 'worker-loader!./SearchAirports.js'
import getCityData, { toThumb } from 'Components/wikidata'
import styled from 'styled-components'

const worker = new Worker()

export default function SelectTwoAirports({ setFormValue }) {
	const [state, setState] = useState({
		depuis: { inputValue: '' },
		vers: { inputValue: '' },
		validated: false,
	})

	useEffect(() => {
		worker.onmessage = ({ data: { results, which } }) =>
			console.log(results, which) ||
			setState((state) => ({ ...state, [which]: { ...state[which], results } }))
	}, [])

	const [wikidata, setWikidata] = useState(null)

	useEffect(() => {
		if (!state.vers.choice) return null

		getCityData(state.vers.choice.item.ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])

	console.log('WD', wikidata, wikidata && toThumb(wikidata?.pic.value))
	const versImageURL = wikidata?.pic && toThumb(wikidata?.pic.value)

	const renderOptions = (whichInput, { results = [], inputValue }) =>
		!state.validated && (
			<ul>
				{(5, results.map(renderOption(whichInput)(inputValue))).slice(0, 5)}
			</ul>
		)

	const renderOption = (whichInput) => (inputValue) => (option) => {
		const { nom, ville, pays } = option.item,
			inputState = state[whichInput],
			choice = inputState && inputState.choice

		return (
			<li
				key={nom}
				css={`
					padding: 0.2rem 0.6rem;
					border-radius: 0.3rem;
					${choice && choice.nom === nom
						? 'background: var(--color); color: var(--textColor)'
						: ''};
					button {
						color: white;
						font-size: 100%;
					}

					button:hover {
						background: var(--darkerColor2);
						border-radius: 0.3rem;
					}
				`}
			>
				<button
					onClick={() => {
						const newState = {
							...state,
							[whichInput]: { ...state[whichInput], choice: option },
						}
						const distance = computeDistance(state)
						if (distance) {
							setFormValue(distance)
						}
						setState(newState)
					}}
				>
					<Highlighter searchWords={[inputValue]} textToHighlight={nom} />
					<span style={{ opacity: 0.6, fontSize: '75%', marginLeft: '.6em' }}>
						<Highlighter
							searchWords={[inputValue]}
							textToHighlight={ville + ' - ' + pays}
						/>
					</span>
				</button>
			</li>
		)
	}

	const { depuis, vers } = state
	const placeholder = 'Aéroport ou ville '
	const distance = computeDistance(state)

	return (
		<>
			<div
				css={`
					label {
						display: flex;
						justify-content: space-evenly;
						align-items: center;
						margin: 1em;
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
					}
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
					{depuis.results && renderOptions('depuis', depuis)}
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
					{vers.results && renderOptions('vers', vers)}
					{versImageURL && <CityImage src={versImageURL} />}
				</div>
			</div>
			{distance && (
				<div
					css={`
						margin: 1rem 0;
					`}
				>
					Distance {emoji('📏')} : &nbsp;<strong>{distance + ' km'}</strong>
				</div>
			)}
			{distance && !state.validated && (
				<button {...{ submit: () => setState({ ...state, validated: true }) }}>
					àimplementer
				</button>
			)}
		</>
	)
}

function computeDistance({ depuis, vers }) {
	return (
		depuis.choice &&
		vers.choice &&
		Math.round(
			GreatCircle.distance(
				depuis.choice.latitude,
				depuis.choice.longitude,
				vers.choice.latitude,
				vers.choice.longitude,
				'KM'
			)
		)
	)
}

const CityImage = styled.img`
	width: 100%;
	position: absolute;
	object-fit: cover;
	max-height: 10rem;
	@media (max-width: 800px) {
		max-height: 6rem;
	}
`
