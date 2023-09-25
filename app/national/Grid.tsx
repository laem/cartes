// https://codepen.io/cssjockey/pen/bGbmop
// https://shhdharmen.github.io/keyboard-css/#states
// https://codepen.io/vladracoare/pen/jOPmMap

import data from './data.yaml'
import Card from './Card'

const undefinedIsZero = (figure) => (figure == null ? 0 : figure)

const Grid = ({ state, setState }) => {
	const sorted = data.sort(
			(a, b) => undefinedIsZero(b.formule) - undefinedIsZero(a.formule)
		),
		evaluated = sorted.filter((el) => el.formule),
		notEvaluated = sorted.filter((el) => !el.formule)

	return (
		<ul
			id="shareImage"
			css={`
				h2 {
					text-align: center;
				}
				> div {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					touch-action: manipulation;
				}
			`}
		>
			<div>
				{evaluated.map((el) => (
					<Card {...{ data: el, state, setState }} />
				))}
			</div>
			<h2>Action pas encore chiffrées</h2>
			<div>
				{notEvaluated.map((el) => (
					<Card {...{ data: el, state, setState }} />
				))}
			</div>
		</ul>
	)
}

export default Grid
