import { getRules } from '@/providers/getRules'
import Test from './Test'

export default async function MaVar({ params: { mavar } }) {
	const rules = await getRules('futureco')

	return (
		<>
			<h1>Mon titre</h1>
			<Test maVar={mavar} rules={rules} />
		</>
	)
}
