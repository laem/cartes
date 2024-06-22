import { getRules } from '@/providers/getRules'
import Wiki from './Wiki'

export default async function Page() {
	const rules = await getRules('futureco')
	return (
		<main>
			<h1 css="font-size: 150%; line-height: 1.6rem; margin: 1rem">
				Découvre les impacts de chaque geste du quotidien !
			</h1>
			<Wiki rules={rules} />
		</main>
	)
}
