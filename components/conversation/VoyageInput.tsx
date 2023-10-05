'use client'
import destinationPoint from '@/public/destination-point.svg'
import startPoint from '@/public/start-point.svg'
import Emoji from 'Components/Emoji'
import getCityData, { toThumb } from 'Components/wikidata'
import { motion } from 'framer-motion'
import GreatCircle from 'great-circle'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LightButton } from '../UI'
import useGeo from '../useGeo'
import GeoInputOptions from './GeoInputOptions'
import Map from 'Components/Map'
import { InputStyle } from './UI'
import invertIcon from '@/public/invertIcon.svg'
import {
	Choice,
	CityImage,
	ImageWrapper,
	InputWrapper,
	VoyageWrapper,
} from './VoyageUI'

export default function VoyageInput({
	onChange,
	placeholder,
	db,
	rulesPath,
	fromIcon = '',
	toIcon = '',
	displayImage = true,
	updateSituation,
}) {
	const [state, setState] = useState({
		depuis: { inputValue: '', choice: false },
		vers: { inputValue: '', choice: false },
		validated: false,
	})

	const [realDistance, setRealDistance] = useState(null)
	const geo = useGeo()

	const [wikidata, setWikidata] = useState(null)

	useEffect(() => {
		if (!state.vers.choice) return undefined

		getCityData(state.vers.choice.item.ville).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])

	const versImageURL = wikidata?.pic && toThumb(wikidata?.pic.value)
	const { depuis, vers } = state

	const distance = realDistance || computeDistance(state)

	const validDistance = typeof distance === 'number'
	useEffect(() => {
		if (!validDistance) return
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
						console.log(json)
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
		<VoyageWrapper>
			{displayImage && (
				<ImageWrapper>
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
					{validDistance && (
						<div
							css={`
								margin: 1rem 0;
							`}
						>
							Distance : <strong>{distance + ' km'}</strong>
						</div>
					)}
				</ImageWrapper>
			)}
			<InputWrapper>
				<div>
					{!depuis.choice && vers.choice && (
						<>
							<label>
								<span>
									D'où partez-vous ? <Emoji e={fromIcon} />
								</span>
								<InputStyle>
									<input
										type="text"
										value={depuis.inputValue}
										placeholder={placeholder}
										onChange={onInputChange('depuis')}
									/>
								</InputStyle>
							</label>
							{geo && (
								<small
									css={`
										display: block;
										text-align: right;
									`}
								>
									<Emoji e="✨" />
									suggestion:{' '}
									<LightButton
										onClick={() => {
											const value = geo.city + ', ' + geo.country
											onInputChange('depuis')({ target: { value } })
										}}
									>
										{geo.city}
									</LightButton>
								</small>
							)}
							{depuis.results && depuis.inputValue !== '' && !state.validated && (
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
						</>
					)}
					{depuis.choice && (
						<Choice>
							<Image src={startPoint} alt="Depuis" />
							<div
								css={`
									text-align: right;
									img {
										width: 2rem;
									}
								`}
							>
								{depuis.choice.item.nom}
								<button
									type="button"
									onClick={() => setState({ ...state, depuis: {} })}
								>
									<Emoji e="✏️" title="Modifier la ville de départ" />
								</button>
							</div>
						</Choice>
					)}
				</div>

				{depuis.choice && vers.choice && (
					<LightButton
						title="Remplacer la destination par l'origine, et vice et versa"
						onClick={() => {
							setState({ ...state, depuis: state.vers, vers: state.depuis })
						}}
						css={`
							img {
								width: 2rem;
								height: 2rem;
							}
							text-align: right;
							padding: 0 2rem 0 0;
						`}
					>
						<Image src={invertIcon} />
					</LightButton>
				)}
				<div>
					{!vers.choice && (
						<>
							<label>
								<span>
									Où allez-vous ? <Emoji e={toIcon} />
								</span>
								<InputStyle>
									<input
										type="text"
										value={vers.inputValue}
										placeholder={placeholder}
										onChange={onInputChange('vers')}
									/>
								</InputStyle>
							</label>
							{vers.results && vers.inputValue !== '' && !state.validated && (
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
						</>
					)}
					{vers.choice && (
						<Choice>
							<Image src={destinationPoint} alt="Vers" />
							<div
								css={`
									text-align: right;
									img {
										width: 2rem;
									}
								`}
							>
								{vers.choice.item.nom}
								<button
									type="button"
									onClick={() => setState({ ...state, vers: {} })}
								>
									<Emoji e="✏️" title="Modifier la ville de destination" />
								</button>
							</div>
						</Choice>
					)}
				</div>
			</InputWrapper>
			<MapWrapper state={state} setRealDistance={setRealDistance} />
			{false && distance && !state.validated && (
				<button {...{ submit: () => setState({ ...state, validated: true }) }}>
					àimplementer
				</button>
			)}
		</VoyageWrapper>
	)
}

const MapWrapper = ({ state: { depuis, vers }, setRealDistance }) => {
	const origin = depuis.choice && [
		depuis.choice.item.latitude,
		depuis.choice.item.longitude,
	]
	const destination = vers.choice && [
		vers.choice.item.latitude,
		vers.choice.item.longitude,
	]
	console.log('O', origin)
	return (
		<Map
			origin={origin}
			destination={destination}
			setRealDistance={setRealDistance}
		/>
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
