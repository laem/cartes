import { Viewer } from 'geovisio'
import { FocusedWrapper } from './FocusedImage'
import { useEffect, useRef } from 'react'
export default function Panoramax() {
	const ref = useRef()
	useEffect(() => {
		if (!ref || !ref.current) return
		const panoramax = new Viewer(
			ref.current, // Div ID
			'https://api.panoramax.xyz/api', // STAC API endpoint
			{
				map: true, //selectedPicture: '4ff88765-2500-4328-b888-41d5ae9ed443'
			} // Viewer options
		)
	}, [ref])
	return (
		<FocusedWrapper>
			<div
				css={`
					canvas {
						height: 60vh !important;
					}
				`}
			>
				<div ref={ref} />
			</div>
		</FocusedWrapper>
	)
}
