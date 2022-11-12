/** @jsxImportSource https://esm.sh/react */

import { ImageResponse } from '../../mod.ts'

export default function handler(req) {
	const { searchParams } = new URL(req.url)
	const emojis = searchParams.get('emojis'),
		title = searchParams.get('title')

	return new ImageResponse(
		(
			<div>
				<h1>{title}</h1>
			</div>
		),
		{
			width: 1200,
			height: 630,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent', 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}
