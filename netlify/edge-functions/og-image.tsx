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
					background: '#57bff5',
					width: '100%',
					height: '100%',
					padding: '100px',
					textAlign: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<h1 style={{ fontSize: 80, margin: '0', padding: 0 }}>{title}</h1>
				<div style={{ fontSize: 400 }}>{emojis}</div>
			</div>
		),
		{
			width: 1200,
			height: 660,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent', 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}
