import GeoInputOptions from '@/components/conversation/GeoInputOptions'
import { InputStyle } from '@/components/conversation/UI'
import css from '@/components/css/convertToJs'
import fetchPhoton from '@/components/voyage/fetchPhoton'
import { useEffect, useState } from 'react'
import { encodePlace } from './utils'
import Logo from '@/public/voyage.svg'
import Image from 'next/image'

export default function PlaceSearch({
	state,
	setState,
	sideSheet,
	setSnap,
	zoom,
	setSearchParams,
	searchParams,
}) {
	const [localSearch, setLocalSearch] = useState(true)
	const urlSearchQuery = searchParams.q
	const { vers } = state
	const value = vers.inputValue
	console.log('violet', value)

	const onInputChange =
		(whichInput, localSearch = false) =>
		(v) => {
			const oldState = state[whichInput]
			setState({
				...state,
				[whichInput]: {
					...(v == null ? { ...oldState, results: null } : oldState),
					inputValue: v,
				},
				validated: false,
			})
			if (v?.length > 2) {
				const hash = window.location.hash,
					local = hash.split('/').slice(1, 3)

				fetchPhoton(v, setState, whichInput, localSearch && local, zoom)
			}
		}
	const onDestinationChange = onInputChange('vers', localSearch)

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
						}
					`}
				>
					<input
						type="text"
						value={value || ''}
						onClick={(e) => {
							setSnap(0)
							e.preventDefault()
							e.stopPropagation()

							setTimeout(() => {
								e.target.focus()
							}, 300)
						}}
						placeholder={'Saint-Malo, Le Conquet, Café du Port...'}
						onChange={({ target: { value } }) => onDestinationChange(value)}
					/>
					<button onClick={() => onDestinationChange(null)}>X</button>
				</InputStyle>
			</div>
			{vers.results &&
				vers.inputValue !== '' &&
				(!state.vers.choice ||
					state.vers.choice.inputValue !== vers.inputValue) && (
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
								whichInput: 'vers',
								data: state['vers'],
								updateState: (newData) => {
									setSnap(1)
									setState((state) => ({ ...state, vers: newData }))

									console.log('ici', newData)
									const { osmId, featureType } = newData.choice
									if (osmId && featureType)
										setSearchParams({
											lieu: encodePlace(featureType, osmId),
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
									onInputChange('vers', !localSearch)(vers.inputValue)
								}}
							/>
							<span style={css``}>Rechercher ici</span>
						</label>
					</div>
				)}
		</div>
	)
}
