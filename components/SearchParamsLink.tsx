import { Suspense } from 'react'
import SearchParamsLinkClient from './SearchParamsLinkClient'

export default function SearchParamsLink(props) {
	return (
		<Suspense fallback={<span>Chargement...</span>}>
			<SearchParamsLinkClient {...props} />
		</Suspense>
	)
}
