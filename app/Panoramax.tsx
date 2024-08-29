import { Viewer } from 'geovisio'
import { FocusedWrapper } from './FocusedImage'
import { useEffect, useRef, useState } from 'react'
import 'geovisio/build/index.css'
import { ModalCloseButton } from './UI'

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
					z-index: -1;
					height: 40vh;
					width: 90vw;

					@media (min-width: 800px) {
						width: 40vw;
						height: 90vh;
					}
					> div {
						position: relative;
						width: 95%;
						margin: 2.5%;
						height: 100%;
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
					.gvs-main {
						border-radius: 0.6rem;
						overflow: hidden;
					}
				`}
			>
				<div ref={ref} />
			</div>
			<ModalCloseButton onClick={() => alert('Close not implemented')} />
		</FocusedWrapper>
	)
}
