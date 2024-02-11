import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'

export default function SetDestination({ destination, origin }) {
	if (!origin) return null
	const { latitude, longitude } = origin

	const setSearchParams = useSetSearchParams()

	const href = setSearchParams(
		{
			allez: `${longitude}|${latitude};${destination.longitude}|${destination.latitude}`,
		},
		true,
		false
	)

	return <Link href={href}>Y aller</Link>
}
