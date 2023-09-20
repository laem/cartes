// https://codepen.io/cssjockey/pen/bGbmop
// https://shhdharmen.github.io/keyboard-css/#states
// https://codepen.io/vladracoare/pen/jOPmMap

import data from './data.yaml'
import Card from './Card'

const undefinedIsZero = (figure) => (figure == null ? 0 : figure)

const Grid = ({ state, setState }) => (
	<ul
		id="shareImage"
		css={`
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
			touch-action: manipulation;
			margin-top: 2rem;
		`}
	>
		{data
			.sort((a, b) => undefinedIsZero(b.formule) - undefinedIsZero(a.formule))
			.map((el) => (
				<Card {...{ data: el, state, setState }} />
			))}
	</ul>
)

export default Grid
