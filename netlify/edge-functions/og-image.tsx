// /netlify/edge-functions/og.tsx

import React from 'https://esm.sh/react@18.2.0'
import { ImageResponse } from 'https://deno.land/x/og_edge/mod.ts'
import Emoji from '../../source/components/Emoji.tsx'

export default function handler(req: Request) {
	const { searchParams } = new URL(req.url)
	const username = searchParams.get('username')

	return new ImageResponse(
		(
			<div
				style={{
					fontSize: 60,
					color: 'black',
					background: '#f6f6f6',
					width: '100%',
					height: '100%',
					paddingTop: 50,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					display: 'flex',
				}}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					alt="avatar"
					width="256"
					src={`https://github.com/${username || 'netlify'}.png`}
					style={{
						borderRadius: 128,
					}}
				/>
				{username ? (
					<>
						<p>YOYOgithub.com/{username}</p>
						<Emoji e="🗽" />
					</>
				) : (
					<p>Mon nozdazdm d'ut /?username=ascorbic</p>
				)}
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	)
}
