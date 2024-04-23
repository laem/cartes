'use client'
import destinationPoint from '@/public/destination-point.svg'
import invertIcon from '@/public/invertIcon.svg'
import startPoint from '@/public/start-point.svg'
import Emoji from 'Components/Emoji'
const Map = dynamic(() => import('Components/Map'), { ssr: false })

import getCityData from 'Components/wikidata'
import { motion } from 'framer-motion'
import GreatCircle from 'great-circle'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LightButton } from '../UI'
import useGeo from '../useGeo'
import { buildPhotonItem } from '../voyage/fetchPhoton'
import { extractFileName, getThumb } from '../wikidata'
import GeoInputOptions from './GeoInputOptions'
import { InputStyle } from './UI'
import {
	Choice,
	ChoiceContent,
	ChoiceText,
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
	dispatchUpdateSituation,
	orthodromic, // wether to use valhalla to estimate the driving route distance, or not
	dottedName,
	situation,
}) {
	const [state, setState] = useState({
		depuis: { inputValue: '', choice: false },
		vers: { inputValue: '', choice: false },
		validated: false,
	})

	const [realDistance, setRealDistance] = useState(null)
	const [realHighwayPrice, setRealHighwayPrice] = useState(null)
	const geo = useGeo()

	const [wikidata, setWikidata] = useState(null)

	useEffect(() => {
		if (!state.vers.choice) return undefined

		getCityData(state.vers.choice.city || state.vers.choice.name).then((json) =>
			setWikidata(json?.results?.bindings[0])
		)
	}, [state.vers])

	console.log('wikidata', wikidata?.pic.value)
	const versImageURL =
		wikidata?.pic &&
		getThumb(extractFileName(decodeURI(wikidata?.pic.value)), 400)
	console.log(
		'wikidata',
		wikidata?.pic.value,
		extractFileName(decodeURI(wikidata?.pic.value)),
		getThumb(extractFileName(decodeURI(wikidata?.pic.value)), 400)
	)
	const { depuis, vers } = state

	const distance = realDistance || computeDistance(state)

	const validDistance = typeof distance === 'number'
	const situationDistance = situation[dottedName]
	useEffect(() => {
		// I don't get why we need this check. Without it, this component goes wild in an infinite loop. doesn't happen to other RuleInput comps
		if (!validDistance || distance === situationDistance) return
		onChange(distance)
		if (dispatchUpdateSituation) {
			if (realHighwayPrice != null) {
				dispatchUpdateSituation(
					'voyage . trajet voiture . péages . prix calculé . prix 2018'
				)(realHighwayPrice)
			}
		}
	}, [
		situationDistance,
		distance,
		onChange,
		realHighwayPrice,
		dispatchUpdateSituation,
		validDistance,
	])

	const onInputChange = (whichInput) => (e) => {
		const v = e.target.value
		setState({
			...state,
			[whichInput]: { ...state[whichInput], inputValue: v },
			validated: false,
		})
		if (v.length > 2) {
			if (db === 'osm') {
				fetch(
					`https://photon.komoot.io/api/?q=${v}&limit=6&layer=city&layer=district&lang=fr`
				)
					.then((res) => res.json())
					.then((json) => {
						setState((state) => ({
							...state,
							[whichInput]: {
								...state[whichInput],
								results: json.features.map((f) => buildPhotonItem(f)),
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
								$thinner={displayImage === 'plane'}
								src={versImageURL}
								alt={`Une photo emblématique de la destination, ${vers.choice?.name}`}
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
										autoFocus={true}
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
							{depuis.results &&
								depuis.inputValue !== '' &&
								!state.validated && (
									<GeoInputOptions
										{...{
											whichInput: 'depuis',
											data: state['depuis'],
											updateState: (newData) =>
												setState((state) => ({ ...state, depuis: newData })),
											rulesPath,
											dispatchUpdateSituation,
										}}
									/>
								)}
						</>
					)}
					{depuis.choice && (
						<Choice>
							<Image src={startPoint} alt="Depuis" />
							<ChoiceContent>
								<ChoiceText>{depuis.choice.name}</ChoiceText>
								<button
									type="button"
									onClick={() => setState({ ...state, depuis: {} })}
								>
									<Emoji e="✏️" title="Modifier la ville de départ" />
								</button>
							</ChoiceContent>
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
										dispatchUpdateSituation,
										rulesPath,
									}}
								/>
							)}
						</>
					)}
					{vers.choice && (
						<Choice>
							<Image src={destinationPoint} alt="Vers" />
							<ChoiceContent>
								<ChoiceText>{vers.choice.name}</ChoiceText>
								<button
									type="button"
									onClick={() => setState({ ...state, vers: {} })}
								>
									<Emoji e="✏️" title="Modifier la ville de destination" />
								</button>
							</ChoiceContent>
						</Choice>
					)}
				</div>
			</InputWrapper>
			<MapWrapper
				state={state}
				setRealDistance={setRealDistance}
				setRealHighwayPrice={setRealHighwayPrice}
				orthodromic={orthodromic}
			/>
			{false && distance && !state.validated && (
				<button {...{ submit: () => setState({ ...state, validated: true }) }}>
					àimplementer
				</button>
			)}
		</VoyageWrapper>
	)
}

const MapWrapper = ({
	state: { depuis, vers },
	setRealDistance,
	setRealHighwayPrice,
	orthodromic,
}) => {
	const origin = depuis.choice && [
		depuis.choice.latitude,
		depuis.choice.longitude,
	]
	const destination = vers.choice && [
		vers.choice.latitude,
		vers.choice.longitude,
	]
	return (
		<Map
			origin={origin}
			destination={destination}
			setRealDistance={setRealDistance}
			setRealHighwayPrice={setRealHighwayPrice}
			orthodromic={orthodromic}
		/>
	)
}

export function computeDistance({ depuis, vers }) {
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
