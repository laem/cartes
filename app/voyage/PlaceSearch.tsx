import GeoInputOptions from '@/components/conversation/GeoInputOptions'
import { InputStyle } from '@/components/conversation/UI'
import css from '@/components/css/convertToJs'
import fetchPhoton from '@/components/voyage/fetchPhoton'
import { useState } from 'react'

export default function PlaceSearch({
	state,
	setState,
	sideSheet,
	setSnap,
	zoom,
}) {
	const [localSearch, setLocalSearch] = useState(true)
	const { vers } = state
	const onInputChange =
		(whichInput, localSearch = false) =>
		({ target: { value: v } }) => {
			setState({
				...state,
				[whichInput]: { ...state[whichInput], inputValue: v },
				validated: false,
			})
			if (v.length > 2) {
				const hash = window.location.hash,
					local = hash.split('/').slice(1, 3)

				fetchPhoton(v, setState, whichInput, localSearch && local, zoom)
			}
		}
	return (
		<div>
			<InputStyle
				css={`
					color: white;
					input {
						max-width: 100%;
						margin-bottom: 0;
					}
				`}
			>
				<input
					type="text"
					autoFocus={true}
					value={vers.inputValue}
					onFocus={() => setSnap(0)}
					placeholder={'Saint-Malo, Le Conquet, Café du Port...'}
					onChange={onInputChange('vers', localSearch)}
				/>
			</InputStyle>

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
										'vers',
										!localSearch
									)({ target: { value: vers.inputValue } })
								}}
							/>
							<span style={css``}>Rechercher ici</span>
						</label>
					</div>
				)}
		</div>
	)
}
