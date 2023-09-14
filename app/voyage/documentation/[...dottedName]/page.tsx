import rules from '@/app/voyage/data/rules.ts'
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
				pathPrefix="/voyage"
			/>
		</main>
	)
}

export default Page

const Back = () => (
	<div>
		<Link href="/voyage/">
			<Emoji e=" 	⬅" /> Revenir au calculateur
		</Link>
		<ExempleHeader />
	</div>
)
