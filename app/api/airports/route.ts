import { NextResponse } from 'next/server'
import airports from './airports.csv'
import Fuse from 'fuse.js'

const searchWeights = [
	{
		name: 'city',
		weight: 0.4,
	},
	{
		name: 'name',
		weight: 0.4,
	},
	{
		name: 'country',
		weight: 0.2,
	},
]

const fuse = new Fuse(airports, {
	keys: searchWeights,
})

export function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const input = searchParams.get('input')

	const results = fuse
		.search(input)
		.slice(0, 10)
		.map((result) => result.item)

	return NextResponse.json(results)
}
