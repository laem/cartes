import { NextResponse } from 'next/server'
import airports from './airports.csv'
import Fuse from 'fuse.js'

const searchWeights = [
	{
		name: 'ville',
		weight: 0.4,
	},
	{
		name: 'nom',
		weight: 0.4,
	},
	{
		name: 'pays',
		weight: 0.2,
	},
]

const fuse = new Fuse(airports, {
	keys: searchWeights,
})

export function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const input = searchParams.get('input')

	const results = fuse.search(input)

	return NextResponse.json(results)
}
