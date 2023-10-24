import rules from '@/app/voyage/cout-voiture/data/rules.ts'
import QuickDocumentationPage from '@/components/documentation/QuickDocumentationPage'
import { utils } from 'publicodes'
import Link from 'next/link'
import Emoji from '@/components/Emoji'
import ExempleHeader from '@/components/documentation/ExempleHeader'

const Page = async ({ params: { dottedName: rawDottedName } }: Props) => {
	const dottedName = decodeURIComponent(rawDottedName.join('/'))
	const decoded = utils.decodeRuleName(dottedName)
	return (
		<main>
			<Back />
			<QuickDocumentationPage
				dottedName={decoded}
				rules={rules}
				pathPrefix="/voyage/cout-voiture"
				spotlight={['voyage . trajet voiture . coût trajet par personne']}
				objective="trajet voiture . coût trajet par personne"
			/>
		</main>
	)
}

export default Page
