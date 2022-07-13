import * as React from 'react'
import { useCallback } from 'react'
import pathDataToPolys, { calcPolygonArea } from './svgPathToPolygons'

import image from './megaexpressfour.png'

function SvgMegaExpressFour(props) {
	const restaurantRef = React.useRef(null)
	const d = restaurantRef?.current?.getAttribute('d')

	let points = d && pathDataToPolys(d, { tolerance: 1, decimals: 1 })
	const area = points && calcPolygonArea(points[0])

	return (
		<>
			{d}
			<br />
			{Math.round(area)}

			<svg
				width="600mm"
				height="800mm"
				viewBox="0 0 600 800"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<image
					width={558.8}
					height={745.067}
					preserveAspectRatio="none"
					xlinkHref={image}
					x={19.757}
					y={32.595}
				/>
				<path
					d="M153.07 388.542l.892 46.568 134.856-.71.379-9.345 81.56-.348v-28.425l-82.017.44-.148-9.569z"
					fill="none"
					stroke="#fff800"
					strokeWidth={2}
					id="7-restaurant"
					ref={restaurantRef}
				/>
				<path
					id="7-total"
					css="fill:none;stroke:#ffffff;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1"
					d="m 153.06315,388.64409 0.89231,46.56778 296.46315,-1.99918 0.13512,-46.45373 z"
				/>
			</svg>
		</>
	)
}

export default SvgMegaExpressFour

function useClientRect() {
	const [rect, setRect] = React.useState(null)
	const ref = useCallback((node) => {
		if (node !== null) {
			setRect(node.getBoundingClientRect())
		}
	}, [])
	return [rect, ref]
}
