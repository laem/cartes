import GeoInputOptions from '@/components/conversation/GeoInputOptions'
import { InputStyle } from '@/components/conversation/UI'
import css from '@/components/css/convertToJs'
import fetchPhoton from '@/components/voyage/fetchPhoton'

export default function PlaceSearch({
	state,
	setState,
	localSearch,
	setLocalSearch,
}) {
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
				fetchPhoton(v, setState, whichInput, localSearch && local)
			}
		}
	return (
		<div>
			<InputStyle
				css={`
					color: white;
				`}
			>
				<input
					type="text"
					autoFocus={true}
					value={vers.inputValue}
					placeholder={'Saint-Malo, Sarzeau, Le Conquet, ...'}
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
								@media (max-width: 800px) {
									margin-left: -0.6rem;
									width: 98vw;
								}
							}
						`}
					>
						<GeoInputOptions
							{...{
								whichInput: 'vers',
								data: state['vers'],
								updateState: (newData) =>
									setState((state) => ({ ...state, vers: newData })),
							}}
						/>
						<label
							css={`
								text-align: right;
								margin: 0 0 auto auto;
								display: block;
								width: 12.8rem;
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
								checked={localSearch}
								onClick={() => {
									setLocalSearch(!localSearch)
									onInputChange(
										'vers',
										!localSearch
									)({ target: { value: vers.inputValue } })
								}}
							/>
							<span style={css``}>Rechercher sur la carte</span>
						</label>
					</div>
				)}
		</div>
	)
}
