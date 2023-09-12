import { NextRequest, NextResponse } from 'next/server'

export const config = {
	runtime: 'edge',
}

// https://github.com/vercel/examples/blob/main/edge-middleware/geolocation/middleware.ts

export default function Geolocation(req: NextRequest) {
	const { nextUrl: url, geo } = req
	console.log(geo)
	const country = geo.country || 'FR'
	const city = geo.city || 'Paris'
	const region = geo.region || 'IDF'
	return NextResponse.json({ country, city, region })
}
