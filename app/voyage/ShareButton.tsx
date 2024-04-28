'use client'
import { useState } from 'react'
import { PlaceButton } from './PlaceButtonsUI'
import { buildAllezPart } from './SetDestination'
import { encodePlace } from './utils'
import shareIcon from '@/public/share.svg'
import Image from 'next/image'

export default function ShareButton({ osmFeature, clickedPoint }) {
	console.log('purple share', osmFeature, clickedPoint)

	const branchUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
		isMaster = branchUrl?.includes('-git-master-'),
		domain = isMaster ? 'cartes.app' : branchUrl
	const urlBase =
		process.env.NEXT_PUBLIC_NODE_ENV === 'development'
			? 'http://localhost:8080'
			: 'https://' + domain

	const url = `${urlBase}/?allez=${
		osmFeature
			? buildAllezPart(
					osmFeature.tags?.name,
					encodePlace(osmFeature.type, osmFeature.id),
					osmFeature.lon,
					osmFeature.lat
			  )
			: buildAllezPart(
					'Point sur la carte',
					null,
					clickedPoint.longitude,
					clickedPoint.latitude
			  )
	}`
	return (
		<PlaceButton>
			{navigator.share ? (
				<button
					css={`
						margin: 0 auto !important;
					`}
					title="Cliquez pour partager le lien"
					onClick={() => {
						navigator
							.share({ text, url, title, color, label })
							.then(() => console.log('Successful share'))
							.catch((error) => console.log('Error sharing', error))
					}}
				>
					<div>
						<Image src={shareIcon} alt="Icône de partage" />
					</div>
					<div>Partager</div>
					{/* Created by Barracuda from the Noun Project */}
				</button>
			) : (
				<DesktopShareButton {...{ url }} />
			)}
		</PlaceButton>
	)
}

export const DesktopShareButton = ({ url }) => {
	const [copySuccess, setCopySuccess] = useState(false)

	function copyToClipboard() {
		navigator.clipboard.writeText(url).then(
			function () {
				setCopySuccess(true)
				console.log('Async: Copying to clipboard was successful !')
			},
			function (err) {
				console.error('Async: Could not copy text: ', err)
			}
		)
		e.preventDefault()
		return null
	}

	return (
		<button onClick={copyToClipboard}>
			<div>
				<Image src={shareIcon} alt="Icône de partage" />
			</div>
			<div>
				{!copySuccess ? (
					'Partager'
				) : (
					<span
						css={`
							background: white;
							color: var(--color);
							padding: 0 0.4rem;
							line-height: 1.2rem;
							border-radius: 0.2rem;
						`}
					>
						Copié !
					</span>
				)}
			</div>
		</button>
	)
}
