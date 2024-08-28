import { Viewer } from 'geovisio'
import { FocusedWrapper } from './FocusedImage'
import { useEffect, useRef, useState } from 'react'
export default function Panoramax() {
	const ref = useRef()
	const [viewer, setViewer] = useState(null)
	useEffect(() => {
		if (!ref || !ref.current || viewer) return
		console.log('salut purple')
		const panoramax = new Viewer(
			ref.current, // Div ID
			'https://api.panoramax.xyz/api', // STAC API endpoint
			{
				map: false,
				selectedPicture: '4ff88765-2500-4328-b888-41d5ae9ed443',
			} // Viewer options
		)
		setViewer(panoramax)
	}, [ref, viewer, setViewer])
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
