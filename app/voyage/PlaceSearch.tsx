import GeoInputOptions from '@/components/conversation/GeoInputOptions'
import { InputStyle } from '@/components/conversation/UI'

export default function PlaceSearch({ onInputChange, state, setState }) {
	const { vers } = state
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
					onChange={onInputChange('vers')}
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
					</div>
				)}
		</div>
	)
}
