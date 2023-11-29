import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function useSetSeachParams() {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [hash, setHash] = useState(null)

	useEffect(() => {
		setHash(window.location.hash)
	}, [searchParams])

	//TODO move to components
	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(newSearchParams: object, clear: boolean) => {
			const params = new URLSearchParams(clear ? {} : searchParams)

			Object.entries(newSearchParams).map(([k, v]) => params.set(k, v))

			return params.toString()
		},
		[searchParams]
	)
	return (newSearchParams: object, noPush: boolean, clear: boolean) => {
		const newUrl =
			pathname + '?' + createQueryString(newSearchParams, clear) + hash
		if (!noPush) router.push(newUrl)
		else return newUrl
	}
}
