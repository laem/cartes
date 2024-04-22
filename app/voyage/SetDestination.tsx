import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import Image from 'next/image'
import { PlaceButton } from './PlaceButtonsUI'

// We don't need full precision, just 5 decimals ~ 1m
// https://wiki.openstreetmap.org/wiki/Precision_of_coordinates
// We'll even try with 4 and see
export const buildAllezPart = (name, id, longitude, latitude) => {
	const part = `${name}|${id || ''}|${longitude.toFixed(4)}|${latitude.toFixed(
		4
	)}`
	return part
}

export const removeStatePart = (key: string | number, state: Array<object>) =>
	state
		.map((part, index) =>
			(typeof key === 'string' ? part.key === key : index === key)
				? false
				: part.key
		)
		.filter(Boolean)
		.join('->')
export const setStatePart = (
	key: string | number,
	state: Array<object>,
	value: string
) =>
	state
		.map((part, index) =>
			(typeof key === 'string' ? part.key === key : index === key)
				? value
				: part.key
		)
		.join('->')

export default function SetDestination({
	destination,
	geolocation,
	searchParams,
}) {
	const setSearchParams = useSetSearchParams()

	const destinationPart = destination
		? buildAllezPart(
				'Point sur la carte',
				null,
				destination.longitude,
				destination.latitude
		  )
		: searchParams.allez || ''

	const search = {
		allez: geolocation
			? `${buildAllezPart(
					'Votre position',
					null,
					geolocation.longitude,
					geolocation.latitude
			  )}->${destinationPart}`
			: `->${destinationPart}`,
	}

	const href = setSearchParams(search, true, false)

	return (
		<PlaceButton>
			<Link href={href}>
				<button>
					<div>
						<Image
							src="/itinerary.svg"
							width="50"
							height="50"
							alt="Lancer le mode itinéraire"
						/>
					</div>
					<div>Y aller</div>
				</button>
			</Link>
		</PlaceButton>
	)
}
