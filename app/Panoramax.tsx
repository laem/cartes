import { Viewer } from 'geovisio'
import { FocusedWrapper } from './FocusedImage'
import { useEffect, useRef, useState } from 'react'
import 'geovisio/build/index.css'

const servers = {
	meta: 'https://api.panoramax.xyz/api',
	ign: 'https://panoramax.ign.fr/api',
	osm: 'https://panoramax.openstreetmap.fr/api',
}

export default function Panoramax() {
	const ref = useRef()
	const [viewer, setViewer] = useState(null)
	useEffect(() => {
		if (!ref || !ref.current || viewer) return
		const panoramax = new Viewer(
			ref.current, // Div ID
			servers.meta,
			{
				selectedPicture: '4ff88765-2500-4328-b888-41d5ae9ed443',
				map: false,
			} // Viewer options
		)
		setViewer(panoramax)
	}, [ref, viewer, setViewer])
	return (
		<FocusedWrapper>
			<div
				css={`
					height: 40rem;
					width: 40rem;
					> div {
						position: relative;
						width: 95%;
						margin: 2.5%;
						height: 400px;
					}
					> div.fullpage {
						position: fixed;
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
						height: unset;
						width: unset;
						margin: 0;
					}
				`}
			>
				<div ref={ref} />
			</div>
		</FocusedWrapper>
	)
}
