/** @jsxImportSource https://esm.sh/react */

import { ImageResponse } from '../../mod.ts'
export default function handler(req) {
	const { searchParams } = new URL(req.url)
	const emojis = searchParams.get('emojis'),
		title = searchParams.get('title')

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 100,
					color: 'black',
					width: '100%',
					height: '100%',
					padding: '30px',
					textAlign: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					background: 'white',
				}}
			>
				<img src="https://futur.eco/logo.svg" style={{ width: '8rem' }} />
				<h1
					style={{
						fontSize: 100,
						margin: '10px 0 0 0 ',
						padding: 0,
						lineHeight: '6rem',
						backgroundImage:
							'linear-gradient(90deg, #185abd, #2988e6, #57bff5)',

						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					{title}
				</h1>
				<div style={{ fontSize: 250 }}>{emojis}</div>
			</div>
		),
		{
			width: 1200,
			height: 750,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent', 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}
