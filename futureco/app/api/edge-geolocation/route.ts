import { geolocation } from '@vercel/edge'

export const runtime = 'edge'

export function GET(request: Request) {
	const userGeolocation = geolocation(request)
	return Response.json(userGeolocation)
}
