'use client'
import getCityData, { toThumb } from 'Components/wikidata'
import { motion } from 'framer-motion'
import GreatCircle from 'great-circle'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Emoji from '../../Emoji'
import GeoInputOptions from './GeoInputOptions'

export default function SelectTwoAirports({
	onChange,
	placeholder,
	db,
	rulesPath,
	fromIcon = '',
	toIcon = '',
	displayImage,
	updateSituation,
}) {
	const [state, setState] = useState({
		depuis: { inputValue: '' },
		vers: { inputValue: '' },
		validated: false,
	})

	const [wikidata, setWikidata] = useState(null)

	useEffect(() => {
		if (!state.vers.choice) return undefined

		getCityData(state.vers.choice.item.ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])

	const versImageURL = wikidata?.pic && toThumb(wikidata?.pic.value)
	const { depuis, vers } = state

	const distance = computeDistance(state)
	useEffect(() => {
		if (typeof distance !== 'number') return
		if (updateSituation) {
			updateSituation('distance aller . orthodromique')(distance)
		} else onChange(distance)
	}, [distance])
	const onInputChange = (whichInput) => (e) => {
		let v = e.target.value
		setState({
			...state,
			[whichInput]: { ...state[whichInput], inputValue: v },
			validated: false,
		})
		if (v.length > 2) {
			if (db === 'osm') {
				fetch(`https://photon.komoot.io/api/?q=${v}&limit=6&layer=city&lang=fr`)
					.then((res) => res.json())
					.then((json) => {
						setState((state) => ({
							...state,
							[whichInput]: {
								...state[whichInput],
								results: json.features.map((f) => ({
									item: {
										longitude: f.geometry.coordinates[0],
										latitude: f.geometry.coordinates[1],
										nom: f.properties.name,
										ville: f.properties.cities || f.properties.name,
										pays: f.properties.country,
									},
								})),
							},
						}))
					})
			} else {
				fetch(`/api/airports?input=${v}&which=${whichInput}`)
					.then((res) => res.json())
					.then((results) => {
						setState((state) => ({
							...state,

							[whichInput]: { results },
						}))
					})
			}
		}
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
			{displayImage && (
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
							<CityImage
								thinner={displayImage === 'plane'}
								src={versImageURL}
							/>
						</motion.div>
					)}
					{!isNaN(distance) && (
						<div
							css={`
								margin: 1rem 0;
							`}
						>
							Distance : <strong>{distance + ' km'}</strong>
						</div>
					)}
				</div>
			)}
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
						max-width: 30rem;
					}
				`}
			>
				<div>
					<label>
						<span>
							Départ <Emoji e={fromIcon} />
						</span>
						<input
							type="text"
							className="ui__"
							value={depuis.inputValue}
							placeholder={placeholder}
							onChange={onInputChange('depuis')}
						/>
					</label>
					{!depuis.choice &&
						depuis.results &&
						depuis.inputValue !== '' &&
						!state.validated && (
							<GeoInputOptions
								{...{
									whichInput: 'depuis',
									data: state['depuis'],
									updateState: (newData) =>
										setState((state) => ({ ...state, depuis: newData })),
									onChange,
									rulesPath,
									updateSituation,
								}}
							/>
						)}
					{depuis.choice && (
						<div
							css={`
								text-align: right;
								img {
									width: 2rem;
								}
							`}
						>
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
						<span>
							Arrivée <Emoji e={toIcon} />
						</span>
						<input
							className="ui__"
							type="text"
							value={vers.inputValue}
							placeholder={placeholder}
							onChange={onInputChange('vers')}
						/>
					</label>
					{!vers.choice &&
						vers.results &&
						vers.inputValue !== '' &&
						!state.validated && (
							<GeoInputOptions
								{...{
									whichInput: 'vers',
									data: state['vers'],
									updateState: (newData) =>
										setState((state) => ({ ...state, vers: newData })),
									onChange,
									updateSituation,
									rulesPath,
								}}
							/>
						)}
					{vers.choice && (
						<div
							css={`
								text-align: right;
								img {
									width: 2rem;
								}
							`}
						>
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

export function computeDistance({ depuis, vers }) {
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

export const CityImage = styled.img`
	object-fit: cover;
	border-radius: 6rem;
	width: calc(6rem + 6vw);
	height: calc(6rem + 6vw);
	${(props) =>
		props.thinner
			? `
	height: calc(10rem + 6vw);
	`
			: ``}
`
