import rules from '@/app/voyage/data/rules.ts'
import QuickDocumentationPage from '@/components/documentation/QuickDocumentationPage'
import { utils } from 'publicodes'

const Page = async ({ params: { dottedName: rawDottedName } }: Props) => {
	const dottedName = decodeURIComponent(rawDottedName.join('/'))
	const decoded = utils.decodeRuleName(dottedName)
	return (
		<main>
			<QuickDocumentationPage
				dottedName={decoded}
				rules={rules}
				pathPrefix="/voyage"
			/>
		</main>
	)
}

export default Page
