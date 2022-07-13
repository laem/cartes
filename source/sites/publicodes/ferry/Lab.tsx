import { useEffect, useRef, useState } from 'react'
import Mega from './Mega'
import pathDataToPolys, { calcPolygonArea } from './svgPathToPolygons'

/* For each iteration on the SVG drawing,
 run this command :
 npx --yes  @svgr/cli --ref --replace-attr-values ../1ccc23d5/megaexpressfour.png=/images/megaexpressfour.png -- source/sites/publicodes/ferry/mega-express-four.svg > source/sites/publicodes/ferry/Mega.tsx

 */

const deckTotalArea = (elements, n) =>
	elements.find((el) => el.id === n + '-total').area

export default () => {
	const ref = useRef(null)
	const [elements, setElements] = useState([])

	useEffect(() => {
		const el = ref.current
		if (!el) return null
		const elements = [...el.querySelectorAll('path')].map((path) => {
			const d = path.getAttribute('d')
			let points = d && pathDataToPolys(d, { tolerance: 1, decimals: 1 })
			const area = points && Math.round(calcPolygonArea(points[0]))
			return { id: path.id, area }
		})
		setElements(elements)
	}, [])

	return (
		<div
			css={`
				svg {
					width: 100%;
					height: auto;
				}
			`}
		>
			<ul>
				{elements.map((el) => (
					<li>
						{el.id} : {el.area} (
						{Math.round(
							(el.area / deckTotalArea(elements, el.id.split('-')[0])) * 100
						)}
						%)
					</li>
				))}
			</ul>
			<Mega ref={ref} />
		</div>
	)
}
