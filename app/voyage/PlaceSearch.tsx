import GeoInputOptions from '@/components/conversation/GeoInputOptions'
import { InputStyle } from '@/components/conversation/UI'
import css from '@/components/css/convertToJs'
import fetchPhoton from '@/components/voyage/fetchPhoton'
import { useCallback, useEffect, useRef, useState } from 'react'
import { encodePlace } from './utils'
import Logo from '@/public/voyage.svg'
import Image from 'next/image'
import { getArrayIndex, replaceArrayIndex } from '@/components/utils/utils'
import { buildAllezPart, setStatePart } from './SetDestination'
import { buildAddress } from '@/components/voyage/Address'
import { isStepBeingSearched } from './itinerary/Steps'
import Link from 'next/link'

const positionTriggers = ['ma pos', 'position', 'ici', 'géoloc', 'geoloc']

const useAutoFocus = () => {
	const inputRef = useCallback((inputElement) => {
		if (inputElement) {
			inputElement.focus()
		}
	}, [])

	return inputRef
}

/* I'm  not sure of the interest to attache `results` to each state step.
 * It could be cached across the app. No need to re-query photon for identical
 * queries too.*/
export default function PlaceSearch({
	state,
	setState,
	sideSheet,
	setSnap,
	zoom,
	setSearchParams,
	searchParams,
	autoFocus = false,
	stepIndex,
	triggerGeolocation,
	geolocation,
}) {
	if (stepIndex == null) throw new Error('Step index necessary')
	const [localSearch, setLocalSearch] = useState(true)
	const urlSearchQuery = searchParams.q
	const step = getArrayIndex(state, stepIndex) || {
		results: [],
		inputValue: '',
	}
	const value = step.inputValue

	const autofocusInputRef = useAutoFocus()

	const onInputChange =
		(stepIndex = -1, localSearch = false) =>
		(v) => {
			const newState = replaceArrayIndex(
				state,
				stepIndex,
				{
					...(v == null ? { results: null } : {}),
					inputValue: v,
				}
				//validated: false, // TODO was important or not ? could be stored in each state array entries and calculated ?
			)
			setState(newState)
			if (v?.length > 2) {
				const hash = window.location.hash,
					local = hash.split('/').slice(1, 3)

				fetchPhoton(v, setState, stepIndex, localSearch && local, zoom)
			}
		}
	const onDestinationChange = onInputChange(stepIndex, localSearch)

	useEffect(() => {
		if (!urlSearchQuery || value != null) return

		onDestinationChange(urlSearchQuery)
	}, [urlSearchQuery, onDestinationChange, value])

	return (
		<div>
			<div
				css={`
					display: flex;
					justify-content: center;
					> img {
						width: 2rem;
						margin-right: 0.4rem;
						height: auto;
					}
					${sideSheet && `margin: .4rem 0`}
				`}
			>
				<Image src={Logo} alt="Logo de Cartes.app" width="100" height="100" />
				<InputStyle
					css={`
						color: white;
						input {
							max-width: 22rem;
							width: 83vw;

							margin-bottom: 0;
							${state.some(isStepBeingSearched) &&
							`border: 3px solid yellow !important`}
						}
						position: relative;
					`}
				>
					<input
						type="text"
						value={value || ''}
						ref={autoFocus && autofocusInputRef}
						onClick={(e) => {
							setSnap(0, 'PlaceSearch')
							e.preventDefault()
							e.stopPropagation()

							setTimeout(() => {
								e.target.focus()
							}, 300)
						}}
						placeholder={'Saint-Malo, Le Conquet, Café du Port...'}
						onChange={({ target: { value } }) => onDestinationChange(value)}
					/>
					{value && (
						<button
							onClick={() => onDestinationChange(null)}
							css={`
								position: absolute;
								right: 0.6rem;
								top: 50%;
								transform: translateY(-50%);
								img {
									width: 0.8rem;
									height: 0.8rem;
								}
								padding: 0;
							`}
						>
							<Image
								src="/close.svg"
								alt="Effacer la recherche"
								width="10"
								height="10"
							/>
						</button>
					)}
				</InputStyle>
			</div>
			<div>
				{state.length > 1 &&
					stepIndex === 0 && // TODO for VIA geolocal, less prioritary
					(geolocation ? (
						<Link
							href={setSearchParams(
								{
									allez:
										buildAllezPart(
											'Ma position',
											null,
											geolocation.longitude,
											geolocation.latitude
										) + searchParams.allez,
								},
								true
							)}
						>
							Depuis ma position
						</Link>
					) : (
						<button onClick={() => triggerGeolocation()}>
							<span
								css={`
									background-position: 50%;
									background-repeat: no-repeat;
									display: block;
									display: inline-block;
									width: 1rem;
									height: 1rem;
									margin-right: 0.4rem;
									vertical-align: sub;
									background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' fill='%23333' viewBox='0 0 20 20'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 0 0 5.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 0 0 9 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 0 0 3.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0 0 11 5.1V5s0-1-1-1m0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E");
								`}
							/>
							Me géolocaliser
						</button>
					))}
			</div>
			{step.inputValue !== '' &&
				(!step.choice || step.choice.inputValue !== step.inputValue) && (
					<div>
						{step.results ? (
							<div
								css={`
									ul {
										background: var(--darkerColor);
										border-radius: 0.4rem;
										padding: 0.6rem 0;
										list-style-type: none;
										margin-top: 0.2rem;
										${!sideSheet &&
										`
									width: auto
								`}
									}
								`}
							>
								<GeoInputOptions
									{...{
										whichInput: 'vers', // legacy
										data: step,
										updateState: (newData) => {
											setSnap(1, 'PlaceSearch')
											// this is questionable; see first comment in this file
											setState(replaceArrayIndex(state, stepIndex, newData))

											console.log('ici', newData)
											const { osmId, featureType, longitude, latitude, name } =
												newData.choice

											const address = buildAddress(newData.choice, true)
											const isOsmFeature = osmId && featureType
											setSearchParams({
												allez: setStatePart(
													stepIndex,
													state,
													buildAllezPart(
														name || address,
														isOsmFeature ? encodePlace(featureType, osmId) : '',
														longitude,
														latitude
													)
												),
												q: undefined,
											})
										},
									}}
								/>
								<label
									css={`
										text-align: right;
										margin: 0 0 auto auto;
										display: block;
										width: 9rem;
										margin-top: 0.2rem;
										background: var(--darkerColor);
										color: white;
										padding: 0rem 0.6rem 0rem;
										border-radius: 0.3rem;
										> span {
											margin-left: 0.4rem;
										}
									`}
								>
									<input
										type="checkbox"
										defaultChecked={localSearch}
										onClick={() => {
											setLocalSearch(!localSearch)
											onInputChange(
												stepIndex,
												!localSearch
											)(state.slice(-1)[0].inputValue)
										}}
									/>
									<span style={css``}>Rechercher ici</span>
								</label>
							</div>
						) : (
							'Chargement..'
						)}
					</div>
				)}
		</div>
	)
}
