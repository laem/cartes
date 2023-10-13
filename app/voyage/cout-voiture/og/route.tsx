import { ImageResponse } from 'next/server'
import Publicodes from 'publicodes'
// App router includes @vercel/og.
// No need to install it.
//
const engine = new Publicodes({ a: 'b + 2', b: '27' })
const value = engine.evaluate('a').nodeValue

export const runtime = 'edge'

export async function GET() {
	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					height: '100%',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
					fontSize: 60,
					letterSpacing: -2,
					fontWeight: 700,
					textAlign: 'center',
				}}
			>
				{value}
				<div
					style={{
						backgroundImage:
							'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					Develop
				</div>
				<div
					style={{
						backgroundImage:
							'linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					Preview
				</div>
				<div
					style={{
						backgroundImage:
							'linear-gradient(90deg, rgb(255, 77, 77), rgb(249, 203, 40))',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					Ship
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'twemoji',
		}
	)
}
