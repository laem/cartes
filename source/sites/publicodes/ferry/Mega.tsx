import * as React from 'react'

function SvgMegaExpressFour(props, svgRef) {
	return (
		<svg
			width="600mm"
			height="800mm"
			viewBox="0 0 600 800"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			xmlns="http://www.w3.org/2000/svg"
			ref={svgRef}
			{...props}
		>
			<image
				width={558.8}
				height={745.067}
				preserveAspectRatio="none"
				xlinkHref="/images/megaexpressfour.png"
				x={19.757}
				y={32.595}
			/>
			<g fill="none" strokeWidth={2}>
				<path
					d="M153.07 388.542l.892 46.568 134.856-.71.379-9.345 81.56-.348v-28.425l-82.017.44-.148-9.569z"
					stroke="#fff800"
				/>
				<path
					d="M153.063 388.644l.892 46.568 296.464-2 .135-46.453z"
					stroke="#fff"
				/>
			</g>
			<g fill="none" strokeWidth={2}>
				<path
					d="M153.531 325.741l.892 46.568 134.856-.71.379-9.346 81.56-.347v-28.425l-82.017.44-.148-9.57z"
					stroke="#fff800"
				/>
				<path
					d="M153.524 325.843l.893 46.568 296.463-2 .135-46.453z"
					stroke="#fff"
				/>
			</g>
			<text x={153.07} y={388.542}>
				<tspan
					style={{
						textAlign: 'center',
						verticalAlign: 'bottom',
					}}
					dy={12}
					fontSize={3.175}
					fontWeight={400}
				>
					{'123891.78 px'}
					<tspan fontSize="65%" baselineShift="super">
						{'2'}
					</tspan>
				</tspan>
			</text>
		</svg>
	)
}

const ForwardRef = React.forwardRef(SvgMegaExpressFour)
export default ForwardRef

