import SimulationVignetteOg from '@/components/SimulationVignetteOg'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
	const { searchParams } = new URL(request.url)

	return new ImageResponse(
		<SimulationVignetteOg searchParams={searchParams} />,
		{
			width: 1200,
			height: 630,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}
